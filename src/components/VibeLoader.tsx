import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function VibeLoader({ message = "Orchestrating Neural Logic..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12 animate-fade-in">
      <div className="relative">
        {/* Core pulse */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20"
        />
        
        {/* Orbiting particles */}
        <div className="relative w-24 h-24">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 10 + i * 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 border border-indigo-500/10 rounded-full"
            >
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              />
            </motion.div>
          ))}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 rounded-full glass-panel border border-indigo-500/20 shadow-2xl">
              <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h3 className="text-xl font-sans font-bold tracking-tight text-white uppercase tracking-[0.2em]">{message}</h3>
        <div className="flex items-center gap-3">
          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Synthesizing Multimodal Layers</p>
        </div>
      </div>

      <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent relative overflow-hidden">
        <motion.div
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
        />
      </div>
    </div>
  );
}
