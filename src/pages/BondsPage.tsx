import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BOND_CATALOG = [
  { id: 'b1', name: '7.10% GOI 2034', issuer: 'Government of India', couponRate: 7.10, maturityYears: 10, faceValue: 1000, rating: 'Sovereign', ytm: 7.15 },
  { id: 'b2', name: '7.26% GOI 2033', issuer: 'Government of India', couponRate: 7.26, maturityYears: 9, faceValue: 1000, rating: 'Sovereign', ytm: 7.28 },
  { id: 'b3', name: 'HDFC Bank Bond 2027', issuer: 'HDFC Bank', couponRate: 7.90, maturityYears: 3, faceValue: 1000, rating: 'AAA', ytm: 7.95 },
  { id: 'b4', name: 'REC Ltd NCD 2028', issuer: 'REC Limited', couponRate: 7.75, maturityYears: 4, faceValue: 1000, rating: 'AAA', ytm: 7.80 },
  { id: 'b5', name: 'NHAI Infrastructure Bond', issuer: 'NHAI', couponRate: 8.10, maturityYears: 5, faceValue: 1000, rating: 'AAA', ytm: 8.15 },
  { id: 'b6', name: 'SBI AT1 Bond', issuer: 'State Bank of India', couponRate: 8.50, maturityYears: 15, faceValue: 1000, rating: 'AA+', ytm: 8.55 },
];

export default function BondsPage() {
  const { bondHoldings, user, placeOrder, stocks } = useApp();
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [qty, setQty] = useState('10');

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">Government Bonds</h1>
      <p className="text-sm text-muted-foreground mb-5">Invest in safe government and corporate bonds</p>

      {bondHoldings.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold mb-3">My Bond Holdings</h2>
          <div className="space-y-3">
            {bondHoldings.map(b => (
              <div key={b.id} className="bg-card border rounded-xl p-4">
                <div className="flex justify-between"><p className="font-semibold">{b.name}</p><span className="text-xs bg-gain/10 text-gain px-2 py-0.5 rounded font-medium">{b.rating}</span></div>
                <p className="text-sm text-muted-foreground">{b.couponRate}% coupon · Matures {new Date(b.maturityDate).getFullYear()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {BOND_CATALOG.map(bond => (
          <div key={bond.id} className="bg-card border rounded-2xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold">{bond.name}</p>
                <p className="text-xs text-muted-foreground">{bond.issuer}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-bold ${bond.rating === 'Sovereign' || bond.rating === 'AAA' ? 'bg-gain/10 text-gain' : 'bg-warning/10 text-warning'}`}>{bond.rating}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[['Coupon', `${bond.couponRate}%`], ['YTM', `${bond.ytm}%`], ['Tenure', `${bond.maturityYears}Y`], ['Face Val', `₹${bond.faceValue}`]].map(([k,v]) => (
                <div key={k} className="bg-muted/40 rounded-lg p-2 text-center"><p className="text-xs text-muted-foreground">{k}</p><p className="font-semibold text-sm">{v}</p></div>
              ))}
            </div>
            {buyingId === bond.id ? (
              <div className="space-y-2">
                <Input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="Number of units" />
                <p className="text-sm text-muted-foreground">Total: ₹{(parseInt(qty||'0') * bond.faceValue).toLocaleString('en-IN')}</p>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => setBuyingId(null)}>Invest Now (Simulated)</Button>
                  <Button variant="outline" onClick={() => setBuyingId(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setBuyingId(bond.id)}>Invest in Bond</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
