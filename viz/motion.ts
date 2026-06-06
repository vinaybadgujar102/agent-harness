import type { Transition, Variants } from "framer-motion";

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
};

export const easeOut: Transition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1],
};

export const panelVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...easeOut, staggerChildren: 0.06 },
  },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2 } },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: easeOut },
  exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
};
