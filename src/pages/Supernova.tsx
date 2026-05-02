import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Download,
  Image as ImageIcon,
  Loader2,
  Menu,
  MessageSquarePlus,
  Paperclip,
  Pencil,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  User as UserIcon,
  Plus,
  X,
  StopCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  appendMessage,
  createConversation,
  deleteConversation,
  renameConversation,
  subscribeConversations,
  subscribeMessages,
  SupernovaConversation,
  SupernovaMessage,
} from "@/lib/supernovaStore";
import {
  ChatMessage,
  ChatPart,
  detectImageIntent,
  fileToDataUrl,
  generateImage,
  ImageRatio,
  ImageStyle,
  streamChat,
  chatOnce,
} from "@/lib/supernovaChat";

const STYLES: { id: ImageStyle; label: string }[] = [
  { id: "auto", label: "Auto" },
  { id: "realistic", label: "Realistic" },
  { id: "anime", label: "Anime" },
  { id: "illustration", label: "Illustration" },
  { id: "3d", label: "3D" },
  { id: "pixel", label: "Pixel" },
  { id: "logo", label: "Logo" },
  { id: "sketch", label: "Sketch" },
  { id: "watercolor", label: "Watercolor" },
  { id: "cyberpunk", label: "Cyberpunk" },
];

const RATIOS: ImageRatio[] = ["1:1", "16:9", "9:16", "3:2", "2:3", "4:3"];

const SUGGESTED = [
  { icon: "🎨", text: "Create a cinematic poster of a lone astronaut on a neon planet" },
  { icon: "🐉", text: "Anime illustration of a friendly dragon over a mountain village" },
  { icon: "🖼️", text: "Minimal vector logo for a coffee brand called 'North'" },
  { icon: "💡", text: "Explain quantum entanglement in 3 short paragraphs" },
];

function autoTitle(text: string) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > 48 ? t.slice(0, 45) + "…" : t || "New chat";
}

