import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Stock, STOCKS_DATA, INDICES, Index, simulatePriceTick, simulateIndexTick } from '@/lib/marketData';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  aadhaar: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  kycStatus: 'pending' | 'approved' | 'rejected';
  virtualBalance: number;
  avatar?: string;
  nominee?: { name: string; relation: string; dob: string };
}

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  type: 'stock' | 'mutual_fund' | 'etf';
}

export interface Order {
  id: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop_loss' | 'stop_loss_market';
  quantity: number;
  price: number;
  limitPrice?: number;
  status: 'pending' | 'executed' | 'cancelled';
  timestamp: Date;
  charges: number;
}

export interface MutualFund {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  nav: number;
  invested: number;
  units: number;
  cagr: number;
  sipAmount?: number;
  sipDate?: number;
  isActive: boolean;
}

export interface FDInvestment {
  id: string;
  principal: number;
  tenure: number;
  tenureUnit: 'days' | 'months' | 'years';
  interestRate: number;
  startDate: Date;
  maturityDate: Date;
  maturityAmount: number;
  rating: string;
  bank: string;
  status: 'active' | 'matured' | 'withdrawn';
}

export interface GoldHolding {
  grams: number;
  avgBuyPrice: number;
  currentPrice: number;
  invested: number;
}

export interface BondHolding {
  id: string;
  name: string;
  issuer: string;
  faceValue: number;
  couponRate: number;
  maturityDate: Date;
  quantity: number;
  purchasePrice: number;
  rating: string;
  yieldToMaturity: number;
}

export interface IPOApplication {
  id: string;
  ipoId: string;
  name: string;
  lots: number;
  lotSize: number;
  issuePrice: number;
  appliedAt: Date;
  allotmentStatus: 'pending' | 'allotted' | 'not_allotted';
  allottedShares?: number;
}

export interface WatchlistItem {
  symbol: string;
  addedAt: Date;
}

export interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  isDarkMode: boolean;
  stocks: Stock[];
  indices: Index[];
  holdings: Holding[];
  orders: Order[];
  mutualFunds: MutualFund[];
  fdInvestments: FDInvestment[];
  goldHolding: GoldHolding;
  bondHoldings: BondHolding[];
  ipoApplications: IPOApplication[];
  watchlist: WatchlistItem[];
  notifications: { id: string; message: string; type: 'success' | 'info' | 'warning'; timestamp: Date; read: boolean }[];
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => boolean;
  signup: (userData: Partial<User>, password: string) => void;
  logout: () => void;
  toggleDarkMode: () => void;
  placeOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status' | 'charges'>) => boolean;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  investMutualFund: (fund: Omit<MutualFund, 'id'>) => void;
  startSIP: (fundId: string, amount: number, date: number) => void;
  stopSIP: (fundId: string) => void;
  redeemMutualFund: (fundId: string, units: number) => void;
  investFD: (fd: Omit<FDInvestment, 'id' | 'status'>) => void;
  exitFD: (fdId: string) => void;
  buyGold: (grams: number, pricePerGram: number) => void;
  sellGold: (grams: number, pricePerGram: number) => void;
  applyIPO: (app: Omit<IPOApplication, 'id' | 'appliedAt' | 'allotmentStatus'>) => void;
  updateUserProfile: (data: Partial<User>) => void;
  updateUserBalance: (amount: number) => void;
  addUserBalance: (userId: string, amount: number) => void;
  markNotificationRead: (id: string) => void;
  getStockBySymbol: (symbol: string) => Stock | undefined;
  exitPosition: (symbol: string, quantity: number) => boolean;
  // Admin functions
  adminUpdateStock: (symbol: string, updates: Partial<Stock>) => void;
  adminDeleteUser: (userId: string) => void;
  adminUpdateUser: (userId: string, data: Partial<User>) => void;
  adminChangePassword: (newPassword: string) => void;
  getAllUsers: () => { email: string; password: string; user: User }[];
}

const AppContext = createContext<AppContextType | null>(null);

