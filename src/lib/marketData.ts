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
  capCategory: 'large' | 'mid' | 'small';
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

// Helper to create stock
const s = (symbol: string, name: string, sector: string, exchange: 'NSE' | 'BSE', price: number, changePercent: number, volume: number, marketCap: number, pe: number, dividendYield: number, capCategory: 'large' | 'mid' | 'small'): Stock => {
  const change = parseFloat((price * changePercent / 100).toFixed(2));
  const prevClose = parseFloat((price - change).toFixed(2));
  return {
    symbol, name, sector, exchange, price, open: parseFloat((price * 0.998).toFixed(2)),
    high: parseFloat((price * 1.005).toFixed(2)), low: parseFloat((price * 0.993).toFixed(2)),
    prevClose, change, changePercent, volume, marketCap, pe, eps: parseFloat((price / pe).toFixed(2)),
    week52High: parseFloat((price * 1.25).toFixed(2)), week52Low: parseFloat((price * 0.78).toFixed(2)),
    dividendYield, capCategory
  };
};

export const STOCKS_DATA: Stock[] = [
  // LARGE CAP - Nifty 50
  s('RELIANCE', 'Reliance Industries', 'Energy', 'NSE', 2847.50, 0.62, 8543210, 1924500, 22.4, 0.35, 'large'),
  s('TCS', 'Tata Consultancy Services', 'IT', 'NSE', 3542.80, 0.65, 3421890, 1289500, 28.3, 1.12, 'large'),
  s('HDFCBANK', 'HDFC Bank', 'Banking', 'NSE', 1678.45, 0.51, 12453670, 1264300, 18.7, 1.24, 'large'),
  s('INFY', 'Infosys', 'IT', 'NSE', 1489.20, 0.62, 7654320, 618540, 23.8, 2.34, 'large'),
  s('ICICIBANK', 'ICICI Bank', 'Banking', 'NSE', 1124.60, 0.59, 9876540, 791250, 16.2, 0.89, 'large'),
  s('HINDUNILVR', 'Hindustan Unilever', 'FMCG', 'NSE', 2234.75, 0.44, 2345670, 524800, 52.4, 1.45, 'large'),
  s('BAJFINANCE', 'Bajaj Finance', 'NBFC', 'NSE', 7234.50, 0.48, 1234560, 435200, 33.6, 0.28, 'large'),
  s('WIPRO', 'Wipro', 'IT', 'NSE', 478.30, 0.69, 5643210, 247890, 19.4, 0.21, 'large'),
  s('KOTAKBANK', 'Kotak Mahindra Bank', 'Banking', 'NSE', 1789.60, 0.54, 3456780, 355430, 21.3, 0.11, 'large'),
  s('BHARTIARTL', 'Bharti Airtel', 'Telecom', 'NSE', 1634.85, 0.61, 4567890, 918760, 85.4, 0.36, 'large'),
  s('ASIANPAINT', 'Asian Paints', 'Consumer', 'NSE', 2978.40, 0.45, 1234567, 285430, 62.3, 0.97, 'large'),
  s('MARUTI', 'Maruti Suzuki India', 'Auto', 'NSE', 12456.70, 0.46, 456789, 376540, 26.8, 0.88, 'large'),
  s('SUNPHARMA', 'Sun Pharmaceutical', 'Pharma', 'NSE', 1756.30, 0.47, 2345678, 421230, 35.7, 0.74, 'large'),
  s('LTIM', 'LTIMindtree', 'IT', 'NSE', 5234.60, 0.32, 876543, 155430, 31.4, 0.57, 'large'),
  s('TATAMOTORS', 'Tata Motors', 'Auto', 'NSE', 978.45, 0.66, 8765432, 363200, 8.4, 0.20, 'large'),
  s('HCLTECH', 'HCL Technologies', 'IT', 'NSE', 1678.90, 0.65, 3456789, 456780, 24.6, 3.21, 'large'),
  s('AXISBANK', 'Axis Bank', 'Banking', 'NSE', 1123.40, 0.66, 6543210, 346540, 12.8, 0.09, 'large'),
  s('ONGC', 'Oil & Natural Gas Corp', 'Energy', 'NSE', 267.80, 1.06, 23456789, 337650, 6.8, 4.85, 'large'),
  s('SBIN', 'State Bank of India', 'Banking', 'NSE', 812.30, 0.78, 18765432, 724500, 10.4, 1.60, 'large'),
  s('MM', 'Mahindra & Mahindra', 'Auto', 'NSE', 2978.60, 0.53, 2345678, 370450, 28.7, 0.54, 'large'),
  s('NTPC', 'NTPC', 'Power', 'NSE', 389.45, 0.89, 12345678, 377430, 16.8, 2.54, 'large'),
  s('POWERGRID', 'Power Grid Corp', 'Power', 'NSE', 321.70, 0.85, 9876543, 299340, 18.4, 3.85, 'large'),
  s('TITAN', 'Titan Company', 'Consumer', 'NSE', 3456.80, 0.43, 1234567, 306870, 89.4, 0.35, 'large'),
  s('ULTRACEMCO', 'UltraTech Cement', 'Cement', 'NSE', 11234.50, 0.49, 234567, 324560, 35.2, 0.35, 'large'),
  s('NESTLEIND', 'Nestle India', 'FMCG', 'NSE', 2278.40, 0.59, 345678, 219540, 74.3, 1.62, 'large'),
  s('BAJAJFINSV', 'Bajaj Finserv', 'NBFC', 'NSE', 1678.90, 0.65, 2345678, 267540, 28.4, 0.06, 'large'),
  s('DRREDDY', "Dr Reddy's Laboratories", 'Pharma', 'NSE', 1289.60, 0.75, 1234567, 214560, 19.8, 0.39, 'large'),
  s('ADANIENT', 'Adani Enterprises', 'Diversified', 'NSE', 2892.45, 0.61, 3456789, 329450, 68.4, 0.07, 'large'),
  s('ZOMATO', 'Zomato', 'Internet', 'NSE', 267.40, 1.29, 45678901, 237540, 312.4, 0, 'large'),
  s('PIDILITIND', 'Pidilite Industries', 'Chemical', 'NSE', 2987.60, 0.46, 456789, 152430, 71.4, 0.67, 'large'),
  s('DABUR', 'Dabur India', 'FMCG', 'NSE', 512.30, 0.65, 3456789, 90870, 45.6, 0.98, 'large'),
  s('GODREJCP', 'Godrej Consumer Products', 'FMCG', 'NSE', 1267.80, 0.62, 1234567, 129870, 56.7, 0.79, 'large'),
  s('TATAPOWER', 'Tata Power Company', 'Power', 'NSE', 456.80, 0.84, 12345678, 146540, 42.3, 0.44, 'large'),
  s('GRASIM', 'Grasim Industries', 'Cement', 'NSE', 2456.70, 0.52, 1234567, 161430, 17.8, 0.57, 'large'),
  s('DIVISLAB', "Divi's Laboratories", 'Pharma', 'NSE', 4789.30, 0.45, 456789, 127240, 57.8, 0.63, 'large'),
  s('EICHERMOT', 'Eicher Motors', 'Auto', 'NSE', 4645.80, 0.38, 345678, 127240, 31.2, 0.86, 'large'),
  s('INDUSINDBK', 'IndusInd Bank', 'Banking', 'NSE', 1078.40, 0.79, 4567890, 83450, 9.4, 1.11, 'large'),
  s('COALINDIA', 'Coal India', 'Mining', 'NSE', 478.60, 0.76, 9876543, 294530, 7.4, 5.98, 'large'),
  s('JSWSTEEL', 'JSW Steel', 'Steel', 'NSE', 934.50, 0.70, 5678901, 229430, 12.8, 1.07, 'large'),
  s('TECHM', 'Tech Mahindra', 'IT', 'NSE', 1567.30, 0.60, 2345678, 152430, 32.1, 1.91, 'large'),
  s('BRITANNIA', 'Britannia Industries', 'FMCG', 'NSE', 5234.80, 0.44, 123456, 125780, 54.3, 1.34, 'large'),
  s('CIPLA', 'Cipla', 'Pharma', 'NSE', 1534.60, 0.63, 2345678, 123870, 27.4, 0.52, 'large'),
  s('HEROMOTOCO', 'Hero MotoCorp', 'Auto', 'NSE', 4678.40, 0.39, 456789, 93540, 21.4, 2.35, 'large'),
  s('APOLLOHOSP', 'Apollo Hospitals', 'Healthcare', 'NSE', 6789.30, 0.46, 345678, 97230, 78.4, 0.22, 'large'),
  s('BPCL', 'Bharat Petroleum Corp', 'Energy', 'NSE', 567.80, 0.85, 8765432, 123210, 10.4, 4.94, 'large'),
  s('SHREECEM', 'Shree Cement', 'Cement', 'NSE', 28456.70, 0.48, 45678, 102540, 45.6, 0.17, 'large'),
  s('HINDALCO', 'Hindalco Industries', 'Metal', 'NSE', 678.90, 0.73, 6789012, 152430, 10.8, 0.74, 'large'),
  s('TATACONSUM', 'Tata Consumer Products', 'FMCG', 'NSE', 1123.40, 0.75, 2345678, 103540, 62.4, 0.80, 'large'),
  s('LT', 'Larsen & Toubro', 'Engineering', 'NSE', 3567.80, 0.85, 3456789, 489540, 32.4, 0.67, 'large'),
  s('ADANIPORTS', 'Adani Ports & SEZ', 'Infrastructure', 'NSE', 1398.50, 1.12, 4567890, 302340, 25.6, 0.43, 'large'),

  // MID CAP
  s('MUTHOOTFIN', 'Muthoot Finance', 'NBFC', 'NSE', 1834.60, 0.92, 1234567, 73450, 17.4, 1.09, 'mid'),
  s('CHOLAFIN', 'Cholamandalam Investment', 'NBFC', 'NSE', 1456.30, 1.15, 2345678, 119870, 24.6, 0.28, 'mid'),
  s('PERSISTENT', 'Persistent Systems', 'IT', 'NSE', 5678.90, 1.34, 456789, 87540, 48.6, 0.35, 'mid'),
  s('COFORGE', 'Coforge', 'IT', 'NSE', 7234.50, 1.56, 345678, 48780, 45.2, 0.55, 'mid'),
  s('MPHASIS', 'Mphasis', 'IT', 'NSE', 2567.80, 0.87, 567890, 48230, 29.4, 1.17, 'mid'),
  s('SUPREMEIND', 'Supreme Industries', 'Plastic', 'NSE', 4567.90, 1.23, 234567, 57890, 38.7, 0.54, 'mid'),
  s('KANSAINER', 'Kansai Nerolac Paints', 'Consumer', 'NSE', 312.40, 0.67, 1234567, 28340, 29.8, 0.96, 'mid'),
  s('BERGEPAINT', 'Berger Paints India', 'Consumer', 'NSE', 534.60, 0.78, 2345678, 51870, 55.4, 0.56, 'mid'),
  s('ATUL', 'Atul Ltd', 'Chemical', 'NSE', 6789.30, 1.45, 123456, 19870, 32.6, 0.74, 'mid'),
  s('PIIND', 'PI Industries', 'Agro Chemical', 'NSE', 3456.70, 1.23, 234567, 52350, 34.8, 0.29, 'mid'),
  s('ASTRAL', 'Astral Poly Technik', 'Plastic', 'NSE', 1876.40, 0.98, 567890, 49870, 64.2, 0.27, 'mid'),
  s('POLYCAB', 'Polycab India', 'Electrical', 'NSE', 5678.90, 1.67, 345678, 84560, 38.4, 0.53, 'mid'),
  s('HAVELLS', 'Havells India', 'Electrical', 'NSE', 1634.50, 0.89, 1234567, 102340, 54.6, 0.61, 'mid'),
  s('VOLTAS', 'Voltas', 'Consumer Durables', 'NSE', 1456.70, 1.12, 987654, 48560, 48.2, 0.41, 'mid'),
  s('BLUEDART', 'Blue Dart Express', 'Logistics', 'NSE', 6789.40, 0.76, 45678, 16120, 42.8, 0.44, 'mid'),
  s('CONCOR', 'Container Corporation', 'Logistics', 'NSE', 789.30, 0.56, 1234567, 52340, 34.6, 0.76, 'mid'),
  s('ABBOTINDIA', 'Abbott India', 'Pharma', 'NSE', 24567.80, 0.45, 23456, 52040, 38.4, 0.81, 'mid'),
  s('ALKEM', 'Alkem Laboratories', 'Pharma', 'NSE', 5234.60, 0.67, 123456, 62450, 28.6, 0.57, 'mid'),
  s('TORNTPHARM', 'Torrent Pharmaceuticals', 'Pharma', 'NSE', 3234.70, 0.89, 234567, 54670, 32.4, 0.62, 'mid'),
  s('AUROPHARMA', 'Aurobindo Pharma', 'Pharma', 'NSE', 1234.50, 1.23, 2345678, 72340, 18.4, 0.49, 'mid'),
  s('LUPIN', 'Lupin', 'Pharma', 'NSE', 1876.40, 0.94, 1234567, 84560, 24.6, 0.53, 'mid'),
  s('BALKRISIND', 'Balkrishna Industries', 'Tyre', 'NSE', 2678.90, 1.45, 345678, 51870, 26.8, 0.75, 'mid'),
  s('MRF', 'MRF', 'Tyre', 'NSE', 128456.70, 0.34, 12345, 54560, 24.6, 0.31, 'mid'),
  s('APOLLOTYRE', 'Apollo Tyres', 'Tyre', 'NSE', 456.70, 1.12, 3456789, 28960, 14.8, 0.66, 'mid'),
  s('CEATLTD', 'CEAT', 'Tyre', 'NSE', 3234.50, 0.98, 234567, 13040, 19.4, 0.62, 'mid'),
  s('OFSS', 'Oracle Financial Services', 'IT', 'NSE', 9234.60, 0.56, 123456, 79560, 28.4, 5.43, 'mid'),
  s('KPIT', 'KPIT Technologies', 'IT', 'NSE', 1634.50, 1.89, 1234567, 44560, 56.4, 0.31, 'mid'),
  s('TANLA', 'Tanla Platforms', 'IT', 'NSE', 987.30, 1.56, 876543, 13450, 18.4, 0.51, 'mid'),
  s('TATAELXSI', 'Tata Elxsi', 'IT', 'NSE', 6789.30, 0.78, 234567, 42340, 42.6, 0.74, 'mid'),
  s('ZEEL', 'Zee Entertainment', 'Media', 'NSE', 145.60, -0.89, 12345678, 13450, 0, 0, 'mid'),
  s('PVRINOX', 'PVR INOX', 'Entertainment', 'NSE', 1456.70, 0.67, 876543, 13560, 85.4, 0, 'mid'),
  s('IRCTC', 'Indian Railway Catering', 'Tourism', 'NSE', 789.30, 1.23, 3456789, 63450, 42.6, 1.27, 'mid'),
  s('INDIAMART', 'IndiaMart InterMESH', 'Internet', 'NSE', 2567.80, 0.89, 234567, 15450, 34.8, 0.78, 'mid'),
  s('NAUKRI', 'Info Edge India', 'Internet', 'NSE', 6234.50, 0.45, 345678, 80560, 112.4, 0.48, 'mid'),
  s('JUSTDIAL', 'Just Dial', 'Internet', 'NSE', 1234.50, 1.56, 567890, 10230, 28.6, 0, 'mid'),
  s('ANGELONE', 'Angel One', 'Fintech', 'NSE', 2456.70, 2.34, 1234567, 22340, 18.4, 1.63, 'mid'),
  s('CDSL', 'CDSL', 'Financial Services', 'NSE', 1678.90, 1.78, 2345678, 17560, 42.6, 0.60, 'mid'),
  s('BSE', 'BSE', 'Exchange', 'NSE', 3456.70, 2.12, 567890, 46870, 38.4, 0.58, 'mid'),
  s('MCX', 'Multi Commodity Exchange', 'Exchange', 'NSE', 5234.80, 1.67, 345678, 26780, 48.6, 0.48, 'mid'),
  s('NIACL', 'New India Assurance', 'Insurance', 'NSE', 178.60, 0.45, 3456789, 29340, 12.4, 2.24, 'mid'),
  s('STARHEALTH', 'Star Health Insurance', 'Insurance', 'NSE', 456.70, 0.89, 2345678, 26560, 0, 0, 'mid'),
  s('KAJARIACER', 'Kajaria Ceramics', 'Building Materials', 'NSE', 1234.50, 1.12, 567890, 19560, 32.4, 0.97, 'mid'),
  s('CENTURYPLY', 'Century Plyboards', 'Building Materials', 'NSE', 678.90, 1.45, 1234567, 15120, 28.6, 0.44, 'mid'),
  s('GREENPLY', 'Greenply Industries', 'Building Materials', 'NSE', 345.60, 1.23, 876543, 4230, 24.8, 0, 'mid'),
  s('WHIRLPOOL', 'Whirlpool of India', 'Consumer Durables', 'NSE', 1567.80, 0.67, 234567, 19890, 0, 0, 'mid'),
  s('CROMPTON', 'Crompton Greaves Consumer', 'Consumer Durables', 'NSE', 345.60, 1.34, 2345678, 22340, 32.4, 0.87, 'mid'),
  s('DIXON', 'Dixon Technologies', 'Electronics', 'NSE', 12456.70, 2.34, 234567, 74560, 112.4, 0.12, 'mid'),
  s('AMBER', 'Amber Enterprises', 'Electronics', 'NSE', 4567.80, 1.89, 123456, 15230, 45.6, 0, 'mid'),
  s('BATAINDIA', 'Bata India', 'Footwear', 'NSE', 1456.70, 0.78, 456789, 18760, 48.4, 0.69, 'mid'),
  s('RELAXO', 'Relaxo Footwears', 'Footwear', 'NSE', 745.60, 0.56, 345678, 18540, 56.8, 0.40, 'mid'),
  s('VGUARD', 'V-Guard Industries', 'Electrical', 'NSE', 345.80, 1.12, 1234567, 15670, 38.4, 0.58, 'mid'),
  s('RBLBANK', 'RBL Bank', 'Banking', 'NSE', 178.60, -0.45, 8765432, 10780, 8.4, 1.12, 'mid'),
  s('FEDERALBNK', 'Federal Bank', 'Banking', 'NSE', 178.90, 0.89, 12345678, 37890, 9.4, 1.12, 'mid'),
  s('SOUTHBNK', 'South Indian Bank', 'Banking', 'NSE', 24.56, 1.23, 23456789, 6230, 7.4, 1.63, 'mid'),
  s('DCBBANK', 'DCB Bank', 'Banking', 'NSE', 112.30, 0.78, 3456789, 3560, 9.4, 1.07, 'mid'),

  // SMALL CAP
  s('NATCOPHARM', 'Natco Pharma', 'Pharma', 'NSE', 1456.70, 2.34, 234567, 25670, 18.4, 0.69, 'small'),
  s('GRANULES', 'Granules India', 'Pharma', 'NSE', 567.80, 1.78, 1234567, 14230, 15.6, 0.53, 'small'),
  s('ERIS', 'Eris Lifesciences', 'Pharma', 'NSE', 1234.50, 1.45, 345678, 16780, 22.4, 0.81, 'small'),
  s('SUVEN', 'Suven Pharmaceuticals', 'Pharma', 'NSE', 789.30, 2.12, 456789, 20340, 34.6, 0, 'small'),
  s('SEQUENT', 'SeQuent Scientific', 'Pharma', 'NSE', 145.60, 1.56, 2345678, 4560, 0, 0, 'small'),
  s('CAPLIPOINT', 'Caplin Point Laboratories', 'Pharma', 'NSE', 2345.60, 2.45, 123456, 17230, 24.8, 0.43, 'small'),
  s('IDFCFIRSTB', 'IDFC First Bank', 'Banking', 'NSE', 67.80, -0.56, 34567890, 44560, 24.6, 0, 'small'),
  s('UJJIVANSFB', 'Ujjivan Small Finance', 'Banking', 'NSE', 34.56, 1.23, 12345678, 6780, 7.4, 2.31, 'small'),
  s('EQUITASBNK', 'Equitas Small Finance', 'Banking', 'NSE', 89.60, 0.89, 8765432, 9870, 9.6, 1.12, 'small'),
  s('SURYAROSNI', 'Surya Roshni', 'Electrical', 'NSE', 456.70, 1.89, 567890, 4230, 14.8, 0.44, 'small'),
  s('KPRMILL', 'KPR Mill', 'Textile', 'NSE', 678.90, 1.56, 456789, 9870, 18.6, 0.59, 'small'),
  s('VARDHMAN', 'Vardhman Textiles', 'Textile', 'NSE', 456.70, 0.89, 234567, 8900, 12.4, 0.88, 'small'),
  s('PAGEIND', 'Page Industries', 'Textile', 'NSE', 34567.80, 0.34, 12345, 38670, 62.4, 0.87, 'small'),
  s('ALKYLAMINE', 'Alkyl Amines Chemicals', 'Chemical', 'NSE', 2234.50, 1.67, 123456, 11230, 28.6, 0.54, 'small'),
  s('FINPIPE', 'Finolex Industries', 'Plastic', 'NSE', 234.50, 1.12, 1234567, 9230, 18.4, 1.28, 'small'),
  s('JYOTHYLAB', 'Jyothy Labs', 'FMCG', 'NSE', 456.70, 1.34, 2345678, 16780, 38.4, 1.31, 'small'),
  s('EMAMILTD', 'Emami', 'FMCG', 'NSE', 678.90, 0.89, 1234567, 14560, 32.6, 2.06, 'small'),
  s('MARICO', 'Marico', 'FMCG', 'NSE', 789.30, 0.78, 2345678, 102340, 48.4, 1.52, 'small'),
  s('REDINGTON', 'Redington India', 'IT Distribution', 'NSE', 234.50, 1.23, 2345678, 9870, 12.6, 2.13, 'small'),
  s('NETWORK18', 'Network18 Media', 'Media', 'NSE', 89.60, -0.45, 8765432, 7890, 0, 0, 'small'),
  s('TV18BRDCST', 'TV18 Broadcast', 'Media', 'NSE', 34.56, -0.89, 12345678, 3450, 0, 0, 'small'),
  s('HFCL', 'HFCL', 'Telecom Equipment', 'NSE', 123.40, 2.34, 12345678, 9870, 24.8, 0.41, 'small'),
  s('STLTECH', 'Sterlite Technologies', 'Telecom Equipment', 'NSE', 156.70, 1.78, 5678901, 6780, 0, 0, 'small'),
  s('RAILTEL', 'RailTel Corporation', 'Telecom', 'NSE', 456.70, 2.12, 2345678, 14560, 34.6, 0.55, 'small'),
  s('IRFC', 'Indian Railway Finance', 'Financial Services', 'NSE', 178.90, 1.56, 12345678, 234560, 18.4, 0.84, 'small'),
  s('RVNL', 'Rail Vikas Nigam', 'Infrastructure', 'NSE', 456.70, 2.34, 8765432, 95560, 28.6, 0.66, 'small'),
  s('PNBHOUSING', 'PNB Housing Finance', 'NBFC', 'NSE', 1023.40, 1.45, 1234567, 16780, 14.8, 0, 'small'),
  s('ICICIGI', 'ICICI Lombard', 'Insurance', 'NSE', 1789.30, 0.89, 567890, 88450, 32.4, 0.59, 'small'),
  s('HDFCLIFE', 'HDFC Life Insurance', 'Insurance', 'NSE', 654.30, 0.67, 3456789, 140560, 74.6, 0.31, 'small'),
  s('SBILIFE', 'SBI Life Insurance', 'Insurance', 'NSE', 1567.80, 0.78, 2345678, 156780, 68.4, 0.24, 'small'),
  s('MANAPPURAM', 'Manappuram Finance', 'NBFC', 'NSE', 178.90, 0.89, 8765432, 15120, 9.4, 2.23, 'small'),
  s('CREDITACC', 'CreditAccess Grameen', 'Microfinance', 'NSE', 1234.50, 1.45, 567890, 19560, 18.4, 0, 'small'),
  s('SPANDANA', 'Spandana Sphoorty', 'Microfinance', 'NSE', 567.80, 1.23, 456789, 7890, 12.6, 0, 'small'),
  s('UTIAMC', 'UTI Asset Management', 'Asset Management', 'NSE', 1234.50, 0.89, 234567, 15670, 22.4, 2.44, 'small'),
  s('HDFCAMC', 'HDFC Asset Management', 'Asset Management', 'NSE', 3678.90, 0.78, 345678, 77890, 34.6, 1.36, 'small'),
  s('NIPPONLIFE', 'Nippon Life India AMC', 'Asset Management', 'NSE', 567.80, 1.12, 1234567, 34560, 28.8, 1.41, 'small'),
  s('CAMS', 'Computer Age Management', 'Financial Technology', 'NSE', 3456.70, 0.67, 123456, 16780, 42.6, 1.74, 'small'),
  s('KFINTECH', 'KFin Technologies', 'Financial Technology', 'NSE', 789.30, 1.34, 567890, 12450, 38.4, 0.76, 'small'),
  s('INFIBEAM', 'Infibeam Avenues', 'Fintech', 'NSE', 34.56, 2.34, 23456789, 9870, 28.6, 0, 'small'),
  s('PAYTM', 'One 97 Communications', 'Fintech', 'NSE', 892.30, 0.71, 8765432, 56780, 0, 0, 'small'),
  s('POLICYBZR', 'PB Fintech', 'Fintech', 'NSE', 1789.30, 1.89, 1234567, 80560, 0, 0, 'small'),
  s('CARTRADE', 'CarTrade Tech', 'Internet', 'NSE', 1234.50, 1.45, 234567, 5670, 0, 0, 'small'),
  s('NYKAA', 'FSN E-Commerce', 'E-Commerce', 'NSE', 178.90, 1.23, 8765432, 51230, 0, 0, 'small'),
  s('DELHIVERY', 'Delhivery', 'Logistics', 'NSE', 456.70, 1.56, 3456789, 33450, 0, 0, 'small'),
  s('XPRO', 'Xpro India', 'Plastic Films', 'NSE', 1567.80, 3.45, 234567, 3450, 14.8, 0, 'small'),
  s('GRAVITA', 'Gravita India', 'Metal Recycling', 'NSE', 2345.60, 2.12, 345678, 8900, 24.6, 0.43, 'small'),
  s('GOLDIAM', 'Goldiam International', 'Gems & Jewellery', 'NSE', 456.70, 1.89, 567890, 3450, 18.4, 0.88, 'small'),
  s('KALYANKJIL', 'Kalyan Jewellers', 'Gems & Jewellery', 'NSE', 567.80, 1.34, 3456789, 56780, 45.6, 0.35, 'small'),
  s('SENCO', 'Senco Gold', 'Gems & Jewellery', 'NSE', 789.30, 1.23, 456789, 8900, 32.4, 0.25, 'small'),
  s('DOMS', 'DOMS Industries', 'Stationery', 'NSE', 2567.80, 2.34, 123456, 18900, 48.6, 0, 'small'),
  s('IDEAFORGE', 'ideaForge Technology', 'Drones', 'NSE', 456.70, 3.45, 456789, 3450, 0, 0, 'small'),
  s('BIKAJI', 'Bikaji Foods', 'FMCG', 'NSE', 789.30, 1.78, 567890, 18900, 56.4, 0, 'small'),
  s('CAMPUS', 'Campus Activewear', 'Footwear', 'NSE', 245.60, 1.12, 1234567, 7120, 48.6, 0, 'small'),
  s('VEDL', 'Vedanta', 'Mining', 'NSE', 456.70, 1.34, 12345678, 169560, 12.4, 8.77, 'small'),
  s('NMDC', 'NMDC', 'Mining', 'NSE', 234.50, 0.89, 8765432, 68790, 8.4, 4.68, 'small'),
];

