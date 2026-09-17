"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const petals = [0, 60, 120, 180, 240, 300];

/**
 * Organic "lens bloom" — layered petals, iridescent rings and a bright core.
 * Tuned to read on both the light and the dark surface.
 */
export function LensOrb({ className, size = 220 }: { className?: string; size?: number }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {/* ambient glow */}
      <motion.div
        className="absolute inset-[-18%] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(93 139 205 / 0.45), rgb(93 139 205 / 0.08) 60%, transparent 75%)",
        }}
        animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.05, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* petals — the organic bloom silhouette */}
      <motion.div
        className="absolute inset-[-8%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
      >
        {petals.map((deg, i) => (
          <motion.span
            key={deg}
            className="absolute left-1/2 top-1/2 blur-[10px]"
            style={{
              width: "56%",
              height: "72%",
              marginLeft: "-28%",
              marginTop: "-36%",
              borderRadius: "50% 50% 46% 46% / 62% 62% 38% 38%",
              transformOrigin: "50% 50%",
              transform: `rotate(${deg}deg) translateY(-26%)`,
              background:
                i % 2 === 0
                  ? "radial-gradient(60% 55% at 50% 30%, rgb(186 208 239 / 0.95), rgb(93 139 205 / 0.5) 58%, transparent 80%)"
                  : "radial-gradient(60% 55% at 50% 30%, rgb(245 233 205 / 0.85), rgb(204 157 74 / 0.4) 58%, transparent 80%)",
            }}
            animate={{ opacity: [0.5, 0.95, 0.5], scale: [1, 1.06, 1] }}
            transition={{ duration: 7 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.45 }}
          />
        ))}
      </motion.div>

      {/* iridescent ring */}
      <motion.div
        className="absolute inset-[6%] rounded-full opacity-80 blur-[10px]"
        style={{
          background:
            "conic-gradient(from 200deg, rgb(143 178 226 / 0.75), rgb(255 255 255 / 0.85), rgb(204 157 74 / 0.5), rgb(36 76 138 / 0.7), rgb(143 178 226 / 0.75))",
          maskImage: "radial-gradient(closest-side, transparent 52%, #000 66%, #000 92%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(closest-side, transparent 52%, #000 66%, #000 92%, transparent 100%)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      />

      {/* lens body */}
      <div
        className="absolute inset-[27%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 36% 30%, rgb(255 255 255 / 0.98), rgb(186 208 239 / 0.9) 38%, rgb(36 76 138 / 0.85) 82%, rgb(9 32 64 / 0.92) 100%)",
          boxShadow:
            "inset 0 -10px 24px rgb(9 32 64 / 0.45), inset 0 8px 20px rgb(255 255 255 / 0.45), 0 12px 34px -14px rgb(9 32 64 / 0.6)",
        }}
      />

      {/* specular highlight */}
      <motion.div
        className="absolute rounded-full blur-[5px]"
        style={{
          left: "35%",
          top: "33%",
          width: "18%",
          height: "13%",
          background: "radial-gradient(closest-side, rgb(255 255 255 / 0.95), transparent 70%)",
        }}
        animate={{ opacity: [0.75, 1, 0.75], x: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* thin rim */}
      <div
        className="absolute inset-[26%] rounded-full"
        style={{ border: "1px solid rgb(255 255 255 / 0.4)" }}
      />
    </div>
  );
}
