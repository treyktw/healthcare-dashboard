// constants/animations.ts
export const spring = {
  type: "spring",
  stiffness: 700,
  damping: 25,
  duration: 1,
} as const;

export const questionVariants = {
  hidden: { opacity: 0, translateY: 200 },
  show: {
    opacity: 1,
    translateY: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const variant = {
  hidden: { opacity: 0, translateY: 50 },
  show: { opacity: 1, translateY: 0 },
};

export const item = {
  hidden: { opacity: 0, translateY: -100 },
  show: { opacity: 1, translateY: 0 },
};