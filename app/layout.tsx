import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bio Roaster — Your bio called. It needs help.",
  description:
    "Get a playful Instagram bio roast with a browser-based generator. No AI API key, account, or backend required.",
  applicationName: "Bio Roaster",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
