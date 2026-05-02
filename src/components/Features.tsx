import {
  Wand2, MousePointer2, ShoppingBag, Flame,
  Code2, Shield, Zap, Image,
} from "lucide-react";

const FEATURES = [
  {
    icon: Wand2,
    title: "AI Code Generation",
    desc: "Codestral writes complete, production-quality HTML, CSS, and JavaScript from a single sentence.",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: MousePointer2,
    title: "Visual Editor",
    desc: "Click any element in the live preview to edit text, swap colors, and rearrange sections — no code.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: ShoppingBag,
    title: "Shopify-style Commerce",
    desc: "Add product grids, cart UI, and checkout flows. Real e-commerce layouts generated instantly.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Image,
    title: "Real Image Integration",
    desc: "Automatically pulls relevant, high-quality images from Unsplash and Picsum into your pages.",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: Flame,
    title: "Firebase Realtime Sync",
    desc: "Every generation is saved to your dashboard in real-time via Firebase. Access from any device.",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
  {
    icon: Code2,
    title: "Clean Code Export",
    desc: "Download or copy the full HTML source. No dependencies, no build step — just open in a browser.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    desc: "Firebase Auth protects your account. Firestore rules ensure only you can access your builds.",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  {
    icon: Zap,
    title: "Instant Preview",
    desc: "See your page live in desktop, tablet, and mobile frames as it generates. No waiting.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />

      <div className="container px-4 relative">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-500 mb-6">Core_Capabilities</p>
          <h2 className="huge-type !text-4xl md:!text-5xl mb-6">
            Everything you need
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">to ship faster.</span>
          </h2>
          <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-sans max-w-lg">
            Matrixbook combines multimodal intelligence with real-time editing, 
            instant deployment, and enterprise-grade security.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`group glass rounded-2xl p-5 border ${f.bg} hover:shadow-elevated transition-all duration-300 hover:-translate-y-1`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} border flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
