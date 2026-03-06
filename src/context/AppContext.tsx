import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Stock, STOCKS_DATA, INDICES, Index, simulatePriceTick, simulateIndexTick, RESERVE_STOCKS } from '@/lib/marketData';

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

export interface SilverHolding {
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

export interface DividendRecord {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  creditedAt: Date;
  perShare: number;
  shares: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  timestamp: Date;
  read: boolean;
}

// Per-user portfolio data stored separately
export interface UserPortfolio {
  holdings: Holding[];
  orders: Order[];
  mutualFunds: MutualFund[];
  fdInvestments: FDInvestment[];
  goldHolding: GoldHolding;
  silverHolding: SilverHolding;
  bondHoldings: BondHolding[];
  ipoApplications: IPOApplication[];
  watchlist: WatchlistItem[];
  notifications: Notification[];
  dividendHistory: DividendRecord[];
  lastDividendCheck: string; // ISO date string of last quarter check
}

export interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  isDarkMode: boolean;
  stocks: Stock[];
  indices: Index[];
  // Current user portfolio (loaded from per-user storage on login)
  holdings: Holding[];
  orders: Order[];
  mutualFunds: MutualFund[];
  fdInvestments: FDInvestment[];
  goldHolding: GoldHolding;
  silverHolding: SilverHolding;
  bondHoldings: BondHolding[];
  ipoApplications: IPOApplication[];
  watchlist: WatchlistItem[];
  notifications: Notification[];
  dividendHistory: DividendRecord[];
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
  buySilver: (grams: number, pricePerGram: number) => void;
  sellSilver: (grams: number, pricePerGram: number) => void;
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

// ===== STORAGE HELPERS =====

function getGlobalKey() { return 'surya_global_state'; }
function getUserPortfolioKey(userId: string) { return `surya_portfolio_${userId}`; }

function saveGlobalState(state: { isDarkMode: boolean; stocks: Stock[]; indices: Index[] }) {
  try {
    localStorage.setItem(getGlobalKey(), JSON.stringify(state));
  } catch {}
}

function loadGlobalState(): { isDarkMode: boolean; stocks: Stock[]; indices: Index[] } {
  try {
    const saved = localStorage.getItem(getGlobalKey());
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        isDarkMode: parsed.isDarkMode ?? false,
        stocks: parsed.stocks && parsed.stocks.length > 0 ? parsed.stocks : STOCKS_DATA,
        indices: parsed.indices && parsed.indices.length > 0 ? parsed.indices : INDICES,
      };
    }
  } catch {}
  return { isDarkMode: false, stocks: STOCKS_DATA, indices: INDICES };
}

function hydratePortfolioDates(p: UserPortfolio): UserPortfolio {
  return {
    ...p,
    orders: (p.orders || []).map(o => ({ ...o, timestamp: new Date(o.timestamp) })),
    fdInvestments: (p.fdInvestments || []).map(f => ({ ...f, startDate: new Date(f.startDate), maturityDate: new Date(f.maturityDate) })),
    ipoApplications: (p.ipoApplications || []).map(a => ({ ...a, appliedAt: new Date(a.appliedAt) })),
    bondHoldings: (p.bondHoldings || []).map(b => ({ ...b, maturityDate: new Date(b.maturityDate) })),
    watchlist: (p.watchlist || []).map(w => ({ ...w, addedAt: new Date(w.addedAt) })),
    notifications: (p.notifications || []).map(n => ({ ...n, timestamp: new Date(n.timestamp) })),
    dividendHistory: (p.dividendHistory || []).map(d => ({ ...d, creditedAt: new Date(d.creditedAt) })),
  };
}

function loadUserPortfolio(userId: string): UserPortfolio {
  try {
    const saved = localStorage.getItem(getUserPortfolioKey(userId));
    if (saved) {
      return hydratePortfolioDates(JSON.parse(saved));
    }
  } catch {}
  return getDefaultPortfolio();
}

function saveUserPortfolio(userId: string, portfolio: UserPortfolio) {
  try {
    localStorage.setItem(getUserPortfolioKey(userId), JSON.stringify(portfolio));
  } catch {}
}

function getDefaultPortfolio(): UserPortfolio {
  return {
    holdings: [],
    orders: [],
    mutualFunds: [],
    fdInvestments: [],
    goldHolding: { grams: 0, avgBuyPrice: 0, currentPrice: 7234.50, invested: 0 },
    silverHolding: { grams: 0, avgBuyPrice: 0, currentPrice: 95.40, invested: 0 },
    bondHoldings: [],
    ipoApplications: [],
    watchlist: [],
    notifications: [],
    dividendHistory: [],
    lastDividendCheck: '',
  };
}

function getInitialAppState(): AppState {
  const global = loadGlobalState();
  return {
    user: null,
    isLoggedIn: false,
    isDarkMode: global.isDarkMode,
    stocks: global.stocks,
    indices: global.indices,
    ...getDefaultPortfolio(),
  };
}

