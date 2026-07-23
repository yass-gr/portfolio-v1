"use client";

import { useState, useEffect, type ComponentProps } from "react";
import GradualBlur from "./GradualBlur";

type GradualBlurProps = ComponentProps<typeof GradualBlur>;

export default function GradualBlurWrapper(props: GradualBlurProps) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const check = () => setEnabled(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!enabled) return null;
  return <GradualBlur {...props} />;
}
