import type { Metadata } from "next";
import {
  exposeRegular,
  exposeBold,
  exposeBlack,
  clashGroteskRegular,
  clashGroteskSemibold,
  clashGroteskBold,
} from "./fonts";
import { InteractiveGrid } from "@/components/InteractiveGrid";
import { BottomNav } from "@/components/BottomNav";
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
      <body className="min-h-full">
        <InteractiveGrid className="fixed inset-0 overflow-hidden w-full">
          <div className="flex min-h-full flex-col">
            {children}
            <BottomNav />
          </div>
        </InteractiveGrid>
      </body>
    </html>
  );
}
