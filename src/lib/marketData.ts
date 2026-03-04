// Core price simulation engine - realistic Indian market volatility

export type TimeFrame = '1m' | '5m' | '15m' | '1H' | '1D' | '1W' | '1M';

export interface OHLCV {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  exchange: 'NSE' | 'BSE';
  price: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  eps: number;
  week52High: number;
  week52Low: number;
  dividendYield: number;
  isFavorite?: boolean;
}

export interface Index {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
}

// Indian stocks universe
export const STOCKS_DATA: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', exchange: 'NSE', price: 2847.50, open: 2820, high: 2865, low: 2810, prevClose: 2830, change: 17.50, changePercent: 0.62, volume: 8543210, marketCap: 1924500, pe: 22.4, eps: 127.1, week52High: 3217, week52Low: 2220, dividendYield: 0.35 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', exchange: 'NSE', price: 3542.80, open: 3510, high: 3558, low: 3495, prevClose: 3520, change: 22.80, changePercent: 0.65, volume: 3421890, marketCap: 1289500, pe: 28.3, eps: 125.2, week52High: 4255, week52Low: 3108, dividendYield: 1.12 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', exchange: 'NSE', price: 1678.45, open: 1660, high: 1689, low: 1655, prevClose: 1670, change: 8.45, changePercent: 0.51, volume: 12453670, marketCap: 1264300, pe: 18.7, eps: 89.8, week52High: 1794, week52Low: 1363, dividendYield: 1.24 },
  { symbol: 'INFY', name: 'Infosys', sector: 'IT', exchange: 'NSE', price: 1489.20, open: 1475, high: 1502, low: 1469, prevClose: 1480, change: 9.20, changePercent: 0.62, volume: 7654320, marketCap: 618540, pe: 23.8, eps: 62.6, week52High: 1904, week52Low: 1358, dividendYield: 2.34 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', exchange: 'NSE', price: 1124.60, open: 1112, high: 1138, low: 1108, prevClose: 1118, change: 6.60, changePercent: 0.59, volume: 9876540, marketCap: 791250, pe: 16.2, eps: 69.4, week52High: 1196, week52Low: 899, dividendYield: 0.89 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG', exchange: 'NSE', price: 2234.75, open: 2215, high: 2248, low: 2208, prevClose: 2225, change: 9.75, changePercent: 0.44, volume: 2345670, marketCap: 524800, pe: 52.4, eps: 42.7, week52High: 2778, week52Low: 2172, dividendYield: 1.45 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'NBFC', exchange: 'NSE', price: 7234.50, open: 7180, high: 7289, low: 7145, prevClose: 7200, change: 34.50, changePercent: 0.48, volume: 1234560, marketCap: 435200, pe: 33.6, eps: 215.3, week52High: 8192, week52Low: 6187, dividendYield: 0.28 },
  { symbol: 'WIPRO', name: 'Wipro', sector: 'IT', exchange: 'NSE', price: 478.30, open: 472, high: 485, low: 469, prevClose: 475, change: 3.30, changePercent: 0.69, volume: 5643210, marketCap: 247890, pe: 19.4, eps: 24.7, week52High: 614, week52Low: 415, dividendYield: 0.21 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking', exchange: 'NSE', price: 1789.60, open: 1770, high: 1802, low: 1762, prevClose: 1780, change: 9.60, changePercent: 0.54, volume: 3456780, marketCap: 355430, pe: 21.3, eps: 84.0, week52High: 2063, week52Low: 1544, dividendYield: 0.11 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', exchange: 'NSE', price: 1634.85, open: 1618, high: 1648, low: 1610, prevClose: 1625, change: 9.85, changePercent: 0.61, volume: 4567890, marketCap: 918760, pe: 85.4, eps: 19.1, week52High: 1779, week52Low: 1082, dividendYield: 0.36 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', sector: 'Consumer', exchange: 'NSE', price: 2978.40, open: 2955, high: 2995, low: 2940, prevClose: 2965, change: 13.40, changePercent: 0.45, volume: 1234567, marketCap: 285430, pe: 62.3, eps: 47.8, week52High: 3590, week52Low: 2671, dividendYield: 0.97 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India', sector: 'Auto', exchange: 'NSE', price: 12456.70, open: 12350, high: 12520, low: 12300, prevClose: 12400, change: 56.70, changePercent: 0.46, volume: 456789, marketCap: 376540, pe: 26.8, eps: 464.8, week52High: 13675, week52Low: 9724, dividendYield: 0.88 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Pharma', exchange: 'NSE', price: 1756.30, open: 1740, high: 1772, low: 1728, prevClose: 1748, change: 8.30, changePercent: 0.47, volume: 2345678, marketCap: 421230, pe: 35.7, eps: 49.2, week52High: 1960, week52Low: 1133, dividendYield: 0.74 },
  { symbol: 'LTIM', name: 'LTIMindtree', sector: 'IT', exchange: 'NSE', price: 5234.60, open: 5195, high: 5270, low: 5168, prevClose: 5218, change: 16.60, changePercent: 0.32, volume: 876543, marketCap: 155430, pe: 31.4, eps: 166.7, week52High: 6280, week52Low: 4301, dividendYield: 0.57 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', exchange: 'NSE', price: 978.45, open: 968, high: 986, low: 962, prevClose: 972, change: 6.45, changePercent: 0.66, volume: 8765432, marketCap: 363200, pe: 8.4, eps: 116.5, week52High: 1179, week52Low: 672, dividendYield: 0.20 },
  { symbol: 'HCLTECH', name: 'HCL Technologies', sector: 'IT', exchange: 'NSE', price: 1678.90, open: 1663, high: 1692, low: 1650, prevClose: 1668, change: 10.90, changePercent: 0.65, volume: 3456789, marketCap: 456780, pe: 24.6, eps: 68.3, week52High: 1904, week52Low: 1235, dividendYield: 3.21 },
  { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Banking', exchange: 'NSE', price: 1123.40, open: 1112, high: 1135, low: 1105, prevClose: 1116, change: 7.40, changePercent: 0.66, volume: 6543210, marketCap: 346540, pe: 12.8, eps: 87.8, week52High: 1340, week52Low: 970, dividendYield: 0.09 },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corp', sector: 'Energy', exchange: 'NSE', price: 267.80, open: 264, high: 271, low: 261, prevClose: 265, change: 2.80, changePercent: 1.06, volume: 23456789, marketCap: 337650, pe: 6.8, eps: 39.4, week52High: 345, week52Low: 195, dividendYield: 4.85 },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', exchange: 'NSE', price: 812.30, open: 804, high: 820, low: 799, prevClose: 806, change: 6.30, changePercent: 0.78, volume: 18765432, marketCap: 724500, pe: 10.4, eps: 78.1, week52High: 912, week52Low: 543, dividendYield: 1.60 },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', sector: 'Auto', exchange: 'NSE', price: 2978.60, open: 2952, high: 3001, low: 2940, prevClose: 2963, change: 15.60, changePercent: 0.53, volume: 2345678, marketCap: 370450, pe: 28.7, eps: 103.8, week52High: 3222, week52Low: 1550, dividendYield: 0.54 },
  { symbol: 'NTPC', name: 'NTPC', sector: 'Power', exchange: 'NSE', price: 389.45, open: 384, high: 393, low: 380, prevClose: 386, change: 3.45, changePercent: 0.89, volume: 12345678, marketCap: 377430, pe: 16.8, eps: 23.2, week52High: 448, week52Low: 247, dividendYield: 2.54 },
  { symbol: 'POWERGRID', name: 'Power Grid Corp', sector: 'Power', exchange: 'NSE', price: 321.70, open: 318, high: 325, low: 315, prevClose: 319, change: 2.70, changePercent: 0.85, volume: 9876543, marketCap: 299340, pe: 18.4, eps: 17.5, week52High: 366, week52Low: 218, dividendYield: 3.85 },
  { symbol: 'TITAN', name: 'Titan Company', sector: 'Consumer', exchange: 'NSE', price: 3456.80, open: 3428, high: 3472, low: 3412, prevClose: 3442, change: 14.80, changePercent: 0.43, volume: 1234567, marketCap: 306870, pe: 89.4, eps: 38.7, week52High: 3886, week52Low: 2595, dividendYield: 0.35 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', sector: 'Cement', exchange: 'NSE', price: 11234.50, open: 11150, high: 11290, low: 11100, prevClose: 11180, change: 54.50, changePercent: 0.49, volume: 234567, marketCap: 324560, pe: 35.2, eps: 319.0, week52High: 12244, week52Low: 8520, dividendYield: 0.35 },
  { symbol: 'NESTLEIND', name: 'Nestle India', sector: 'FMCG', exchange: 'NSE', price: 2278.40, open: 2256, high: 2295, low: 2243, prevClose: 2265, change: 13.40, changePercent: 0.59, volume: 345678, marketCap: 219540, pe: 74.3, eps: 30.7, week52High: 2778, week52Low: 2055, dividendYield: 1.62 },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', sector: 'NBFC', exchange: 'NSE', price: 1678.90, open: 1660, high: 1692, low: 1648, prevClose: 1668, change: 10.90, changePercent: 0.65, volume: 2345678, marketCap: 267540, pe: 28.4, eps: 59.1, week52High: 1972, week52Low: 1418, dividendYield: 0.06 },
  { symbol: 'DRREDDY', name: "Dr Reddy's Laboratories", sector: 'Pharma', exchange: 'NSE', price: 1289.60, open: 1275, high: 1302, low: 1265, prevClose: 1280, change: 9.60, changePercent: 0.75, volume: 1234567, marketCap: 214560, pe: 19.8, eps: 65.1, week52High: 1419, week52Low: 987, dividendYield: 0.39 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', sector: 'Diversified', exchange: 'NSE', price: 2892.45, open: 2865, high: 2915, low: 2851, prevClose: 2875, change: 17.45, changePercent: 0.61, volume: 3456789, marketCap: 329450, pe: 68.4, eps: 42.3, week52High: 3743, week52Low: 1902, dividendYield: 0.07 },
  { symbol: 'ZOMATO', name: 'Zomato', sector: 'Internet', exchange: 'NSE', price: 267.40, open: 263, high: 272, low: 259, prevClose: 264, change: 3.40, changePercent: 1.29, volume: 45678901, marketCap: 237540, pe: 312.4, eps: 0.86, week52High: 304, week52Low: 127, dividendYield: 0 },
  { symbol: 'PAYTM', name: 'One 97 Communications', sector: 'Fintech', exchange: 'NSE', price: 892.30, open: 882, high: 901, low: 875, prevClose: 886, change: 6.30, changePercent: 0.71, volume: 8765432, marketCap: 56780, pe: 0, eps: -15.2, week52High: 998, week52Low: 310, dividendYield: 0 },
  { symbol: 'PIDILITIND', name: 'Pidilite Industries', sector: 'Chemical', exchange: 'NSE', price: 2987.60, open: 2965, high: 3005, low: 2950, prevClose: 2974, change: 13.60, changePercent: 0.46, volume: 456789, marketCap: 152430, pe: 71.4, eps: 41.8, week52High: 3374, week52Low: 2437, dividendYield: 0.67 },
  { symbol: 'DABUR', name: 'Dabur India', sector: 'FMCG', exchange: 'NSE', price: 512.30, open: 507, high: 518, low: 503, prevClose: 509, change: 3.30, changePercent: 0.65, volume: 3456789, marketCap: 90870, pe: 45.6, eps: 11.2, week52High: 613, week52Low: 481, dividendYield: 0.98 },
  { symbol: 'GODREJCP', name: 'Godrej Consumer Products', sector: 'FMCG', exchange: 'NSE', price: 1267.80, open: 1254, high: 1278, low: 1244, prevClose: 1260, change: 7.80, changePercent: 0.62, volume: 1234567, marketCap: 129870, pe: 56.7, eps: 22.4, week52High: 1451, week52Low: 988, dividendYield: 0.79 },
  { symbol: 'TATAPOWER', name: 'Tata Power Company', sector: 'Power', exchange: 'NSE', price: 456.80, open: 451, high: 462, low: 447, prevClose: 453, change: 3.80, changePercent: 0.84, volume: 12345678, marketCap: 146540, pe: 42.3, eps: 10.8, week52High: 514, week52Low: 278, dividendYield: 0.44 },
  { symbol: 'GRASIM', name: 'Grasim Industries', sector: 'Cement', exchange: 'NSE', price: 2456.70, open: 2435, high: 2472, low: 2420, prevClose: 2444, change: 12.70, changePercent: 0.52, volume: 1234567, marketCap: 161430, pe: 17.8, eps: 138.0, week52High: 2836, week52Low: 1695, dividendYield: 0.57 },
  { symbol: 'DIVISLAB', name: "Divi's Laboratories", sector: 'Pharma', exchange: 'NSE', price: 4789.30, open: 4754, high: 4812, low: 4730, prevClose: 4768, change: 21.30, changePercent: 0.45, volume: 456789, marketCap: 127240, pe: 57.8, eps: 82.8, week52High: 5362, week52Low: 3337, dividendYield: 0.63 },
  { symbol: 'EICHERMOT', name: 'Eicher Motors', sector: 'Auto', exchange: 'NSE', price: 4645.80, open: 4610, high: 4668, low: 4590, prevClose: 4628, change: 17.80, changePercent: 0.38, volume: 345678, marketCap: 127240, pe: 31.2, eps: 148.9, week52High: 5136, week52Low: 3457, dividendYield: 0.86 },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank', sector: 'Banking', exchange: 'NSE', price: 1078.40, open: 1065, high: 1089, low: 1058, prevClose: 1070, change: 8.40, changePercent: 0.79, volume: 4567890, marketCap: 83450, pe: 9.4, eps: 114.7, week52High: 1694, week52Low: 964, dividendYield: 1.11 },
  { symbol: 'COALINDIA', name: 'Coal India', sector: 'Mining', exchange: 'NSE', price: 478.60, open: 473, high: 484, low: 468, prevClose: 475, change: 3.60, changePercent: 0.76, volume: 9876543, marketCap: 294530, pe: 7.4, eps: 64.7, week52High: 544, week52Low: 375, dividendYield: 5.98 },
  { symbol: 'JSWSTEEL', name: 'JSW Steel', sector: 'Steel', exchange: 'NSE', price: 934.50, open: 925, high: 942, low: 918, prevClose: 928, change: 6.50, changePercent: 0.70, volume: 5678901, marketCap: 229430, pe: 12.8, eps: 73.0, week52High: 1069, week52Low: 703, dividendYield: 1.07 },
  { symbol: 'TECHM', name: 'Tech Mahindra', sector: 'IT', exchange: 'NSE', price: 1567.30, open: 1551, high: 1579, low: 1538, prevClose: 1558, change: 9.30, changePercent: 0.60, volume: 2345678, marketCap: 152430, pe: 32.1, eps: 48.8, week52High: 1795, week52Low: 1059, dividendYield: 1.91 },
  { symbol: 'BRITANNIA', name: 'Britannia Industries', sector: 'FMCG', exchange: 'NSE', price: 5234.80, open: 5198, high: 5259, low: 5171, prevClose: 5212, change: 22.80, changePercent: 0.44, volume: 123456, marketCap: 125780, pe: 54.3, eps: 96.4, week52High: 5999, week52Low: 4441, dividendYield: 1.34 },
  { symbol: 'CIPLA', name: 'Cipla', sector: 'Pharma', exchange: 'NSE', price: 1534.60, open: 1519, high: 1548, low: 1508, prevClose: 1525, change: 9.60, changePercent: 0.63, volume: 2345678, marketCap: 123870, pe: 27.4, eps: 56.0, week52High: 1697, week52Low: 1078, dividendYield: 0.52 },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp', sector: 'Auto', exchange: 'NSE', price: 4678.40, open: 4645, high: 4700, low: 4621, prevClose: 4660, change: 18.40, changePercent: 0.39, volume: 456789, marketCap: 93540, pe: 21.4, eps: 218.6, week52High: 5323, week52Low: 3206, dividendYield: 2.35 },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals', sector: 'Healthcare', exchange: 'NSE', price: 6789.30, open: 6745, high: 6820, low: 6710, prevClose: 6758, change: 31.30, changePercent: 0.46, volume: 345678, marketCap: 97230, pe: 78.4, eps: 86.6, week52High: 7326, week52Low: 4735, dividendYield: 0.22 },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corp', sector: 'Energy', exchange: 'NSE', price: 567.80, open: 561, high: 574, low: 556, prevClose: 563, change: 4.80, changePercent: 0.85, volume: 8765432, marketCap: 123210, pe: 10.4, eps: 54.6, week52High: 736, week52Low: 440, dividendYield: 4.94 },
  { symbol: 'SHREECEM', name: 'Shree Cement', sector: 'Cement', exchange: 'NSE', price: 28456.70, open: 28250, high: 28590, low: 28150, prevClose: 28320, change: 136.70, changePercent: 0.48, volume: 45678, marketCap: 102540, pe: 45.6, eps: 624.1, week52High: 32300, week52Low: 22100, dividendYield: 0.17 },
  { symbol: 'HINDALCO', name: 'Hindalco Industries', sector: 'Metal', exchange: 'NSE', price: 678.90, open: 671, high: 685, low: 665, prevClose: 674, change: 4.90, changePercent: 0.73, volume: 6789012, marketCap: 152430, pe: 10.8, eps: 62.9, week52High: 772, week52Low: 432, dividendYield: 0.74 },
  { symbol: 'TATACONSUM', name: 'Tata Consumer Products', sector: 'FMCG', exchange: 'NSE', price: 1123.40, open: 1111, high: 1135, low: 1104, prevClose: 1115, change: 8.40, changePercent: 0.75, volume: 2345678, marketCap: 103540, pe: 62.4, eps: 18.0, week52High: 1264, week52Low: 826, dividendYield: 0.80 },
];

// NIFTY 50 composite (uses top 50 stocks)
export const INDICES: Index[] = [
  { name: 'NIFTY 50', value: 24198.85, change: 148.50, changePercent: 0.62, high: 24260, low: 24080 },
  { name: 'NIFTY NEXT 50', value: 68342.15, change: 392.20, changePercent: 0.58, high: 68450, low: 67890 },
  { name: 'SENSEX', value: 79876.45, change: 523.30, changePercent: 0.66, high: 80012, low: 79540 },
  { name: 'NIFTY BANK', value: 51234.60, change: 245.80, changePercent: 0.48, high: 51380, low: 50980 },
  { name: 'NIFTY IT', value: 38456.90, change: 312.40, changePercent: 0.82, high: 38590, low: 38280 },
  { name: 'NIFTY PHARMA', value: 21345.70, change: 178.50, changePercent: 0.84, high: 21420, low: 21234 },
  { name: 'NIFTY AUTO', value: 22567.80, change: 145.60, changePercent: 0.65, high: 22640, low: 22478 },
  { name: 'NIFTY FMCG', value: 57890.40, change: 289.30, changePercent: 0.50, high: 57980, low: 57690 },
];

// Check if market is open (NSE: 9:15 AM - 3:30 PM, Mon-Fri IST)
export function isMarketOpen(): boolean {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay();
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const marketOpen = 9 * 60 + 15;
  const marketClose = 15 * 60 + 30;
  return day >= 1 && day <= 5 && totalMinutes >= marketOpen && totalMinutes <= marketClose;
}

// Generate realistic OHLCV historical data
export function generateHistoricalData(basePrice: number, periods: number, interval: TimeFrame): OHLCV[] {
  const data: OHLCV[] = [];
  let currentPrice = basePrice * (0.85 + Math.random() * 0.1);
  const now = Date.now();
  let intervalMs = 60000;
  
  switch (interval) {
    case '1m': intervalMs = 60 * 1000; break;
    case '5m': intervalMs = 5 * 60 * 1000; break;
    case '15m': intervalMs = 15 * 60 * 1000; break;
    case '1H': intervalMs = 60 * 60 * 1000; break;
    case '1D': intervalMs = 24 * 60 * 60 * 1000; break;
    case '1W': intervalMs = 7 * 24 * 60 * 60 * 1000; break;
    case '1M': intervalMs = 30 * 24 * 60 * 60 * 1000; break;
  }

  const volatility = interval === '1m' ? 0.003 : interval === '5m' ? 0.005 : interval === '15m' ? 0.008 : interval === '1H' ? 0.012 : 0.018;
  const trend = (basePrice / currentPrice - 1) / periods;

  for (let i = periods; i >= 0; i--) {
    const time = Math.floor((now - i * intervalMs) / 1000);
    const change = (Math.random() - 0.48) * volatility + trend;
    const open = currentPrice;
    currentPrice = currentPrice * (1 + change);
    const high = Math.max(open, currentPrice) * (1 + Math.random() * volatility * 0.5);
    const low = Math.min(open, currentPrice) * (1 - Math.random() * volatility * 0.5);
    const volume = Math.floor(100000 + Math.random() * 500000);
    
    data.push({
      time,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(currentPrice.toFixed(2)),
      volume
    });
  }

  return data;
}

// Simulate live price tick
export function simulatePriceTick(stock: Stock): Stock {
  const open = isMarketOpen();
  if (!open) return stock;

  const volatility = 0.002 + Math.random() * 0.003;
  const change = (Math.random() - 0.495) * volatility;
  const newPrice = parseFloat((stock.price * (1 + change)).toFixed(2));
  const totalChange = newPrice - stock.prevClose;
  const totalChangePercent = (totalChange / stock.prevClose) * 100;
  
  return {
    ...stock,
    price: newPrice,
    high: Math.max(stock.high, newPrice),
    low: Math.min(stock.low, newPrice),
    change: parseFloat(totalChange.toFixed(2)),
    changePercent: parseFloat(totalChangePercent.toFixed(2)),
    volume: stock.volume + Math.floor(Math.random() * 1000),
  };
}

// Simulate index tick
export function simulateIndexTick(index: Index): Index {
  if (!isMarketOpen()) return index;
  const volatility = 0.001 + Math.random() * 0.002;
  const change = (Math.random() - 0.495) * volatility;
  const newValue = parseFloat((index.value * (1 + change)).toFixed(2));
  const baseValue = newValue / (1 + index.changePercent / 100);
  const totalChange = newValue - baseValue;
  return {
    ...index,
    value: newValue,
    change: parseFloat(totalChange.toFixed(2)),
    changePercent: parseFloat(((totalChange / baseValue) * 100).toFixed(2)),
    high: Math.max(index.high, newValue),
    low: Math.min(index.low, newValue),
  };
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(2)}K`;
  return `₹${amount.toFixed(2)}`;
}

export function formatLargeNumber(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(2)}K`;
  return n.toFixed(0);
}
