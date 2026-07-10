import type { Metadata } from "next";
import {
  exposeRegular,
  exposeBold,
  exposeBlack,
  clashGroteskRegular,
  clashGroteskSemibold,
  clashGroteskBold,
} from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yassine Grairi",
  description: "Yassine Grairi's Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${exposeRegular.variable} ${exposeBold.variable} ${exposeBlack.variable} ${clashGroteskRegular.variable} ${clashGroteskSemibold.variable} ${clashGroteskBold.variable} h-full antialiased`}
    >
      <body className="min-h-full  flex flex-col">{children}</body>
    </html>
  );
}
