import { motion } from "motion/react";
import { Zap, GitBranch, Terminal, Shield, Sparkles, Database } from "lucide-react";

const NODES = [
  { icon: Terminal, label: "Neural Input", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { icon: GitBranch, label: "Logic Matrix", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Database, label: "Context sync", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Sparkles, label: "Synthesis", color: "text-amber-500", bg: "bg-amber-500/10" },
];

export function Workflow() {
  return (
    <section className="py-24 relative overflow-hidden bg-black">
      <div className="container px-6 relative z-10">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="huge-type !text-4xl md:!text-5xl mb-6 glossy-text">
            INTELLIGENT <span className="text-indigo-500">PIPELINES</span>
          </h2>
          <p className="mono-tag text-neutral-500">
            Define, synchronize, and deploy multimodal workflows across the neural network in real-time.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 max-w-5xl mx-auto">
          {/* Connecting lines (SVG) */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-neutral-800 -translate-y-1/2 hidden md:block" />
          
          {NODES.map((node, i) => (
            <motion.div
              key={node.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="relative z-20 flex flex-col items-center group"
            >
              <div className={`w-20 h-20 rounded-2xl ${node.bg} border border-neutral-800 flex items-center justify-center mb-4 transition-all duration-500 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]`}>
                <node.icon className={`w-8 h-8 ${node.color}`} />
              </div>
              <span className="mono-tag text-[10px] text-neutral-400 group-hover:text-white transition-colors">
                {node.label}
              </span>
              
              {/* Pulse effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-indigo-500 blur-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <WorkflowCard 
            icon={<Zap className="w-5 h-5 text-indigo-500" />}
            title="LOW_LATENCY_EXECUTION"
            desc="Optimized for real-time inference with our proprietary buffering engine."
          />
          <WorkflowCard 
            icon={<Shield className="w-5 h-5 text-indigo-500" />}
            title="SECURE_CONTEXT"
            desc="End-to-end encryption for all multimodal data streams and neural logs."
          />
          <WorkflowCard 
            icon={<GitBranch className="w-5 h-5 text-indigo-500" />}
            title="BRANCHING_LOGIC"
            desc="Complex conditional flows that adapt to user intent and historical data."
          />
        </div>
      </div>
    </section>
  );
}

function WorkflowCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-8 rounded-sm border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900/50 transition-all duration-300">
      <div className="mb-6">{icon}</div>
      <h3 className="mono-tag text-neutral-100 text-xs mb-3">{title}</h3>
      <p className="text-sm text-neutral-500 leading-relaxed font-sans">{desc}</p>
    </div>
  );
}
