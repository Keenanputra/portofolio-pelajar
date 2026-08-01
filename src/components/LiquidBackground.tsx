"use client";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

function getSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function Blob({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const moveX = useMotionValue(x);
  const moveY = useMotionValue(y);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const nx = moveX.get() + (Math.random() - 0.5) * 0.2;
      const ny = moveY.get() + (Math.random() - 0.5) * 0.2;
      moveX.set(nx < -size || nx > window.innerWidth + size ? -nx : nx);
      moveY.set(ny < -size || ny > window.innerHeight + size ? -ny : ny);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [moveX, moveY, size]);

  const springX = useSpring(moveX, { stiffness: 20, damping: 20 });
  const springY = useSpring(moveY, { stiffness: 20, damping: 20 });

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: size * 2,
        height: size * 2,
        x: springX,
        y: springY,
        transformOrigin: "center",
      }}
    >
      <div
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 70%)`,
          opacity: 0.3,
        }}
      />
    </motion.div>
  );
}

export default function LiquidBackground() {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const isClient = useIsClient();
  const [size] = useState(() => {
    if (typeof window === "undefined") return { width: 0, height: 0 };
    return { width: window.innerWidth, height: window.innerHeight };
  });

  if (reduced || !isClient) {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, #060608 0%, #0a0a0f 100%)" }}
      />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #060608 0%, #0a0a0f 100%)" }}
      />
      <Blob x={-100} y={-100} size={400} color="rgba(245, 245, 244, 0.15)" />
      <Blob x={size.width + 100} y={size.height / 2} size={500} color="rgba(245, 245, 244, 0.12)" />
      <Blob x={size.width / 2} y={size.height + 100} size={350} color="rgba(34, 211, 238, 0.08)" />
    </div>
  );
}
