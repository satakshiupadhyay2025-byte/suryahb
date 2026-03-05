import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const FD_OPTIONS = [
  { tenure: 356, unit: 'days' as const, rate: 8.0, bank: 'HDFC Bank', rating: 'AAA', compounding: false },
  { tenure: 399, unit: 'days' as const, rate: 8.5, bank: 'SBI', rating: 'AAA', compounding: false },
  { tenure: 356, unit: 'days' as const, rate: 8.0, bank: 'HDFC Bank', rating: 'AAA', compounding: true },
  { tenure: 399, unit: 'days' as const, rate: 8.5, bank: 'SBI', rating: 'AAA', compounding: true },
  { tenure: 12, unit: 'months' as const, rate: 7.5, bank: 'ICICI Bank', rating: 'AAA', compounding: false },
  { tenure: 18, unit: 'months' as const, rate: 7.8, bank: 'Axis Bank', rating: 'AA+', compounding: false },
  { tenure: 2, unit: 'years' as const, rate: 7.6, bank: 'Kotak Bank', rating: 'AAA', compounding: false },
  { tenure: 3, unit: 'years' as const, rate: 7.4, bank: 'Yes Bank', rating: 'AA', compounding: false },
  { tenure: 5, unit: 'years' as const, rate: 7.25, bank: 'PNB', rating: 'AA+', compounding: false },
];

function calcMaturity(p: number, rate: number, tenure: number, unit: string, compound: boolean) {
  const days = unit === 'days' ? tenure : unit === 'months' ? tenure * 30 : tenure * 365;
  const years = days / 365;
  if (compound) {
    return p * Math.pow(1 + rate / 100, years);
  }
  return p * (1 + rate / 100 * years);
}

export default function FDPage() {
  const { fdInvestments, investFD, exitFD, user } = useApp();
  const [selected, setSelected] = useState<typeof FD_OPTIONS[0] | null>(null);
  const [principal, setPrincipal] = useState('50000');
  const [confirmExit, setConfirmExit] = useState<string | null>(null);

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
      maturityAmount: parseFloat(calcMaturity(p, selected.rate, selected.tenure, selected.unit, selected.compounding).toFixed(0)),
      rating: selected.rating, bank: selected.bank + (selected.compounding ? ' (Compounding)' : ''),
    });
    setSelected(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">Fixed Deposits</h1>
      <p className="text-sm text-muted-foreground mb-5">Earn up to 8.5% p.a. · Simple & Compound options</p>

      {fdInvestments.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold mb-3">My FDs ({fdInvestments.length})</h2>
          <div className="space-y-3">
            {fdInvestments.map(fd => {
              const now = Date.now();
              const start = new Date(fd.startDate).getTime();
              const end = new Date(fd.maturityDate).getTime();
              const progress = Math.min(100, ((now - start) / (end - start)) * 100);
              const daysLeft = Math.max(0, Math.ceil((end - now) / (1000 * 86400)));
              return (
                <div key={fd.id} className="bg-card border rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div><p className="font-semibold">{fd.bank}</p><p className="text-xs text-muted-foreground">{fd.tenure} {fd.tenureUnit} · {fd.rating}</p></div>
                    <div className="text-right">
                      <p className="font-bold text-gain">{fd.interestRate}% p.a.</p>
                      <p className="text-xs text-muted-foreground">₹{fd.principal.toLocaleString('en-IN')} → ₹{fd.maturityAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{progress.toFixed(0)}% complete</span>
                      <span>{daysLeft} days left</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Started: {new Date(fd.startDate).toLocaleDateString('en-IN')}</span>
                    <span>Matures: {new Date(fd.maturityDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  {confirmExit === fd.id ? (
                    <div className="mt-2 pt-2 border-t flex gap-2 items-center">
                      <p className="text-xs text-warning flex-1">Early exit incurs 1% penalty on earned interest</p>
                      <Button size="sm" variant="destructive" onClick={() => { exitFD(fd.id); setConfirmExit(null); }}>Confirm Exit</Button>
                      <Button size="sm" variant="outline" onClick={() => setConfirmExit(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmExit(fd.id)} className="mt-2 text-xs text-loss hover:underline">Exit FD (early withdrawal)</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Available FD Options</h2>
          <p className="text-xs text-muted-foreground">Available: ₹{(user?.virtualBalance || 0).toLocaleString('en-IN')}</p>
        </div>
        {FD_OPTIONS.map((opt, i) => {
          const p = parseFloat(principal) || 50000;
          const maturity = calcMaturity(p, opt.rate, opt.tenure, opt.unit, opt.compounding);
          const interest = maturity - p;
          return (
            <div key={i} className={`bg-card border rounded-2xl p-4 transition-all cursor-pointer ${selected === opt ? 'border-primary bg-primary/5' : 'hover:border-primary/40'}`} onClick={() => setSelected(opt === selected ? null : opt)}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold">{opt.rate}% p.a.</p>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${opt.rating === 'AAA' ? 'bg-gain/10 text-gain' : 'bg-warning/10 text-warning'}`}>{opt.rating}</span>
                    {opt.compounding && <span className="text-xs px-2 py-0.5 rounded font-semibold bg-primary/10 text-primary">Compound</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{opt.bank} · {opt.tenure} {opt.unit}</p>
                </div>
                <div className="text-right"><p className="text-xs text-muted-foreground">Interest on ₹{p.toLocaleString('en-IN')}</p><p className="font-semibold text-gain">+₹{interest.toFixed(0)}</p></div>
              </div>
              {selected === opt && (
                <div className="mt-4 space-y-3 border-t pt-3" onClick={e => e.stopPropagation()}>
                  <div><Label className="text-xs">Principal Amount (min ₹1,000)</Label><Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="mt-1" /></div>
                  <div className="bg-muted/50 rounded-xl p-3 text-sm space-y-1">
                    <div className="flex justify-between"><span className="text-muted-foreground">Principal</span><span>₹{p.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Interest ({opt.compounding ? 'Compound' : 'Simple'} @ {opt.rate}%)</span><span className="text-gain">+₹{interest.toFixed(0)}</span></div>
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
