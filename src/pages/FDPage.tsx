import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const FD_OPTIONS = [
  { tenure: 356, unit: 'days' as const, rate: 8.0, bank: 'HDFC Bank', rating: 'AAA' },
  { tenure: 399, unit: 'days' as const, rate: 8.5, bank: 'SBI', rating: 'AAA' },
  { tenure: 12, unit: 'months' as const, rate: 7.5, bank: 'ICICI Bank', rating: 'AAA' },
  { tenure: 18, unit: 'months' as const, rate: 7.8, bank: 'Axis Bank', rating: 'AA+' },
  { tenure: 2, unit: 'years' as const, rate: 7.6, bank: 'Kotak Bank', rating: 'AAA' },
  { tenure: 3, unit: 'years' as const, rate: 7.4, bank: 'Yes Bank', rating: 'AA' },
  { tenure: 5, unit: 'years' as const, rate: 7.25, bank: 'PNB', rating: 'AA+' },
];

export default function FDPage() {
  const { fdInvestments, investFD, user } = useApp();
  const [selected, setSelected] = useState<typeof FD_OPTIONS[0] | null>(null);
  const [principal, setPrincipal] = useState('50000');

  const calcMaturity = (p: number, rate: number, tenure: number, unit: string) => {
    const days = unit === 'days' ? tenure : unit === 'months' ? tenure * 30 : tenure * 365;
    const years = days / 365;
    return p * (1 + rate / 100 * years);
  };

  const handleInvest = () => {
    if (!selected) return;
    const p = parseFloat(principal);
    if (!p || p < 1000 || !user || user.virtualBalance < p) return;
    const start = new Date();
    const days = selected.unit === 'days' ? selected.tenure : selected.unit === 'months' ? selected.tenure * 30 : selected.tenure * 365;
    const matDate = new Date(start.getTime() + days * 24 * 3600 * 1000);
    investFD({
      principal: p, tenure: selected.tenure, tenureUnit: selected.unit,
      interestRate: selected.rate, startDate: start, maturityDate: matDate,
      maturityAmount: parseFloat(calcMaturity(p, selected.rate, selected.tenure, selected.unit).toFixed(0)),
      rating: selected.rating, bank: selected.bank,
    });
    setSelected(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">Fixed Deposits</h1>
      <p className="text-sm text-muted-foreground mb-5">Earn up to 8.5% p.a. with guaranteed returns</p>

      {fdInvestments.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold mb-3">My FDs</h2>
          <div className="space-y-3">
            {fdInvestments.map(fd => (
              <div key={fd.id} className="bg-card border rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div><p className="font-semibold">{fd.bank}</p><p className="text-xs text-muted-foreground">{fd.tenure} {fd.tenureUnit} · {fd.rating}</p></div>
                  <div className="text-right"><p className="font-bold gain-text">{fd.interestRate}% p.a.</p><p className="text-xs text-muted-foreground">₹{fd.principal.toLocaleString('en-IN')} → ₹{fd.maturityAmount.toLocaleString('en-IN')}</p></div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex gap-4">
                  <span>Started: {new Date(fd.startDate).toLocaleDateString('en-IN')}</span>
                  <span>Matures: {new Date(fd.maturityDate).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-bold">Available FD Options</h2>
        {FD_OPTIONS.map((opt, i) => {
          const p = parseFloat(principal) || 50000;
          const maturity = calcMaturity(p, opt.rate, opt.tenure, opt.unit);
          const interest = maturity - p;
          return (
            <div key={i} className={`bg-card border rounded-2xl p-4 transition-all cursor-pointer ${selected === opt ? 'border-primary bg-primary/5' : 'hover:border-primary/40'}`} onClick={() => setSelected(opt === selected ? null : opt)}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2"><p className="font-bold">{opt.rate}% p.a.</p><span className={`text-xs px-2 py-0.5 rounded font-semibold ${opt.rating === 'AAA' ? 'bg-gain/10 text-gain' : 'bg-warning/10 text-warning'}`}>{opt.rating}</span></div>
                  <p className="text-sm text-muted-foreground">{opt.bank} · {opt.tenure} {opt.unit}</p>
                </div>
                <div className="text-right"><p className="text-xs text-muted-foreground">Interest on ₹{p.toLocaleString('en-IN')}</p><p className="font-semibold gain-text">+₹{interest.toFixed(0)}</p></div>
              </div>
              {selected === opt && (
                <div className="mt-4 space-y-3 border-t pt-3" onClick={e => e.stopPropagation()}>
                  <div><Label className="text-xs">Principal Amount (min ₹1,000)</Label><Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="mt-1" /></div>
                  <div className="bg-muted/50 rounded-xl p-3 text-sm space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Principal</span><span>₹{p.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Interest ({opt.rate}% for {opt.tenure} {opt.unit})</span><span className="gain-text">+₹{interest.toFixed(0)}</span></div>
                    <div className="flex justify-between font-bold border-t pt-1"><span>Maturity Amount</span><span>₹{maturity.toFixed(0)}</span></div>
                  </div>
                  <Button onClick={handleInvest} className="w-full">Book FD Now</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
