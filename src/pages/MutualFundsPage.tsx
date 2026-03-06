import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MF_CATALOG = [
  // INDEX FUNDS
  { name: 'HDFC Index Fund - NIFTY 50', category: 'Index', subCategory: 'NIFTY 50', nav: 156.78, cagr: 12.8 },
  { name: 'UTI Nifty 50 Index Fund', category: 'Index', subCategory: 'NIFTY 50', nav: 112.34, cagr: 12.6 },
  { name: 'ICICI Pru Nifty 50 Index Fund', category: 'Index', subCategory: 'NIFTY 50', nav: 189.45, cagr: 12.5 },
  { name: 'SBI Nifty Index Fund', category: 'Index', subCategory: 'NIFTY 50', nav: 178.90, cagr: 12.4 },
  { name: 'Nippon India Index Nifty 50', category: 'Index', subCategory: 'NIFTY 50', nav: 34.56, cagr: 12.3 },
  { name: 'Motilal Oswal Nifty 50 Index', category: 'Index', subCategory: 'NIFTY 50', nav: 23.45, cagr: 12.7 },
  { name: 'HDFC Nifty Next 50 Index Fund', category: 'Index', subCategory: 'NIFTY Next 50', nav: 67.89, cagr: 13.4 },
  { name: 'UTI Nifty Next 50 Index Fund', category: 'Index', subCategory: 'NIFTY Next 50', nav: 89.12, cagr: 13.2 },
  { name: 'ICICI Pru Nifty Next 50 Index', category: 'Index', subCategory: 'NIFTY Next 50', nav: 45.67, cagr: 13.5 },
  { name: 'Nippon India Nifty Next 50 Junior BeES FOF', category: 'Index', subCategory: 'NIFTY Next 50', nav: 12.34, cagr: 13.1 },
  { name: 'HDFC SENSEX Index Fund', category: 'Index', subCategory: 'SENSEX', nav: 234.56, cagr: 12.9 },
  { name: 'SBI Magnum SENSEX ETF', category: 'Index', subCategory: 'SENSEX', nav: 789.30, cagr: 12.8 },
  { name: 'Nippon India ETF Nifty BeES', category: 'Index', subCategory: 'NIFTY 50 ETF', nav: 234.56, cagr: 12.7 },
  { name: 'HDFC Nifty 100 Index Fund', category: 'Index', subCategory: 'Large Cap Index', nav: 23.45, cagr: 13.1 },
  { name: 'ICICI Pru Nifty 100 Low Vol 30 ETF', category: 'Index', subCategory: 'Large Cap Index', nav: 145.60, cagr: 13.4 },
  { name: 'Motilal Oswal Nifty Midcap 150 Index', category: 'Index', subCategory: 'Mid Cap Index', nav: 34.56, cagr: 18.2 },
  { name: 'HDFC Nifty Midcap 150 Index Fund', category: 'Index', subCategory: 'Mid Cap Index', nav: 23.45, cagr: 18.5 },
  { name: 'Nippon India Nifty Midcap 150 Index', category: 'Index', subCategory: 'Mid Cap Index', nav: 18.90, cagr: 18.0 },
  { name: 'Motilal Oswal Nifty Smallcap 250 Index', category: 'Index', subCategory: 'Small Cap Index', nav: 28.90, cagr: 22.1 },
  { name: 'HDFC Nifty Smallcap 250 Index Fund', category: 'Index', subCategory: 'Small Cap Index', nav: 19.45, cagr: 21.8 },
  { name: 'Nippon India Nifty Smallcap 250 Index', category: 'Index', subCategory: 'Small Cap Index', nav: 15.67, cagr: 21.5 },
  { name: 'Motilal Oswal Nifty 500 Index Fund', category: 'Index', subCategory: 'Total Market', nav: 12.34, cagr: 14.2 },
  { name: 'ICICI Pru Nifty 500 Index Fund', category: 'Index', subCategory: 'Total Market', nav: 11.23, cagr: 14.0 },
  { name: 'HDFC Nifty 500 Index Fund', category: 'Index', subCategory: 'Total Market', nav: 10.45, cagr: 13.9 },
  { name: 'DSP Nifty 50 Equal Weight Index', category: 'Index', subCategory: 'Equal Weight', nav: 23.45, cagr: 13.8 },
  { name: 'Motilal Oswal S&P 500 Index Fund', category: 'Index', subCategory: 'International', nav: 23.45, cagr: 15.2 },
  { name: 'HDFC Developed World Indexes FOF', category: 'Index', subCategory: 'International', nav: 18.90, cagr: 14.8 },

  // LARGE CAP EQUITY
  { name: 'Mirae Asset Large Cap Fund', category: 'Equity', subCategory: 'Large Cap', nav: 98.45, cagr: 14.2 },
  { name: 'ICICI Prudential Bluechip Fund', category: 'Equity', subCategory: 'Large Cap', nav: 89.12, cagr: 13.9 },
  { name: 'Axis Bluechip Fund', category: 'Equity', subCategory: 'Large Cap', nav: 56.78, cagr: 13.5 },
  { name: 'Canara Robeco Bluechip Equity Fund', category: 'Equity', subCategory: 'Large Cap', nav: 45.67, cagr: 14.1 },
  { name: 'Kotak Bluechip Fund', category: 'Equity', subCategory: 'Large Cap', nav: 456.78, cagr: 13.7 },
  { name: 'SBI Bluechip Fund', category: 'Equity', subCategory: 'Large Cap', nav: 78.90, cagr: 13.4 },
  { name: 'HDFC Top 100 Fund', category: 'Equity', subCategory: 'Large Cap', nav: 1089.45, cagr: 13.2 },
  { name: 'Franklin India Bluechip Fund', category: 'Equity', subCategory: 'Large Cap', nav: 789.30, cagr: 13.0 },
  { name: 'DSP Top 100 Equity Fund', category: 'Equity', subCategory: 'Large Cap', nav: 456.78, cagr: 13.6 },
  { name: 'Nippon India Large Cap Fund', category: 'Equity', subCategory: 'Large Cap', nav: 78.90, cagr: 14.0 },
  { name: 'Edelweiss Large Cap Fund', category: 'Equity', subCategory: 'Large Cap', nav: 67.89, cagr: 13.3 },

  // MID CAP EQUITY
  { name: 'Axis Midcap Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 72.34, cagr: 18.5 },
  { name: 'Nippon India Growth Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 345.67, cagr: 19.4 },
  { name: 'Kotak Emerging Equity Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 123.45, cagr: 19.8 },
  { name: 'HDFC Mid-Cap Opportunities Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 178.90, cagr: 20.1 },
  { name: 'Edelweiss Mid Cap Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 67.89, cagr: 18.9 },
  { name: 'Mirae Asset Midcap Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 34.56, cagr: 19.2 },
  { name: 'SBI Magnum Midcap Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 234.56, cagr: 20.4 },
  { name: 'ICICI Pru Midcap Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 234.56, cagr: 19.6 },
  { name: 'DSP Midcap Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 123.45, cagr: 18.8 },
  { name: 'Franklin India Prima Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 2345.67, cagr: 17.4 },

  // SMALL CAP EQUITY
  { name: 'SBI Small Cap Fund', category: 'Equity', subCategory: 'Small Cap', nav: 134.56, cagr: 22.1 },
  { name: 'Nippon India Small Cap Fund', category: 'Equity', subCategory: 'Small Cap', nav: 123.45, cagr: 23.4 },
  { name: 'HDFC Small Cap Fund', category: 'Equity', subCategory: 'Small Cap', nav: 112.34, cagr: 22.8 },
  { name: 'Axis Small Cap Fund', category: 'Equity', subCategory: 'Small Cap', nav: 89.12, cagr: 24.1 },
  { name: 'Kotak Small Cap Fund', category: 'Equity', subCategory: 'Small Cap', nav: 234.56, cagr: 22.5 },
  { name: 'DSP Small Cap Fund', category: 'Equity', subCategory: 'Small Cap', nav: 189.45, cagr: 21.8 },
  { name: 'Franklin India Smaller Companies Fund', category: 'Equity', subCategory: 'Small Cap', nav: 123.45, cagr: 20.9 },
  { name: 'Canara Robeco Small Cap Fund', category: 'Equity', subCategory: 'Small Cap', nav: 34.56, cagr: 23.2 },
  { name: 'ICICI Pru Smallcap Fund', category: 'Equity', subCategory: 'Small Cap', nav: 78.90, cagr: 22.0 },
  { name: 'Quant Small Cap Fund', category: 'Equity', subCategory: 'Small Cap', nav: 234.56, cagr: 28.4 },

  // FLEXI & MULTI CAP
  { name: 'Parag Parikh Flexi Cap Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 68.92, cagr: 16.8 },
  { name: 'Axis Flexi Cap Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 23.45, cagr: 14.9 },
  { name: 'HDFC Flexi Cap Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 1567.80, cagr: 15.2 },
  { name: 'Kotak Flexi Cap Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 89.12, cagr: 15.6 },
  { name: 'DSP Flexi Cap Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 78.90, cagr: 15.4 },
  { name: 'SBI Flexicap Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 89.12, cagr: 16.1 },
  { name: 'Nippon India Flexicap Fund', category: 'Equity', subCategory: 'Flexi Cap', nav: 23.45, cagr: 15.9 },
  { name: 'ICICI Pru Multicap Fund', category: 'Equity', subCategory: 'Multi Cap', nav: 678.90, cagr: 16.4 },
  { name: 'Quant Active Fund', category: 'Equity', subCategory: 'Multi Cap', nav: 567.80, cagr: 19.8 },
  { name: 'Nippon India Multi Cap Fund', category: 'Equity', subCategory: 'Multi Cap', nav: 345.60, cagr: 17.2 },

  // ELSS (TAX SAVING)
  { name: 'Axis Long Term Equity Fund (ELSS)', category: 'ELSS', subCategory: 'Tax Saving', nav: 89.12, cagr: 15.4 },
  { name: 'Mirae Asset Tax Saver Fund (ELSS)', category: 'ELSS', subCategory: 'Tax Saving', nav: 45.67, cagr: 16.8 },
  { name: 'Parag Parikh Tax Saver Fund (ELSS)', category: 'ELSS', subCategory: 'Tax Saving', nav: 23.45, cagr: 15.9 },
  { name: 'HDFC TaxSaver Fund (ELSS)', category: 'ELSS', subCategory: 'Tax Saving', nav: 1234.56, cagr: 14.2 },
  { name: 'DSP Tax Saver Fund (ELSS)', category: 'ELSS', subCategory: 'Tax Saving', nav: 89.12, cagr: 15.1 },
  { name: 'Kotak Tax Saver Fund (ELSS)', category: 'ELSS', subCategory: 'Tax Saving', nav: 123.45, cagr: 15.6 },
  { name: 'SBI Long Term Equity Fund (ELSS)', category: 'ELSS', subCategory: 'Tax Saving', nav: 345.60, cagr: 14.8 },
  { name: 'Franklin India Taxshield (ELSS)', category: 'ELSS', subCategory: 'Tax Saving', nav: 1123.45, cagr: 13.9 },

  // DEBT FUNDS
  { name: 'HDFC Short Term Debt Fund', category: 'Debt', subCategory: 'Short Duration', nav: 34.56, cagr: 7.4 },
  { name: 'ICICI Pru Short Term Fund', category: 'Debt', subCategory: 'Short Duration', nav: 56.78, cagr: 7.6 },
  { name: 'Kotak Short Duration Fund', category: 'Debt', subCategory: 'Short Duration', nav: 23.45, cagr: 7.2 },
  { name: 'SBI Short Term Debt Fund', category: 'Debt', subCategory: 'Short Duration', nav: 34.56, cagr: 7.5 },
  { name: 'HDFC Corporate Bond Fund', category: 'Debt', subCategory: 'Corporate Bond', nav: 34.56, cagr: 7.8 },
  { name: 'Nippon India Corporate Bond Fund', category: 'Debt', subCategory: 'Corporate Bond', nav: 23.45, cagr: 7.9 },
  { name: 'ICICI Pru Corporate Bond Fund', category: 'Debt', subCategory: 'Corporate Bond', nav: 34.56, cagr: 8.0 },
  { name: 'HDFC Liquid Fund', category: 'Debt', subCategory: 'Liquid', nav: 4567.89, cagr: 6.8 },
  { name: 'SBI Liquid Fund', category: 'Debt', subCategory: 'Liquid', nav: 3456.78, cagr: 6.9 },
  { name: 'Nippon India Liquid Fund', category: 'Debt', subCategory: 'Liquid', nav: 5678.90, cagr: 6.7 },
  { name: 'HDFC Gilt Fund', category: 'Debt', subCategory: 'Gilt', nav: 56.78, cagr: 7.2 },
  { name: 'SBI Magnum Gilt Fund', category: 'Debt', subCategory: 'Gilt', nav: 67.89, cagr: 7.4 },
  { name: 'ICICI Pru All Seasons Bond Fund', category: 'Debt', subCategory: 'Dynamic Bond', nav: 45.67, cagr: 7.9 },

  // HYBRID FUNDS
  { name: 'HDFC Balanced Advantage Fund', category: 'Hybrid', subCategory: 'Balanced Advantage', nav: 567.89, cagr: 14.1 },
  { name: 'ICICI Pru Balanced Advantage Fund', category: 'Hybrid', subCategory: 'Balanced Advantage', nav: 67.89, cagr: 13.8 },
  { name: 'Kotak Balanced Advantage Fund', category: 'Hybrid', subCategory: 'Balanced Advantage', nav: 23.45, cagr: 13.4 },
  { name: 'Edelweiss Balanced Advantage Fund', category: 'Hybrid', subCategory: 'Balanced Advantage', nav: 45.67, cagr: 13.9 },
  { name: 'HDFC Aggressive Hybrid Fund', category: 'Hybrid', subCategory: 'Aggressive Hybrid', nav: 789.30, cagr: 15.2 },
  { name: 'ICICI Pru Equity & Debt Fund', category: 'Hybrid', subCategory: 'Aggressive Hybrid', nav: 345.60, cagr: 15.8 },
  { name: 'SBI Equity Hybrid Fund', category: 'Hybrid', subCategory: 'Aggressive Hybrid', nav: 345.60, cagr: 14.4 },
  { name: 'Canara Robeco Equity Hybrid Fund', category: 'Hybrid', subCategory: 'Aggressive Hybrid', nav: 345.60, cagr: 14.9 },

  // SECTORAL/THEMATIC
  { name: 'ICICI Pru Technology Fund', category: 'Sector', subCategory: 'IT/Technology', nav: 234.56, cagr: 22.4 },
  { name: 'SBI Technology Opportunities Fund', category: 'Sector', subCategory: 'IT/Technology', nav: 234.56, cagr: 21.8 },
  { name: 'Tata Digital India Fund', category: 'Sector', subCategory: 'IT/Technology', nav: 45.67, cagr: 22.1 },
  { name: 'Mirae Asset Healthcare Fund', category: 'Sector', subCategory: 'Healthcare', nav: 34.56, cagr: 18.4 },
  { name: 'ICICI Pru Pharma Healthcare Fund', category: 'Sector', subCategory: 'Healthcare', nav: 56.78, cagr: 17.8 },
  { name: 'Nippon India Pharma Fund', category: 'Sector', subCategory: 'Healthcare', nav: 456.78, cagr: 18.9 },
  { name: 'SBI Infrastructure Fund', category: 'Sector', subCategory: 'Infrastructure', nav: 56.78, cagr: 19.4 },
  { name: 'ICICI Pru Infrastructure Fund', category: 'Sector', subCategory: 'Infrastructure', nav: 189.45, cagr: 20.1 },
  { name: 'Quant Infrastructure Fund', category: 'Sector', subCategory: 'Infrastructure', nav: 34.56, cagr: 24.8 },
  { name: 'ICICI Pru Banking & Financial Services', category: 'Sector', subCategory: 'Banking', nav: 123.45, cagr: 16.4 },
  { name: 'Nippon India Banking & Financial Services', category: 'Sector', subCategory: 'Banking', nav: 567.80, cagr: 15.8 },
  { name: 'Mirae Asset Financial Services Fund', category: 'Sector', subCategory: 'Banking', nav: 23.45, cagr: 16.2 },
  { name: 'SBI PSU Fund', category: 'Sector', subCategory: 'PSU', nav: 45.67, cagr: 21.4 },
  { name: 'CPSE ETF', category: 'Sector', subCategory: 'PSU', nav: 89.12, cagr: 19.8 },
  { name: 'Mirae Asset NYSE FANG+ ETF FOF', category: 'Sector', subCategory: 'International Tech', nav: 34.56, cagr: 24.2 },
  { name: 'Nippon India Consumption Fund', category: 'Sector', subCategory: 'Consumption', nav: 234.56, cagr: 15.6 },
  { name: 'SBI Consumption Opportunities Fund', category: 'Sector', subCategory: 'Consumption', nav: 345.60, cagr: 16.1 },
  { name: 'Aditya Birla Sun Life Manufacturing Equity', category: 'Sector', subCategory: 'Manufacturing', nav: 45.67, cagr: 18.9 },
  { name: 'Nippon India Power & Infra Fund', category: 'Sector', subCategory: 'Energy', nav: 345.60, cagr: 20.4 },
  { name: 'Tata Resources & Energy Fund', category: 'Sector', subCategory: 'Energy', nav: 34.56, cagr: 19.8 },
];

const ALL_CATEGORIES = ['All', 'Index', 'Equity', 'ELSS', 'Hybrid', 'Debt', 'Sector'];
const INDEX_SUBCATS = ['NIFTY 50', 'NIFTY Next 50', 'SENSEX', 'Mid Cap Index', 'Small Cap Index', 'Large Cap Index', 'Total Market', 'International'];

export default function MutualFundsPage() {
  const { mutualFunds, investMutualFund, stopSIP, redeemMutualFund } = useApp();
  const [showInvest, setShowInvest] = useState<string | null>(null);
  const [amount, setAmount] = useState('5000');
  const [investType, setInvestType] = useState<'sip' | 'lumpsum'>('sip');
  const [sipDate, setSipDate] = useState('5');
  const [filter, setFilter] = useState('All');
  const [subFilter, setSubFilter] = useState('All');
  const [search, setSearch] = useState('');

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

  const subCategories = filter === 'All' ? [] : ['All', ...new Set(MF_CATALOG.filter(f => filter === 'All' || f.category === filter).map(f => f.subCategory))];

  const filteredCatalog = MF_CATALOG.filter(f => {
    const catMatch = filter === 'All' || f.category === filter;
    const subMatch = subFilter === 'All' || f.subCategory === subFilter;
    const searchMatch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.subCategory.toLowerCase().includes(search.toLowerCase());
    return catMatch && subMatch && searchMatch;
  });

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-2">Mutual Funds</h1>
      <p className="text-muted-foreground text-sm mb-5">300+ funds · SIP from ₹500/month · All major indices</p>

      {/* SIP Calculator CTA */}
      <div className="bg-gradient-to-r from-primary to-primary-glow rounded-2xl p-5 text-primary-foreground mb-6">
        <p className="font-bold text-lg mb-1">Start SIP Today</p>
        <p className="text-sm text-primary-foreground/80 mb-3">Invest in NIFTY 50, SENSEX, Midcap & more</p>
        <div className="flex gap-2 text-xs flex-wrap">
          {[['NIFTY 50', '12-13%'], ['Nifty Next 50', '13-14%'], ['SENSEX', '12-13%'], ['Midcap 150', '18-20%'], ['Smallcap 250', '22-24%']].map(([name, ret]) => (
            <div key={name} className="bg-primary-foreground/10 rounded-lg px-2 py-1 text-center">
              <p className="font-semibold">{name}</p><p className="opacity-70">{ret}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My Investments */}
      {mutualFunds.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold mb-3">My Investments ({mutualFunds.length})</h2>
          <div className="space-y-3">
            {mutualFunds.map(f => {
              const cur = f.units * f.nav;
              const pl = cur - f.invested;
              return (
                <div key={f.id} className="bg-card border rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-2">
                      <p className="font-semibold text-sm">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.subCategory} · CAGR {f.cagr}%</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold">₹{cur.toFixed(0)}</p>
                      <p className={`text-xs ${pl >= 0 ? 'gain-text' : 'loss-text'} font-medium`}>{pl >= 0 ? '+' : ''}₹{Math.abs(pl).toFixed(0)}</p>
                    </div>
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

      {/* Search */}
      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search funds by name or category..."
          className="w-full px-4 py-2.5 border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
        {ALL_CATEGORIES.map(c => (
          <button key={c} onClick={() => { setFilter(c); setSubFilter('All'); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all border ${filter === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Sub-category filter */}
      {subCategories.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {subCategories.map(c => (
            <button key={c} onClick={() => setSubFilter(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all border ${subFilter === c ? 'bg-secondary text-secondary-foreground border-secondary' : 'border-border text-muted-foreground hover:bg-muted'}`}>
              {c}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-3">{filteredCatalog.length} funds found</p>

      {/* Catalog */}
      <div className="space-y-3">
        {filteredCatalog.map(mf => (
          <div key={mf.name} className="bg-card border rounded-2xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 pr-2">
                <p className="font-semibold text-sm">{mf.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">{mf.subCategory}</span>
                  <span className="text-xs bg-muted px-1.5 py-0.5 rounded font-medium">{mf.category}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">NAV ₹{mf.nav}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-bold text-sm ${mf.cagr > 0 ? 'gain-text' : 'loss-text'}`}>{mf.cagr}%</p>
                <p className="text-xs text-muted-foreground">3Y CAGR</p>
              </div>
            </div>
            {showInvest === mf.name ? (
              <div className="space-y-3 border-t pt-3">
                <div className="flex gap-2">
                  {(['sip', 'lumpsum'] as const).map(t => (
                    <button key={t} onClick={() => setInvestType(t)}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-medium capitalize ${investType === t ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {t === 'sip' ? 'Monthly SIP' : 'Lumpsum'}
                    </button>
                  ))}
                </div>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (min ₹500)" />
                {investType === 'sip' && (
                  <Select value={sipDate} onValueChange={setSipDate}>
                    <SelectTrigger><SelectValue placeholder="SIP Date" /></SelectTrigger>
                    <SelectContent>{[1,5,10,15,20,25,28].map(d => <SelectItem key={d} value={String(d)}>{d}th of every month</SelectItem>)}</SelectContent>
                  </Select>
                )}
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
