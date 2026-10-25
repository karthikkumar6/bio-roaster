import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bio Roaster — Your bio called. It needs help.",
  description:
    "Get a playful, personal Instagram bio roast with OpenAI or Claude.",
  applicationName: "Bio Roaster",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
