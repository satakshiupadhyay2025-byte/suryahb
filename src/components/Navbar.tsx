import { useApp } from '@/context/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, TrendingUp, BarChart2, Briefcase, Settings, Bell, 
  Sun, Moon, Menu, X, Search, LogOut, User, Shield,
  Star, BookOpen, Coins, Building2, ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/stocks', label: 'Stocks', icon: TrendingUp },
  { to: '/mutual-funds', label: 'Mutual Funds', icon: BarChart2 },
  { to: '/ipo', label: 'IPO', icon: Star },
  { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
];

const MORE_ITEMS = [
  { to: '/gold', label: 'Gold & Silver', icon: Coins },
  { to: '/bonds', label: 'Gov. Bonds', icon: Building2 },
  { to: '/fd', label: 'Fixed Deposits', icon: BookOpen },
];

export default function Navbar() {
  const { isLoggedIn, user, toggleDarkMode, isDarkMode, logout, notifications } = useApp();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">
              Surya <span className="text-primary">Broker</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {isLoggedIn && (
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(to) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}>
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <div className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  More <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute top-full left-0 mt-1 bg-card border rounded-xl shadow-lg p-1 min-w-[160px] z-50"
                      onMouseLeave={() => setMoreOpen(false)}
                    >
                      {MORE_ITEMS.map(({ to, label, icon: Icon }) => (
                        <Link key={to} to={to} onClick={() => setMoreOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                            isActive(to) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                          }`}>
                          <Icon className="w-4 h-4" /> {label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <>
                <Link to="/search" className="p-2 rounded-lg hover:bg-muted transition-all">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Link to="/notifications" className="p-2 rounded-lg hover:bg-muted transition-all relative">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-loss rounded-full text-xs text-white flex items-center justify-center font-bold">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>
              </>
            )}
            <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-muted transition-all">
              {isDarkMode ? <Sun className="w-4 h-4 text-muted-foreground" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
            </button>
            {isLoggedIn ? (
              <div className="flex items-center gap-1">
                {user?.id === 'admin' && (
                  <Link to="/admin" className="p-2 rounded-lg hover:bg-muted transition-all">
                    <Shield className="w-4 h-4 text-primary" />
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-all">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden md:block max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={logout} className="p-2 rounded-lg hover:bg-muted transition-all">
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
            {isLoggedIn && (
              <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-all" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b bg-card z-40 overflow-hidden"
          >
            <div className="container mx-auto p-3 grid grid-cols-2 gap-1">
              {[...NAV_ITEMS, ...MORE_ITEMS].map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(to) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}>
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              ))}
              <Link to="/profile" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted">
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link to="/settings" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom mobile nav */}
      {isLoggedIn && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card border-t safe-area-bottom">
          <div className="flex items-center justify-around h-16">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                  isActive(to) ? 'text-primary' : 'text-muted-foreground'
                }`}>
                <Icon className={`w-5 h-5 ${isActive(to) ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            ))}
            <Link to="/settings"
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${
                isActive('/settings') ? 'text-primary' : 'text-muted-foreground'
              }`}>
              <Settings className="w-5 h-5" />
              <span className="text-[10px] font-medium">Settings</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
