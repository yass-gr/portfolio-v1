import type { Metadata } from "next";
import {
  exposeRegular,
  exposeBold,
  exposeBlack,
  clashGroteskRegular,
  clashGroteskSemibold,
  clashGroteskBold,
  panchangRegular,
  panchangBold,
  panchangExtrabold,
} from "./fonts";
import { BottomNav } from "@/components/BottomNav";
import DownloadCvButton from "@/components/download-cv";
import Footer from "@/components/footer";

import { TooltipProvider } from "@/components/tooltip";
import { InlineScript } from "@/components/inline-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yassine Grairi",
  description: "Yassine Grairi's Portfolio",
  icons: [{ rel: "icon", url: "/strawhat.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${exposeRegular.variable} ${exposeBold.variable} ${exposeBlack.variable} ${clashGroteskRegular.variable} ${clashGroteskSemibold.variable} ${clashGroteskBold.variable} ${panchangRegular.variable} ${panchangBold.variable} ${panchangExtrabold.variable} h-full antialiased overflow-x-hidden`}
    >
      <head>
        <link rel="icon" href="/strawhat.png" />
        <InlineScript
          html={`(function(){try{var mq=window.matchMedia('(prefers-color-scheme: dark)');if(mq.matches){document.documentElement.classList.add('dark')}mq.addEventListener('change',function(e){document.documentElement.classList.toggle('dark',e.matches)})}catch(e){}})()`}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <video
          className="fixed inset-0 w-full h-full object-cover -z-10 pointer-events-none max-sm:!inset-x-0 max-sm:!top-1/2 max-sm:!-translate-y-1/2 max-sm:!h-[40vh] max-lg:!inset-x-0 max-lg:!top-1/2 max-lg:!-translate-y-1/2 max-lg:!h-[40vh] dark:block hidden"
          loop
          autoPlay
          muted
          playsInline
        >
          <source src="/background-dark.webm" type="video/webm" />
        </video>
        <video
          className="fixed inset-0 w-full h-full object-cover -z-10 pointer-events-none max-sm:!inset-x-0 max-sm:!top-1/2 max-sm:!-translate-y-1/2 max-sm:!h-[40vh] max-lg:!inset-x-0 max-lg:!top-1/2 max-lg:!-translate-y-1/2 max-lg:!h-[40vh] block dark:hidden"
          loop
          autoPlay
          muted
          playsInline
        >
          <source src="/background-light.webm" type="video/webm" />
        </video>
        <div className="flex-1 px-[3%] max-sm:px-0 max-lg:px-0">
          {children}
        </div>
        <Footer />
        <div className="fixed inset-x-0 bottom-6 z-[1200] flex items-center justify-center gap-4 overflow-x-hidden">
          <TooltipProvider delayDuration={0}>
            <DownloadCvButton />
            <BottomNav />
          </TooltipProvider>
        </div>
      </body>
    </html>
  );
}
