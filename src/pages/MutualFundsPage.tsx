import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { TrendingUp, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MF_CATALOG = [
  { name: 'Mirae Asset Large Cap Fund', category: 'Equity', subCategory: 'Large Cap', nav: 98.45, cagr: 14.2 },
  { name: 'Axis Midcap Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 72.34, cagr: 18.5 },
  { name: 'HDFC Index Fund - NIFTY 50', category: 'Index', subCategory: 'Large Cap', nav: 156.78, cagr: 12.8 },
  { name: 'SBI Small Cap Fund', category: 'Equity', subCategory: 'Small Cap', nav: 134.56, cagr: 22.1 },
  { name: 'Parag Parikh Flexi Cap Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 68.92, cagr: 16.8 },
  { name: 'UTI Nifty 50 Index Fund', category: 'Index', subCategory: 'Large Cap', nav: 112.34, cagr: 12.6 },
  { name: 'ICICI Prudential Bluechip Fund', category: 'Equity', subCategory: 'Large Cap', nav: 89.12, cagr: 13.9 },
  { name: 'Nippon India Growth Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 345.67, cagr: 19.4 },
];

export default function MutualFundsPage() {
  const { mutualFunds, investMutualFund, stopSIP, redeemMutualFund, user } = useApp();
  const [showInvest, setShowInvest] = useState<string | null>(null);
  const [amount, setAmount] = useState('5000');
  const [investType, setInvestType] = useState<'sip' | 'lumpsum'>('sip');
  const [sipDate, setSipDate] = useState('5');
  const [filter, setFilter] = useState('All');

  const handleInvest = (mf: typeof MF_CATALOG[0]) => {
    const amt = parseFloat(amount);
    if (!amt || amt < 500) return;
    investMutualFund({
      name: mf.name, category: mf.category, subCategory: mf.subCategory,
      nav: mf.nav, invested: amt, units: amt / mf.nav, cagr: mf.cagr,
      sipAmount: investType === 'sip' ? amt : undefined,
      sipDate: investType === 'sip' ? parseInt(sipDate) : undefined,
      isActive: true,
    });
    setShowInvest(null);
  };

  const categories = ['All', 'Equity', 'Index', 'Debt'];
  const filteredCatalog = MF_CATALOG.filter(f => filter === 'All' || f.category === filter);

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-2">Mutual Funds</h1>
      <p className="text-muted-foreground text-sm mb-5">Invest in top mutual funds with SIP starting ₹500/month</p>

      {/* SIP Calculator CTA */}
      <div className="bg-gradient-to-r from-primary to-primary-glow rounded-2xl p-5 text-primary-foreground mb-6">
        <p className="font-bold text-lg mb-1">SIP Calculator</p>
        <p className="text-sm text-primary-foreground/80 mb-3">See how your SIP grows over time</p>
        <div className="flex gap-3 text-sm">
          {[['₹5,000/mo', '10yr'], ['₹10,000/mo', '15yr'], ['₹25,000/mo', '20yr']].map(([amt, yr]) => (
            <div key={yr} className="bg-primary-foreground/10 rounded-xl px-3 py-2 text-center">
              <p className="font-semibold">{amt}</p><p className="text-xs opacity-70">{yr}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My Investments */}
      {mutualFunds.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold mb-3">My Investments</h2>
          <div className="space-y-3">
            {mutualFunds.map(f => {
              const cur = f.units * f.nav;
              const pl = cur - f.invested;
              return (
                <div key={f.id} className="bg-card border rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div><p className="font-semibold text-sm">{f.name}</p><p className="text-xs text-muted-foreground">{f.subCategory} · CAGR {f.cagr}%</p></div>
                    <div className="text-right"><p className="font-bold">₹{cur.toFixed(0)}</p><p className={`text-xs ${pl >= 0 ? 'gain-text' : 'loss-text'} font-medium`}>{pl >= 0 ? '+' : ''}₹{Math.abs(pl).toFixed(0)}</p></div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {f.sipAmount && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">SIP ₹{f.sipAmount}/mo</span>}
                    <button onClick={() => stopSIP(f.id)} className="text-xs bg-muted px-2 py-1 rounded hover:bg-muted/80">Stop SIP</button>
                    <button onClick={() => redeemMutualFund(f.id, f.units)} className="text-xs bg-loss/10 text-loss px-2 py-1 rounded hover:bg-loss/20">Redeem All</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Catalog */}
      <h2 className="font-bold mb-3">Explore Funds</h2>
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {categories.map(c => <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all border ${filter === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}>{c}</button>)}
      </div>
      <div className="space-y-3">
        {filteredCatalog.map(mf => (
          <div key={mf.name} className="bg-card border rounded-2xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1"><p className="font-semibold">{mf.name}</p><p className="text-xs text-muted-foreground">{mf.subCategory} · NAV ₹{mf.nav}</p></div>
              <div className="text-right ml-2"><p className="gain-text font-bold text-sm">{mf.cagr}%</p><p className="text-xs text-muted-foreground">3Y CAGR</p></div>
            </div>
            {showInvest === mf.name ? (
              <div className="space-y-3 border-t pt-3">
                <div className="flex gap-2">
                  {(['sip', 'lumpsum'] as const).map(t => <button key={t} onClick={() => setInvestType(t)} className={`flex-1 py-1.5 rounded-lg text-sm font-medium capitalize ${investType === t ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{t === 'sip' ? 'SIP' : 'Lumpsum'}</button>)}
                </div>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (min ₹500)" />
                {investType === 'sip' && <Select value={sipDate} onValueChange={setSipDate}><SelectTrigger><SelectValue placeholder="SIP Date" /></SelectTrigger><SelectContent>{[1,5,10,15,20,25,28].map(d => <SelectItem key={d} value={String(d)}>{d}th of every month</SelectItem>)}</SelectContent></Select>}
                <div className="flex gap-2">
                  <Button onClick={() => handleInvest(mf)} className="flex-1">Invest ₹{amount}</Button>
                  <Button variant="outline" onClick={() => setShowInvest(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setShowInvest(mf.name)} variant="outline" className="w-full" size="sm">
                <Plus className="w-3 h-3 mr-1" /> Invest Now
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