export default function Supernova() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [convos, setConvos] = useState<SupernovaConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupernovaMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]); // data URLs
  const [imageMode, setImageMode] = useState(false);
  const [style, setStyle] = useState<ImageStyle>("auto");
  const [ratio, setRatio] = useState<ImageRatio>("1:1");
  const [busy, setBusy] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [renameOpen, setRenameOpen] = useState<{ id: string; title: string } | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to conversations
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeConversations(user.uid, (rows) => {
      setConvos(rows);
      if (!activeId && rows.length > 0) setActiveId(rows[0].id);
    });
    return unsub;
  }, [user, activeId]);

  // Subscribe to messages of active conversation
  useEffect(() => {
    if (!user || !activeId) {
      setMessages([]);
      return;
    }
    const unsub = subscribeMessages(user.uid, activeId, setMessages);
    return unsub;
  }, [user, activeId]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      scrollRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior: "smooth" });
    }
  }, [messages, streamText]);

  // Mobile check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeConvo = useMemo(
    () => convos.find((c) => c.id === activeId) ?? null,
    [convos, activeId],
  );

  const newChat = async () => {
    if (!user) return;
    const id = await createConversation(user.uid, "New session");
    setActiveId(id);
    setMessages([]);
    setDraft("");
    setAttachments([]);
    setSidebarOpen(false);
  };

  const send = async () => {
    if (!user) return;
    const text = draft.trim();
    if (!text && attachments.length === 0) return;
    if (busy) return;

    let cid = activeId;
    if (!cid) {
      cid = await createConversation(user.uid, autoTitle(text));
      setActiveId(cid);
    } else if (messages.length === 0 && text) {
      renameConversation(user.uid, cid, autoTitle(text)).catch(() => {});
    }

    const userImages = attachments.slice();
    const intent = imageMode ? { isImage: true, prompt: text } : detectImageIntent(text);

    await appendMessage(user.uid, cid, {
      role: "user",
      kind: intent.isImage ? "image" : "text",
      content: text,
      images: userImages,
      prompt: intent.isImage ? intent.prompt : undefined,
    });

    setDraft("");
    setAttachments([]);
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      if (intent.isImage) {
        const images = await generateImage({
          prompt: intent.prompt || "an image",
          style,
          ratio,
          count: 1,
          signal: controller.signal,
        });

        let caption = "";
        try {
          caption = await chatOnce(
            [
              { role: "system", content: "You are Supernova, a concise image studio assistant. Give a technical confirmation for the operator." },
              { role: "user", content: `Prompt: "${intent.prompt}". Style: ${style}. Ratio: ${ratio}.` },
            ],
            { signal: controller.signal, maxTokens: 80 },
          );
        } catch { /* ignore */ }

        await appendMessage(user.uid, cid, {
          role: "assistant",
          kind: "image",
          content: caption || `RENDERED: ${style} // ${ratio}`,
          images: images.map((i) => i.url),
          prompt: intent.prompt,
        });
      } else {
        const history: ChatMessage[] = [
          {
            role: "system",
            content: "You are Supernova, the Matrix Core Intelligence. You use markdown precisely. You are authoritative yet helpful. Address the user as OPERATOR when appropriate.",
          },
          ...messages.map<ChatMessage>((m) => {
            if (m.role === "assistant") return { role: "assistant", content: m.content };
            const parts: ChatPart[] = [];
            if (m.content) parts.push({ type: "text", text: m.content });
            (m.images ?? []).forEach((url) => parts.push({ type: "image_url", image_url: { url } }));
            return { role: "user", content: parts.length > 1 ? parts : m.content };
          }),
        ];

        const parts: ChatPart[] = [];
        if (text) parts.push({ type: "text", text });
        userImages.forEach((url) => parts.push({ type: "image_url", image_url: { url } }));
        history.push({ role: "user", content: parts.length > 1 ? parts : text });

        setStreamText("▍");
        const final = await streamChat(
          history,
          (_d, full) => setStreamText(full + "▍"),
          { signal: controller.signal, maxTokens: 2048 },
        );
        setStreamText("");
        await appendMessage(user.uid, cid, {
          role: "assistant",
          kind: "text",
          content: final || "SYSTEM_ERROR // EMPTY_RESPONSE",
        });
      }
    } catch (e: unknown) {
      const err = e as { message?: string; name?: string };
      const aborted = /aborted/i.test(String(err?.message)) || err?.name === "AbortError";
      if (!aborted) {
        toast.error(err?.message ?? "Operation failed");
      }
    } finally {
      setBusy(false);
      setStreamText("");
      abortRef.current = null;
    }
  };

  const removeChat = async (id: string) => {
    if (!user) return;
    if (!confirm("PURGE SESSION? Data will be lost.")) return;
    await deleteConversation(user.uid, id);
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-200">
      <div className="p-4 flex items-center gap-4 border-b border-neutral-800">
        <Link to="/" className="text-neutral-500 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex items-center gap-3">
          <span className="mono-tag text-[10px] text-indigo-500 font-bold glossy-text tracking-tighter">MATRIXBOOK_CORE</span>
        </div>
      </div>

      <div className="p-4">
        <Button onClick={newChat} className="w-full justify-start gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-100 rounded-sm mono-tag text-[10px]">
          <MessageSquarePlus className="w-4 h-4 text-indigo-500" /> NEW_SESSION
        </Button>
      </div>

      <div className="px-4 py-2 mono-tag text-[9px] text-neutral-600 border-b border-neutral-800/10">
        HISTORY_LOG // {convos.length} ENTRIES
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1 custom-scrollbar">
        {convos.map((c) => (
          <div key={c.id} className={`group flex items-center gap-1 rounded-sm ${activeId === c.id ? "bg-neutral-900 border border-neutral-800" : "hover:bg-neutral-900/50"}`}>
            <button onClick={() => setActiveId(c.id)} className="flex-1 text-left text-[11px] font-mono px-3 py-2.5 truncate text-neutral-400 uppercase tracking-tighter transition-colors">
              {c.title}
            </button>
            <button onClick={() => setRenameOpen({ id: c.id, title: c.title })} className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-white p-2">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => removeChat(c.id)} className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-500 p-2 mr-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-800 bg-neutral-900/20 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center grayscale overflow-hidden">
          {user.photoURL ? <img src={user.photoURL} alt="" /> : <UserIcon className="w-4 h-4 text-neutral-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono text-neutral-300 truncate tracking-tight">{user.displayName || user.email?.split("@")[0]}</p>
          <button onClick={() => signOut()} className="mono-tag text-[9px] text-red-500 opacity-60 hover:opacity-100">DISCONNECT</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex bg-black text-neutral-100 overflow-hidden font-sans">
      {!isMobile && (
        <aside className={`${sidebarOpen ? "w-80" : "w-0"} shrink-0 transition-[width] duration-300 border-r border-neutral-900 bg-neutral-950 overflow-hidden`}>
          <SidebarContent />
        </aside>
      )}

      <main className="flex-1 flex flex-col min-w-0 bg-neutral-950 relative matrix-bg">
        <header className="h-14 px-4 sm:px-6 flex items-center justify-between border-b border-neutral-900 bg-black/50 backdrop-blur-md z-20">
          <div className="flex items-center gap-3 min-w-0">
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-neutral-500">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80 border-r-neutral-800">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(s => !s)} className="text-neutral-500 hover:text-white">
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <h1 className="mono-tag text-[10px] sm:text-xs text-neutral-400 truncate max-w-[200px] sm:max-w-md uppercase tracking-widest">{activeConvo?.title || "UNSET_SESSION"}</h1>
          </div>
          <div className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[8px] sm:text-[9px] font-mono font-bold text-indigo-500 uppercase tracking-widest">MATRIX_READY</span>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6">
          <div className="max-w-4xl mx-auto py-10 space-y-8">
            {messages.length === 0 && !streamText ? (
              <div className="flex flex-col items-center justify-center text-center pt-10 sm:pt-20">
                <div className="relative mb-8">
                   <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
                   <div className="relative w-20 h-20 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                     <Sparkles className="w-10 h-10 text-indigo-500" />
                   </div>
                </div>
                <h2 className="huge-type !text-3xl sm:!text-5xl text-neutral-100 mb-4 glossy-text tracking-tighter">HELLO_OPERATOR</h2>
                <div className="mono-tag text-neutral-600 mb-12 border-b border-neutral-900 pb-2 text-[10px]">CORE_ACCESS // GRANTED // SYSTEM_TIME: {new Date().toLocaleTimeString()}</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                  {SUGGESTED.map(s => (
                    <button key={s.text} onClick={() => setDraft(s.text)} className="text-left p-6 gap-4 flex rounded-sm border border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900/50 group transition-all duration-300">
                      <span className="text-2xl pt-1">{s.icon}</span>
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-mono text-neutral-300 leading-relaxed font-bold tracking-tight uppercase">{s.text}</span>
                        <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">EXECUTE_REQUEST</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                {messages.map(m => <MessageBubble key={m.id} msg={m} />)}
                {streamText && <MessageBubble msg={{ role: "assistant", kind: "text", content: streamText }} streaming />}
                {busy && !streamText && (
                  <div className="flex items-center gap-3 text-neutral-600 mono-tag text-[9px] animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" /> SYNCHRONIZING_MATRIX_CORE...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:pb-12 pointer-events-none">
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className={`relative group transition-all duration-500 ${busy ? "opacity-80" : "opacity-100"}`}>
              {/* Glassmorphism background */}
              <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-2xl rounded-[28px] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
              
              <div className="relative flex flex-col p-2">
                {/* Mode indicators */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 mb-1 overflow-x-auto no-scrollbar">
                  <button 
                    onClick={() => setImageMode(v => !v)} 
                    className={`text-[10px] sm:text-[11px] px-3 py-1.5 rounded-full transition-all flex items-center gap-2 whitespace-nowrap font-sans font-medium ${imageMode ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-neutral-400 border border-white/5'}`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> {imageMode ? "Imaging Mode" : "Analysis Mode"}
                  </button>
                  {imageMode && (
                    <>
                      <select value={style} onChange={e => setStyle(e.target.value as ImageStyle)} className="text-[10px] sm:text-[11px] bg-white/5 border border-white/5 rounded-full px-3 py-1.5 text-neutral-300 outline-none">
                        {STYLES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                      <select value={ratio} onChange={e => setRatio(e.target.value as ImageRatio)} className="text-[10px] sm:text-[11px] bg-white/5 border border-white/5 rounded-full px-3 py-1.5 text-neutral-300 outline-none">
                        {RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </>
                  )}
                </div>

                <div className="flex items-end gap-2 px-1">
                  <label className="p-3 cursor-pointer text-neutral-500 hover:text-white transition-colors">
                    <Paperclip className="w-5 h-5" />
                    <input type="file" accept="image/*" multiple className="hidden" onChange={e => {
                      if (e.target.files) {
                         Array.from(e.target.files).forEach(async f => {
                            const url = await fileToDataUrl(f);
                            setAttachments(prev => [...prev, url].slice(0, 4));
                         });
                      }
                    }} />
                  </label>
                  
                  <Textarea
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                    placeholder={imageMode ? "Describe what you want to create..." : "Ask me anything..."}
                    rows={1}
                    className="flex-1 min-h-[56px] max-h-48 resize-none bg-transparent border-0 focus-visible:ring-0 text-[16px] text-neutral-200 placeholder:text-neutral-500 py-4 px-2"
                  />

                  <div className="pb-2.5 pr-2">
                    {busy ? (
                      <Button onClick={() => abortRef.current?.abort()} size="icon" className="h-10 w-10 bg-neutral-800 hover:bg-neutral-700 text-red-500 rounded-full transition-all">
                        <StopCircle className="w-5 h-5" />
                      </Button>
                    ) : (
                      <Button onClick={send} disabled={!draft.trim() && attachments.length === 0} size="icon" className="h-10 w-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/20 disabled:opacity-30 transition-all">
                        <Send className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>

                {attachments.length > 0 && (
                  <div className="flex gap-3 px-4 py-3 border-t border-white/5 mt-1 overflow-x-auto no-scrollbar">
                    {attachments.map((src, i) => (
                      <div key={i} className="relative w-14 h-14 rounded-xl border border-white/10 overflow-hidden shrink-0 group">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => setAttachments(p => p.filter((_, idx) => idx !== i))} className="absolute top-0.5 right-0.5 p-1 bg-black/60 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 px-4 flex items-center justify-center gap-6 text-[10px] text-neutral-500 uppercase tracking-widest font-sans font-medium">
              <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-emerald-500" /> Matrix Core Active</span>
              <span className="hidden sm:inline">End-to-End Encrypted Session</span>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={!!renameOpen} onOpenChange={o => !o && setRenameOpen(null)}>
        <DialogContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
          <DialogHeader><DialogTitle className="mono-tag text-indigo-500 text-[11px]">RENAME_SESSION</DialogTitle></DialogHeader>
          <Input 
            value={renameOpen?.title || ""} 
            onChange={e => setRenameOpen(r => r ? {...r, title: e.target.value} : null)} 
            className="bg-neutral-950 border-neutral-800 font-mono text-xs uppercase"
          />
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setRenameOpen(null)} className="mono-tag text-[9px]">CANCEL</Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-500 text-white h-9 rounded-sm mono-tag text-[9px]"
              onClick={async () => {
                if (!user || !renameOpen) return;
                await renameConversation(user.uid, renameOpen.id, renameOpen.title.trim() || "UNTITLED");
                setRenameOpen(null);
                toast.success("SYSTEM_CONFIG_UPDATED");
              }}
            >
              SAVE_CHANGES
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MessageBubble({ msg, streaming }: { msg: SupernovaMessage; streaming?: boolean }) {
  const isUser = msg.role === "user";
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`flex w-full mb-8 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex gap-4 max-w-[90%] sm:max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold border transition-all duration-500 ${
          isUser 
            ? "bg-neutral-800 border-neutral-700 text-neutral-400" 
            : "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
        }`}>
          {isUser ? "U" : <Sparkles className="w-4 h-4" />}
        </div>

        <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
          {msg.images && msg.images.length > 0 && (
            <div className="grid grid-cols-1 gap-4 w-full mb-2">
              {msg.images.map((src, i) => (
                <div key={i} className="relative group rounded-2xl overflow-hidden border border-neutral-900 bg-neutral-950 shadow-2xl">
                  <img src={src} alt="" className="w-full h-auto max-h-[600px] object-contain transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <a href={src} download className="p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all">
                        <Download className="w-5 h-5" />
                     </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {msg.content && (
            <div className={`rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed relative ${
              isUser 
                ? "bg-neutral-900 text-neutral-200 border border-neutral-800/50" 
                : "text-neutral-100"
            }`}>
              {isUser ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none 
                  prose-p:my-2 
                  prose-headings:text-indigo-400 prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight
                  prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800 prose-pre:rounded-xl 
                  prose-code:text-indigo-400 prose-code:bg-indigo-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                  font-sans">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
              {streaming && <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-1 animate-pulse" />}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