// NIFTY 50 composite
export const INDICES: Index[] = [
  { name: 'NIFTY 50', value: 24198.85, change: 148.50, changePercent: 0.62, high: 24260, low: 24080 },
  { name: 'NIFTY NEXT 50', value: 68342.15, change: 392.20, changePercent: 0.58, high: 68450, low: 67890 },
  { name: 'SENSEX', value: 79876.45, change: 523.30, changePercent: 0.66, high: 80012, low: 79540 },
  { name: 'NIFTY BANK', value: 51234.60, change: 245.80, changePercent: 0.48, high: 51380, low: 50980 },
  { name: 'NIFTY IT', value: 38456.90, change: 312.40, changePercent: 0.82, high: 38590, low: 38280 },
  { name: 'NIFTY PHARMA', value: 21345.70, change: 178.50, changePercent: 0.84, high: 21420, low: 21234 },
  { name: 'NIFTY AUTO', value: 22567.80, change: 145.60, changePercent: 0.65, high: 22640, low: 22478 },
  { name: 'NIFTY FMCG', value: 57890.40, change: 289.30, changePercent: 0.50, high: 57980, low: 57690 },
  { name: 'NIFTY MIDCAP 100', value: 56789.30, change: 456.20, changePercent: 0.81, high: 56980, low: 56340 },
  { name: 'NIFTY SMALLCAP', value: 18345.60, change: 234.10, changePercent: 1.29, high: 18490, low: 18120 },
  { name: 'NIFTY REALTY', value: 1023.45, change: 18.50, changePercent: 1.84, high: 1034, low: 1008 },
  { name: 'NIFTY METAL', value: 9234.50, change: 123.40, changePercent: 1.35, high: 9290, low: 9145 },
];

