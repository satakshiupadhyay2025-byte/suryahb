import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GoldPage() {
  const { goldHolding, silverHolding, buyGold, sellGold, buySilver, sellSilver, user } = useApp();
  const [activeAsset, setActiveAsset] = useState<'gold' | 'silver'>('gold');
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [grams, setGrams] = useState('');

  const goldPrice = goldHolding.currentPrice;
  const silverPrice = silverHolding.currentPrice;
  const currentPrice = activeAsset === 'gold' ? goldPrice : silverPrice;
  const currentHolding = activeAsset === 'gold' ? goldHolding : silverHolding;

  const handleBuy = () => {
    const g = parseFloat(grams) || parseFloat(amount) / currentPrice;
    if (g > 0) {
      if (activeAsset === 'gold') buyGold(parseFloat(g.toFixed(4)), currentPrice);
      else buySilver(parseFloat(g.toFixed(4)), currentPrice);
    }
    setAmount(''); setGrams('');
  };

  const handleSell = () => {
    const g = parseFloat(grams);
    if (g > 0 && g <= currentHolding.grams) {
      if (activeAsset === 'gold') sellGold(g, currentPrice);
      else sellSilver(g, currentPrice);
      setGrams('');
    }
  };

  const pnl = currentHolding.grams > 0
    ? (currentPrice - currentHolding.avgBuyPrice) * currentHolding.grams
    : 0;

  const quickAmounts = activeAsset === 'gold' ? [500, 1000, 5000, 10000] : [100, 500, 1000, 5000];

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">Gold & Silver</h1>
      <p className="text-sm text-muted-foreground mb-5">Buy digital gold & silver. 24K 999.9 purity.</p>

      {/* Asset Selector */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-5">
        {(['gold', 'silver'] as const).map(a => (
          <button key={a} onClick={() => { setActiveAsset(a); setAmount(''); setGrams(''); setTab('buy'); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all flex items-center justify-center gap-1.5 ${activeAsset === a ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>
            {a === 'gold' ? '🥇' : '🥈'} {a === 'gold' ? 'Gold (24K)' : 'Silver (999)'}
          </button>
        ))}
      </div>

      {/* Price Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`border rounded-2xl p-4 cursor-pointer transition-all ${activeAsset === 'gold' ? 'bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border-yellow-400/50' : 'bg-muted/40 border-border'}`}
          onClick={() => setActiveAsset('gold')}>
          <div className="flex items-center gap-2 mb-2"><span className="text-2xl">🥇</span><span className="font-semibold text-sm">Gold (24K)</span></div>
          <p className="text-xl font-bold">₹{goldPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-muted-foreground">per gram</p>
          <p className="text-xs gain-text mt-1 font-medium">+0.12% today</p>
        </div>
        <div className={`border rounded-2xl p-4 cursor-pointer transition-all ${activeAsset === 'silver' ? 'bg-gradient-to-br from-slate-400/20 to-slate-600/10 border-slate-400/50' : 'bg-muted/40 border-border'}`}
          onClick={() => setActiveAsset('silver')}>
          <div className="flex items-center gap-2 mb-2"><span className="text-2xl">🥈</span><span className="font-semibold text-sm">Silver (999)</span></div>
          <p className="text-xl font-bold">₹{silverPrice.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">per gram</p>
          <p className="text-xs gain-text mt-1 font-medium">+0.08% today</p>
        </div>
      </div>

      {/* Holdings */}
      {currentHolding.grams > 0 && (
        <div className="bg-card border rounded-2xl p-4 mb-5">
          <h3 className="font-bold mb-3">My {activeAsset === 'gold' ? 'Gold' : 'Silver'} Holdings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['Quantity', `${currentHolding.grams.toFixed(4)}g`],
              ['Avg Price', `₹${currentHolding.avgBuyPrice.toFixed(0)}/g`],
              ['Current Value', `₹${(currentHolding.grams * currentPrice).toFixed(0)}`],
              ['P&L', `${pnl >= 0 ? '+' : ''}₹${Math.abs(pnl).toFixed(0)}`],
            ].map(([k, v], i) => (
              <div key={k} className="bg-muted/40 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className={`font-bold text-sm ${i === 3 ? (pnl >= 0 ? 'gain-text' : 'loss-text') : ''}`}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buy/Sell Panel */}
      <div className="bg-card border rounded-2xl p-4">
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-4">
          {(['buy', 'sell'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? (t === 'buy' ? 'bg-gain text-white' : 'bg-loss text-white') : 'text-muted-foreground'}`}>
              {t === 'buy' ? `▲ Buy ${activeAsset === 'gold' ? 'Gold' : 'Silver'}` : `▼ Sell ${activeAsset === 'gold' ? 'Gold' : 'Silver'}`}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {tab === 'buy' ? (
            <>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Amount (₹)</label>
                <Input type="number" value={amount} onChange={e => {
                  setAmount(e.target.value);
                  setGrams(e.target.value ? (parseFloat(e.target.value) / currentPrice).toFixed(4) : '');
                }} placeholder="Enter amount" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Grams</label>
                <Input type="number" value={grams} onChange={e => {
                  setGrams(e.target.value);
                  setAmount(e.target.value ? (parseFloat(e.target.value) * currentPrice).toFixed(0) : '');
                }} placeholder="Enter grams" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {quickAmounts.map(v => (
                  <button key={v} onClick={() => { setAmount(String(v)); setGrams((v / currentPrice).toFixed(4)); }}
                    className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium hover:bg-muted/80">₹{v}</button>
                ))}
              </div>
              <Button onClick={handleBuy} className="w-full bg-gain hover:bg-gain/90 text-white">
                Buy {activeAsset === 'gold' ? 'Gold' : 'Silver'}
              </Button>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Grams to sell (max {currentHolding.grams.toFixed(4)}g)
                </label>
                <Input type="number" value={grams} onChange={e => setGrams(e.target.value)}
                  placeholder="Enter grams" max={currentHolding.grams} />
              </div>
              {grams && (
                <p className="text-sm text-muted-foreground">
                  You'll receive: <strong>₹{(parseFloat(grams) * currentPrice).toFixed(0)}</strong>
                </p>
              )}
              {currentHolding.grams === 0 && (
                <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2">
                  No {activeAsset} holdings to sell. Buy first!
                </p>
              )}
              <Button onClick={handleSell} disabled={currentHolding.grams === 0}
                className="w-full bg-loss hover:bg-loss/90 text-white">
                Sell {activeAsset === 'gold' ? 'Gold' : 'Silver'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-muted/40 rounded-2xl p-4">
          <p className="font-semibold mb-1 flex items-center gap-1">🥇 About Digital Gold</p>
          <p className="text-xs text-muted-foreground">Buy 24K 999.9 purity gold in digital form. Start from ₹1. Backed by physical gold stored in secure vaults.</p>
        </div>
        <div className="bg-muted/40 rounded-2xl p-4">
          <p className="font-semibold mb-1 flex items-center gap-1">🥈 About Digital Silver</p>
          <p className="text-xs text-muted-foreground">Buy 999 purity silver digitally. Higher volatility than gold. Strong industrial demand drives prices.</p>
        </div>
      </div>
    </div>
  );
}
