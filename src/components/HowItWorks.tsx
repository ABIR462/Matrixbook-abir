import { MessageSquare, Wand2, MousePointer2, Rocket } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Describe it",
    body: "Type what you want in plain English. A landing page, a store, a portfolio — any idea works.",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    icon: Wand2,
    number: "02",
    title: "AI builds it",
    body: "Codestral generates a complete, styled, responsive HTML page with real images and clean code.",
    color: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/30",
    iconColor: "text-violet-400",
  },
  {
    icon: MousePointer2,
    number: "03",
    title: "Edit visually",
    body: "Click any element in the live preview to edit text, colors, and layout — no code needed.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Ship it",
    body: "Download the HTML, copy the code, or save to your dashboard. Production-ready in seconds.",
    color: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/30",
    iconColor: "text-orange-400",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="container px-4 relative">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-500 mb-6">Process_Flow</p>
          <h2 className="huge-type !text-3xl md:!text-4xl mb-6">
            From idea to website
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">in four steps.</span>
          </h2>
          <p className="text-neutral-500 text-xs md:text-sm leading-relaxed font-sans max-w-lg">
            A streamlined workflow designed for maximum efficiency. 
            No design friction. No coding overhead.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`relative group glass rounded-2xl p-6 border ${step.border} hover:shadow-elevated transition-all duration-300 hover:-translate-y-1`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10">
                {/* Number */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-4xl font-bold text-foreground/10 group-hover:text-foreground/20 transition-colors">
                    {step.number}
                  </span>
                  <div className={`w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center border ${step.border}`}>
                    <step.icon className={`w-5 h-5 ${step.iconColor}`} />
                  </div>
                </div>

                <h3 className="font-display text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </div>

              {/* Connector line (not on last) */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border z-20" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-20 glass-panel rounded-3xl p-8 md:p-16 text-center border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/5 animate-pulse-glow" />
          <div className="relative z-10">
            <h3 className="huge-type !text-2xl md:!text-4xl mb-6 text-white leading-tight">
              Your next website is <br className="md:hidden" /> one prompt away.
            </h3>
            <p className="text-neutral-500 mb-10 max-w-lg mx-auto text-xs md:text-sm font-sans">
              Join the new era of creators building with Matrixbook.
            </p>
            <a
              href="#top"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-[0_10px_40px_rgba(99,102,241,0.2)] active:scale-95"
            >
              <Wand2 className="w-4 h-4" />
              Initialize Session
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
