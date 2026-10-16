import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ExternalLink,
  KeyRound,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../store/authStore';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Target destination after login (default to /admin)
  const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('กรุณาระบุรหัสผ่าน');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const res = login(password, rememberMe);
      if (res.success) {
        navigate(fromLocation, { replace: true });
      } else {
        setError(res.error || 'รหัสผ่านไม่ถูกต้อง');
        setIsLoading(false);
      }
    }, 250);
  };

  const handleUseDefaultPass = () => {
    setPassword('jled2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-color)] opacity-[0.05] rounded-full blur-[140px] pointer-events-none" />

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#111827]/90 backdrop-blur-xl rounded-3xl border border-[#334155]/80 p-6 sm:p-8 shadow-2xl shadow-black/80 flex flex-col">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--accent-color)] to-[var(--accent-color-light)] p-0.5 shadow-xl shadow-[var(--accent-color-muted)] mb-4 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B1120] rounded-[14px] flex items-center justify-center">
                <Lock className="w-7 h-7 text-[var(--accent-color)]" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-[var(--accent-color-light)] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>Internal Management System</span>
            </div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              เข้าสู่ระบบ JLED Proposal
            </h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5">
              ระบบสร้างและจัดการข้อเสนอการติดตั้งจอ LED ระดับพรีเมียม
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-slate-300 flex items-center justify-between"
              >
                <span>รหัสผ่านผู้ดูแลระบบ (Admin Passcode)</span>
              </label>

              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="กรอกรหัสผ่านเพื่อเข้าใช้งาน"
                  autoFocus
                  className="w-full pl-4 pr-11 py-3 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm transition font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 rounded-lg text-[#94A3B8] hover:text-white transition-colors"
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-[#94A3B8] hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0B1120] border-[#334155] accent-[var(--accent-color)] cursor-pointer"
                />
                <span>จดจำการเข้าสู่ระบบบนอุปกรณ์นี้</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-[var(--accent-color)] text-white hover:opacity-95 shadow-lg shadow-[var(--accent-color-muted)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบจัดการ'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Default Passcode Helper */}
          <div className="mt-6 pt-5 border-t border-[#334155]/60 flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>รหัสผ่านตั้งต้นของระบบ:</span>
              <button
                type="button"
                onClick={handleUseDefaultPass}
                className="font-mono font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--accent-color-light)] hover:bg-white/10 transition cursor-pointer"
                title="คลิกเพื่อกรอกรหัสผ่านนี้ทันที"
              >
                jled2026
              </button>
            </div>
            <p className="text-[11px] text-[#64748B]">
              สามารถเปลี่ยนรหัสผ่านใหม่ได้ตลอดเวลาในแถบเมนูหลังบ้าน
            </p>
          </div>
        </div>

        {/* Bottom Link to Client Presentation */}
        <div className="mt-6 text-center">
          <Link
            to="/p/royal-d"
            className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors py-1 px-3 rounded-lg hover:bg-white/5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span>เข้าชมหน้าข้อเสนอพรีเซนต์ลูกค้า (Royal-D Demo)</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLoginPage;
