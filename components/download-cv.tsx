"use client";

import { Download } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tooltip";

export default function DownloadCvButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="overflow-hidden">
          <GlassSurface
            width="auto"
            height="auto"
            borderRadius={999}
            backgroundOpacity={0.25}
            saturation={1.8}
            className="p-1.5 cursor-pointer max-sm:p-1 max-lg:p-1"
          >
            <a
              href="/cv.pdf"
              download
              className="flex items-center justify-center p-1.5 rounded-lg text-neutral-700 dark:text-neutral-300"
            >
              <Download size={20} />
            </a>
          </GlassSurface>
        </div>
      </TooltipTrigger>
      <TooltipContent>Download CV</TooltipContent>
    </Tooltip>
  );
}