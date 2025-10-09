"use client";

import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGsapScroll(
  ref: RefObject<HTMLElement>,
  animation: (element: HTMLElement) => gsap.core.Timeline | gsap.core.Tween
) {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const anim = animation(element);

    return () => {
      if (anim) {
        anim.kill();
      }
    };
  }, [ref, animation]);
}
