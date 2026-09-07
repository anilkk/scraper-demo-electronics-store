// Voltique PDP parser, baseline for the self-healing demo.
//
// Paste this into Scraper Studio > Code > Parser code before every take,
// then Save to development, Preview one v1 URL, Save to production.
//
// Design rule: a scraped field that is missing is a parse_error, never an
// empty cell. The first heal of this demo "fixed" a broken price by guarding
// against NaN and returning null, which made 12 empty rows count as success.
// These throws close that door: the only way to make the error go away is to
// find the new selectors on the page.

function must(selector) {
  const el = $(selector);
  if (!el.length) throw new Error(`parse_error: selector "${selector}" matched nothing, the page structure changed`);
  const text = el.first().text_sane();
  if (!text) throw new Error(`parse_error: selector "${selector}" is empty`);
  return text;
}

function money(text, field) {
  // v1 prints "€299.00". A different format is a change worth relearning, not a NaN to swallow.
  const value = parseFloat(text.replace(/[^0-9.]/g, ''));
  if (!isFinite(value)) throw new Error(`parse_error: ${field} "${text}" is not a price`);
  return new Money(value, 'EUR');
}

const name = must('h1.product-name');
const brand = must('.product-brand');
const price = money(must('.product-price'), 'price');

// Genuinely optional: only discounted products show a compare-at price.
const compareText = $('.product-compare-price').first().text_sane();
const compare_at_price = compareText ? money(compareText, 'compare_at_price') : null;

const stock_status = must('.product-stock');
const sku = must('.product-sku').replace(/^SKU\s*/i, '');

const rating = parseFloat(must('.rating-value'));
if (!isFinite(rating)) throw new Error('parse_error: rating is not a number');

const review_count = parseInt(must('.product-reviews').replace(/[^0-9]/g, ''), 10);
if (!isFinite(review_count)) throw new Error('parse_error: review_count is not a number');

const specs = $('.product-specs .spec-row').toArray().map((row) => ({
  label: $(row).find('.spec-label').text_sane(),
  value: $(row).find('.spec-value').text_sane(),
}));
if (!specs.length) throw new Error('parse_error: no specification rows found');

return { name, brand, price, compare_at_price, stock_status, sku, rating, review_count, specs };
