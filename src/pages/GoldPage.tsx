import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GoldPage() {
  const { goldHolding, buyGold, sellGold, user } = useApp();
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [grams, setGrams] = useState('');

  const silverPrice = 95.40;
  const goldPrice = goldHolding.currentPrice;

  const handleBuy = () => {
    const g = parseFloat(grams) || parseFloat(amount) / goldPrice;
    if (g > 0) buyGold(parseFloat(g.toFixed(4)), goldPrice);
    setAmount(''); setGrams('');
  };

  const handleSell = () => {
    const g = parseFloat(grams);
    if (g > 0 && g <= goldHolding.grams) { sellGold(g, goldPrice); setGrams(''); }
  };

  const goldPnl = goldHolding.grams > 0 ? (goldHolding.currentPrice - goldHolding.avgBuyPrice) * goldHolding.grams : 0;

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">Gold & Silver</h1>
      <p className="text-sm text-muted-foreground mb-5">Buy digital gold & silver. 24K 999.9 purity.</p>

      {/* Price Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-400/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2"><span className="text-2xl">🥇</span><span className="font-semibold">Gold (24K)</span></div>
          <p className="text-2xl font-bold">₹{goldPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-muted-foreground">per gram</p>
          <p className="text-xs gain-text mt-1 font-medium">+0.12% today</p>
        </div>
        <div className="bg-gradient-to-br from-slate-400/20 to-slate-600/10 border border-slate-400/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2"><span className="text-2xl">🥈</span><span className="font-semibold">Silver (999)</span></div>
          <p className="text-2xl font-bold">₹{silverPrice.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">per gram</p>
          <p className="text-xs gain-text mt-1 font-medium">+0.08% today</p>
        </div>
      </div>

      {/* Holdings */}
      {goldHolding.grams > 0 && (
        <div className="bg-card border rounded-2xl p-4 mb-5">
          <h3 className="font-bold mb-3">My Gold Holdings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[['Quantity', `${goldHolding.grams.toFixed(4)}g`], ['Avg Price', `₹${goldHolding.avgBuyPrice.toFixed(0)}/g`], ['Current Value', `₹${(goldHolding.grams * goldPrice).toFixed(0)}`], ['P&L', `${goldPnl >= 0 ? '+' : ''}₹${Math.abs(goldPnl).toFixed(0)}`]].map(([k,v], i) => (
              <div key={k} className="bg-muted/40 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className={`font-bold text-sm ${i === 3 ? (goldPnl >= 0 ? 'gain-text' : 'loss-text') : ''}`}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buy/Sell */}
      <div className="bg-card border rounded-2xl p-4">
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-4">
          {(['buy', 'sell'] as const).map(t => <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? (t === 'buy' ? 'bg-gain text-white' : 'bg-loss text-white') : 'text-muted-foreground'}`}>{t === 'buy' ? '▲ Buy Gold' : '▼ Sell Gold'}</button>)}
        </div>
        <div className="space-y-3">
          {tab === 'buy' ? (
            <>
              <div><label className="text-xs text-muted-foreground mb-1 block">Amount (₹)</label><Input type="number" value={amount} onChange={e => { setAmount(e.target.value); setGrams((parseFloat(e.target.value) / goldPrice).toFixed(4)); }} placeholder="Enter amount" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Grams</label><Input type="number" value={grams} onChange={e => { setGrams(e.target.value); setAmount((parseFloat(e.target.value) * goldPrice).toFixed(0)); }} placeholder="Enter grams" /></div>
              <div className="flex gap-2 flex-wrap">
                {[500, 1000, 5000, 10000].map(v => <button key={v} onClick={() => { setAmount(String(v)); setGrams((v/goldPrice).toFixed(4)); }} className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium hover:bg-muted/80">₹{v}</button>)}
              </div>
              <Button onClick={handleBuy} className="w-full bg-gain hover:bg-gain/90 text-white">Buy Gold</Button>
            </>
          ) : (
            <>
              <div><label className="text-xs text-muted-foreground mb-1 block">Grams to sell (max {goldHolding.grams.toFixed(4)}g)</label><Input type="number" value={grams} onChange={e => setGrams(e.target.value)} placeholder="Enter grams" max={goldHolding.grams} /></div>
              {grams && <p className="text-sm text-muted-foreground">You'll receive: <strong>₹{(parseFloat(grams) * goldPrice).toFixed(0)}</strong></p>}
              <Button onClick={handleSell} className="w-full bg-loss hover:bg-loss/90 text-white">Sell Gold</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
