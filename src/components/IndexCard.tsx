import { useApp } from '@/context/AppContext';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function IndexCard({ name }: { name: string }) {
  const { indices } = useApp();
  const index = indices.find(i => i.name === name);
  if (!index) return null;
  const isGain = index.changePercent >= 0;

  return (
    <div className="bg-card border rounded-xl p-4 card-hover">
      <p className="text-xs font-medium text-muted-foreground mb-1">{index.name}</p>
      <p className="font-bold text-xl">{index.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
      <div className={`flex items-center gap-1 mt-1 text-sm font-semibold ${isGain ? 'gain-text' : 'loss-text'}`}>
        {isGain ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        <span>{isGain ? '+' : ''}{index.change.toFixed(2)} ({isGain ? '+' : ''}{index.changePercent.toFixed(2)}%)</span>
      </div>
      <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
        <span>H: {index.high.toLocaleString('en-IN')}</span>
        <span>L: {index.low.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}

export function MiniIndexBar() {
  const { indices, isLoggedIn } = useApp();
  const mainIndices = indices.slice(0, 3);

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
      {mainIndices.map(index => {
        const isGain = index.changePercent >= 0;
        return (
          <div key={index.name} className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2 shrink-0 min-w-[160px]">
            <div>
              <p className="text-xs text-muted-foreground font-medium">{index.name}</p>
              <p className="font-bold text-sm">{index.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className={`ml-auto text-xs font-semibold ${isGain ? 'gain-text' : 'loss-text'}`}>
              {isGain ? '+' : ''}{index.changePercent.toFixed(2)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
