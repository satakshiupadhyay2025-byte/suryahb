import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff, TrendingUp, Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    setLoading(false);
    if (ok) {
      // Admin goes to admin panel, user goes to dashboard
      if (email === 'suryanarayan') navigate('/admin');
      else navigate('/');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    login('rahul@example.com', 'password123');
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary p-12 text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl">Surya Broker</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">India's Best<br />Paper Trading Platform</h1>
          <p className="text-primary-foreground/80 text-lg">Practice trading with ₹10 Lakhs virtual money. Stocks, Mutual Funds, Gold, IPOs and more.</p>
          <div className="grid grid-cols-2 gap-4">
            {[['₹10L', 'Virtual Balance'], ['250+', 'Stocks'], ['0%', 'Real Risk'], ['100%', 'Real Experience']].map(([v, l]) => (
              <div key={l} className="bg-primary-foreground/10 rounded-xl p-4">
                <p className="text-2xl font-bold">{v}</p>
                <p className="text-primary-foreground/70 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-primary-foreground/50 text-sm">© 2025 Surya Stock Broker. Paper Trading Platform.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Surya Broker</span>
          </div>

          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Login to your paper trading account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Email / Username</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email or username" className="pl-9" required />
              </div>
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="pl-9 pr-9" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPass ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-loss text-sm bg-loss/10 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
            <div className="relative flex justify-center"><span className="bg-background px-3 text-sm text-muted-foreground">or</span></div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleDemo} disabled={loading}>
            🚀 Try Demo Account
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
