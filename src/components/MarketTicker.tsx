import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketTicker() {
  const { indices, stocks } = useApp();
  const tickerItems = [
    ...indices.map(i => ({ label: i.name, value: i.value.toFixed(2), change: i.changePercent, isIndex: true })),
    ...stocks.slice(0, 15).map(s => ({ label: s.symbol, value: s.price.toFixed(2), change: s.changePercent, isIndex: false })),
  ];

  return (
    <div className="bg-muted/50 border-b overflow-hidden">
      <div className="flex">
        <div className="flex items-center gap-4 ticker-scroll whitespace-nowrap py-1.5 px-4">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs shrink-0">
              <span className="font-semibold text-foreground">{item.label}</span>
              <span className="text-foreground">₹{item.value}</span>
              <span className={`flex items-center gap-0.5 font-medium ${item.change >= 0 ? 'gain-text' : 'loss-text'}`}>
                {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
              </span>
              <span className="text-muted-foreground/50 ml-2">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
