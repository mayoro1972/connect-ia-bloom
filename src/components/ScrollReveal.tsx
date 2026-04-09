import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  once?: boolean;
  distance?: number;
}

const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true,
  distance,
}: ScrollRevealProps) => {
  void delay;
  void direction;
  void duration;
  void once;
  void distance;
  return <div className={className}>{children}</div>;
};

export default ScrollReveal;
