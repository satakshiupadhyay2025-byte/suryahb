import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight, Star, Bell, Eye, EyeOff } from 'lucide-react';
import { IndexCard } from '@/components/IndexCard';
import { StockRow } from '@/components/StockCard';
import MarketTicker from '@/components/MarketTicker';
import { getMarketStatus, formatCurrency } from '@/lib/marketData';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const SECTOR_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316', '#14b8a6'];

export default function Dashboard() {
  const { stocks, indices, holdings, watchlist, user, mutualFunds, fdInvestments, goldHolding, isLoggedIn } = useApp();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const marketStatus = getMarketStatus();

  const sorted = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sorted.slice(0, 6);
  const topLosers = sorted.slice(-6).reverse();
  const trending = stocks.slice(0, 8);

  const totalInvested = holdings.reduce((s, h) => s + h.avgPrice * h.quantity, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.currentPrice * h.quantity, 0);
  const pnl = totalCurrent - totalInvested;
  const pnlPct = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;

  const sectorMap: Record<string, number> = {};
  holdings.forEach(h => {
    const stock = stocks.find(s => s.symbol === h.symbol);
    const sector = stock?.sector || 'Other';
    sectorMap[sector] = (sectorMap[sector] || 0) + h.currentPrice * h.quantity;
  });
  const pieData = Object.entries(sectorMap).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(0)) }));

  const mfValue = mutualFunds.reduce((s, f) => s + f.units * f.nav, 0);
  const fdValue = fdInvestments.reduce((s, f) => s + f.principal, 0);
  const goldValue = goldHolding.grams * goldHolding.currentPrice;
  const totalWealth = (user?.virtualBalance || 0) + totalCurrent + mfValue + fdValue + goldValue;
  const goldPrice = goldHolding.currentPrice;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const firstName = user?.name?.split(' ')[0] || '';

  return (
    <div className="animate-fade-in">
      <MarketTicker />
      <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 space-y-6">

        {/* Welcome / Date */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              {isLoggedIn ? `${greeting}, ${firstName} 👋` : 'Markets Overview'}
            </h1>
            <p className="text-sm text-muted-foreground">{dateStr}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${marketStatus.open ? 'bg-gain/10 text-gain' : 'bg-muted text-muted-foreground'}`}>
            <div className={`w-2 h-2 rounded-full ${marketStatus.open ? 'bg-gain animate-pulse' : 'bg-muted-foreground'}`} />
            {marketStatus.message}
          </div>
        </div>

        {/* Balance card */}
        {isLoggedIn && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-primary to-primary-glow rounded-2xl p-5 text-primary-foreground">
            <div className="flex items-center justify-between mb-1">
              <p className="text-primary-foreground/80 text-sm font-medium">Total Portfolio Value</p>
              <button onClick={() => setBalanceVisible(!balanceVisible)} className="p-1 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-all">
                {balanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-3xl font-bold mb-3">
              {balanceVisible ? `₹${totalWealth.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '₹ ••••••'}
            </p>
            <div className="flex gap-4 flex-wrap">
              <div>
                <p className="text-xs text-primary-foreground/70">Available Cash</p>
                <p className="font-semibold">{balanceVisible ? `₹${(user?.virtualBalance || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '••••••'}</p>
              </div>
              <div>
                <p className="text-xs text-primary-foreground/70">Invested</p>
                <p className="font-semibold">{balanceVisible ? formatCurrency(totalInvested + mfValue + fdValue + goldHolding.invested) : '••••'}</p>
              </div>
              {pnl !== 0 && (
                <div>
                  <p className="text-xs text-primary-foreground/70">P&L</p>
                  <p className={`font-semibold flex items-center gap-1 ${pnl >= 0 ? 'text-primary-foreground' : 'text-red-200'}`}>
                    {pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {pnl >= 0 ? '+' : ''}₹{Math.abs(pnl).toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%)
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Indices - clickable */}
        <div>
          <h2 className="font-bold text-base mb-3">Market Indices</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['NIFTY 50', 'NIFTY NEXT 50', 'SENSEX', 'NIFTY BANK'].map(name => (
              <IndexCard key={name} name={name} />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {['NIFTY IT', 'NIFTY PHARMA', 'NIFTY AUTO', 'NIFTY MIDCAP 100'].map(name => (
              <IndexCard key={name} name={name} />
            ))}
          </div>
        </div>

        {/* Gold & Commodities */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link to="/gold" className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-400/30 rounded-xl p-4 card-hover">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🥇</span>
              <span className="font-medium text-sm">Gold (24K)</span>
            </div>
            <p className="font-bold text-lg">₹{goldPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/g</p>
            <p className="text-xs gain-text mt-0.5">+0.12% today</p>
            <p className="text-xs text-primary mt-2 font-medium">Buy Gold →</p>
          </Link>
          <Link to="/gold" className="bg-gradient-to-br from-slate-400/20 to-slate-600/10 border border-slate-400/30 rounded-xl p-4 card-hover">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🥈</span>
              <span className="font-medium text-sm">Silver (999)</span>
            </div>
            <p className="font-bold text-lg">₹{(95.40).toFixed(2)}/g</p>
            <p className="text-xs gain-text mt-0.5">+0.08% today</p>
            <p className="text-xs text-primary mt-2 font-medium">Buy Silver →</p>
          </Link>
          <Link to="/fd" className="bg-card border rounded-xl p-4 card-hover col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📈</span>
              <span className="font-medium text-sm">FD Rates (Best)</span>
            </div>
            <p className="font-bold text-lg">Up to 8.5% p.a.</p>
            <p className="text-xs text-muted-foreground mt-0.5">399 days tenure</p>
            <p className="text-xs text-primary mt-2 font-medium">Invest in FD →</p>
          </Link>
        </div>

        {/* Watchlist */}
        {isLoggedIn && watchlist.length > 0 && (
          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <h2 className="font-bold">My Watchlist</h2>
              </div>
              <Link to="/stocks" className="text-xs text-primary font-medium flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-0">
              {watchlist.slice(0, 5).map(w => <StockRow key={w.symbol} symbol={w.symbol} />)}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {/* Top Gainers */}
          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gain" />
                <h2 className="font-bold">Top Gainers</h2>
              </div>
              <Link to="/stocks?filter=gainers" className="text-xs text-primary font-medium">See All →</Link>
            </div>
            {topGainers.map(s => <StockRow key={s.symbol} symbol={s.symbol} />)}
          </div>

          {/* Top Losers */}
          <div className="bg-card border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-loss" />
                <h2 className="font-bold">Top Losers</h2>
              </div>
              <Link to="/stocks?filter=losers" className="text-xs text-primary font-medium">See All →</Link>
            </div>
            {topLosers.map(s => <StockRow key={s.symbol} symbol={s.symbol} />)}
          </div>
        </div>

        {/* Portfolio allocation */}
        {isLoggedIn && holdings.length > 0 && pieData.length > 0 && (
          <div className="bg-card border rounded-2xl p-4">
            <h2 className="font-bold mb-4">Portfolio Allocation</h2>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-sm">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trending - clickable */}
        <div className="bg-card border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">🔥 Trending Stocks</h2>
            <Link to="/stocks" className="text-xs text-primary font-medium">See All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {trending.map(s => (
              <Link key={s.symbol} to={`/stock/${s.symbol}`}
                className="bg-muted/50 rounded-xl p-3 hover:bg-muted transition-all">
                <p className="font-bold text-sm">{s.symbol}</p>
                <p className="text-xs text-muted-foreground truncate">{s.sector}</p>
                <p className="font-semibold text-sm mt-1">₹{s.price.toFixed(2)}</p>
                <p className={`text-xs font-medium ${s.changePercent >= 0 ? 'gain-text' : 'loss-text'}`}>
                  {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        {isLoggedIn && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: '/mutual-funds', icon: '📊', label: 'Mutual Funds', sub: 'SIP & Lumpsum' },
              { to: '/ipo', icon: '🚀', label: 'IPO', sub: 'Apply Now' },
              { to: '/fd', icon: '🏦', label: 'Fixed Deposits', sub: 'Up to 8.5%' },
              { to: '/bonds', icon: '🏛️', label: 'Gov. Bonds', sub: 'Safe Returns' },
            ].map(({ to, icon, label, sub }) => (
              <Link key={to} to={to} className="bg-card border rounded-xl p-4 card-hover">
                <span className="text-2xl">{icon}</span>
                <p className="font-semibold text-sm mt-2">{label}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Not logged in CTA */}
        {!isLoggedIn && (
          <div className="bg-gradient-to-br from-primary to-primary-glow rounded-2xl p-8 text-center text-primary-foreground">
            <h2 className="text-2xl font-bold mb-2">Start Paper Trading Today</h2>
            <p className="text-primary-foreground/80 mb-6">Get ₹10 Lakhs virtual money to practice trading with zero real risk.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/signup" className="bg-primary-foreground text-primary px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all">Get Started Free</Link>
              <Link to="/login" className="border border-primary-foreground/50 px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-foreground/10 transition-all">Login</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
