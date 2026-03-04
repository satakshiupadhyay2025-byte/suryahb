import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const IPOS = [
  { id: 'ipo1', name: 'Swiggy Ltd', status: 'ongoing', issuePrice: 390, lotSize: 38, subscribed: 3.2, openDate: '2024-11-06', closeDate: '2024-11-08', gmp: 15, rating: 4 },
  { id: 'ipo2', name: 'ACME Solar Holdings', status: 'ongoing', issuePrice: 289, lotSize: 51, subscribed: 1.8, openDate: '2024-11-06', closeDate: '2024-11-08', gmp: 8, rating: 3 },
  { id: 'ipo3', name: 'Vishal Mega Mart', status: 'upcoming', issuePrice: 78, lotSize: 192, subscribed: 0, openDate: '2024-11-27', closeDate: '2024-11-29', gmp: 5, rating: 3 },
  { id: 'ipo4', name: 'Sagility India', status: 'upcoming', issuePrice: 30, lotSize: 500, subscribed: 0, openDate: '2024-11-05', closeDate: '2024-11-07', gmp: 2, rating: 3 },
  { id: 'ipo5', name: 'Niva Bupa Health Insurance', status: 'listed', issuePrice: 74, lotSize: 202, subscribed: 5.6, openDate: '2024-11-07', closeDate: '2024-11-11', gmp: 0, rating: 4, listingPrice: 78, listingGain: 5.4 },
  { id: 'ipo6', name: 'Hyundai Motor India', status: 'listed', issuePrice: 1960, lotSize: 7, subscribed: 2.4, openDate: '2024-10-15', closeDate: '2024-10-17', gmp: 0, rating: 4, listingPrice: 1934, listingGain: -1.3 },
];

export default function IPOPage() {
  const { applyIPO, ipoApplications, user } = useApp();
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [lots, setLots] = useState('1');
  const [tab, setTab] = useState<'ongoing' | 'upcoming' | 'listed'>('ongoing');

  const handleApply = (ipo: typeof IPOS[0]) => {
    const l = parseInt(lots) || 1;
    applyIPO({ ipoId: ipo.id, name: ipo.name, lots: l, lotSize: ipo.lotSize, issuePrice: ipo.issuePrice });
    setApplyingId(null);
  };

  const filtered = IPOS.filter(i => i.status === tab);
  const myApps = ipoApplications;

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">IPO</h1>
      <p className="text-sm text-muted-foreground mb-5">Apply for upcoming and ongoing IPOs</p>

      {myApps.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold mb-3">My Applications</h2>
          <div className="space-y-2">
            {myApps.map(a => (
              <div key={a.id} className="bg-card border rounded-xl p-3 flex items-center justify-between">
                <div><p className="font-semibold text-sm">{a.name}</p><p className="text-xs text-muted-foreground">{a.lots} lot(s) @ ₹{a.issuePrice}</p></div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${a.allotmentStatus === 'allotted' ? 'bg-gain/10 text-gain' : a.allotmentStatus === 'not_allotted' ? 'bg-loss/10 text-loss' : 'bg-muted text-muted-foreground'}`}>
                  {a.allotmentStatus === 'allotted' ? '✅ Allotted' : a.allotmentStatus === 'not_allotted' ? '❌ Not Allotted' : '⏳ Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-4">
        {(['ongoing', 'upcoming', 'listed'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>{t}</button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map(ipo => {
          const applied = myApps.some(a => a.ipoId === ipo.id);
          const totalCost = parseInt(lots) * ipo.lotSize * ipo.issuePrice;
          return (
            <div key={ipo.id} className="bg-card border rounded-2xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold">{ipo.name}</p>
                  <p className="text-xs text-muted-foreground">{ipo.openDate} – {ipo.closeDate}</p>
                </div>
                {ipo.gmp > 0 && <span className="text-xs gain-text font-semibold bg-gain/10 px-2 py-0.5 rounded">GMP +₹{ipo.gmp}</span>}
                {(ipo as { listingGain?: number }).listingGain !== undefined && <span className={`text-xs font-semibold px-2 py-0.5 rounded ${(ipo as { listingGain?: number }).listingGain! >= 0 ? 'bg-gain/10 gain-text' : 'bg-loss/10 loss-text'}`}>Listed {(ipo as { listingGain?: number }).listingGain! >= 0 ? '+' : ''}{(ipo as { listingGain?: number }).listingGain!.toFixed(1)}%</span>}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-muted/40 rounded-xl p-2 text-center"><p className="text-xs text-muted-foreground">Issue Price</p><p className="font-bold text-sm">₹{ipo.issuePrice}</p></div>
                <div className="bg-muted/40 rounded-xl p-2 text-center"><p className="text-xs text-muted-foreground">Lot Size</p><p className="font-bold text-sm">{ipo.lotSize}</p></div>
                <div className="bg-muted/40 rounded-xl p-2 text-center"><p className="text-xs text-muted-foreground">Subscribed</p><p className={`font-bold text-sm ${ipo.subscribed > 0 ? 'gain-text' : ''}`}>{ipo.subscribed > 0 ? `${ipo.subscribed}x` : '-'}</p></div>
              </div>
              {ipo.status === 'ongoing' && !applied && (
                applyingId === ipo.id ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input type="number" value={lots} min="1" onChange={e => setLots(e.target.value)} className="w-24" />
                      <span className="text-sm text-muted-foreground">lots × {ipo.lotSize} shares = ₹{(parseInt(lots||'1') * ipo.lotSize * ipo.issuePrice).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleApply(ipo)} className="flex-1">Apply Now</Button>
                      <Button variant="outline" onClick={() => setApplyingId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setApplyingId(ipo.id)} className="w-full">Apply for IPO</Button>
                )
              )}
              {applied && <div className="text-center text-sm gain-text font-semibold py-2 bg-gain/5 rounded-xl">✅ Applied</div>}
              {ipo.status === 'upcoming' && <div className="text-center text-sm text-muted-foreground py-2 bg-muted/30 rounded-xl">Opens on {ipo.openDate}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
