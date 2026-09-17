"use client";

import { motion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-90px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Word-by-word editorial headline reveal.
 *
 * The observer lives on the unclipped container: a word translated out of its
 * own `overflow-hidden` mask has an empty intersection rect, so putting
 * `whileInView` on the word itself would never fire.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
  accentFrom,
}: {
  text: string;
  className?: string;
  delay?: number;
  /** Words from this index on are rendered in italic serif accent. */
  accentFrom?: number;
}) {
  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.07, delayChildren: delay }}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={
              accentFrom !== undefined && i >= accentFrom
                ? "display-italic inline-block text-accent-fg"
                : "inline-block"
            }
            variants={{
              hidden: { y: "108%", opacity: 0 },
              visible: { y: "0%", opacity: 1 },
            }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
