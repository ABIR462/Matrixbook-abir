import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/integrations/firebase/config";
import { useAuth } from "@/hooks/useAuth";
import { Brand } from "@/components/Brand";
import { firebaseMissingEnvKeys } from "@/lib/env";

export default function AuthPage() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(
    params.get("mode") === "signup" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const from = params.get("from") || "/";

  useEffect(() => {
    document.title =
      mode === "signup"
        ? "Create Account // MATRIXBOOK"
        : "Access Terminal // MATRIXBOOK";
  }, [mode]);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (firebaseMissingEnvKeys.length > 0) {
      toast.error(`Configuration Error: Missing Firebase environment keys.`);
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, {
          displayName: name || email.split("@")[0],
        });
        toast.success("Identity Verified. Welcome to MATRIXBOOK.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Access Granted.");
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      toast.error(error?.message ?? "Authentication Failed.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    if (firebaseMissingEnvKeys.length > 0) {
      toast.error("Configuration Error: Missing Firebase environment keys.");
      return;
    }
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("External Identity Verified.");
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error?.code !== "auth/popup-closed-by-user") {
        toast.error(error?.message ?? "Sign-in failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-[#050505] text-white selection:bg-indigo-500/30">
      {/* ── Visual Side Panel ── */}
      <div className="hidden lg:flex flex-col justify-between flex-1 relative overflow-hidden p-16 border-r border-white/5 bg-[#080808]">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full animate-pulse-glow" />
        
        <Link to="/" className="relative z-10">
          <Brand size={32} />
        </Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-8">
            Access Control // v4.2
          </div>
          <h2 className="huge-type !text-3xl md:!text-5xl mb-8 leading-[0.9] text-white">
            SECURE <br/> NEURAL <br/><span className="text-neutral-500">GATEWAY</span>
          </h2>
          <p className="text-neutral-500 text-sm max-w-sm font-sans font-light leading-relaxed uppercase tracking-wider">
            Biometric-ready authentication layer for multimodal synchronization and deep-learning orchestration.
          </p>

          <div className="mt-16 space-y-4">
            {[
              "ENCRYPTION: SHARDED_AES256",
              "HEARTBEAT: LHR_STABLE",
              "AUTH_SYNC: COMPLETED",
            ].map((line) => (
              <div key={line} className="flex items-center gap-4 text-[10px] font-sans font-black text-neutral-400 uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[10px] text-neutral-700 font-sans font-bold uppercase tracking-[0.3em]">
          MATRIXBOOK CORE // BUILT FOR THE NEXT ERA
        </p>
      </div>

      {/* ── Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 relative overflow-hidden">
        {/* Mobile Background */}
        <div className="absolute inset-0 lg:hidden opacity-20">
           <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="mb-12 text-center lg:text-left">
            <Link to="/" className="inline-block lg:hidden mb-12">
               <Brand size={32} />
            </Link>
            <h1 className="text-4xl font-sans font-bold tracking-tight mb-3">
              {mode === "signup" ? "Initialize Identity" : "Access Terminal"}
            </h1>
            <p className="text-neutral-500 text-sm">
              {mode === "signup"
                ? "Provision a new node in the Matrixbook ecosystem."
                : "Synchronize session with existing neural signatures."}
            </p>
          </div>

          <div className="space-y-6">
            {/* Google provider */}
            <button
              onClick={onGoogle}
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center gap-4 hover:bg-white/[0.06] transition-all group active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-sans font-bold text-neutral-300">Continue with Neural SSO</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] font-sans font-bold text-neutral-600 uppercase tracking-widest">OR SECURE MAIL</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="relative group">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-neutral-700 text-sm font-sans"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-neutral-700 text-sm font-sans"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-14 pl-14 pr-14 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-indigo-500/50 outline-none transition-all placeholder:text-neutral-700 text-sm font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 mt-4 rounded-2xl bg-indigo-600 text-white font-sans font-bold hover:bg-indigo-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.2)] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {mode === "signup" ? "Initialize Gateway" : "Secure Access"}
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-6">
              <p className="text-sm text-neutral-500 font-sans">
                {mode === "signup" ? "Already sharded?" : "New operator?"}{" "}
                <button 
                  onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                  className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                >
                  {mode === "signup" ? "Sign In" : "Register Node"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
