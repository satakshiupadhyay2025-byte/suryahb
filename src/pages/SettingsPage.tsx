import { useApp } from '@/context/AppContext';
import { Sun, Moon, Bell, Shield, User, LogOut, ChevronRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';

export default function SettingsPage() {
  const { isDarkMode, toggleDarkMode, logout, user } = useApp();

  const sections = [
    { title: 'Account', items: [{ icon: User, label: 'Edit Profile', to: '/profile' }, { icon: Shield, label: 'KYC Details', to: '/profile' }] },
    { title: 'Help & Legal', items: [{ icon: Bell, label: 'FAQ & Support', to: '#' }, { icon: Shield, label: 'Privacy Policy', to: '#' }] },
  ];

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Appearance */}
      <div className="bg-card border rounded-2xl p-4 mb-4">
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Appearance</h3>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-warning" />}
            <span className="font-medium">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
        </div>
      </div>

      {sections.map(section => (
        <div key={section.title} className="bg-card border rounded-2xl p-4 mb-4">
          <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">{section.title}</h3>
          {section.items.map(({ icon: Icon, label, to }) => (
            <Link key={label} to={to} className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center"><Icon className="w-4 h-4 text-muted-foreground" /></div>
                <span className="font-medium">{label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      ))}

      <div className="bg-card border rounded-2xl p-4 mb-4 text-center">
        <p className="text-xs text-muted-foreground">Surya Stock Broker v1.0.0</p>
        <p className="text-xs text-muted-foreground">Paper Trading Platform • Indian Markets Only</p>
      </div>

      <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 bg-loss/10 text-loss rounded-2xl font-semibold hover:bg-loss/20 transition-all">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
}
