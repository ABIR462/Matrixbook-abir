import { useRef, useEffect } from "react";
import { PromptComposer, type Attachment } from "./PromptComposer";
import { Zap, Shield, Sparkles } from "lucide-react";

const FLOATING_WORDS = ["Landing Page", "Dashboard", "Portfolio", "Store", "Blog", "SaaS App"];

export function Hero({
  onSubmit,
  loading,
}: {
  onSubmit: (p: string, attachments?: Attachment[]) => void;
  loading: boolean;
}) {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tickerRef.current;
    if (!el) return;
    let frame: number;
    let x = 0;
    const speed = 0.3;
    const animate = () => {
      x -= speed;
      if (x <= -el.scrollWidth / 2) x = 0;
      el.style.transform = `translateX(${x}px)`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section id="top" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-24">
      {/* Premium Background Layering */}
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* Neural Grid */}
      <div className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Atmospheric Glare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-indigo-500/20 blur-[160px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 px-6 text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-3 px-4 py-2 mb-8 md:mb-12 rounded-full glass-panel text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-sans font-bold text-indigo-400 animate-fade-in shadow-[0_0_40px_rgba(99,102,241,0.15)] mx-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Neural Operating System // v2.4.8_RC
        </div>

        {/* Massive Headline */}
        <h1 className="huge-type mb-5 md:mb-8 animate-fade-up text-white leading-[0.95] glossy-text tracking-tighter drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          ORCHESTRATE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-500 via-purple-400 to-indigo-300">INTELLIGENCE</span>
        </h1>

        <p className="max-w-2xl mx-auto text-neutral-400 text-sm md:text-lg leading-relaxed mb-8 md:mb-14 animate-fade-up delay-100 font-sans font-light tracking-tight px-6 opacity-70">
          Matrixbook is the terminal for multimodal engineering. 
          Synchronize high-fidelity AI workflows with precision.
        </p>

        {/* Action Center */}
        <div className="max-w-3xl mx-auto animate-fade-up delay-200 mb-20 md:mb-28 group/composer px-2 sm:px-0">
          <div className="p-[1px] rounded-[24px] md:rounded-[36px] bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 group-hover/composer:shadow-indigo-500/10">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl rounded-[23px] md:rounded-[35px] overflow-hidden">
               <PromptComposer
                 onSubmit={(prompt, attachments) => onSubmit(prompt, attachments)}
                 loading={loading}
               />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 md:gap-10 mt-8 md:mt-12">
            <div className="flex -space-x-3 md:-space-x-4">
              {[15, 23, 44, 52, 61].map(i => (
                <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#050505] bg-neutral-900 overflow-hidden ring-1 ring-white/20 grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer hover:scale-110 active:scale-95">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            <div className="flex flex-col items-center sm:items-start gap-1">
               <span className="text-[9px] md:text-[10px] font-sans font-black text-neutral-500 uppercase tracking-[0.3em]">
                 Data Privacy Standards
               </span>
               <div className="flex items-center gap-4">
                  <span className="text-[10px] md:text-[12px] font-sans font-bold text-neutral-200 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" /> AES-256
                  </span>
                  <span className="text-[10px] md:text-[12px] font-sans font-bold text-neutral-200 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" /> ISO/IEC 27001
                  </span>
               </div>
            </div>
          </div>
        </div>

        {/* Interactive UI Mockup */}
        <div className="relative max-w-6xl mx-auto rounded-3xl border border-white/10 bg-[#0a0a0a] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.8)] group transition-transform duration-1000 hover:scale-[1.01]">
          <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-6 gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-800" />
              <div className="w-3 h-3 rounded-full bg-neutral-800" />
              <div className="w-3 h-3 rounded-full bg-neutral-800" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[10px] font-sans font-bold text-neutral-600 uppercase tracking-[0.4em] ml-[-40px]">CORE_ORCHESTRATOR // LOCAL_SYNC</span>
            </div>
          </div>
          
          <div className="p-2 sm:p-4 aspect-[21/9] flex items-center justify-center bg-black relative">
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#4f46e5_1px,transparent_1px)] bg-[size:40px_40px]" />
             
             <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="grid grid-cols-4 gap-4 sm:gap-8 w-full max-w-5xl px-4 sm:px-8">
                   <div className="h-32 rounded-2xl border border-white/5 bg-white/[0.02] p-4 hidden md:flex flex-col justify-between backdrop-blur-sm">
                      <div className="w-8 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                      <div className="space-y-2">
                        <div className="w-full h-1 bg-neutral-800 rounded-full" />
                        <div className="w-2/3 h-1 bg-neutral-800 rounded-full" />
                      </div>
                   </div>
                   
                   <div className="h-48 col-span-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.03] p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(99,102,241,0.1)] relative overflow-hidden group-hover:border-indigo-500/50 transition-colors">
                      <div className="absolute top-0 right-0 p-4">
                         <div className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-bold text-indigo-400 uppercase tracking-widest">Live</div>
                      </div>
                      <div className="space-y-4">
                        <div className="w-16 h-1 bg-indigo-500 rounded-full" />
                        <div className="space-y-2">
                           <div className="w-full h-1 bg-white/10 rounded-full" />
                           <div className="w-full h-1 bg-white/10 rounded-full" />
                           <div className="w-3/4 h-1 bg-white/10 rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
                        <div className="w-32 h-1 bg-white/5 rounded-full" />
                      </div>
                   </div>

                   <div className="h-32 rounded-2xl border border-white/5 bg-white/[0.02] p-4 hidden md:flex flex-col justify-between backdrop-blur-sm">
                      <div className="w-8 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                      <div className="space-y-2">
                        <div className="w-full h-1 bg-neutral-800 rounded-full" />
                        <div className="w-2/3 h-1 bg-neutral-800 rounded-full" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Scrolling ticker */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-border/30 py-3 bg-background/50 backdrop-blur-sm">
        <div ref={tickerRef} className="flex gap-8 whitespace-nowrap will-change-transform">
          {[...FLOATING_WORDS, ...FLOATING_WORDS, ...FLOATING_WORDS, ...FLOATING_WORDS].map((w, i) => (
            <span key={i} className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest">
              ✦ {w}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
