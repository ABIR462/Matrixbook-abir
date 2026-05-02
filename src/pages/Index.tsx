import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Workflow } from "@/components/Workflow";
import { Features } from "@/components/Features";
import { Templates } from "@/components/Templates";
import { HowItWorks } from "@/components/HowItWorks";
import { Brand } from "@/components/Brand";
import type { Template } from "@/lib/templates";
import { Github, Twitter, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const start = (prompt: string) => {
    if (!prompt.trim()) return;
    navigate("/build", { state: { prompt } });
  };

  const pickTemplate = (t: Template) => start(t.prompt);

  useEffect(() => {
    document.title = "MATRIXBOOK — The Operating System for Multimodal Intelligence";
  }, []);  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <main>
        <Hero onSubmit={start} loading={false} />
        
        {/* Immersive Intelligence Section */}
        <section className="py-32 relative border-y border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          
          <div className="container px-6 flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-6 font-sans">
                Core Capability // 01
              </div>
              <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-8 leading-[1.1]">
                Seamlessly Orchestrate <br /> <span className="text-neutral-500">Neural Workflows.</span>
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed mb-10 font-sans font-light">
                Connect your logic to our multimodal intelligence layer. Observe as Matrixbook synthesizes complex requirements into polished, production-ready interfaces in real-time.
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                  <div className="text-[10px] font-sans font-bold text-neutral-500 uppercase tracking-widest">Neural Accuracy</div>
                </div>
                <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white mb-1">&lt; 200ms</div>
                  <div className="text-[10px] font-sans font-bold text-neutral-500 uppercase tracking-widest">Sync Latency</div>
                </div>
              </div>
            </div>

            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
               <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full animate-pulse" />
               <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_20s_linear_infinite]" />
               <div className="absolute inset-8 border border-indigo-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
               
               <div className="relative z-10 p-12 rounded-full bg-black/40 backdrop-blur-3xl border border-white/10 flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-20 h-20 text-indigo-500 animate-pulse" />
               </div>
            </div>
          </div>
        </section>

        <Workflow />
        <Features />
        
        <div className="bg-[#080808] py-32 border-t border-white/5 shadow-[0_-20px_100px_rgba(0,0,0,1)]">
          <Templates onPick={pickTemplate} />
        </div>
        
        <HowItWorks />
      </main>

      <footer className="relative border-t border-white/5 pt-32 pb-16 overflow-hidden bg-[#050505]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <div className="container relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-2">
              <Brand size={40} />
              <p className="text-neutral-400 mt-6 max-w-sm leading-relaxed font-sans font-light">
                The world's first neural operating system designed for the next era of multimodal intelligence. Built for engineers, by engineers.
              </p>
              <div className="flex items-center gap-4 mt-8">
                <a href="#" className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-neutral-400 hover:text-white">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-neutral-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-sans font-bold text-neutral-500 uppercase tracking-[0.3em] mb-8">Platform</h4>
              <ul className="space-y-4">
                {["Inference", "Orchestrator", "Neural Sync", "Security"].map(item => (
                  <li key={item}><a href="#" className="text-sm text-neutral-400 hover:text-indigo-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-sans font-bold text-neutral-500 uppercase tracking-[0.3em] mb-8">Resources</h4>
              <ul className="space-y-4">
                {["Documentation", "API Reference", "Architecture", "Community"].map(item => (
                  <li key={item}><a href="#" className="text-sm text-neutral-400 hover:text-indigo-400 transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
            <p className="text-[11px] text-neutral-600 font-sans tracking-wide">
              © 2026 MATRIXBOOK // ALL SYSTEMS OPERATIONAL // BUILT BY ABIR KAYAL
            </p>
            <div className="flex items-center gap-6">
               <span className="flex items-center gap-2 text-[10px] font-sans font-bold text-neutral-500 uppercase tracking-widest leading-none">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                 LHR_D_NODE01
               </span>
               <span className="text-[10px] font-sans font-bold text-neutral-500 uppercase tracking-widest leading-none">V2.4.8_STABLE</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
