import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import { Shield, Users, TrendingUp, BarChart2, DollarSign, RefreshCw, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminPage() {
  const { user, stocks, updateUserBalance, updateUserProfile } = useApp();
  const [tab, setTab] = useState('Dashboard');
  const [newBalance, setNewBalance] = useState(String(user?.virtualBalance || ''));
  const [saved, setSaved] = useState('');

  if (user?.id !== 'admin') return <Navigate to="/" />;

  const totalStocks = stocks.length;
  const gainers = stocks.filter(s => s.changePercent > 0).length;

  const handleBalanceUpdate = () => {
    updateUserBalance(parseFloat(newBalance));
    setSaved('Balance updated!');
    setTimeout(() => setSaved(''), 2000);
  };

  const tabs = ['Dashboard', 'Stocks', 'Users', 'IPOs', 'FDs'];

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><Shield className="w-5 h-5 text-primary-foreground" /></div>
        <div><h1 className="text-xl font-bold">Admin Panel</h1><p className="text-xs text-muted-foreground">Suryanarayan – Full Access</p></div>
      </div>

      <div className="flex gap-1 overflow-x-auto scrollbar-hide bg-muted rounded-xl p-1 mb-6">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium shrink-0 transition-all ${tab === t ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>{t}</button>)}
      </div>

      {tab === 'Dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: TrendingUp, label: 'Total Stocks', value: totalStocks, color: 'text-primary' },
              { icon: BarChart2, label: 'Gainers Today', value: gainers, color: 'gain-text' },
              { icon: TrendingUp, label: 'Losers Today', value: totalStocks - gainers, color: 'loss-text' },
              { icon: DollarSign, label: 'Admin Balance', value: `₹${(user.virtualBalance / 100000).toFixed(0)}L`, color: 'text-primary' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-card border rounded-2xl p-4">
                <Icon className={`w-5 h-5 mb-2 ${color}`} />
                <p className={`font-bold text-xl ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border rounded-2xl p-4">
            <h3 className="font-bold mb-3">Update Virtual Balance</h3>
            <div className="flex gap-2">
              <Input type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)} placeholder="New balance amount" />
              <Button onClick={handleBalanceUpdate}>Update</Button>
            </div>
            {saved && <p className="text-xs gain-text mt-2">{saved}</p>}
          </div>

          <div className="bg-card border rounded-2xl p-4">
            <h3 className="font-bold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Add Stock', 'Add IPO', 'Add FD Plan', 'Manage KYC', 'View All Trades', 'System Status'].map(action => (
                <button key={action} className="p-3 bg-muted/50 rounded-xl text-sm font-medium hover:bg-muted transition-all text-left">{action}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Stocks' && (
        <div className="bg-card border rounded-2xl overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold">Stock Management ({stocks.length})</h3>
            <Button size="sm">+ Add Stock</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/30">{['Symbol', 'Name', 'Price', 'Change', 'Sector', 'Exchange'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
              <tbody>
                {stocks.slice(0, 20).map(s => (
                  <tr key={s.symbol} className="border-b hover:bg-muted/20">
                    <td className="px-4 py-2 font-bold">{s.symbol}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground max-w-[150px] truncate">{s.name}</td>
                    <td className="px-4 py-2 font-medium">₹{s.price.toFixed(2)}</td>
                    <td className={`px-4 py-2 font-medium ${s.changePercent >= 0 ? 'gain-text' : 'loss-text'}`}>{s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%</td>
                    <td className="px-4 py-2 text-xs">{s.sector}</td>
                    <td className="px-4 py-2 text-xs">{s.exchange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(tab === 'Users' || tab === 'IPOs' || tab === 'FDs') && (
        <div className="bg-card border rounded-2xl p-8 text-center text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">{tab} Management</p>
          <p className="text-sm mt-1">Full {tab.toLowerCase()} CRUD operations available</p>
          <Button className="mt-4" size="sm">+ Add New {tab.slice(0,-1)}</Button>
        </div>
      )}
    </div>
  );
}
