import { useState, type FormEvent } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  LogOut,
  KeyRound,
  Check,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../store/authStore';

export function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Change Password Form State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout, changePasscode } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (!currentPass) {
      setPassError('กรุณาระบุรหัสผ่านปัจจุบัน');
      return;
    }
    if (!newPass || newPass.length < 4) {
      setPassError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('รหัสผ่านใหม่และการยืนยันไม่ตรงกัน');
      return;
    }

    const res = changePasscode(currentPass, newPass);
    if (res.success) {
      setPassSuccess('เปลี่ยนรหัสผ่านสำเร็จแล้ว');
      setTimeout(() => {
        setShowPasswordModal(false);
        setCurrentPass('');
        setNewPass('');
        setConfirmPass('');
        setPassSuccess(null);
      }, 1500);
    } else {
      setPassError(res.error || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    }
  };

  const navItems = [
    {
      to: '/admin',
      label: 'แดชบอร์ด & โปรเจกต์',
      icon: LayoutDashboard,
      end: false,
      isActive: (pathname: string) =>
        pathname === '/admin' || pathname.startsWith('/admin/edit/'),
      description: 'ภาพรวมและรายการข้อเสนอทั้งหมด',
    },
    {
      to: '/admin/create',
      label: 'สร้างโปรเจกต์ใหม่',
      icon: Plus,
      end: true,
      description: 'เพิ่มข้อเสนอ LED ใหม่',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 h-16 bg-[#111827]/90 backdrop-blur-md border-b border-[#334155]/60 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] lg:hidden transition-colors cursor-pointer"
            aria-label={isMobileOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop collapse toggle */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
            title={isCollapsed ? 'ขยายแถบเมนู' : 'ย่อแถบเมนู'}
            aria-label="ย่อ/ขยายเมนู"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* Logo & Title */}
          <NavLink to="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--accent-color)] to-[var(--accent-color-light)] p-0.5 shadow-lg shadow-[var(--accent-color-muted)] flex items-center justify-center">
              <div className="w-full h-full bg-[#0B1120] rounded-[10px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                <span className="font-black text-sm tracking-tighter text-[var(--accent-color-light)] group-hover:text-black transition-colors">
                  JLED
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-[var(--accent-color-light)] transition-colors">
                  JLED Proposal Builder
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--accent-color-muted)] text-[var(--accent-color-light)] border border-[var(--accent-color)]/30">
                  ADMIN
                </span>
              </div>
              <span className="text-[11px] text-[#94A3B8] hidden md:block">
                ระบบจัดการข้อเสนอการติดตั้งจอ LED อินเทอร์แอคทีฟ
              </span>
            </div>
          </NavLink>
        </div>

        {/* Top Bar Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <NavLink
            to="/admin/create"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-[var(--accent-color)] text-white hover:opacity-90 shadow-md shadow-[var(--accent-color-muted)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">สร้างโปรเจกต์ใหม่</span>
            <span className="sm:hidden">สร้าง</span>
          </NavLink>

          <a
            href="/p/royal-d"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-white bg-[#1E293B] hover:bg-[#273548] border border-[#334155] transition-colors"
            title="ดูตัวอย่างการนำเสนอแบบเต็ม"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span>ดู Demo</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
          </a>

          {/* Change Password button */}
          <button
            type="button"
            onClick={() => {
              setPassError(null);
              setPassSuccess(null);
              setShowPasswordModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-white bg-[#1E293B] hover:bg-[#273548] border border-[#334155] transition-colors cursor-pointer"
            title="เปลี่ยนรหัสผ่านแอดมิน"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">เปลี่ยนรหัส</span>
          </button>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
            title="ออกจากระบบจัดการ"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-[#111827] border-r border-[#334155]/60 transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
            <nav className="space-y-1.5">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = item.isActive
                  ? item.isActive(location.pathname)
                  : location.pathname === item.to;

                return (
                  <NavLink
                    key={index}
                    to={item.to}
                    end={item.end}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                      active
                        ? 'bg-[var(--accent-color-muted)] text-[var(--accent-color-light)] font-semibold shadow-sm'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[var(--accent-color)] rounded-r-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                        active ? 'text-[var(--accent-color)]' : 'text-[#94A3B8] group-hover:text-white'
                      }`}
                    />
                    {!isCollapsed && (
                      <div className="flex flex-col truncate">
                        <span className="truncate">{item.label}</span>
                        <span className="text-[10px] text-[#64748B] font-normal truncate group-hover:text-[#94A3B8]">
                          {item.description}
                        </span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Sidebar Bottom Info */}
            {!isCollapsed && (
              <div className="pt-4 border-t border-[#334155]/40 mt-auto space-y-3">
                <div className="p-3 rounded-xl bg-[#1E293B]/70 border border-[#334155]/40">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <span className="text-xs font-semibold text-white">Security & Access</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                    ระบบป้องกันการเข้าถึงสำหรับทีมงาน JLED เท่านั้น
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="fixed inset-y-0 left-0 w-72 bg-[#111827] border-r border-[#334155] z-50 lg:hidden flex flex-col p-4 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-4 border-b border-[#334155]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent-color)] flex items-center justify-center font-bold text-black text-xs">
                      JLED
                    </div>
                    <span className="font-bold text-white text-sm">เมนูจัดการระบบ</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2 mt-4 flex-1">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = item.isActive
                      ? item.isActive(location.pathname)
                      : location.pathname === item.to;

                    return (
                      <NavLink
                        key={index}
                        to={item.to}
                        end={item.end}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                          active
                            ? 'bg-[var(--accent-color-muted)] text-[var(--accent-color-light)] font-semibold border-l-4 border-[var(--accent-color)]'
                            : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="flex flex-col">
                          <span>{item.label}</span>
                          <span className="text-[11px] text-[#64748B] font-normal">
                            {item.description}
                          </span>
                        </div>
                      </NavLink>
                    );
                  })}
                </nav>

                <div className="pt-4 border-t border-[#334155] space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileOpen(false);
                      setShowPasswordModal(true);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg text-xs font-medium bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#334155]"
                  >
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>เปลี่ยนรหัสผ่านแอดมิน</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg text-xs font-medium text-rose-300 hover:text-white bg-rose-500/10 border border-rose-500/30"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative z-10 w-full max-w-md bg-[#1E293B] border border-[#334155] rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#334155] mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">เปลี่ยนรหัสผ่านแอดมิน</h3>
                    <p className="text-[11px] text-[#94A3B8]">กำหนดรหัสผ่านใหม่สำหรับเข้าจัดการระบบ</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {passError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{passSuccess}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">รหัสผ่านปัจจุบัน</label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="กรอกรหัสผ่านปัจจุบัน"
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">รหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="อย่างน้อย 4 ตัวอักษร"
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">ยืนยันรหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                    className="w-full px-3.5 py-2.5 bg-[#0B1120] border border-[#334155] rounded-xl text-white placeholder-[#64748B] focus:border-[var(--accent-color)] outline-none text-sm"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#334155]">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white bg-transparent hover:bg-white/5 border border-transparent"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--accent-color)] text-white hover:opacity-90 shadow-md cursor-pointer"
                  >
                    บันทึกรหัสผ่านใหม่
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminLayout;
