"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function LiquidText({
  text,
  className = "text-5xl",
}: {
  text: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const isClient = useIsClient();

  useEffect(() => {
    if (reduced || !isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const draw = () => {
      time += 0.01;
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, width, height);

      // Create blob movement
      const blob1X = width / 2 + Math.sin(time) * (width * 0.15);
      const blob1Y = height / 2 + Math.cos(time * 1.3) * (height * 0.15);
      const blob2X = width / 2 + Math.sin(time * 1.5) * (width * 0.2);
      const blob2Y = height / 2 + Math.cos(time * 0.8) * (height * 0.2);

      // Draw text
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 4rem Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, width / 2, height / 2);

      // Save the text as a clipping path
      ctx.save();
      ctx.globalCompositeOperation = "source-in";

      // Draw overlapping blobs for liquid effect
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(blob1X, blob1Y, height * 0.25, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(blob2X, blob2Y, height * 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [text, reduced, isClient]);

  if (reduced || !isClient) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`${className} w-full`}
      style={{ lineHeight: 1, display: "block" }}
    />
  );
}
