"use client";
import { motion } from "motion/react";
import { ComponentProps } from "react";

export const MotionDiv = motion.div;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;
export const MotionH3 = motion.h3;
export const MotionP = motion.p;
export const MotionSpan = motion.span;
export const MotionButton = motion.button;
export const MotionHeader = motion.header;
export const MotionA = motion.a;
export const MotionSvg = motion.svg;

export type MotionDivProps = ComponentProps<typeof motion.div>;
export type MotionH1Props = ComponentProps<typeof motion.h1>;
export type MotionH2Props = ComponentProps<typeof motion.h2>;
export type MotionH3Props = ComponentProps<typeof motion.h3>;
export type MotionPProps = ComponentProps<typeof motion.p>;
export type MotionSpanProps = ComponentProps<typeof motion.span>;
export type MotionButtonProps = ComponentProps<typeof motion.button>;
export type MotionHeaderProps = ComponentProps<typeof motion.header>;
export type MotionAProps = ComponentProps<typeof motion.a>;
export type MotionSvgProps = ComponentProps<typeof motion.svg>;