const DEMO_USER: User = {
  id: 'user_001',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '9876543210',
  pan: 'ABCDE1234F',
  aadhaar: '1234-5678-9012',
  dob: '1992-05-15',
  gender: 'male',
  kycStatus: 'approved',
  virtualBalance: 1000000,
  nominee: { name: 'Priya Sharma', relation: 'Spouse', dob: '1994-08-20' },
};

const DEMO_HOLDINGS: Holding[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 10, avgPrice: 2750, currentPrice: 2847.50, type: 'stock' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', quantity: 5, avgPrice: 3400, currentPrice: 3542.80, type: 'stock' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', quantity: 20, avgPrice: 1590, currentPrice: 1678.45, type: 'stock' },
  { symbol: 'INFY', name: 'Infosys', quantity: 15, avgPrice: 1420, currentPrice: 1489.20, type: 'stock' },
  { symbol: 'WIPRO', name: 'Wipro', quantity: 30, avgPrice: 460, currentPrice: 478.30, type: 'stock' },
];

const DEMO_MF: MutualFund[] = [
  { id: 'mf001', name: 'Mirae Asset Large Cap Fund', category: 'Equity', subCategory: 'Large Cap', nav: 98.45, invested: 50000, units: 508.2, cagr: 14.2, sipAmount: 5000, sipDate: 5, isActive: true },
  { id: 'mf002', name: 'Axis Midcap Fund', category: 'Equity', subCategory: 'Mid Cap', nav: 72.34, invested: 30000, units: 414.7, cagr: 18.5, sipAmount: 3000, sipDate: 10, isActive: true },
  { id: 'mf003', name: 'HDFC Index Fund - NIFTY 50', category: 'Index', subCategory: 'Large Cap', nav: 156.78, invested: 75000, units: 478.4, cagr: 12.8, isActive: true },
];

const DEMO_FDS: FDInvestment[] = [
  { id: 'fd001', principal: 100000, tenure: 356, tenureUnit: 'days', interestRate: 8.0, startDate: new Date('2024-01-15'), maturityDate: new Date('2025-01-06'), maturityAmount: 108000, rating: 'AAA', bank: 'HDFC Bank', status: 'active' },
  { id: 'fd002', principal: 50000, tenure: 399, tenureUnit: 'days', interestRate: 8.5, startDate: new Date('2024-03-01'), maturityDate: new Date('2025-04-04'), maturityAmount: 54652, rating: 'AAA', bank: 'SBI', status: 'active' },
];

function loadState(): AppState {
  try {
    const saved = localStorage.getItem('surya_app_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Re-hydrate dates
      if (parsed.orders) parsed.orders = parsed.orders.map((o: Order) => ({ ...o, timestamp: new Date(o.timestamp) }));
      if (parsed.fdInvestments) parsed.fdInvestments = parsed.fdInvestments.map((f: FDInvestment) => ({ ...f, startDate: new Date(f.startDate), maturityDate: new Date(f.maturityDate) }));
      if (parsed.ipoApplications) parsed.ipoApplications = parsed.ipoApplications.map((a: IPOApplication) => ({ ...a, appliedAt: new Date(a.appliedAt) }));
      if (parsed.bondHoldings) parsed.bondHoldings = parsed.bondHoldings.map((b: BondHolding) => ({ ...b, maturityDate: new Date(b.maturityDate) }));
      if (parsed.watchlist) parsed.watchlist = parsed.watchlist.map((w: WatchlistItem) => ({ ...w, addedAt: new Date(w.addedAt) }));
      if (parsed.notifications) parsed.notifications = parsed.notifications.map((n: { id: string; message: string; type: 'success' | 'info' | 'warning'; timestamp: Date; read: boolean }) => ({ ...n, timestamp: new Date(n.timestamp) }));
      return parsed;
    }
  } catch {}
  return getInitialState();
}

