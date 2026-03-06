import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/marketData';
import { TrendingUp, TrendingDown, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const TABS = ['Overview', 'Stocks', 'Mutual Funds', 'FDs', 'Gold & Silver', 'Dividends', 'Trade History'];
const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'];

export default function PortfolioPage() {
  const { holdings, orders, mutualFunds, fdInvestments, goldHolding, silverHolding, user, exitPosition, dividendHistory } = useApp();
  const [tab, setTab] = useState('Overview');

  const totalInvested = holdings.reduce((s, h) => s + h.avgPrice * h.quantity, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.currentPrice * h.quantity, 0);
  const pnl = totalCurrent - totalInvested;
  const pnlPct = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;

  const mfValue = mutualFunds.reduce((s, f) => s + f.units * f.nav, 0);
  const mfInvested = mutualFunds.reduce((s, f) => s + f.invested, 0);
  const fdValue = fdInvestments.reduce((s, f) => s + f.principal, 0);
  const goldValue = goldHolding.grams * goldHolding.currentPrice;
  const silverValue = silverHolding.grams * silverHolding.currentPrice;
  const totalDividendsEarned = dividendHistory.reduce((s, d) => s + d.amount, 0);

  const overviewData = [
    { name: 'Stocks', value: parseFloat(totalCurrent.toFixed(0)) },
    { name: 'Mutual Funds', value: parseFloat(mfValue.toFixed(0)) },
    { name: 'Fixed Deposits', value: fdValue },
    { name: 'Gold', value: parseFloat(goldValue.toFixed(0)) },
    { name: 'Silver', value: parseFloat(silverValue.toFixed(0)) },
    { name: 'Cash', value: parseFloat((user?.virtualBalance || 0).toFixed(0)) },
  ].filter(d => d.value > 0);

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <button className="flex items-center gap-1.5 text-sm text-primary font-medium">
          <Download className="w-4 h-4" /> Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Invested', value: formatCurrency(totalInvested + mfInvested + fdValue + goldHolding.invested + silverHolding.invested) },
          { label: 'Current Value', value: formatCurrency(totalCurrent + mfValue + fdValue + goldValue + silverValue) },
          { label: 'Total P&L', value: `${pnl >= 0 ? '+' : ''}₹${Math.abs(pnl).toFixed(0)}`, isGain: pnl >= 0 },
          { label: 'Dividends Earned', value: `₹${totalDividendsEarned.toFixed(0)}`, isGain: true },
        ].map(({ label, value, isGain }) => (
          <div key={label} className="bg-card border rounded-xl p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`font-bold text-base mt-0.5 ${isGain !== undefined ? (isGain ? 'gain-text' : 'loss-text') : ''}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Allocation Pie */}
      {overviewData.length > 0 && (
        <div className="bg-card border rounded-2xl p-4 mb-4">
          <h3 className="font-bold mb-3">Asset Allocation</h3>
          <div className="w-full" style={{ height: 200 }}>
            <ResponsiveContainer>
              <PieChart><Pie data={overviewData} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                {overviewData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} /><Legend /></PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide bg-muted rounded-xl p-1 mb-4">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${tab === t ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'Overview' && (
        <div className="space-y-3">
          {[
            { label: 'Stocks', value: totalCurrent, invested: totalInvested, icon: '📈', count: holdings.length },
            { label: 'Mutual Funds', value: mfValue, invested: mfInvested, icon: '📊', count: mutualFunds.length },
            { label: 'Fixed Deposits', value: fdValue, invested: fdValue, icon: '🏦', count: fdInvestments.length },
            { label: 'Digital Gold', value: goldValue, invested: goldHolding.invested, icon: '🥇', count: goldHolding.grams > 0 ? 1 : 0 },
            { label: 'Digital Silver', value: silverValue, invested: silverHolding.invested, icon: '🥈', count: silverHolding.grams > 0 ? 1 : 0 },
            { label: 'Dividends Earned', value: totalDividendsEarned, invested: 0, icon: '💰', count: dividendHistory.length },
          ].map(item => (
            <div key={item.label} className="bg-card border rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.count} {item.label === 'Dividends Earned' ? 'payouts' : 'holdings'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">₹{item.value.toFixed(0)}</p>
                {item.invested > 0 && (
                  <p className={`text-xs font-medium ${item.value >= item.invested ? 'gain-text' : 'loss-text'}`}>
                    {item.value >= item.invested ? '+' : ''}{(((item.value - item.invested) / item.invested) * 100).toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stocks */}
      {tab === 'Stocks' && (
        <div className="bg-card border rounded-2xl overflow-hidden">
          {holdings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No stock holdings yet. Start trading!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b bg-muted/30">
                  {['Stock', 'Qty', 'Avg Price', 'LTP', 'Invested', 'Current', 'P&L', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {holdings.map(h => {
                    const inv = h.avgPrice * h.quantity;
                    const cur = h.currentPrice * h.quantity;
                    const pl = cur - inv;
                    return (
                      <tr key={h.symbol} className="border-b hover:bg-muted/20 transition-all">
                        <td className="px-4 py-3 font-semibold">{h.symbol}<br /><span className="text-xs text-muted-foreground font-normal">{h.name}</span></td>
                        <td className="px-4 py-3">{h.quantity}</td>
                        <td className="px-4 py-3">₹{h.avgPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 font-semibold">₹{h.currentPrice.toFixed(2)}</td>
                        <td className="px-4 py-3">₹{inv.toFixed(0)}</td>
                        <td className="px-4 py-3">₹{cur.toFixed(0)}</td>
                        <td className={`px-4 py-3 font-semibold ${pl >= 0 ? 'gain-text' : 'loss-text'}`}>
                          {pl >= 0 ? '+' : ''}₹{Math.abs(pl).toFixed(0)}
                          <br /><span className="text-xs">{pl >= 0 ? '+' : ''}{((pl / inv) * 100).toFixed(1)}%</span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => exitPosition(h.symbol, h.quantity)}
                            className="text-xs bg-loss/10 text-loss px-2 py-1 rounded-lg hover:bg-loss/20 transition-all">Exit</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Mutual Funds */}
      {tab === 'Mutual Funds' && (
        <div className="space-y-3">
          {mutualFunds.length === 0
            ? <div className="p-8 text-center bg-card border rounded-2xl text-muted-foreground">No mutual fund investments yet.</div>
            : mutualFunds.map(f => {
              const cur = f.units * f.nav;
              const pl = cur - f.invested;
              return (
                <div key={f.id} className="bg-card border rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 pr-2"><p className="font-semibold text-sm">{f.name}</p><p className="text-xs text-muted-foreground">{f.subCategory} · NAV ₹{f.nav.toFixed(2)}</p></div>
                    <div className="text-right shrink-0"><p className="font-bold">₹{cur.toFixed(0)}</p><p className={`text-xs font-medium ${pl >= 0 ? 'gain-text' : 'loss-text'}`}>{pl >= 0 ? '+' : ''}₹{Math.abs(pl).toFixed(0)}</p></div>
                  </div>
                  {f.sipAmount && <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">SIP ₹{f.sipAmount}/mo</span><span>on {f.sipDate}th</span></div>}
                </div>
              );
            })
          }
        </div>
      )}

      {/* FDs */}
      {tab === 'FDs' && (
        <div className="space-y-3">
          {fdInvestments.length === 0
            ? <div className="p-8 text-center bg-card border rounded-2xl text-muted-foreground">No fixed deposits yet.</div>
            : fdInvestments.map(fd => (
              <div key={fd.id} className="bg-card border rounded-2xl p-4">
                <div className="flex justify-between">
                  <div><p className="font-semibold">{fd.bank}</p><p className="text-xs text-muted-foreground">{fd.rating} · {fd.interestRate}% p.a.</p></div>
                  <div className="text-right"><p className="font-bold">₹{fd.principal.toLocaleString('en-IN')}</p><p className="text-xs gain-text">Matures: ₹{fd.maturityAmount.toLocaleString('en-IN')}</p></div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Maturity: {new Date(fd.maturityDate).toLocaleDateString('en-IN')}</div>
              </div>
            ))
          }
        </div>
      )}

      {/* Gold & Silver */}
      {tab === 'Gold & Silver' && (
        <div className="space-y-3">
          {goldHolding.grams > 0 && (
            <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/5 border border-yellow-400/30 rounded-2xl p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">🥇 Gold Holdings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[['Quantity', `${goldHolding.grams.toFixed(4)}g`], ['Avg Buy Price', `₹${goldHolding.avgBuyPrice.toFixed(0)}/g`], ['Current Price', `₹${goldHolding.currentPrice.toFixed(0)}/g`], ['Current Value', `₹${goldValue.toFixed(0)}`]].map(([k, v]) => (
                  <div key={k} className="bg-background/50 rounded-xl p-3"><p className="text-xs text-muted-foreground">{k}</p><p className="font-bold">{v}</p></div>
                ))}
              </div>
            </div>
          )}
          {silverHolding.grams > 0 && (
            <div className="bg-gradient-to-br from-slate-400/10 to-slate-600/5 border border-slate-400/30 rounded-2xl p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2">🥈 Silver Holdings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[['Quantity', `${silverHolding.grams.toFixed(4)}g`], ['Avg Buy Price', `₹${silverHolding.avgBuyPrice.toFixed(0)}/g`], ['Current Price', `₹${silverHolding.currentPrice.toFixed(0)}/g`], ['Current Value', `₹${silverValue.toFixed(0)}`]].map(([k, v]) => (
                  <div key={k} className="bg-background/50 rounded-xl p-3"><p className="text-xs text-muted-foreground">{k}</p><p className="font-bold">{v}</p></div>
                ))}
              </div>
            </div>
          )}
          {goldHolding.grams === 0 && silverHolding.grams === 0 && (
            <div className="p-8 text-center bg-card border rounded-2xl text-muted-foreground">No gold or silver holdings yet.</div>
          )}
        </div>
      )}

      {/* Dividends */}
      {tab === 'Dividends' && (
        <div>
          {dividendHistory.length === 0 ? (
            <div className="bg-card border rounded-2xl p-8 text-center text-muted-foreground">
              <p className="text-4xl mb-3">💰</p>
              <p className="font-semibold mb-1">No dividends yet</p>
              <p className="text-sm">Hold dividend-paying stocks for quarterly payouts. High yield stocks: COALINDIA, ONGC, BPCL, POWERGRID</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-gain/10 to-gain/5 border border-gain/20 rounded-2xl p-4 mb-2">
                <p className="text-sm text-muted-foreground">Total Dividends Earned</p>
                <p className="text-2xl font-bold gain-text">₹{totalDividendsEarned.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">Credited directly to your virtual balance</p>
              </div>
              {dividendHistory.map(d => (
                <div key={d.id} className="bg-card border rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{d.symbol}</p>
                    <p className="text-xs text-muted-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">₹{d.perShare.toFixed(2)}/share × {d.shares} shares</p>
                    <p className="text-xs text-muted-foreground">{new Date(d.creditedAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold gain-text">+₹{d.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Dividend</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trade History */}
      {tab === 'Trade History' && (
        <div className="bg-card border rounded-2xl overflow-hidden">
          {orders.length === 0
            ? <div className="p-8 text-center text-muted-foreground">No trades yet.</div>
            : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b bg-muted/30">
                    {['Order ID', 'Stock', 'Type', 'Qty', 'Price', 'Total', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-b hover:bg-muted/20">
                        <td className="px-4 py-3 text-xs text-muted-foreground">{o.id.slice(0, 12)}</td>
                        <td className="px-4 py-3 font-semibold">{o.symbol}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${o.type === 'buy' ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'}`}>{o.type.toUpperCase()}</span></td>
                        <td className="px-4 py-3">{o.quantity}</td>
                        <td className="px-4 py-3">₹{o.price.toFixed(2)}</td>
                        <td className="px-4 py-3">₹{(o.price * o.quantity).toFixed(0)}</td>
                        <td className="px-4 py-3"><span className="text-xs bg-gain/10 text-gain px-2 py-0.5 rounded">{o.status}</span></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.timestamp).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}
