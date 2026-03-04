import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StockRow } from '@/components/StockCard';

const SECTORS = ['All', 'Banking', 'IT', 'FMCG', 'Pharma', 'Auto', 'Energy', 'Power', 'Telecom', 'Metal', 'Cement'];

export default function StocksPage() {
  const { stocks } = useApp();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [sort, setSort] = useState<'gainers' | 'losers' | 'name' | 'price'>('gainers');

  const filterVal = searchParams.get('filter');
  
  let filtered = stocks.filter(s =>
    (search === '' || s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase())) &&
    (sector === 'All' || s.sector === sector)
  );

  if (sort === 'gainers' || filterVal === 'gainers') filtered = [...filtered].sort((a, b) => b.changePercent - a.changePercent);
  else if (sort === 'losers' || filterVal === 'losers') filtered = [...filtered].sort((a, b) => a.changePercent - b.changePercent);
  else if (sort === 'price') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">Stocks</h1>
      <div className="flex flex-col gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stocks..." className="pl-9" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {SECTORS.map(s => (
            <button key={s} onClick={() => setSector(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all border ${sector === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/50'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['gainers', 'losers', 'price', 'name'] as const).map(s => (
            <button key={s} onClick={() => setSort(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${sort === s ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}>
              {s === 'gainers' ? '▲ Gainers' : s === 'losers' ? '▼ Losers' : s}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-card border rounded-2xl p-4">
        <p className="text-sm text-muted-foreground mb-3">{filtered.length} stocks</p>
        {filtered.map(s => <StockRow key={s.symbol} symbol={s.symbol} showSector />)}
      </div>
    </div>
  );
}
