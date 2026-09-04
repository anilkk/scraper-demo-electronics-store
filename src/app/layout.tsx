import type { Metadata } from "next";
import "./globals.css";
import { inter, fraunces } from "@/lib/fonts";
import { STORE } from "@/lib/products";
import { VERSION, RESOLVED } from "@/lib/variant";
import { CartProvider } from "@/components/shared/CartProvider";
import { VersionBadge } from "@/components/shared/VersionBadge";
import { UI } from "@/components";

export const metadata: Metadata = {
  title: { default: `${STORE.name} · ${STORE.tagline}`, template: `%s · ${STORE.name}` },
  description: "Considered electronics for everyday life. Audio, wearables and smart home, chosen slowly in Berlin.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme={RESOLVED.theme} data-store-version={VERSION} className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <CartProvider>
          <UI.Shell>{children}</UI.Shell>
        </CartProvider>
        <VersionBadge />
      </body>
    </html>
  );
}
