import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import { Shield, Users, TrendingUp, BarChart2, Lock, Edit, Trash2, Plus, Save, X, BookOpen, Eye, EyeOff, AlertTriangle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ADMIN_LOCK_SECONDS = 30;

const TIPS_CONTENT = `
# 💡 Permanent Income Strategy Guide

## 🏦 Fixed Deposit (FD) Dividend Income
- **Compounding FD**: Re-invest interest every year. ₹1L at 8.5% compounded = ~₹1.39L in 4 years.
- **FD Ladder Strategy**: Split ₹5L into 5 FDs maturing every year. Always have liquid + earning money.
- **Monthly Interest FD**: Choose monthly payout option for regular income.
- **Best Rates**: 356 days @ 8%, 399 days @ 8.5% — highest guaranteed returns.

## 📊 SIP & Mutual Fund Dividend Strategy
- **Dividend Option Funds**: IDCW (Income Distribution cum Capital Withdrawal) funds pay regular dividends.
- **Debt Funds**: Safer, give ~7-9% returns with lower volatility.
- **SIP Power**: ₹5,000/month SIP in Nifty 50 for 20 years = ~₹50L+ (12% CAGR).
- **Top Dividend MFs**: HDFC Dividend Yield, ICICI Pru Dividend Yield Equity.

## 🏛️ Government Bond Coupon Income
- **Coupon = Fixed Interest**: 7.1% GOI bond pays ₹710 every year on ₹10,000 face value.
- **Annual Income Formula**: (Coupon Rate × Principal) / 100
- **Best Bonds for Income**: REC, NHAI, SBI AT1 bonds (8-8.5% coupons).
- **Hold to Maturity**: Get face value back + all coupons = zero risk on principal.

## 🥇 Gold Investment Tips  
- **Buy on Dips**: Gold rises during market uncertainty. Buy < ₹7,000/g for long-term holds.
- **Digital Gold Advantage**: No making charges, 24K purity guaranteed.
- **Allocation**: Keep 10-15% portfolio in gold as hedge.
- **Silver**: More volatile, 3-5x returns possible during bull runs.

## 📈 Stock Dividend Income
- **High Dividend Yield Stocks**: COALINDIA (6%), ONGC (5%), BPCL (5%), POWERGRID (4%).
- **Dividend Aristocrats**: Companies that increase dividends every year.
- **Ex-Dividend Date**: Buy BEFORE this date to receive dividend.
- **DRIP Strategy**: Reinvest all dividends to compound wealth.

## 🔄 Permanent Loop Income Strategy
1. **Month 1-12**: Invest ₹20,000/month in SIP + ₹5,000 in FD
2. **Year 2**: Use FD maturity to buy bonds for coupon income
3. **Year 3**: Bond coupons + SIP dividends fund new FDs
4. **Result**: Self-sustaining income loop with minimal new investment!

## 💰 Monthly Income Calculator
| Investment | Amount | Monthly Income |
|-----------|--------|----------------|
| FD (8.5%) | ₹10L | ~₹7,083 |
| Bonds (7.5%) | ₹10L | ~₹6,250 |
| Div Stocks | ₹10L | ~₹3,000-8,000 |
| **Total** | **₹30L** | **~₹16,000-21,000** |

## 🎯 Quick Tips
- Diversify: Never put >20% in single asset
- Reinvest for 10 years = 2-3x wealth multiplication
- Tax-saving FDs: 5-year FD under 80C saves tax too
- Emergency Fund: Always keep 6 months expenses in liquid FD
`;

export default function AdminPage() {
  const { user, stocks, updateUserBalance, updateUserProfile, adminUpdateStock, adminChangePassword, getAllUsers, adminDeleteUser, adminUpdateUser, addUserBalance } = useApp();
  const [tab, setTab] = useState('Dashboard');
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(ADMIN_LOCK_SECONDS);
  const [unlockPass, setUnlockPass] = useState('');
  const [lockError, setLockError] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef(Date.now());

  // Auto-lock on inactivity
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setLockTimer(ADMIN_LOCK_SECONDS);
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart'];
    events.forEach(e => document.addEventListener(e, resetTimer));
    return () => events.forEach(e => document.removeEventListener(e, resetTimer));
  }, [resetTimer]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      const remaining = ADMIN_LOCK_SECONDS - elapsed;
      if (remaining <= 0) {
        setIsLocked(true);
        setLockTimer(0);
      } else {
        setLockTimer(remaining);
      }
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  if (user?.id !== 'admin') return <Navigate to="/" />;

  const handleUnlock = () => {
    const savedPass = localStorage.getItem('surya_admin_password') || 'Suryanarayan@123';
    if (unlockPass === savedPass) {
      setIsLocked(false);
      resetTimer();
      setUnlockPass('');
      setLockError('');
    } else {
      setLockError('Incorrect password');
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card border rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-1">Admin Panel Locked</h2>
          <p className="text-sm text-muted-foreground mb-5">Session locked due to inactivity. Enter password to continue.</p>
          <Input type="password" value={unlockPass} onChange={e => setUnlockPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUnlock()} placeholder="Admin password" className="mb-3" />
          {lockError && <p className="text-xs text-loss mb-2">{lockError}</p>}
          <Button className="w-full" onClick={handleUnlock}>Unlock</Button>
        </div>
      </div>
    );
  }

  const tabs = ['Dashboard', 'Stocks', 'Users', 'IPOs', 'FDs', 'Change Password', 'Tips'];
  const totalStocks = stocks.length;
  const gainers = stocks.filter(s => s.changePercent > 0).length;
  const allUsers = getAllUsers();

  return (
    <div className="container mx-auto px-4 py-6 pb-24 lg:pb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><Shield className="w-5 h-5 text-primary-foreground" /></div>
          <div><h1 className="text-xl font-bold">Admin Panel</h1><p className="text-xs text-muted-foreground">Suryanarayan – Full Access</p></div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-xs px-2 py-1 rounded-lg font-medium ${lockTimer <= 10 ? 'bg-loss/10 text-loss' : 'bg-muted text-muted-foreground'}`}>
            🔒 Lock in {lockTimer}s
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsLocked(true)}><Lock className="w-3 h-3 mr-1" />Lock</Button>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto scrollbar-hide bg-muted rounded-xl p-1 mb-6">
        {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 rounded-lg text-sm font-medium shrink-0 transition-all ${tab === t ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>{t}</button>)}
      </div>

      {tab === 'Dashboard' && <AdminDashboard stocks={stocks} gainers={gainers} totalStocks={totalStocks} user={user} updateUserBalance={updateUserBalance} allUsers={allUsers} />}
      {tab === 'Stocks' && <AdminStocks stocks={stocks} adminUpdateStock={adminUpdateStock} />}
      {tab === 'Users' && <AdminUsers allUsers={allUsers} adminDeleteUser={adminDeleteUser} adminUpdateUser={adminUpdateUser} addUserBalance={addUserBalance} />}
      {tab === 'IPOs' && <AdminIPOs />}
      {tab === 'FDs' && <AdminFDs />}
      {tab === 'Change Password' && <AdminChangePassword adminChangePassword={adminChangePassword} />}
      {tab === 'Tips' && <AdminTips />}
    </div>
  );
}

function AdminDashboard({ stocks, gainers, totalStocks, user, updateUserBalance, allUsers }: {
  stocks: ReturnType<typeof useApp>['stocks'];
  gainers: number; totalStocks: number;
  user: ReturnType<typeof useApp>['user'];
  updateUserBalance: ReturnType<typeof useApp>['updateUserBalance'];
  allUsers: { email: string; password: string; user: import('@/context/AppContext').User }[];
}) {
  const [newBalance, setNewBalance] = useState(String(user?.virtualBalance || ''));
  const [saved, setSaved] = useState('');

  const handleBalanceUpdate = () => {
    updateUserBalance(parseFloat(newBalance));
    setSaved('Balance updated!');
    setTimeout(() => setSaved(''), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: 'Total Stocks', value: totalStocks, color: 'text-primary' },
          { icon: BarChart2, label: 'Gainers Today', value: gainers, color: 'text-gain' },
          { icon: TrendingUp, label: 'Losers Today', value: totalStocks - gainers, color: 'text-loss' },
          { icon: Users, label: 'Registered Users', value: (allUsers as unknown[]).length, color: 'text-primary' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-card border rounded-2xl p-4">
            <Icon className={`w-5 h-5 mb-2 ${color}`} />
            <p className={`font-bold text-xl ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border rounded-2xl p-4">
        <h3 className="font-bold mb-3">Update Admin Virtual Balance</h3>
        <div className="flex gap-2">
          <Input type="number" value={newBalance} onChange={e => setNewBalance(e.target.value)} placeholder="New balance amount" />
          <Button onClick={handleBalanceUpdate}>Update</Button>
        </div>
        {saved && <p className="text-xs text-gain mt-2">{saved}</p>}
      </div>

      <div className="bg-card border rounded-2xl p-4">
        <h3 className="font-bold mb-3">Top Performing Stocks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/30">
              {['Symbol', 'Price', 'Change', 'Volume'].map(h => <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">{h}</th>)}
            </tr></thead>
            <tbody>
              {[...stocks].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 8).map(s => (
                <tr key={s.symbol} className="border-b hover:bg-muted/20">
                  <td className="px-3 py-2 font-bold">{s.symbol}</td>
                  <td className="px-3 py-2">₹{s.price.toFixed(2)}</td>
                  <td className={`px-3 py-2 font-medium ${s.changePercent >= 0 ? 'text-gain' : 'text-loss'}`}>{s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{(s.volume / 1000).toFixed(0)}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminStocks({ stocks, adminUpdateStock }: {
  stocks: ReturnType<typeof useApp>['stocks'];
  adminUpdateStock: ReturnType<typeof useApp>['adminUpdateStock'];
}) {
  const [editingSymbol, setEditingSymbol] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState('');

  const filtered = stocks.filter(s =>
    s.symbol.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (symbol: string) => {
    const p = parseFloat(editPrice);
    if (p > 0) {
      adminUpdateStock(symbol, { price: p });
      setSaved(`${symbol} updated to ₹${p}`);
      setTimeout(() => setSaved(''), 2000);
    }
    setEditingSymbol(null);
  };

  return (
    <div className="bg-card border rounded-2xl overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center gap-3 flex-wrap">
        <h3 className="font-bold">Stock Management ({stocks.length})</h3>
        <div className="flex gap-2">
          <Input placeholder="Search stocks..." value={search} onChange={e => setSearch(e.target.value)} className="w-48" />
        </div>
      </div>
      {saved && <div className="px-4 py-2 bg-gain/10 text-gain text-sm">{saved}</div>}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card"><tr className="border-b bg-muted/30">
            {['Symbol', 'Name', 'Price', 'Change%', 'Cap', 'Exchange', 'Action'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.symbol} className="border-b hover:bg-muted/20">
                <td className="px-4 py-2 font-bold">{s.symbol}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground max-w-[150px] truncate">{s.name}</td>
                <td className="px-4 py-2 font-medium">
                  {editingSymbol === s.symbol ? (
                    <Input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="w-24 h-7 text-xs" autoFocus />
                  ) : `₹${s.price.toFixed(2)}`}
                </td>
                <td className={`px-4 py-2 font-medium text-xs ${s.changePercent >= 0 ? 'text-gain' : 'text-loss'}`}>{s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%</td>
                <td className="px-4 py-2 text-xs">{s.capCategory}</td>
                <td className="px-4 py-2 text-xs">{s.exchange}</td>
                <td className="px-4 py-2">
                  {editingSymbol === s.symbol ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleSave(s.symbol)} className="p-1 rounded bg-gain/10 text-gain hover:bg-gain/20"><Save className="w-3 h-3" /></button>
                      <button onClick={() => setEditingSymbol(null)} className="p-1 rounded bg-muted hover:bg-muted/80"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditingSymbol(s.symbol); setEditPrice(String(s.price)); }} className="p-1 rounded bg-primary/10 text-primary hover:bg-primary/20">
                      <Edit className="w-3 h-3" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminUsers({ allUsers, adminDeleteUser, adminUpdateUser, addUserBalance }: {
  allUsers: { email: string; password: string; user: import('@/context/AppContext').User }[];
  adminDeleteUser: ReturnType<typeof useApp>['adminDeleteUser'];
  adminUpdateUser: ReturnType<typeof useApp>['adminUpdateUser'];
  addUserBalance: ReturnType<typeof useApp>['addUserBalance'];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<import('@/context/AppContext').User>>({});
  const [addAmount, setAddAmount] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saved, setSaved] = useState('');

  const handleSave = (userId: string) => {
    adminUpdateUser(userId, editData);
    setSaved('User updated!');
    setTimeout(() => setSaved(''), 2000);
    setEditingId(null);
  };

  const handleAddBalance = (userId: string) => {
    const amt = parseFloat(addAmount);
    if (amt > 0) {
      addUserBalance(userId, amt);
      setSaved(`Added ₹${amt.toLocaleString('en-IN')} to user`);
      setTimeout(() => setSaved(''), 2000);
    }
    setSelectedUserId(null);
    setAddAmount('');
  };

  if (allUsers.length === 0) {
    return (
      <div className="bg-card border rounded-2xl p-8 text-center text-muted-foreground">
        <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No registered users yet</p>
        <p className="text-sm mt-1">Users who sign up will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {saved && <div className="px-4 py-2 bg-gain/10 text-gain text-sm rounded-lg">{saved}</div>}
      {allUsers.map(({ user }) => (
        <div key={user.id} className="bg-card border rounded-2xl p-4">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{user.name.charAt(0)}</div>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${user.kycStatus === 'approved' ? 'bg-gain/10 text-gain' : 'bg-warning/10 text-warning'}`}>KYC {user.kycStatus}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">₹{(user.virtualBalance || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => { setEditingId(user.id); setEditData({ name: user.name, kycStatus: user.kycStatus }); }} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"><Edit className="w-3 h-3" /></button>
              <button onClick={() => setSelectedUserId(user.id)} className="p-1.5 rounded-lg bg-gain/10 text-gain hover:bg-gain/20"><Wallet className="w-3 h-3" /></button>
              <button onClick={() => setConfirmDelete(user.id)} className="p-1.5 rounded-lg bg-loss/10 text-loss hover:bg-loss/20"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>

          {editingId === user.id && (
            <div className="mt-3 pt-3 border-t space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div><Label className="text-xs">Name</Label><Input value={editData.name || ''} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} className="h-8 text-xs mt-1" /></div>
                <div><Label className="text-xs">KYC Status</Label>
                  <select value={editData.kycStatus || 'pending'} onChange={e => setEditData(d => ({ ...d, kycStatus: e.target.value as 'pending' | 'approved' | 'rejected' }))}
                    className="w-full h-8 text-xs mt-1 border rounded-md bg-background px-2">
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSave(user.id)}><Save className="w-3 h-3 mr-1" />Save</Button>
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}><X className="w-3 h-3 mr-1" />Cancel</Button>
              </div>
            </div>
          )}

          {selectedUserId === user.id && (
            <div className="mt-3 pt-3 border-t space-y-2">
              <Label className="text-xs">Add Virtual Balance</Label>
              <div className="flex gap-2">
                <Input type="number" value={addAmount} onChange={e => setAddAmount(e.target.value)} placeholder="Amount to add" className="h-8 text-xs" />
                <Button size="sm" onClick={() => handleAddBalance(user.id)}>Add</Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedUserId(null)}>Cancel</Button>
              </div>
              <div className="flex gap-1 flex-wrap">
                {[10000, 50000, 100000, 500000].map(v => (
                  <button key={v} onClick={() => setAddAmount(String(v))} className="text-xs px-2 py-1 bg-muted rounded-lg hover:bg-muted/80">+₹{(v/1000).toFixed(0)}K</button>
                ))}
              </div>
            </div>
          )}

          {confirmDelete === user.id && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex items-center gap-2 text-loss text-sm mb-2"><AlertTriangle className="w-4 h-4" /><span>Delete this user account permanently?</span></div>
              <div className="flex gap-2">
                <Button size="sm" variant="destructive" onClick={() => { adminDeleteUser(user.id); setConfirmDelete(null); setSaved('User deleted'); setTimeout(() => setSaved(''), 2000); }}>Yes, Delete</Button>
                <Button size="sm" variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AdminIPOs() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [lotSize, setLotSize] = useState('');
  const [saved, setSaved] = useState('');
  const [ipos, setIpos] = useState<{ name: string; price: string; lotSize: string; id: string }[]>(
    JSON.parse(localStorage.getItem('admin_ipos') || '[]')
  );

  const handleAdd = () => {
    if (!name || !price || !lotSize) return;
    const newIPO = { name, price, lotSize, id: Date.now().toString() };
    const updated = [...ipos, newIPO];
    setIpos(updated);
    localStorage.setItem('admin_ipos', JSON.stringify(updated));
    setSaved(`IPO "${name}" added!`);
    setTimeout(() => setSaved(''), 2000);
    setName(''); setPrice(''); setLotSize('');
  };

  const handleDelete = (id: string) => {
    const updated = ipos.filter(i => i.id !== id);
    setIpos(updated);
    localStorage.setItem('admin_ipos', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border rounded-2xl p-4">
        <h3 className="font-bold mb-3">Add New IPO</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><Label className="text-xs">Company Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Company Name" className="mt-1" /></div>
          <div><Label className="text-xs">Issue Price (₹)</Label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Issue Price" className="mt-1" /></div>
          <div><Label className="text-xs">Lot Size</Label><Input type="number" value={lotSize} onChange={e => setLotSize(e.target.value)} placeholder="Lot Size" className="mt-1" /></div>
        </div>
        <Button className="mt-3" onClick={handleAdd}><Plus className="w-4 h-4 mr-1" />Add IPO</Button>
        {saved && <p className="text-xs text-gain mt-2">{saved}</p>}
      </div>

      {ipos.length > 0 && (
        <div className="bg-card border rounded-2xl overflow-hidden">
          <div className="p-4 border-b"><h3 className="font-bold">Admin-Added IPOs ({ipos.length})</h3></div>
          {ipos.map(ipo => (
            <div key={ipo.id} className="flex items-center justify-between p-4 border-b hover:bg-muted/20">
              <div><p className="font-semibold">{ipo.name}</p><p className="text-xs text-muted-foreground">₹{ipo.price} · {ipo.lotSize} lot size</p></div>
              <button onClick={() => handleDelete(ipo.id)} className="p-1.5 rounded-lg bg-loss/10 text-loss hover:bg-loss/20"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminFDs() {
  const [bank, setBank] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [tenureUnit, setTenureUnit] = useState<'days' | 'months' | 'years'>('days');
  const [rating, setRating] = useState('AAA');
  const [saved, setSaved] = useState('');
  const [fds, setFds] = useState<{ bank: string; rate: string; tenure: string; unit: string; rating: string; id: string }[]>(
    JSON.parse(localStorage.getItem('admin_fds') || '[]')
  );

  const handleAdd = () => {
    if (!bank || !rate || !tenure) return;
    const newFD = { bank, rate, tenure, unit: tenureUnit, rating, id: Date.now().toString() };
    const updated = [...fds, newFD];
    setFds(updated);
    localStorage.setItem('admin_fds', JSON.stringify(updated));
    setSaved(`FD plan for "${bank}" added!`);
    setTimeout(() => setSaved(''), 2000);
    setBank(''); setRate(''); setTenure('');
  };

  const handleDelete = (id: string) => {
    const updated = fds.filter(f => f.id !== id);
    setFds(updated);
    localStorage.setItem('admin_fds', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border rounded-2xl p-4">
        <h3 className="font-bold mb-3">Add New FD Plan</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div><Label className="text-xs">Bank Name</Label><Input value={bank} onChange={e => setBank(e.target.value)} placeholder="Bank Name" className="mt-1" /></div>
          <div><Label className="text-xs">Interest Rate (%)</Label><Input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} placeholder="Rate %" className="mt-1" /></div>
          <div><Label className="text-xs">Tenure</Label><Input type="number" value={tenure} onChange={e => setTenure(e.target.value)} placeholder="Tenure" className="mt-1" /></div>
          <div><Label className="text-xs">Unit</Label>
            <select value={tenureUnit} onChange={e => setTenureUnit(e.target.value as 'days' | 'months' | 'years')} className="w-full border rounded-md bg-background px-2 h-10 mt-1 text-sm">
              <option value="days">Days</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
          <div><Label className="text-xs">Rating</Label>
            <select value={rating} onChange={e => setRating(e.target.value)} className="w-full border rounded-md bg-background px-2 h-10 mt-1 text-sm">
              <option value="AAA">AAA</option>
              <option value="AA+">AA+</option>
              <option value="AA">AA</option>
            </select>
          </div>
        </div>
        <Button className="mt-3" onClick={handleAdd}><Plus className="w-4 h-4 mr-1" />Add FD Plan</Button>
        {saved && <p className="text-xs text-gain mt-2">{saved}</p>}
      </div>

      {fds.length > 0 && (
        <div className="bg-card border rounded-2xl overflow-hidden">
          <div className="p-4 border-b"><h3 className="font-bold">Admin-Added FD Plans ({fds.length})</h3></div>
          {fds.map(fd => (
            <div key={fd.id} className="flex items-center justify-between p-4 border-b hover:bg-muted/20">
              <div><p className="font-semibold">{fd.bank}</p><p className="text-xs text-muted-foreground">{fd.rate}% p.a. · {fd.tenure} {fd.unit} · {fd.rating}</p></div>
              <button onClick={() => handleDelete(fd.id)} className="p-1.5 rounded-lg bg-loss/10 text-loss hover:bg-loss/20"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminChangePassword({ adminChangePassword }: { adminChangePassword: (p: string) => void }) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);

  const handleChange = () => {
    const savedPass = localStorage.getItem('surya_admin_password') || 'Suryanarayan@123';
    if (current !== savedPass) { setMsg('Current password incorrect'); return; }
    if (newPass.length < 8) { setMsg('New password must be at least 8 characters'); return; }
    if (newPass !== confirm) { setMsg('Passwords do not match'); return; }
    adminChangePassword(newPass);
    setMsg('Password changed successfully!');
    setCurrent(''); setNewPass(''); setConfirm('');
  };

  return (
    <div className="bg-card border rounded-2xl p-6 max-w-md">
      <div className="flex items-center gap-2 mb-5"><Lock className="w-5 h-5 text-primary" /><h3 className="font-bold text-lg">Change Admin Password</h3></div>
      <div className="space-y-4">
        <div><Label>Current Password</Label><Input type={show ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)} className="mt-1" /></div>
        <div><Label>New Password (min 8 chars)</Label><Input type={show ? 'text' : 'password'} value={newPass} onChange={e => setNewPass(e.target.value)} className="mt-1" /></div>
        <div><Label>Confirm New Password</Label><Input type={show ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} className="mt-1" /></div>
        <button onClick={() => setShow(!show)} className="flex items-center gap-1 text-xs text-muted-foreground">
          {show ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />} {show ? 'Hide' : 'Show'} passwords
        </button>
        {msg && <p className={`text-sm ${msg.includes('success') ? 'text-gain' : 'text-loss'}`}>{msg}</p>}
        <Button onClick={handleChange} className="w-full"><Save className="w-4 h-4 mr-2" />Change Password</Button>
      </div>
    </div>
  );
}

function AdminTips() {
  return (
    <div className="bg-card border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-primary" /><h3 className="font-bold text-lg">Investment Tips & Strategies</h3></div>
      <div className="prose prose-sm max-w-none text-foreground">
        {TIPS_CONTENT.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mt-0 mb-3 text-foreground">{line.slice(2)}</h1>;
          if (line.startsWith('## ')) return <h2 key={i} className="text-base font-bold mt-5 mb-2 text-foreground border-b pb-1">{line.slice(3)}</h2>;
          if (line.startsWith('- **')) {
            const parts = line.slice(2).split('**: ');
            return <p key={i} className="text-sm mb-1 pl-3 border-l-2 border-primary/30"><strong>{parts[0].slice(2)}</strong>: {parts[1]}</p>;
          }
          if (line.startsWith('- ')) return <p key={i} className="text-sm mb-1 pl-3 text-muted-foreground">• {line.slice(2)}</p>;
          if (line.startsWith('|')) return null; // skip table for now
          if (line === '') return <div key={i} className="h-1" />;
          return <p key={i} className="text-sm mb-1 text-muted-foreground">{line}</p>;
        })}
      </div>
    </div>
  );
}