// Indian Market Holidays 2024-2025 (NSE)
const MARKET_HOLIDAYS_2025 = [
  '2025-01-14', // Makar Sankranti
  '2025-02-26', // Mahashivratri
  '2025-03-14', // Holi
  '2025-04-10', // Ram Navami
  '2025-04-14', // Dr. Ambedkar Jayanti
  '2025-04-18', // Good Friday
  '2025-05-01', // Maharashtra Day
  '2025-08-15', // Independence Day
  '2025-08-27', // Ganesh Chaturthi
  '2025-10-02', // Gandhi Jayanti
  '2025-10-20', // Diwali Laxmi Puja
  '2025-10-21', // Diwali Balipratipada
  '2025-11-05', // Gurunanak Jayanti
  '2025-12-25', // Christmas
];

// Check if market is open (NSE: 9:15 AM - 3:30 PM, Mon-Fri IST, no holidays)
export function isMarketOpen(): boolean {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay();
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const marketOpen = 9 * 60 + 15;
  const marketClose = 15 * 60 + 30;
  
  if (day === 0 || day === 6) return false; // Weekend
  
  const dateStr = ist.toISOString().slice(0, 10);
  if (MARKET_HOLIDAYS_2025.includes(dateStr)) return false;
  
  return totalMinutes >= marketOpen && totalMinutes <= marketClose;
}

