import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Calendar, Package, BarChart2,
  HelpCircle, Star, Settings, LogOut, Bell, Menu, X, ChevronRight, Plus, Workflow, Image
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/leads', icon: FileText, label: 'Leads' },
  { to: '/admin/follow-ups', icon: Calendar, label: 'Follow-ups' },
  { to: '/admin/loan-products', icon: Package, label: 'Loan Products' },
  // { to: '/admin/form-builder', icon: Workflow, label: 'Form Builder' },
  { to: '/admin/reports', icon: BarChart2, label: 'Reports' },
  { to: '/admin/users', icon: Settings, label: 'Users', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { to: '/admin/faqs', icon: HelpCircle, label: 'FAQs' },
  { to: '/admin/testimonials', icon: Star, label: 'Testimonials' },
  { to: '/admin/hero-offers', icon: Image, label: 'Hero Offers', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { to: '/admin/settings', icon: Settings, label: 'Settings', roles: ['SUPER_ADMIN', 'ADMIN'] },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const filteredNav = navItems.filter(item => !item.roles || item.roles.includes(user?.role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
        <Link to="/admin/dashboard" onClick={() => setSidebarOpen(false)} className="flex min-w-0 flex-1 items-center gap-2.5">
          <img src={logo} alt="GoodDebt" className="h-12 w-36 flex-shrink-0 object-contain object-left" />
          {/* <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">Admin</span> */}
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSidebarOpen(false);
          }}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {filteredNav.map(item => (
          <NavLink key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-brand-600 text-white shadow-brand-sm' : 'text-white/50 hover:bg-white/5 hover:text-white'}`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-white/40 truncate uppercase tracking-wider">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-neutral-900 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }} transition={{ type: 'tween', duration: 0.2 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-neutral-900 z-50 lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-neutral-200 px-4 lg:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <button onClick={() => setSidebarOpen(v => !v)} className="lg:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100" aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1 lg:flex-none" />
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="hidden sm:flex items-center gap-1 text-xs text-neutral-500 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors">
              View Site <ChevronRight className="w-3 h-3" />
            </Link>
            <button className="relative p-2 rounded-lg hover:bg-neutral-100 text-neutral-500">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
