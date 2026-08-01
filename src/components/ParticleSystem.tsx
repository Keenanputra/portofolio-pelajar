"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useScroll, useTransform } from "motion/react";

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseSize: number;
  baseOpacity: number;
};

export default function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const particles = useRef<Particle[]>([]);
  const scrollOffset = useRef(0);

  // Scroll-driven effect: particle density and movement react to scroll
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    return scrollYProgress.on("change", (value) => {
      scrollOffset.current = value;
    });
  }, [scrollYProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const count = Math.min(Math.floor(window.innerWidth / 10), 40);
      particles.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.05 + 0.02,
        baseSize: Math.random() * 2 + 0.5,
        baseOpacity: Math.random() * 0.05 + 0.02,
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";

      const scrollFactor = 1 + scrollOffset.current * 1.5;

      particles.current.forEach((p) => {
        p.x += p.vx * scrollFactor;
        p.y += p.vy * scrollFactor;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Morph based on scroll - particles grow and glow as user scrolls
        const morphScale = 1 + scrollOffset.current * 0.5;
        const currentSize = p.baseSize * morphScale;
        const currentOpacity = Math.min(0.2, p.baseOpacity * (1 + scrollOffset.current));

        ctx.globalAlpha = currentOpacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) {
    return <div className="pointer-events-none fixed inset-0 -z-10" />;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
