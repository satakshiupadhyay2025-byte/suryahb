import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Star, StarOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface StockCardProps {
  symbol: string;
  compact?: boolean;
}

export function StockCard({ symbol, compact = false }: StockCardProps) {
  const { stocks, watchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const stock = stocks.find(s => s.symbol === symbol);
  const inWatchlist = watchlist.some(w => w.symbol === symbol);
  if (!stock) return null;

  const isGain = stock.changePercent >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-card border rounded-xl p-3 card-hover"
    >
      <div className="flex items-start justify-between">
        <Link to={`/stock/${symbol}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {symbol.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{stock.symbol}</p>
              {!compact && <p className="text-xs text-muted-foreground truncate">{stock.name}</p>}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-base">₹{stock.price.toFixed(2)}</span>
            <span className={`flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-md ${isGain ? 'gain-bg gain-text' : 'loss-bg loss-text'}`}>
              {isGain ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isGain ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </div>
          {!compact && (
            <p className={`text-xs mt-0.5 ${isGain ? 'gain-text' : 'loss-text'}`}>
              {isGain ? '+' : ''}₹{stock.change.toFixed(2)}
            </p>
          )}
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); inWatchlist ? removeFromWatchlist(symbol) : addToWatchlist(symbol); }}
          className="p-1 rounded-lg hover:bg-muted transition-all ml-1 shrink-0"
        >
          {inWatchlist ? <Star className="w-4 h-4 text-warning fill-warning" /> : <StarOff className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>
    </motion.div>
  );
}

interface StockRowProps {
  symbol: string;
  showSector?: boolean;
}

export function StockRow({ symbol, showSector = false }: StockRowProps) {
  const { stocks, watchlist, addToWatchlist, removeFromWatchlist } = useApp();
  const stock = stocks.find(s => s.symbol === symbol);
  const inWatchlist = watchlist.some(w => w.symbol === symbol);
  if (!stock) return null;

  const isGain = stock.changePercent >= 0;

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-muted/30 px-2 -mx-2 rounded-lg transition-all cursor-pointer">
      <Link to={`/stock/${symbol}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {symbol.slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm">{stock.symbol}</p>
          <p className="text-xs text-muted-foreground truncate">{showSector ? stock.sector : stock.name}</p>
        </div>
      </Link>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold text-sm">₹{stock.price.toFixed(2)}</p>
          <p className={`text-xs font-medium ${isGain ? 'gain-text' : 'loss-text'}`}>
            {isGain ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </p>
        </div>
        <button
          onClick={() => inWatchlist ? removeFromWatchlist(symbol) : addToWatchlist(symbol)}
          className="p-1 rounded-lg hover:bg-muted transition-all"
        >
          {inWatchlist ? <Star className="w-4 h-4 text-warning fill-warning" /> : <Star className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>
    </div>
  );
}
