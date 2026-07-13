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
import { InteractiveGrid } from "@/components/InteractiveGrid";
import { BottomNav } from "@/components/BottomNav";
import GradualBlur from "@/components/GradualBlur";
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
      suppressHydrationWarning
      className={`${exposeRegular.variable} ${exposeBold.variable} ${exposeBlack.variable} ${clashGroteskRegular.variable} ${clashGroteskSemibold.variable} ${clashGroteskBold.variable} ${panchangRegular.variable} ${panchangBold.variable} ${panchangExtrabold.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mq = window.matchMedia('(prefers-color-scheme: dark)');
                  if (mq.matches) {
                    document.documentElement.classList.add('dark');
                  }
                  mq.addEventListener('change', function(e) {
                    if (e.matches) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  });
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full relative">
        <video
          className="fixed inset-0 w-full h-full object-cover -z-10 pointer-events-none dark:block hidden"
          loop
          autoPlay
          muted
          playsInline
          src="/ascii-test-2-slow.mp4"
        ></video>
        <video
          className="fixed inset-0 w-full h-full object-cover -z-10 pointer-events-none block dark:hidden"
          loop
          autoPlay
          muted
          playsInline
          src="/ascii-test-2-slow-light.mp4"
        ></video>
        <div className="flex min-h-full flex-col">
          {children}
          <BottomNav />
        </div>
        <GradualBlur
          target="page"
          position="bottom"
          height="5rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential
          opacity={0.8}
        />
      </body>
    </html>
  );
}
