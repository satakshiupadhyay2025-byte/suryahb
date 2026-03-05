import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import TradingChart from '@/components/TradingChart';
import OrderPanel from '@/components/OrderPanel';
import { TrendingUp, TrendingDown, Star, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/marketData';
const formatLargeNumber = formatCurrency;

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { stocks, watchlist, addToWatchlist, removeFromWatchlist, orders, holdings, isLoggedIn } = useApp();
  const stock = stocks.find(s => s.symbol === symbol);
  const inWatchlist = watchlist.some(w => w.symbol === symbol);
  const holding = holdings.find(h => h.symbol === symbol);
  const recentOrders = orders.filter(o => o.symbol === symbol).slice(0, 5);

  if (!stock) return <div className="container mx-auto p-6 text-center text-muted-foreground">Stock not found.</div>;

  const isGain = stock.changePercent >= 0;

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <Link to="/stocks" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="w-4 h-4" /> Back to Stocks</Link>

      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">{stock.symbol.slice(0,2)}</div>
            <div>
              <h1 className="text-xl font-bold">{stock.symbol}</h1>
              <p className="text-sm text-muted-foreground">{stock.name} · {stock.exchange}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-bold">₹{stock.price.toFixed(2)}</p>
            <p className={`text-sm font-semibold flex items-center gap-1 justify-end ${isGain ? 'gain-text' : 'loss-text'}`}>
              {isGain ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {isGain ? '+' : ''}₹{stock.change.toFixed(2)} ({isGain ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </p>
          </div>
          <button onClick={() => inWatchlist ? removeFromWatchlist(stock.symbol) : addToWatchlist(stock.symbol)}
            className="p-2 rounded-xl border hover:bg-muted transition-all">
            <Star className={`w-5 h-5 ${inWatchlist ? 'text-warning fill-warning' : 'text-muted-foreground'}`} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <TradingChart symbol={stock.symbol} basePrice={stock.price} height={320} />

          {/* Stock info */}
          <div className="bg-card border rounded-2xl p-4">
            <h3 className="font-bold mb-3">Key Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                ['Open', `₹${stock.open.toFixed(2)}`], ['Prev Close', `₹${stock.prevClose.toFixed(2)}`],
                ["Today's High", `₹${stock.high.toFixed(2)}`], ["Today's Low", `₹${stock.low.toFixed(2)}`],
                ['52W High', `₹${stock.week52High.toLocaleString('en-IN')}`], ['52W Low', `₹${stock.week52Low.toLocaleString('en-IN')}`],
                ['Volume', formatLargeNumber(stock.volume)], ['Market Cap', `₹${formatLargeNumber(stock.marketCap)}Cr`],
                ['P/E Ratio', stock.pe.toFixed(1)], ['EPS', `₹${stock.eps.toFixed(1)}`],
                ['Div Yield', `${stock.dividendYield.toFixed(2)}%`], ['Sector', stock.sector],
              ].map(([k, v]) => (
                <div key={k} className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-semibold text-sm">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Holdings info */}
          {isLoggedIn && holding && (
            <div className="bg-card border rounded-2xl p-4">
              <h3 className="font-bold mb-3">Your Holdings</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-bold">{holding.quantity}</p>
                </div>
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Avg Price</p>
                  <p className="font-bold">₹{holding.avgPrice.toFixed(2)}</p>
                </div>
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">P&L</p>
                  <p className={`font-bold text-sm ${(holding.currentPrice - holding.avgPrice) >= 0 ? 'gain-text' : 'loss-text'}`}>
                    {(holding.currentPrice - holding.avgPrice) >= 0 ? '+' : ''}₹{((holding.currentPrice - holding.avgPrice) * holding.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders */}
          {isLoggedIn && recentOrders.length > 0 && (
            <div className="bg-card border rounded-2xl p-4">
              <h3 className="font-bold mb-3">Recent Orders</h3>
              <div className="space-y-2">
                {recentOrders.map(o => (
                  <div key={o.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-xl">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${o.type === 'buy' ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'}`}>{o.type.toUpperCase()}</span>
                      <span className="text-sm ml-2 font-medium">x{o.quantity} @ ₹{o.price.toFixed(2)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(o.timestamp).toLocaleDateString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Panel */}
        {isLoggedIn ? (
          <div><OrderPanel symbol={stock.symbol} /></div>
        ) : (
          <div className="bg-card border rounded-2xl p-6 text-center">
            <p className="font-semibold mb-2">Login to Trade</p>
            <p className="text-sm text-muted-foreground mb-4">Create a free account to start paper trading</p>
            <Link to="/login" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-all inline-block">Login / Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
}
