"use client";
import { useEffect, useState } from "react";
import { motion, useSpring } from "motion/react";

interface TrailDot {
  x: number;
  y: number;
  id: number;
}

export default function LiquidCursorTrail() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState<TrailDot[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [lowBattery, setLowBattery] = useState(false);

  const springX = useSpring(mousePosition.x, { stiffness: 120, damping: 25 });
  const springY = useSpring(mousePosition.y, { stiffness: 120, damping: 25 });

  // Check if device is desktop and battery level
  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth > 768 && !("ontouchstart" in window));
    };

    const checkBattery = async () => {
      if ("getBattery" in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setLowBattery(battery.level < 0.2);
        } catch (error) {
          // Battery API not supported
          setLowBattery(false);
        }
      }
    };

    checkDevice();
    checkBattery();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Track mouse movement and create trail
  useEffect(() => {
    if (!isDesktop || lowBattery) return;

    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);

      // Add new trail dot
      const newDot: TrailDot = {
        x: newPosition.x,
        y: newPosition.y,
        id: Date.now(),
      };

      setTrails((prev) => {
        const updated = [newDot, ...prev].slice(0, 5); // Keep only 5 dots
        return updated;
      });
    };

    // Clean up old trails
    const cleanupTrails = () => {
      setTrails((prev) => 
        prev.filter((dot) => Date.now() - dot.id < 1000) // Remove dots older than 1s
      );
      animationFrame = requestAnimationFrame(cleanupTrails);
    };

    document.addEventListener("mousemove", handleMouseMove);
    cleanupTrails();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isDesktop, lowBattery]);

  // Don't render on mobile, touch devices, or low battery
  if (!isDesktop || lowBattery) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {trails.map((dot, index) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full bg-white/60 shadow-lg shadow-white/20"
          style={{
            left: dot.x - 4,
            top: dot.y - 4,
            width: Math.max(2, 8 - index * 1.5),
            height: Math.max(2, 8 - index * 1.5),
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ 
            opacity: Math.max(0.1, 1 - index * 0.2),
            scale: Math.max(0.5, 1 - index * 0.1)
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 25,
            duration: 0.3
          }}
        />
      ))}
    </div>
  );
}