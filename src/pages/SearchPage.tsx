import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StockRow } from '@/components/StockCard';

export default function SearchPage() {
  const { stocks } = useApp();
  const [query, setQuery] = useState('');

  const results = query.length > 1 ? stocks.filter(s =>
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.sector.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 20) : [];

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search stocks by name, symbol or sector..." className="pl-10 text-base" autoFocus />
      </div>
      {query.length > 1 && (
        <div className="bg-card border rounded-2xl p-4">
          {results.length === 0 ? <p className="text-center text-muted-foreground py-4">No results found</p> : results.map(s => <StockRow key={s.symbol} symbol={s.symbol} showSector />)}
        </div>
      )}
      {query.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Search for stocks, mutual funds, or sectors</p>
        </div>
      )}
    </div>
  );
}
