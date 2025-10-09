"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  triggerStart?: string;
  triggerEnd?: string;
  animationType?: "fade" | "slide" | "scale" | "custom";
  customAnimation?: (element: HTMLElement) => void;
}

export default function ScrollSection({
  children,
  className = "",
  id,
  triggerStart = "top 80%",
  triggerEnd = "bottom 20%",
  animationType = "fade",
  customAnimation,
}: ScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    let animation: gsap.core.Timeline;

    if (customAnimation) {
      customAnimation(element);
    } else {
      animation = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: triggerStart,
          end: triggerEnd,
          toggleActions: "play none none reverse",
        },
      });

      switch (animationType) {
        case "fade":
          gsap.set(element, { opacity: 0, y: 50 });
          animation.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          });
          break;
        case "slide":
          gsap.set(element, { x: -100, opacity: 0 });
          animation.to(element, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          });
          break;
        case "scale":
          gsap.set(element, { scale: 0.8, opacity: 0 });
          animation.to(element, {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          });
          break;
      }
    }

    return () => {
      if (animation) {
        animation.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [triggerStart, triggerEnd, animationType, customAnimation]);

  return (
    <div ref={sectionRef} className={className} id={id}>
      {children}
    </div>
  );
}
