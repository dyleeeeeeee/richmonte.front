"use client";

/**
 * BrandSlider — React + GSAP port of landing-page/slider.{html,css,js}.
 * Preserves the original carousel, color-fade, and animated headline behaviour.
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Slide {
  name: string;
  color: string;
  image: string;
}

const SLIDES: Slide[] = [
  // Desaturated navy gradient matching the refined Apex palette
  {
    name: "Ambition",
    color: "#17223A",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Freedom",
    color: "#2C3E5A",
    image:
      "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Growth",
    color: "#354A68",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Legacy",
    color: "#213048",
    image:
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1200&q=80",
  },
];

const AUTOPLAY_DELAY = 5000;

// Throttle / debounce helpers (ported)
function throttle<T extends (...args: any[]) => void>(cb: T, limit: number): T {
  let waiting = false;
  return function (this: any, ...args: any[]) {
    if (!waiting) {
      cb.apply(this, args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  } as T;
}

function debounce<T extends (...args: any[]) => void>(fn: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: any[]) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  } as T;
}

export default function BrandSlider() {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootEl = rootRef.current;
    const titleEl = titleRef.current;
    const imagesEl = imagesRef.current;
    const cursorEl = cursorRef.current;
    if (!rootEl || !titleEl || !imagesEl || !cursorEl) return;

    let current = 0;
    let animating = false;
    const total = SLIDES.length;
    let slideEls: { el: HTMLDivElement; step: number }[] = [];
    let currentLine: HTMLDivElement | null = null;
    let cursorVisible = false;
    let autoPlayId: ReturnType<typeof setInterval> | null = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mod = (n: number) => ((n % total) + total) % total;

    // Preload
    SLIDES.forEach((s) => {
      const i = new Image();
      i.src = s.image;
    });

    // Title setup
    const setTitle = (text: string) => {
      titleEl.innerHTML = "";
      const line = document.createElement("div");
      [...text].forEach((ch) => {
        const span = document.createElement("span");
        span.textContent = ch === " " ? "\u00A0" : ch;
        line.appendChild(span);
      });
      titleEl.appendChild(line);
      currentLine = line;
    };
    setTitle(SLIDES[0].name);

    gsap.set(rootEl, { backgroundColor: SLIDES[0].color });

    // Cursor init
    gsap.set(cursorEl, { xPercent: -50, yPercent: -50, opacity: 0 });
    const cursorMoveX = gsap.quickTo(cursorEl, "x", { duration: 0.5, ease: "power3" });
    const cursorMoveY = gsap.quickTo(cursorEl, "y", { duration: 0.5, ease: "power3" });

    // Slide helpers
    const makeSlide = (idx: number) => {
      const div = document.createElement("div");
      div.className = "bs-slide";
      const img = document.createElement("img");
      img.src = SLIDES[idx].image;
      img.alt = SLIDES[idx].name;
      div.appendChild(img);
      return div;
    };

    const getSlideProps = (step: number) => {
      const h = imagesEl.offsetHeight;
      const absStep = Math.abs(step);
      const positions = [
        { x: -0.35, y: -0.95, rot: -30, s: 1.35, b: 16, o: 0 },
        { x: -0.18, y: -0.5, rot: -15, s: 1.15, b: 8, o: 0.55 },
        { x: 0, y: 0, rot: 0, s: 1, b: 0, o: 1 },
        { x: -0.06, y: 0.5, rot: 15, s: 0.75, b: 6, o: 0.55 },
        { x: -0.12, y: 0.95, rot: 30, s: 0.55, b: 14, o: 0 },
      ];
      const idx = Math.max(0, Math.min(4, step + 2));
      const p = positions[idx];
      return {
        x: p.x * h,
        y: p.y * h,
        rotation: p.rot,
        scale: p.s,
        blur: p.b,
        opacity: p.o,
        zIndex: absStep === 0 ? 3 : absStep === 1 ? 2 : 1,
      };
    };

    const positionSlide = (slide: HTMLDivElement, step: number) => {
      const p = getSlideProps(step);
      gsap.set(slide, {
        xPercent: -50,
        yPercent: -50,
        x: p.x,
        y: p.y,
        rotation: p.rotation,
        scale: p.scale,
        opacity: p.opacity,
        filter: `blur(${p.blur}px)`,
        zIndex: p.zIndex,
      });
    };

    const buildCarousel = () => {
      if (imagesEl.offsetHeight === 0) return;
      imagesEl.innerHTML = "";
      slideEls = [];
      for (let step = -1; step <= 1; step++) {
        const idx = mod(current + step);
        const slide = makeSlide(idx);
        imagesEl.appendChild(slide);
        positionSlide(slide, step);
        slideEls.push({ el: slide, step });
      }
    };
    buildCarousel();

    const animateTitle = (newText: string, direction: "next" | "prev") => {
      const h = titleEl.offsetHeight;
      const dir = direction === "next" ? 1 : -1;
      const oldLine = currentLine;
      if (!oldLine) return gsap.timeline();
      const oldChars = [...oldLine.querySelectorAll("span")];

      titleEl.style.height = h + "px";
      oldLine.style.cssText = "position:absolute;top:0;left:0;width:100%";

      const newLine = document.createElement("div");
      newLine.style.cssText = "position:absolute;top:0;left:0;width:100%";
      [...newText].forEach((ch) => {
        const span = document.createElement("span");
        span.textContent = ch === " " ? "\u00A0" : ch;
        newLine.appendChild(span);
      });
      titleEl.appendChild(newLine);

      const newChars = [...newLine.querySelectorAll("span")];
      gsap.set(newChars, { y: h * dir });

      const duration = reducedMotion ? 0.01 : 1;
      const stagger = reducedMotion ? 0 : 0.04;

      const tl = gsap.timeline({
        onComplete: () => {
          oldLine.remove();
          newLine.style.cssText = "";
          gsap.set(newChars, { clearProps: "all" });
          titleEl.style.height = "";
          currentLine = newLine;
        },
      });
      tl.to(oldChars, { y: -h * dir, stagger, duration, ease: "expo.inOut" }, 0);
      tl.to(newChars, { y: 0, stagger, duration, ease: "expo.inOut" }, 0);
      return tl;
    };

    const animateCarousel = (direction: "next" | "prev") => {
      if (imagesEl.offsetHeight === 0) return gsap.timeline();
      const shift = direction === "next" ? -1 : 1;
      const enterStep = direction === "next" ? 2 : -2;
      const newIdx = direction === "next" ? mod(current + 2) : mod(current - 2);

      const newSlide = makeSlide(newIdx);
      imagesEl.appendChild(newSlide);
      positionSlide(newSlide, enterStep);
      slideEls.push({ el: newSlide, step: enterStep });

      slideEls.forEach((s) => {
        s.step += shift;
      });

      const duration = reducedMotion ? 0.01 : 1.2;
      const tl = gsap.timeline({
        onComplete: () => {
          slideEls = slideEls.filter((s) => {
            if (Math.abs(s.step) >= 2) {
              s.el.remove();
              return false;
            }
            return true;
          });
        },
      });
      slideEls.forEach((s) => {
        const p = getSlideProps(s.step);
        s.el.style.zIndex = String(p.zIndex);
        tl.to(
          s.el,
          {
            x: p.x,
            y: p.y,
            rotation: p.rotation,
            scale: p.scale,
            opacity: p.opacity,
            filter: `blur(${p.blur}px)`,
            duration,
            ease: "power3.inOut",
          },
          0
        );
      });
      return tl;
    };

    const stopAutoPlay = () => {
      if (autoPlayId) {
        clearInterval(autoPlayId);
        autoPlayId = null;
      }
    };
    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayId = setInterval(() => {
        if (!animating) go("next");
      }, AUTOPLAY_DELAY);
    };

    const go = (direction: "next" | "prev") => {
      if (animating) return;
      animating = true;
      startAutoPlay();
      const nextIdx =
        direction === "next" ? mod(current + 1) : mod(current - 1);

      const master = gsap.timeline({
        onComplete: () => {
          current = nextIdx;
          animating = false;
        },
      });
      master.to(
        rootEl,
        {
          backgroundColor: SLIDES[nextIdx].color,
          duration: reducedMotion ? 0.01 : 1.2,
          ease: "power2.inOut",
        },
        0
      );
      master.add(animateTitle(SLIDES[nextIdx].name, direction), 0);
      master.add(animateCarousel(direction), 0);
    };

    // Bindings — scoped to the slider element, not window (avoids hijacking page scroll)
    const onWheel = throttle((e: WheelEvent) => {
      if (animating) return;
      e.preventDefault();
      go(e.deltaY > 0 ? "next" : "prev");
    }, 1800);

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = throttle((e: TouchEvent) => {
      if (animating) return;
      const diff = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 40) return;
      go(diff > 0 ? "next" : "prev");
    }, 1800);

    const onKeyDown = (e: KeyboardEvent) => {
      // Only when slider is hovered/focused (cursor visible)
      if (!cursorVisible) return;
      if (animating) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") go("next");
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") go("prev");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!cursorVisible) {
        gsap.to(cursorEl, { opacity: 1, duration: 0.3 });
        cursorVisible = true;
      }
      const rect = rootEl.getBoundingClientRect();
      cursorMoveX(e.clientX - rect.left);
      cursorMoveY(e.clientY - rect.top);
    };
    const onMouseLeave = () => {
      gsap.to(cursorEl, { opacity: 0, duration: 0.3 });
      cursorVisible = false;
    };

    const onClick = () => {
      if (!animating) go("next");
    };

    const onResize = debounce(() => {
      if (!animating && imagesEl.offsetHeight > 0) {
        slideEls.forEach((s) => positionSlide(s.el, s.step));
      }
    }, 300);

    rootEl.addEventListener("wheel", onWheel, { passive: false });
    rootEl.addEventListener("touchstart", onTouchStart, { passive: true });
    rootEl.addEventListener("touchend", onTouchEnd, { passive: true });
    rootEl.addEventListener("mousemove", onMouseMove, { passive: true });
    rootEl.addEventListener("mouseleave", onMouseLeave);
    rootEl.addEventListener("click", onClick);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize, { passive: true });

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        animating = false;
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    startAutoPlay();

    return () => {
      stopAutoPlay();
      rootEl.removeEventListener("wheel", onWheel);
      rootEl.removeEventListener("touchstart", onTouchStart);
      rootEl.removeEventListener("touchend", onTouchEnd);
      rootEl.removeEventListener("mousemove", onMouseMove);
      rootEl.removeEventListener("mouseleave", onMouseLeave);
      rootEl.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="bs-slider relative w-full overflow-hidden cursor-none select-none"
      style={{ height: "80vh", minHeight: 520 }}
    >
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-8 md:px-14 pt-8 md:pt-10">
        <div className="w-12 h-12 rounded-full border border-white/30" aria-hidden />
        <span className="hidden md:block text-[11px] tracking-[0.15em] uppercase text-white/60">
          The InvBank Experience
        </span>
      </div>

      {/* Body */}
      <div className="relative h-[calc(100%-88px)] px-8 md:px-14 pb-10 flex flex-col lg:flex-row lg:items-center">
        {/* Left: title */}
        <div className="relative z-10 flex-1 min-h-0 flex flex-col">
          <h2
            ref={titleRef}
            aria-live="polite"
            className="bs-title font-work-sans font-bold text-white leading-[1.15] tracking-tight overflow-hidden relative my-auto"
            style={{ fontSize: "clamp(56px, 12vw, 180px)" }}
          />
          <div className="flex-shrink-0 mt-6 md:mt-10 grid grid-cols-2 gap-6 max-w-md">
            <p className="text-[10px] uppercase tracking-widest text-white/55 leading-relaxed">
              Built for those who build.
              <br />
              Modern American banking.
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white/55 leading-relaxed">
              FDIC-Insured.
              <br />
              Equal Housing Lender.
            </p>
          </div>
        </div>

        {/* Right: images */}
        <div
          ref={imagesRef}
          className="bs-images absolute inset-0 lg:static lg:flex-1 lg:h-full pointer-events-none lg:pointer-events-auto"
        />
      </div>

      {/* Cursor */}
      <div
        ref={cursorRef}
        aria-hidden
        className="bs-cursor fixed top-0 left-0 z-20 w-20 h-20 rounded-full border border-white/30 flex items-center justify-center text-white/70 text-2xl pointer-events-none"
        style={{ willChange: "transform" }}
      >
        +
      </div>

      <style jsx>{`
        .bs-slider :global(.bs-slide) {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 55%;
          aspect-ratio: 1.4;
          overflow: hidden;
          will-change: transform, filter, opacity;
          border-radius: 4px;
        }
        .bs-slider :global(.bs-slide img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.9);
        }
        @media (min-width: 768px) {
          .bs-slider :global(.bs-slide) {
            width: 60%;
          }
        }
        @media (min-width: 1024px) {
          .bs-slider :global(.bs-slide) {
            width: 68%;
          }
        }
        .bs-title :global(span) {
          display: inline-block;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}
