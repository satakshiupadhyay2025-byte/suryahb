import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface OrderPanelProps {
  symbol: string;
  onClose?: () => void;
}

type OrderType = 'market' | 'limit' | 'stop_loss' | 'stop_loss_market';
type TradeType = 'buy' | 'sell';

export default function OrderPanel({ symbol, onClose }: OrderPanelProps) {
  const { stocks, holdings, user, placeOrder } = useApp();
  const stock = stocks.find(s => s.symbol === symbol);
  const holding = holdings.find(h => h.symbol === symbol);

  const [tradeType, setTradeType] = useState<TradeType>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [quantity, setQuantity] = useState('1');
  const [limitPrice, setLimitPrice] = useState(stock?.price.toFixed(2) || '');
  const [slPrice, setSlPrice] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!stock) return null;

  const qty = parseInt(quantity) || 0;
  const execPrice = orderType === 'market' ? stock.price : parseFloat(limitPrice) || stock.price;
  const charges = parseFloat((execPrice * qty * 0.0003 + 20).toFixed(2));
  const total = execPrice * qty + (tradeType === 'buy' ? charges : -charges);
  const maxQty = tradeType === 'sell' ? (holding?.quantity || 0) : Math.floor(((user?.virtualBalance || 0) - 20) / (stock.price * 1.0003));

  const handleSubmit = () => {
    setError('');
    if (qty <= 0) { setError('Enter valid quantity'); return; }
    if (tradeType === 'sell' && qty > (holding?.quantity || 0)) { setError(`Max sellable: ${holding?.quantity || 0}`); return; }
    if (tradeType === 'buy' && total > (user?.virtualBalance || 0)) { setError('Insufficient balance'); return; }

    const ok = placeOrder({ symbol, name: stock.name, type: tradeType, orderType, quantity: qty, price: execPrice, limitPrice: orderType === 'limit' ? execPrice : undefined });
    if (ok) {
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose?.(); }, 2000);
    }
  };

  return (
    <div className="bg-card border rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-bold text-lg">{stock.symbol}</h3>
          <p className="text-sm text-muted-foreground">{stock.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="font-bold text-lg">₹{stock.price.toFixed(2)}</p>
            <p className={`text-xs font-medium ${stock.changePercent >= 0 ? 'gain-text' : 'loss-text'}`}>
              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </p>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Buy/Sell toggle */}
        <div className="flex bg-muted rounded-xl p-1">
          {(['buy', 'sell'] as const).map(t => (
            <button key={t} onClick={() => setTradeType(t)}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                tradeType === t
                  ? t === 'buy' ? 'bg-gain text-white shadow' : 'bg-loss text-white shadow'
                  : 'text-muted-foreground'
              }`}>
              {t === 'buy' ? '▲ BUY' : '▼ SELL'}
            </button>
          ))}
        </div>

        {/* Order type */}
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Order Type</Label>
          <div className="grid grid-cols-2 gap-1">
            {([['market', 'Market'], ['limit', 'Limit'], ['stop_loss', 'Stop Loss'], ['stop_loss_market', 'SL-M']] as [OrderType, string][]).map(([val, label]) => (
              <button key={val} onClick={() => setOrderType(val)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all border ${
                  orderType === val ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <Label className="text-xs text-muted-foreground">Quantity</Label>
            <span className="text-xs text-muted-foreground">
              {tradeType === 'buy' ? `Max: ${maxQty}` : `Holdings: ${holding?.quantity || 0}`}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setQuantity(q => String(Math.max(1, (parseInt(q) || 0) - 1)))} className="w-9 h-9 rounded-lg border hover:bg-muted font-bold text-lg flex items-center justify-center">-</button>
            <Input value={quantity} onChange={e => setQuantity(e.target.value.replace(/\D/g, ''))} className="text-center font-bold" />
            <button onClick={() => setQuantity(q => String((parseInt(q) || 0) + 1))} className="w-9 h-9 rounded-lg border hover:bg-muted font-bold text-lg flex items-center justify-center">+</button>
          </div>
          <div className="flex gap-1 mt-1.5">
            {[1, 5, 10, 25].map(n => (
              <button key={n} onClick={() => setQuantity(String(n))} className="flex-1 py-1 text-xs border rounded-lg hover:bg-muted transition-all">{n}</button>
            ))}
          </div>
        </div>

        {/* Price fields */}
        {orderType !== 'market' && (
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              {orderType === 'stop_loss_market' ? 'Trigger Price' : 'Limit Price'}
            </Label>
            <Input
              type="number"
              value={limitPrice}
              onChange={e => setLimitPrice(e.target.value)}
              placeholder={`₹${stock.price.toFixed(2)}`}
            />
          </div>
        )}
        {(orderType === 'stop_loss' || orderType === 'stop_loss_market') && (
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">Stop Loss Price</Label>
            <Input type="number" value={slPrice} onChange={e => setSlPrice(e.target.value)} placeholder="Enter stop loss" />
          </div>
        )}

        {/* Summary */}
        <div className="bg-muted/50 rounded-xl p-3 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price</span>
            <span className="font-medium">₹{execPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quantity</span>
            <span className="font-medium">{qty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Charges</span>
            <span className="font-medium">₹{charges.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-1.5 font-bold">
            <span>{tradeType === 'buy' ? 'Total Payable' : 'You Receive'}</span>
            <span className={tradeType === 'buy' ? 'loss-text' : 'gain-text'}>
              ₹{Math.abs(total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Balance */}
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Available Balance</span>
          <span className="font-semibold text-primary">₹{(user?.virtualBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-loss text-sm bg-loss/10 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit */}
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-3 text-center text-gain font-semibold bg-gain/10 rounded-xl"
            >
              ✅ Order Executed Successfully!
            </motion.div>
          ) : (
            <Button
              onClick={handleSubmit}
              className={`w-full py-3 text-base font-bold rounded-xl ${tradeType === 'buy' ? 'bg-gain hover:bg-gain/90 text-white' : 'bg-loss hover:bg-loss/90 text-white'}`}
            >
              {tradeType === 'buy' ? `Buy ${qty > 0 ? qty : ''} ${symbol}` : `Sell ${qty > 0 ? qty : ''} ${symbol}`}
            </Button>
          )}
        </AnimatePresence>

        <p className="text-xs text-center text-muted-foreground">Paper trading only • No real money involved</p>
      </div>
    </div>
  );
}