export function getMarketStatus(): { open: boolean; message: string; nextOpen?: string } {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay();
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const dateStr = ist.toISOString().slice(0, 10);
  
  if (MARKET_HOLIDAYS_2025.includes(dateStr)) return { open: false, message: 'Market Holiday' };
  if (day === 0) return { open: false, message: 'Closed (Sunday)', nextOpen: 'Monday 9:15 AM' };
  if (day === 6) return { open: false, message: 'Closed (Saturday)', nextOpen: 'Monday 9:15 AM' };
  if (totalMinutes < 9 * 60 + 15) return { open: false, message: 'Pre-Market', nextOpen: 'Today 9:15 AM' };
  if (totalMinutes > 15 * 60 + 30) return { open: false, message: 'Market Closed', nextOpen: day === 5 ? 'Monday 9:15 AM' : 'Tomorrow 9:15 AM' };
  return { open: true, message: 'Market Open' };
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  return `₹${amount.toFixed(0)}`;
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

// Simulate live price tick - respects market hours
export function simulatePriceTick(stock: Stock): Stock {
  const open = isMarketOpen();
  if (!open) return stock;

  const volatility = 0.002 + Math.random() * 0.003;
  const change = (Math.random() - 0.495) * volatility;
  const newPrice = parseFloat((stock.price * (1 + change)).toFixed(2));
  const totalChange = newPrice - stock.prevClose;
  const totalChangePercent = parseFloat(((totalChange / stock.prevClose) * 100).toFixed(2));
  
  return {
    ...stock,
    price: newPrice,
    change: parseFloat(totalChange.toFixed(2)),
    changePercent: totalChangePercent,
    high: Math.max(stock.high, newPrice),
    low: Math.min(stock.low, newPrice),
    volume: stock.volume + Math.floor(Math.random() * 1000),
  };
}

export function simulateIndexTick(index: Index): Index {
  if (!isMarketOpen()) return index;
  const volatility = 0.001 + Math.random() * 0.002;
  const change = (Math.random() - 0.495) * volatility;
  const newValue = parseFloat((index.value * (1 + change)).toFixed(2));
  const baseValue = newValue / (1 + index.changePercent / 100);
  const totalChange = parseFloat((newValue - baseValue).toFixed(2));
  const totalChangePct = parseFloat(((totalChange / baseValue) * 100).toFixed(2));
  return { ...index, value: newValue, change: totalChange, changePercent: totalChangePct, high: Math.max(index.high, newValue), low: Math.min(index.low, newValue) };
}

// Calculate RSI
export function calculateRSI(closes: number[], period = 14): number[] {
  const result: number[] = new Array(period).fill(0);
  for (let i = period; i < closes.length; i++) {
    let gains = 0, losses = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const diff = closes[j] - closes[j - 1];
      if (diff > 0) gains += diff; else losses += Math.abs(diff);
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    if (avgLoss === 0) { result.push(100); continue; }
    const rs = avgGain / avgLoss;
    result.push(parseFloat((100 - 100 / (1 + rs)).toFixed(2)));
  }
  return result;
}

// Calculate EMA
export function calculateEMA(closes: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const result: number[] = [closes[0]];
  for (let i = 1; i < closes.length; i++) {
    result.push(closes[i] * k + result[i - 1] * (1 - k));
  }
  return result;
}

// Calculate MACD
export function calculateMACD(closes: number[]): { macd: number[]; signal: number[]; histogram: number[] } {
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  const macd = ema12.map((v, i) => parseFloat((v - ema26[i]).toFixed(2)));
  const signal = calculateEMA(macd, 9);
  const histogram = macd.map((v, i) => parseFloat((v - signal[i]).toFixed(2)));
  return { macd, signal, histogram };
}

// Calculate SMA
export function calculateSMA(closes: number[], period: number): number[] {
  const result: number[] = new Array(period - 1).fill(0);
  for (let i = period - 1; i < closes.length; i++) {
    const sum = closes.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(parseFloat((sum / period).toFixed(2)));
  }
  return result;
}
