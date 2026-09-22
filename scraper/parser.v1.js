// Voltique PDP parser, baseline for the self-healing demo.
//
// Paste this into Scraper Studio > Code > Parser code before every take,
// then Save to development, Preview one v1 URL, Save to production.
// Output shape matches the schema the AI agent generated: product_name, brand,
// price, original_price, discount, rating, review_count, availability, sku,
// description, image_url, specifications.
//
// Design rule: a required field that is missing is a parse_error, never an
// empty cell. A parser that falls back to "" or null on v2 returns 12 blank
// rows, Scraper Studio counts them as success, and Auto Self-Healing never
// fires. The throws below name the selector so the healer knows what changed.

const BASE = 'https://scraper-demo-electronics-store.vercel.app';

function must(selector) {
  const el = $(selector);
  if (!el.length) throw new Error(`parse_error: selector "${selector}" matched nothing, the page structure changed`);
  const text = el.first().text_sane();
  if (!text) throw new Error(`parse_error: selector "${selector}" is empty`);
  return text;
}

// v1 prints "€299.00". A different format is a change to relearn, not a null to swallow.
function money(text, field) {
  const m = text.match(/€([\d,]+\.\d{2})/);
  if (!m) throw new Error(`parse_error: ${field} "${text}" is not in the expected price format`);
  return new Money(parseFloat(m[1].replace(/,/g, '')), 'EUR');
}

// Required fields: throw when missing.
const product_name = must('.product-summary .product-name');
const brand = must('.product-summary .product-brand');
const price = money(must('.product-summary .product-price'), 'price');
const availability = must('.product-summary .product-stock');
const sku = must('.product-summary .product-sku').replace(/^SKU\s*/i, '');

const rating = parseFloat(must('.product-summary .rating-value'));
if (!isFinite(rating)) throw new Error('parse_error: rating is not a number');

const review_match = must('.product-summary .product-reviews').match(/([\d,]+)/);
if (!review_match) throw new Error('parse_error: review_count has no number');
const review_count = parseInt(review_match[1].replace(/,/g, ''), 10);

const specifications = $('.product-specs .spec-row').toArray().map((row) => ({
  label: $(row).find('.spec-label').text_sane(),
  value: $(row).find('.spec-value').text_sane(),
}));
if (!specifications.length) throw new Error('parse_error: no specification rows found');

// Genuinely optional: only discounted products have these.
const original_text = $('.product-summary .product-compare-price').first().text_sane();
const original_price = original_text ? money(original_text, 'original_price') : null;
const discount = $('.product-summary .product-discount').text_sane() || null;

// Nice to have, not part of the break.
const description = $('.product-description p').first().text_sane() || null;

let image_url = null;
const image_src = $('.product-gallery .product-image').first().attr('src');
if (image_src) {
  const proxied = new URL(image_src, BASE).searchParams.get('url');
  image_url = new Image(proxied ? decodeURIComponent(proxied) : image_src);
}

return {
  product_name,
  brand,
  price,
  original_price,
  discount,
  rating,
  review_count,
  availability,
  sku,
  description,
  image_url,
  specifications,
};