// ===== DIVIDEND HELPERS =====
function getCurrentQuarter(): string {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3) + 1;
  return `${now.getFullYear()}-Q${q}`;
}

// ===== PROVIDER =====
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(getInitialAppState);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save global state (stocks, indices, dark mode) separately
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveGlobalState({ isDarkMode: state.isDarkMode, stocks: state.stocks, indices: state.indices });
      // Save user portfolio if logged in
      if (state.user) {
        const portfolio: UserPortfolio = {
          holdings: state.holdings,
          orders: state.orders,
          mutualFunds: state.mutualFunds,
          fdInvestments: state.fdInvestments,
          goldHolding: state.goldHolding,
          silverHolding: state.silverHolding,
          bondHoldings: state.bondHoldings,
          ipoApplications: state.ipoApplications,
          watchlist: state.watchlist,
          notifications: state.notifications,
          dividendHistory: state.dividendHistory,
          lastDividendCheck: state.dividendHistory.length > 0
            ? (state as AppState & { lastDividendCheck?: string }).lastDividendCheck || ''
            : '',
        };
        saveUserPortfolio(state.user.id, portfolio);
        // Also save balance back to users list
        const savedUsers = JSON.parse(localStorage.getItem('surya_users') || '[]');
        const idx = savedUsers.findIndex((u: { user: User }) => u.user.id === state.user!.id);
        if (idx >= 0) {
          savedUsers[idx].user.virtualBalance = state.user.virtualBalance;
          localStorage.setItem('surya_users', JSON.stringify(savedUsers));
        }
      }
    }, 500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [state]);

  // Apply dark mode
  useEffect(() => {
    if (state.isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [state.isDarkMode]);

  // Live price simulation - tick every 1.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        // Handle delisted stocks - replace with reserve
        const delistedSymbols: string[] = [];
        const newStocks = prev.stocks.map(stock => {
          const updated = simulatePriceTick(stock);
          if (updated.isDelisted) delistedSymbols.push(stock.symbol);
          return updated;
        });

        let finalStocks = newStocks.filter(s => !s.isDelisted);

        // Add reserve stocks for each delisted company
        if (delistedSymbols.length > 0) {
          const existingSymbols = new Set(finalStocks.map(s => s.symbol));
          const available = RESERVE_STOCKS.filter(r => !existingSymbols.has(r.symbol));
          delistedSymbols.forEach((_, i) => {
            if (available[i]) finalStocks.push(available[i]);
          });
        }

        const newIndices = prev.indices.map(i => simulateIndexTick(i));
        const goldTick = parseFloat((prev.goldHolding.currentPrice * (1 + (Math.random() - 0.499) * 0.001)).toFixed(2));
        const silverTick = parseFloat((prev.silverHolding.currentPrice * (1 + (Math.random() - 0.499) * 0.0015)).toFixed(2));

        return {
          ...prev,
          stocks: finalStocks,
          indices: newIndices,
          goldHolding: { ...prev.goldHolding, currentPrice: goldTick },
          silverHolding: { ...prev.silverHolding, currentPrice: silverTick },
          holdings: prev.holdings.map(h => {
            const stock = finalStocks.find(s => s.symbol === h.symbol);
            return stock ? { ...h, currentPrice: stock.price } : h;
          }),
        };
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Dividend quarterly check
  useEffect(() => {
    if (!state.isLoggedIn || !state.user || state.holdings.length === 0) return;
    const currentQ = getCurrentQuarter();
    const extState = state as AppState & { lastDividendCheck?: string };
    if (extState.lastDividendCheck === currentQ) return;

    const eligible = state.holdings.filter(h => {
      const stock = state.stocks.find(s => s.symbol === h.symbol);
      return stock && stock.dividendYield > 0 && h.quantity > 0;
    });

    if (eligible.length === 0) return;

    let totalDividend = 0;
    const newRecords: DividendRecord[] = [];

    eligible.forEach(h => {
      const stock = state.stocks.find(s => s.symbol === h.symbol);
      if (!stock) return;
      // Quarterly dividend = (annual yield / 4) * current price * quantity
      const quarterlyYieldRate = stock.dividendYield / 400;
      const perShare = parseFloat((stock.price * quarterlyYieldRate).toFixed(2));
      const total = parseFloat((perShare * h.quantity).toFixed(2));
      if (total > 0) {
        totalDividend += total;
        newRecords.push({
          id: `div_${Date.now()}_${stock.symbol}`,
          symbol: stock.symbol,
          name: h.name,
          amount: total,
          creditedAt: new Date(),
          perShare,
          shares: h.quantity,
        });
      }
    });

    if (totalDividend > 0) {
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, virtualBalance: prev.user.virtualBalance + totalDividend } : prev.user,
        dividendHistory: [...newRecords, ...prev.dividendHistory],
        notifications: [
          {
            id: `notif_div_${Date.now()}`,
            message: `💰 Quarterly dividends credited! ₹${totalDividend.toFixed(2)} from ${newRecords.length} stock(s) added to your balance.`,
            type: 'success' as const,
            timestamp: new Date(),
            read: false,
          },
          ...prev.notifications.slice(0, 49),
        ],
        lastDividendCheck: currentQ,
      } as AppState & { lastDividendCheck: string }));
    }
  }, [state.isLoggedIn, state.user?.id]);

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
      const adminUser: User = {
        id: 'admin',
        name: 'Suryanarayan (Admin)',
        email: 'admin@suryabroker.in',
        phone: '9999999999',
        pan: 'ADMIN1234X',
        aadhaar: '0000-0000-0000',
        dob: '1990-01-01',
        gender: 'male',
        kycStatus: 'approved',
        virtualBalance: 1000000,
      };
      const portfolio = loadUserPortfolio('admin');
      setState(prev => ({
        ...prev,
        user: { ...adminUser, virtualBalance: adminUser.virtualBalance },
        isLoggedIn: true,
        ...portfolio,
      }));
      return true;
    }

    // Check saved users
    const savedUsers: { email: string; password: string; user: User }[] = JSON.parse(localStorage.getItem('surya_users') || '[]');
    const found = savedUsers.find(u => u.email === email && u.password === password);
    if (found) {
      const portfolio = loadUserPortfolio(found.user.id);
      setState(prev => ({
        ...prev,
        user: found.user,
        isLoggedIn: true,
        ...portfolio,
      }));
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
    const portfolio = getDefaultPortfolio();
    saveUserPortfolio(newUser.id, portfolio);
    setState(prev => ({
      ...prev,
      user: newUser,
      isLoggedIn: true,
      ...portfolio,
    }));
  }, []);

  const logout = useCallback(() => {
    // Save current user portfolio before logging out
    setState(prev => {
      if (prev.user) {
        const portfolio: UserPortfolio = {
          holdings: prev.holdings,
          orders: prev.orders,
          mutualFunds: prev.mutualFunds,
          fdInvestments: prev.fdInvestments,
          goldHolding: prev.goldHolding,
          silverHolding: prev.silverHolding,
          bondHoldings: prev.bondHoldings,
          ipoApplications: prev.ipoApplications,
          watchlist: prev.watchlist,
          notifications: prev.notifications,
          dividendHistory: prev.dividendHistory,
          lastDividendCheck: (prev as AppState & { lastDividendCheck?: string }).lastDividendCheck || '',
        };
        saveUserPortfolio(prev.user.id, portfolio);
      }
      return {
        ...getDefaultPortfolio(),
        user: null,
        isLoggedIn: false,
        isDarkMode: prev.isDarkMode,
        stocks: prev.stocks,
        indices: prev.indices,
      };
    });
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
      const penalty = earnedInterest * 0.01;
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

  const buySilver = useCallback((grams: number, pricePerGram: number) => {
    const cost = grams * pricePerGram;
    setState(prev => {
      if (!prev.user || prev.user.virtualBalance < cost) return prev;
      const totalGrams = prev.silverHolding.grams + grams;
      const totalInvested = prev.silverHolding.invested + cost;
      return {
        ...prev,
        silverHolding: { ...prev.silverHolding, grams: totalGrams, avgBuyPrice: totalInvested / totalGrams, invested: totalInvested },
        user: { ...prev.user, virtualBalance: prev.user.virtualBalance - cost },
      };
    });
    addNotification(`Bought ${grams}g silver at ₹${pricePerGram}/g`, 'success');
  }, [addNotification]);

  const sellSilver = useCallback((grams: number, pricePerGram: number) => {
    const value = grams * pricePerGram;
    setState(prev => {
      if (prev.silverHolding.grams < grams) return prev;
      const newGrams = prev.silverHolding.grams - grams;
      return {
        ...prev,
        silverHolding: { ...prev.silverHolding, grams: newGrams, invested: newGrams > 0 ? prev.silverHolding.invested - grams * prev.silverHolding.avgBuyPrice : 0 },
        user: prev.user ? { ...prev.user, virtualBalance: prev.user.virtualBalance + value } : prev.user,
      };
    });
    addNotification(`Sold ${grams}g silver at ₹${pricePerGram}/g`, 'success');
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
    localStorage.removeItem(getUserPortfolioKey(userId));
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
      investMutualFund, startSIP, stopSIP, redeemMutualFund, investFD, exitFD,
      buyGold, sellGold, buySilver, sellSilver, applyIPO,
      updateUserProfile, updateUserBalance, addUserBalance, markNotificationRead,
      getStockBySymbol, exitPosition,
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
