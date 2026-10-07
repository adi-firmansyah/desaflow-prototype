"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface InteractiveDotBackgroundProps {
  className?: string;
  count?: number;
  dotRadius?: number;
  minRadius?: number;
  maxRadius?: number;
  hoverRadius?: number;
  repelStrength?: number;
  color?: string;
  darkColor?: string;
}

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSpeed: number;
  radius: number;
  opacity: number;
}

export function InteractiveDotBackground({
  className,
  count,
  dotRadius,
  minRadius = 0.8,
  maxRadius = 3.8,
  hoverRadius = 130,
  repelStrength = 1.2,
  color = "#8c8c8c",
  darkColor = "rgba(255, 255, 255, 0.35)",
}: InteractiveDotBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;

    const rawMouse = {
      clientX: -9999,
      clientY: -9999,
      active: false,
    };

    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function getTargetCount(w: number, h: number) {
      if (count && count > 0) return count;
      // Kurang padat: sekitar 50 - 85 partikel pada desktop, 25 - 40 pada mobile
      return Math.max(30, Math.min(85, Math.floor((w * h) / 22000)));
    }

    const effectiveMin = dotRadius ? dotRadius * 0.5 : minRadius;
    const effectiveMax = dotRadius ? dotRadius * 2.4 : maxRadius;

    function createDot(w: number, h: number): Dot {
      const angle = Math.random() * Math.PI * 2;
      const rand = Math.random();

      // Variasi ukuran: kecil (depth/jauh), sedang, dan besar (aksen foreground)
      let radius: number;
      let opacity: number;
      let speed: number;

      if (rand < 0.55) {
        // 55% partikel kecil (misal 0.8px - 1.6px)
        radius = effectiveMin + Math.random() * (1.6 - effectiveMin);
        opacity = 0.25 + Math.random() * 0.3;
        speed = 0.15 + Math.random() * 0.25;
      } else if (rand < 0.88) {
        // 33% partikel sedang (misal 1.7px - 2.7px)
        radius = 1.7 + Math.random() * 1.0;
        opacity = 0.38 + Math.random() * 0.3;
        speed = 0.22 + Math.random() * 0.28;
      } else {
        // 12% partikel besar/menonjol (misal 2.8px - 3.8px)
        radius = 2.8 + Math.random() * Math.max(0.6, effectiveMax - 2.8);
        opacity = 0.55 + Math.random() * 0.35;
        speed = 0.3 + Math.random() * 0.3;
      }

      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseSpeed: speed,
        radius,
        opacity,
      };
    }

    function initOrAdjustDots(newWidth: number, newHeight: number) {
      const targetCount = getTargetCount(newWidth, newHeight);

      if (dots.length === 0) {
        for (let i = 0; i < targetCount; i++) {
          dots.push(createDot(newWidth, newHeight));
        }
      } else if (dots.length < targetCount) {
        while (dots.length < targetCount) {
          dots.push(createDot(newWidth, newHeight));
        }
      } else if (dots.length > targetCount) {
        dots.splice(targetCount);
      }
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx?.scale(dpr, dpr);
      initOrAdjustDots(width, height);
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(canvas);
    resize();

    const handlePointerMove = (e: PointerEvent) => {
      rawMouse.clientX = e.clientX;
      rawMouse.clientY = e.clientY;
      rawMouse.active = true;
    };

    const handlePointerLeave = () => {
      rawMouse.clientX = -9999;
      rawMouse.clientY = -9999;
      rawMouse.active = false;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("mouseleave", handlePointerLeave);

    const MAX_SPEED = 4.5;
    const DRAG = 0.96;

    function render() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);

      // Sinkronisasi posisi mouse terhadap canvas bounding rect
      if (rawMouse.active) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = rawMouse.clientX - rect.left;
        mouse.y = rawMouse.clientY - rect.top;
        mouse.active =
          mouse.x >= -hoverRadius &&
          mouse.x <= width + hoverRadius &&
          mouse.y >= -hoverRadius &&
          mouse.y <= height + hoverRadius;
      } else {
        mouse.active = false;
      }

      const isDark = document.documentElement.classList.contains("dark");
      const baseColor = isDark ? darkColor : color;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // 1. Efek Repel & Pembelokan Arah Gerak saat Mouse Hover
        if (mouse.active) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < hoverRadius && dist > 0) {
            const force = 1 - dist / hoverRadius;
            const angle = Math.atan2(dy, dx);

            // Mendorong kecepatan dan membelokkan vektor gerak dot menjauh dari mouse
            const impulse = force * force * repelStrength * 1.8;
            dot.vx += Math.cos(angle) * impulse;
            dot.vy += Math.sin(angle) * impulse;

            // Dorongan posisi langsung agar reaksi terasa instan
            dot.x += Math.cos(angle) * (force * 3.5);
            dot.y += Math.sin(angle) * (force * 3.5);
          }
        }

        // 2. Gerakan acak halus (wander steering)
        if (!prefersReducedMotion) {
          dot.vx += (Math.random() - 0.5) * 0.03;
          dot.vy += (Math.random() - 0.5) * 0.03;
        }

        // 3. Batasi kecepatan dan perlahan kembalikan ke kecepatan jelajah normal
        const speed = Math.hypot(dot.vx, dot.vy);
        if (speed > MAX_SPEED) {
          dot.vx = (dot.vx / speed) * MAX_SPEED;
          dot.vy = (dot.vy / speed) * MAX_SPEED;
        } else if (speed > dot.baseSpeed) {
          dot.vx *= DRAG;
          dot.vy *= DRAG;
        } else if (speed < dot.baseSpeed * 0.5 && speed > 0.001) {
          dot.vx = (dot.vx / speed) * dot.baseSpeed;
          dot.vy = (dot.vy / speed) * dot.baseSpeed;
        }

        // 4. Update posisi dot
        if (!prefersReducedMotion) {
          dot.x += dot.vx;
          dot.y += dot.vy;
        }

        // 5. Wrap-around layar dengan padding agar tidak muncul tiba-tiba
        const pad = 24;
        if (dot.x < -pad) dot.x = width + pad;
        else if (dot.x > width + pad) dot.x = -pad;

        if (dot.y < -pad) dot.y = height + pad;
        else if (dot.y > height + pad) dot.y = -pad;

        // 6. Gambar dot dengan transparansi dan sedikit efek saat dekat mouse
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.globalAlpha = dot.opacity;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [
    count,
    dotRadius,
    minRadius,
    maxRadius,
    hoverRadius,
    repelStrength,
    color,
    darkColor,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "fixed inset-0 h-full w-full pointer-events-none z-0",
        className,
      )}
    />
  );
}