function getInitialState(): AppState {
  return {
    user: null,
    isLoggedIn: false,
    isDarkMode: false,
    stocks: STOCKS_DATA,
    indices: INDICES,
    holdings: [],
    orders: [],
    mutualFunds: [],
    fdInvestments: [],
    goldHolding: { grams: 0, avgBuyPrice: 0, currentPrice: 7234.50, invested: 0 },
    bondHoldings: [],
    ipoApplications: [],
    watchlist: [],
    notifications: [],
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  // Save to localStorage on state change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('surya_app_state', JSON.stringify(state));
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  // Apply dark mode
  useEffect(() => {
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  // Live price simulation - tick every 1.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        stocks: prev.stocks.map(s => simulatePriceTick(s)),
        indices: prev.indices.map(i => simulateIndexTick(i)),
        goldHolding: {
          ...prev.goldHolding,
          currentPrice: parseFloat((prev.goldHolding.currentPrice * (1 + (Math.random() - 0.499) * 0.001)).toFixed(2)),
        },
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Update holdings current prices
  useEffect(() => {
    setState(prev => ({
      ...prev,
      holdings: prev.holdings.map(h => {
        const stock = prev.stocks.find(s => s.symbol === h.symbol);
        return stock ? { ...h, currentPrice: stock.price } : h;
      }),
    }));
  }, [state.stocks]);

  const addNotification = useCallback((message: string, type: 'success' | 'info' | 'warning') => {
    setState(prev => ({
      ...prev,
      notifications: [
        { id: Date.now().toString(), message, type, timestamp: new Date(), read: false },
        ...prev.notifications.slice(0, 49),
      ],
    }));
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    // Admin check
    if (email === 'suryanarayan' && password === 'Suryanarayan@123') {
      const adminUser: User = { ...DEMO_USER, id: 'admin', name: 'Suryanarayan (Admin)', email: 'admin@suryabroker.in', kycStatus: 'approved' };
      setState(prev => ({
        ...prev,
        user: adminUser,
        isLoggedIn: true,
        holdings: DEMO_HOLDINGS,
        mutualFunds: DEMO_MF,
        fdInvestments: DEMO_FDS,
        goldHolding: { grams: 2.5, avgBuyPrice: 6800, currentPrice: 7234.50, invested: 17000 },
        watchlist: [{ symbol: 'RELIANCE', addedAt: new Date() }, { symbol: 'TCS', addedAt: new Date() }, { symbol: 'INFY', addedAt: new Date() }, { symbol: 'ZOMATO', addedAt: new Date() }, { symbol: 'HDFCBANK', addedAt: new Date() }],
      }));
      return true;
    }
    // Demo user
    if (email === 'rahul@example.com' && password === 'password123') {
      setState(prev => ({
        ...prev,
        user: DEMO_USER,
        isLoggedIn: true,
        holdings: DEMO_HOLDINGS,
        mutualFunds: DEMO_MF,
        fdInvestments: DEMO_FDS,
        goldHolding: { grams: 2.5, avgBuyPrice: 6800, currentPrice: 7234.50, invested: 17000 },
        watchlist: [{ symbol: 'RELIANCE', addedAt: new Date() }, { symbol: 'TCS', addedAt: new Date() }, { symbol: 'INFY', addedAt: new Date() }],
      }));
      return true;
    }
    // Check saved users
    const savedUsers = JSON.parse(localStorage.getItem('surya_users') || '[]');
    const found = savedUsers.find((u: { email: string; password: string; user: User }) => u.email === email && u.password === password);
    if (found) {
      setState(prev => ({ ...prev, user: found.user, isLoggedIn: true }));
      return true;
    }
    return false;
  }, []);

  const signup = useCallback((userData: Partial<User>, password: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      pan: userData.pan || '',
      aadhaar: userData.aadhaar || '',
      dob: userData.dob || '',
      gender: userData.gender || 'male',
      kycStatus: 'pending',
      virtualBalance: 1000000,
    };
    const savedUsers = JSON.parse(localStorage.getItem('surya_users') || '[]');
    savedUsers.push({ email: newUser.email, password, user: newUser });
    localStorage.setItem('surya_users', JSON.stringify(savedUsers));
    setState(prev => ({ ...prev, user: newUser, isLoggedIn: true }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...getInitialState(), isDarkMode: prev.isDarkMode, stocks: prev.stocks, indices: prev.indices }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  }, []);

  const placeOrder = useCallback((orderData: Omit<Order, 'id' | 'timestamp' | 'status' | 'charges'>): boolean => {
    const charges = parseFloat((orderData.price * orderData.quantity * 0.0003 + 20).toFixed(2));
    const total = orderData.type === 'buy' ? orderData.price * orderData.quantity + charges : 0;

    setState(prev => {
      if (orderData.type === 'buy' && prev.user && prev.user.virtualBalance < total) return prev;

      const newOrder: Order = { ...orderData, id: `ORD${Date.now()}`, timestamp: new Date(), status: 'executed', charges };

      let newHoldings = [...prev.holdings];
      let newBalance = prev.user ? prev.user.virtualBalance : 0;

      if (orderData.type === 'buy') {
        newBalance -= total;
        const existing = newHoldings.findIndex(h => h.symbol === orderData.symbol);
        if (existing >= 0) {
          const old = newHoldings[existing];
          const newQty = old.quantity + orderData.quantity;
          const newAvg = (old.avgPrice * old.quantity + orderData.price * orderData.quantity) / newQty;
          newHoldings[existing] = { ...old, quantity: newQty, avgPrice: parseFloat(newAvg.toFixed(2)), currentPrice: orderData.price };
        } else {
          const stock = prev.stocks.find(s => s.symbol === orderData.symbol);
          newHoldings.push({ symbol: orderData.symbol, name: stock?.name || orderData.symbol, quantity: orderData.quantity, avgPrice: orderData.price, currentPrice: orderData.price, type: 'stock' });
        }
      } else {
        const existing = newHoldings.findIndex(h => h.symbol === orderData.symbol);
        if (existing >= 0) {
          const old = newHoldings[existing];
          const newQty = old.quantity - orderData.quantity;
          if (newQty <= 0) newHoldings.splice(existing, 1);
          else newHoldings[existing] = { ...old, quantity: newQty };
          newBalance += orderData.price * orderData.quantity - charges;
        }
      }

      return {
        ...prev,
        orders: [newOrder, ...prev.orders],
        holdings: newHoldings,
        user: prev.user ? { ...prev.user, virtualBalance: newBalance } : prev.user,
      };
    });
    addNotification(`Order ${orderData.type === 'buy' ? 'Buy' : 'Sell'} ${orderData.symbol} x${orderData.quantity} executed at ₹${orderData.price}`, 'success');
    return true;
  }, [addNotification]);

  const addToWatchlist = useCallback((symbol: string) => {
    setState(prev => {
      if (prev.watchlist.some(w => w.symbol === symbol)) return prev;
      return { ...prev, watchlist: [...prev.watchlist, { symbol, addedAt: new Date() }] };
    });
  }, []);

  const removeFromWatchlist = useCallback((symbol: string) => {
    setState(prev => ({ ...prev, watchlist: prev.watchlist.filter(w => w.symbol !== symbol) }));
  }, []);

  const investMutualFund = useCallback((fund: Omit<MutualFund, 'id'>) => {
    const newFund: MutualFund = { ...fund, id: `mf_${Date.now()}` };
    setState(prev => ({
      ...prev,
      mutualFunds: [...prev.mutualFunds, newFund],
      user: prev.user ? { ...prev.user, virtualBalance: prev.user.virtualBalance - fund.invested } : prev.user,
    }));
    addNotification(`Invested ₹${fund.invested.toLocaleString('en-IN')} in ${fund.name}`, 'success');
  }, [addNotification]);

  const startSIP = useCallback((fundId: string, amount: number, date: number) => {
    setState(prev => ({
      ...prev,
      mutualFunds: prev.mutualFunds.map(f => f.id === fundId ? { ...f, sipAmount: amount, sipDate: date, isActive: true } : f),
    }));
    addNotification('SIP started successfully', 'success');
  }, [addNotification]);

  const stopSIP = useCallback((fundId: string) => {
    setState(prev => ({
      ...prev,
      mutualFunds: prev.mutualFunds.map(f => f.id === fundId ? { ...f, sipAmount: undefined, sipDate: undefined } : f),
    }));
    addNotification('SIP stopped', 'info');
  }, [addNotification]);

  const redeemMutualFund = useCallback((fundId: string, units: number) => {
    setState(prev => {
      const fund = prev.mutualFunds.find(f => f.id === fundId);
      if (!fund) return prev;
      const value = units * fund.nav;
      const newUnits = fund.units - units;
      return {
        ...prev,
        mutualFunds: newUnits <= 0 ? prev.mutualFunds.filter(f => f.id !== fundId) : prev.mutualFunds.map(f => f.id === fundId ? { ...f, units: newUnits, invested: newUnits * fund.nav } : f),
        user: prev.user ? { ...prev.user, virtualBalance: prev.user.virtualBalance + value } : prev.user,
      };
    });
    addNotification('Mutual fund redemption processed', 'success');
  }, [addNotification]);

  const investFD = useCallback((fd: Omit<FDInvestment, 'id' | 'status'>) => {
    const newFD: FDInvestment = { ...fd, id: `fd_${Date.now()}`, status: 'active' };
    setState(prev => ({
      ...prev,
      fdInvestments: [...prev.fdInvestments, newFD],
      user: prev.user ? { ...prev.user, virtualBalance: prev.user.virtualBalance - fd.principal } : prev.user,
    }));
    addNotification(`FD of ₹${fd.principal.toLocaleString('en-IN')} created at ${fd.interestRate}%`, 'success');
  }, [addNotification]);

  const exitFD = useCallback((fdId: string) => {
    setState(prev => {
      const fd = prev.fdInvestments.find(f => f.id === fdId);
      if (!fd) return prev;
      const elapsed = Date.now() - new Date(fd.startDate).getTime();
      const totalDays = (new Date(fd.maturityDate).getTime() - new Date(fd.startDate).getTime()) / (1000 * 86400);
      const elapsedDays = elapsed / (1000 * 86400);
      const progressRatio = Math.min(1, elapsedDays / totalDays);
      const earnedInterest = (fd.maturityAmount - fd.principal) * progressRatio;
      const penalty = earnedInterest * 0.01; // 1% penalty
      const returnAmount = fd.principal + earnedInterest - penalty;
      return {
        ...prev,
        fdInvestments: prev.fdInvestments.filter(f => f.id !== fdId),
        user: prev.user ? { ...prev.user, virtualBalance: prev.user.virtualBalance + returnAmount } : prev.user,
      };
    });
    addNotification('FD withdrawn with early exit penalty applied', 'info');
  }, [addNotification]);

  const buyGold = useCallback((grams: number, pricePerGram: number) => {
    const cost = grams * pricePerGram;
    setState(prev => {
      if (!prev.user || prev.user.virtualBalance < cost) return prev;
      const totalGrams = prev.goldHolding.grams + grams;
      const totalInvested = prev.goldHolding.invested + cost;
      return {
        ...prev,
        goldHolding: { ...prev.goldHolding, grams: totalGrams, avgBuyPrice: totalInvested / totalGrams, invested: totalInvested },
        user: { ...prev.user, virtualBalance: prev.user.virtualBalance - cost },
      };
    });
    addNotification(`Bought ${grams}g gold at ₹${pricePerGram}/g`, 'success');
  }, [addNotification]);

  const sellGold = useCallback((grams: number, pricePerGram: number) => {
    const value = grams * pricePerGram;
    setState(prev => {
      const newGrams = prev.goldHolding.grams - grams;
      return {
        ...prev,
        goldHolding: { ...prev.goldHolding, grams: newGrams >= 0 ? newGrams : 0, invested: newGrams >= 0 ? prev.goldHolding.invested - grams * prev.goldHolding.avgBuyPrice : 0 },
        user: prev.user ? { ...prev.user, virtualBalance: prev.user.virtualBalance + value } : prev.user,
      };
    });
    addNotification(`Sold ${grams}g gold at ₹${pricePerGram}/g`, 'success');
  }, [addNotification]);

  const applyIPO = useCallback((app: Omit<IPOApplication, 'id' | 'appliedAt' | 'allotmentStatus'>) => {
    const totalCost = app.lots * app.lotSize * app.issuePrice;
    const newApp: IPOApplication = { ...app, id: `ipo_${Date.now()}`, appliedAt: new Date(), allotmentStatus: 'pending' };
    setState(prev => ({
      ...prev,
      ipoApplications: [...prev.ipoApplications, newApp],
      user: prev.user ? { ...prev.user, virtualBalance: prev.user.virtualBalance - totalCost } : prev.user,
    }));
    setTimeout(() => {
      const allotted = Math.random() > 0.4;
      setState(prev => ({
        ...prev,
        ipoApplications: prev.ipoApplications.map(a => a.id === newApp.id
          ? { ...a, allotmentStatus: allotted ? 'allotted' : 'not_allotted', allottedShares: allotted ? app.lots * app.lotSize : 0 }
          : a
        ),
      }));
      addNotification(`IPO allotment result for ${app.name}: ${allotted ? '✅ Allotted!' : '❌ Not Allotted - Refund processed'}`, 'info');
      if (!allotted) {
        setState(prev => ({
          ...prev,
          user: prev.user ? { ...prev.user, virtualBalance: prev.user.virtualBalance + totalCost } : prev.user,
        }));
      }
    }, 3000);
    addNotification(`IPO application for ${app.name} submitted`, 'success');
  }, [addNotification]);

  const updateUserProfile = useCallback((data: Partial<User>) => {
    setState(prev => ({ ...prev, user: prev.user ? { ...prev.user, ...data } : prev.user }));
  }, []);

  const updateUserBalance = useCallback((amount: number) => {
    setState(prev => ({ ...prev, user: prev.user ? { ...prev.user, virtualBalance: amount } : prev.user }));
  }, []);

  const addUserBalance = useCallback((userId: string, amount: number) => {
    const savedUsers = JSON.parse(localStorage.getItem('surya_users') || '[]');
    const idx = savedUsers.findIndex((u: { user: User }) => u.user.id === userId);
    if (idx >= 0) {
      savedUsers[idx].user.virtualBalance = (savedUsers[idx].user.virtualBalance || 0) + amount;
      localStorage.setItem('surya_users', JSON.stringify(savedUsers));
    }
    // If current user
    setState(prev => {
      if (prev.user?.id === userId) {
        return { ...prev, user: { ...prev.user, virtualBalance: prev.user.virtualBalance + amount } };
      }
      return prev;
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
  }, []);

  const getStockBySymbol = useCallback((symbol: string) => state.stocks.find(s => s.symbol === symbol), [state.stocks]);

  const exitPosition = useCallback((symbol: string, quantity: number): boolean => {
    const stock = state.stocks.find(s => s.symbol === symbol);
    if (!stock) return false;
    return placeOrder({ symbol, name: stock.name, type: 'sell', orderType: 'market', quantity, price: stock.price });
  }, [state.stocks, placeOrder]);

  const adminUpdateStock = useCallback((symbol: string, updates: Partial<Stock>) => {
    setState(prev => ({
      ...prev,
      stocks: prev.stocks.map(s => s.symbol === symbol ? { ...s, ...updates } : s),
    }));
  }, []);

  const adminDeleteUser = useCallback((userId: string) => {
    const savedUsers = JSON.parse(localStorage.getItem('surya_users') || '[]');
    const updated = savedUsers.filter((u: { user: User }) => u.user.id !== userId);
    localStorage.setItem('surya_users', JSON.stringify(updated));
  }, []);

  const adminUpdateUser = useCallback((userId: string, data: Partial<User>) => {
    const savedUsers = JSON.parse(localStorage.getItem('surya_users') || '[]');
    const idx = savedUsers.findIndex((u: { user: User }) => u.user.id === userId);
    if (idx >= 0) {
      savedUsers[idx].user = { ...savedUsers[idx].user, ...data };
      localStorage.setItem('surya_users', JSON.stringify(savedUsers));
    }
  }, []);

  const adminChangePassword = useCallback((newPassword: string) => {
    localStorage.setItem('surya_admin_password', newPassword);
  }, []);

  const getAllUsers = useCallback(() => {
    return JSON.parse(localStorage.getItem('surya_users') || '[]');
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      login, signup, logout, toggleDarkMode, placeOrder, addToWatchlist, removeFromWatchlist,
      investMutualFund, startSIP, stopSIP, redeemMutualFund, investFD, exitFD, buyGold, sellGold, applyIPO,
      updateUserProfile, updateUserBalance, addUserBalance, markNotificationRead, getStockBySymbol, exitPosition,
      adminUpdateStock, adminDeleteUser, adminUpdateUser, adminChangePassword, getAllUsers,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
