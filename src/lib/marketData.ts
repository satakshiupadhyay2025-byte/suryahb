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
  // Realistic market simulation
  healthScore: number;      // 0-100, below 20 = risk of bankruptcy
  longTermDrift: number;    // annual drift e.g. 0.12 = +12%/yr, -0.30 = -30%/yr
  isDelisted?: boolean;
}

export interface Index {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
}

// Helper to create stock with health/drift
const s = (
  symbol: string, name: string, sector: string, exchange: 'NSE' | 'BSE',
  price: number, changePercent: number, volume: number, marketCap: number,
  pe: number, dividendYield: number, capCategory: 'large' | 'mid' | 'small',
  healthScore = 80, longTermDrift = 0.10
): Stock => {
  const change = parseFloat((price * changePercent / 100).toFixed(2));
  const prevClose = parseFloat((price - change).toFixed(2));
  return {
    symbol, name, sector, exchange, price,
    open: parseFloat((price * 0.998).toFixed(2)),
    high: parseFloat((price * 1.005).toFixed(2)),
    low: parseFloat((price * 0.993).toFixed(2)),
    prevClose, change, changePercent, volume, marketCap, pe,
    eps: parseFloat((price / Math.max(pe, 0.1)).toFixed(2)),
    week52High: parseFloat((price * 1.25).toFixed(2)),
    week52Low: parseFloat((price * 0.78).toFixed(2)),
    dividendYield, capCategory, healthScore, longTermDrift
  };
};

export const STOCKS_DATA: Stock[] = [
  // ===== LARGE CAP - NIFTY 50 =====
  s('RELIANCE','Reliance Industries','Energy','NSE',2847.50,0.62,8543210,1924500,22.4,0.35,'large',95,0.14),
  s('TCS','Tata Consultancy Services','IT','NSE',3542.80,0.65,3421890,1289500,28.3,1.12,'large',97,0.12),
  s('HDFCBANK','HDFC Bank','Banking','NSE',1678.45,0.51,12453670,1264300,18.7,1.24,'large',94,0.13),
  s('INFY','Infosys','IT','NSE',1489.20,0.62,7654320,618540,23.8,2.34,'large',93,0.11),
  s('ICICIBANK','ICICI Bank','Banking','NSE',1124.60,0.59,9876540,791250,16.2,0.89,'large',92,0.13),
  s('HINDUNILVR','Hindustan Unilever','FMCG','NSE',2234.75,0.44,2345670,524800,52.4,1.45,'large',91,0.09),
  s('BAJFINANCE','Bajaj Finance','NBFC','NSE',7234.50,0.48,1234560,435200,33.6,0.28,'large',90,0.15),
  s('WIPRO','Wipro','IT','NSE',478.30,0.69,5643210,247890,19.4,0.21,'large',88,0.09),
  s('KOTAKBANK','Kotak Mahindra Bank','Banking','NSE',1789.60,0.54,3456780,355430,21.3,0.11,'large',90,0.12),
  s('BHARTIARTL','Bharti Airtel','Telecom','NSE',1634.85,0.61,4567890,918760,85.4,0.36,'large',89,0.16),
  s('ASIANPAINT','Asian Paints','Consumer','NSE',2978.40,0.45,1234567,285430,62.3,0.97,'large',88,0.10),
  s('MARUTI','Maruti Suzuki India','Auto','NSE',12456.70,0.46,456789,376540,26.8,0.88,'large',87,0.11),
  s('SUNPHARMA','Sun Pharmaceutical','Pharma','NSE',1756.30,0.47,2345678,421230,35.7,0.74,'large',89,0.12),
  s('LTIM','LTIMindtree','IT','NSE',5234.60,0.32,876543,155430,31.4,0.57,'large',85,0.13),
  s('TATAMOTORS','Tata Motors','Auto','NSE',978.45,0.66,8765432,363200,8.4,0.20,'large',82,0.10),
  s('HCLTECH','HCL Technologies','IT','NSE',1678.90,0.65,3456789,456780,24.6,3.21,'large',90,0.12),
  s('AXISBANK','Axis Bank','Banking','NSE',1123.40,0.66,6543210,346540,12.8,0.09,'large',85,0.11),
  s('ONGC','Oil & Natural Gas Corp','Energy','NSE',267.80,1.06,23456789,337650,6.8,4.85,'large',78,0.06),
  s('SBIN','State Bank of India','Banking','NSE',812.30,0.78,18765432,724500,10.4,1.60,'large',85,0.10),
  s('MM','Mahindra & Mahindra','Auto','NSE',2978.60,0.53,2345678,370450,28.7,0.54,'large',86,0.12),
  s('NTPC','NTPC','Power','NSE',389.45,0.89,12345678,377430,16.8,2.54,'large',84,0.09),
  s('POWERGRID','Power Grid Corp','Power','NSE',321.70,0.85,9876543,299340,18.4,3.85,'large',87,0.09),
  s('TITAN','Titan Company','Consumer','NSE',3456.80,0.43,1234567,306870,89.4,0.35,'large',88,0.13),
  s('ULTRACEMCO','UltraTech Cement','Cement','NSE',11234.50,0.49,234567,324560,35.2,0.35,'large',86,0.10),
  s('NESTLEIND','Nestle India','FMCG','NSE',2278.40,0.59,345678,219540,74.3,1.62,'large',92,0.10),
  s('BAJAJFINSV','Bajaj Finserv','NBFC','NSE',1678.90,0.65,2345678,267540,28.4,0.06,'large',87,0.13),
  s('DRREDDY',"Dr Reddy's Laboratories",'Pharma','NSE',1289.60,0.75,1234567,214560,19.8,0.39,'large',86,0.11),
  s('ADANIENT','Adani Enterprises','Diversified','NSE',2892.45,0.61,3456789,329450,68.4,0.07,'large',75,0.14),
  s('ZOMATO','Zomato','Internet','NSE',267.40,1.29,45678901,237540,312.4,0,'large',72,0.18),
  s('PIDILITIND','Pidilite Industries','Chemical','NSE',2987.60,0.46,456789,152430,71.4,0.67,'large',88,0.11),
  s('DABUR','Dabur India','FMCG','NSE',512.30,0.65,3456789,90870,45.6,0.98,'large',86,0.08),
  s('GODREJCP','Godrej Consumer Products','FMCG','NSE',1267.80,0.62,1234567,129870,56.7,0.79,'large',85,0.09),
  s('TATAPOWER','Tata Power Company','Power','NSE',456.80,0.84,12345678,146540,42.3,0.44,'large',80,0.12),
  s('GRASIM','Grasim Industries','Cement','NSE',2456.70,0.52,1234567,161430,17.8,0.57,'large',84,0.10),
  s('DIVISLAB',"Divi's Laboratories",'Pharma','NSE',4789.30,0.45,456789,127240,57.8,0.63,'large',87,0.10),
  s('EICHERMOT','Eicher Motors','Auto','NSE',4645.80,0.38,345678,127240,31.2,0.86,'large',86,0.10),
  s('INDUSINDBK','IndusInd Bank','Banking','NSE',1078.40,0.79,4567890,83450,9.4,1.11,'large',78,0.08),
  s('COALINDIA','Coal India','Mining','NSE',478.60,0.76,9876543,294530,7.4,5.98,'large',80,0.07),
  s('JSWSTEEL','JSW Steel','Steel','NSE',934.50,0.70,5678901,229430,12.8,1.07,'large',82,0.09),
  s('TECHM','Tech Mahindra','IT','NSE',1567.30,0.60,2345678,152430,32.1,1.91,'large',83,0.10),
  s('BRITANNIA','Britannia Industries','FMCG','NSE',5234.80,0.44,123456,125780,54.3,1.34,'large',89,0.09),
  s('CIPLA','Cipla','Pharma','NSE',1534.60,0.63,2345678,123870,27.4,0.52,'large',86,0.10),
  s('HEROMOTOCO','Hero MotoCorp','Auto','NSE',4678.40,0.39,456789,93540,21.4,2.35,'large',84,0.08),
  s('APOLLOHOSP','Apollo Hospitals','Healthcare','NSE',6789.30,0.46,345678,97230,78.4,0.22,'large',87,0.14),
  s('BPCL','Bharat Petroleum Corp','Energy','NSE',567.80,0.85,8765432,123210,10.4,4.94,'large',78,0.07),
  s('SHREECEM','Shree Cement','Cement','NSE',28456.70,0.48,45678,102540,45.6,0.17,'large',84,0.08),
  s('HINDALCO','Hindalco Industries','Metal','NSE',678.90,0.73,6789012,152430,10.8,0.74,'large',80,0.09),
  s('TATACONSUM','Tata Consumer Products','FMCG','NSE',1123.40,0.75,2345678,103540,62.4,0.80,'large',83,0.10),
  s('LT','Larsen & Toubro','Engineering','NSE',3567.80,0.85,3456789,489540,32.4,0.67,'large',90,0.12),
  s('ADANIPORTS','Adani Ports & SEZ','Infrastructure','NSE',1398.50,1.12,4567890,302340,25.6,0.43,'large',76,0.13),

  // ===== LARGE CAP ADDITIONAL =====
  s('HDFCLIFE','HDFC Life Insurance','Insurance','NSE',654.30,0.67,3456789,140560,74.6,0.31,'large',85,0.11),
  s('SBILIFE','SBI Life Insurance','Insurance','NSE',1567.80,0.78,2345678,156780,68.4,0.24,'large',86,0.11),
  s('ICICIGI','ICICI Lombard','Insurance','NSE',1789.30,0.89,567890,88450,32.4,0.59,'large',84,0.11),
  s('HDFCAMC','HDFC Asset Management','Asset Management','NSE',3678.90,0.78,345678,77890,34.6,1.36,'large',88,0.12),
  s('BAJAJ-AUTO','Bajaj Auto','Auto','NSE',9876.50,0.42,234567,285670,22.1,1.56,'large',88,0.10),
  s('SIEMENS','Siemens India','Engineering','NSE',6789.40,0.56,234567,241560,56.4,0.34,'large',87,0.12),
  s('ABB','ABB India','Engineering','NSE',8234.50,0.48,123456,174560,68.4,0.28,'large',86,0.13),
  s('BOSCHLTD','Bosch','Auto Parts','NSE',32456.70,0.35,45678,95670,42.6,0.68,'large',89,0.09),
  s('CHOLAFIN','Cholamandalam Investment','NBFC','NSE',1456.30,1.15,2345678,119870,24.6,0.28,'large',82,0.14),
  s('MUTHOOTFIN','Muthoot Finance','NBFC','NSE',1834.60,0.92,1234567,73450,17.4,1.09,'large',80,0.12),

  // ===== MID CAP =====
  s('PERSISTENT','Persistent Systems','IT','NSE',5678.90,1.34,456789,87540,48.6,0.35,'mid',82,0.16),
  s('COFORGE','Coforge','IT','NSE',7234.50,1.56,345678,48780,45.2,0.55,'mid',79,0.15),
  s('MPHASIS','Mphasis','IT','NSE',2567.80,0.87,567890,48230,29.4,1.17,'mid',80,0.12),
  s('SUPREMEIND','Supreme Industries','Plastic','NSE',4567.90,1.23,234567,57890,38.7,0.54,'mid',78,0.11),
  s('KANSAINER','Kansai Nerolac Paints','Consumer','NSE',312.40,0.67,1234567,28340,29.8,0.96,'mid',74,0.08),
  s('BERGEPAINT','Berger Paints India','Consumer','NSE',534.60,0.78,2345678,51870,55.4,0.56,'mid',76,0.09),
  s('ATUL','Atul Ltd','Chemical','NSE',6789.30,1.45,123456,19870,32.6,0.74,'mid',78,0.10),
  s('PIIND','PI Industries','Agro Chemical','NSE',3456.70,1.23,234567,52350,34.8,0.29,'mid',79,0.13),
  s('ASTRAL','Astral Poly Technik','Plastic','NSE',1876.40,0.98,567890,49870,64.2,0.27,'mid',77,0.11),
  s('POLYCAB','Polycab India','Electrical','NSE',5678.90,1.67,345678,84560,38.4,0.53,'mid',81,0.14),
  s('HAVELLS','Havells India','Electrical','NSE',1634.50,0.89,1234567,102340,54.6,0.61,'mid',82,0.11),
  s('VOLTAS','Voltas','Consumer Durables','NSE',1456.70,1.12,987654,48560,48.2,0.41,'mid',76,0.10),
  s('BLUEDART','Blue Dart Express','Logistics','NSE',6789.40,0.76,45678,16120,42.8,0.44,'mid',74,0.08),
  s('CONCOR','Container Corporation','Logistics','NSE',789.30,0.56,1234567,52340,34.6,0.76,'mid',75,0.09),
  s('ABBOTINDIA','Abbott India','Pharma','NSE',24567.80,0.45,23456,52040,38.4,0.81,'mid',83,0.09),
  s('ALKEM','Alkem Laboratories','Pharma','NSE',5234.60,0.67,123456,62450,28.6,0.57,'mid',80,0.10),
  s('TORNTPHARM','Torrent Pharmaceuticals','Pharma','NSE',3234.70,0.89,234567,54670,32.4,0.62,'mid',79,0.10),
  s('AUROPHARMA','Aurobindo Pharma','Pharma','NSE',1234.50,1.23,2345678,72340,18.4,0.49,'mid',76,0.09),
  s('LUPIN','Lupin','Pharma','NSE',1876.40,0.94,1234567,84560,24.6,0.53,'mid',78,0.10),
  s('BALKRISIND','Balkrishna Industries','Tyre','NSE',2678.90,1.45,345678,51870,26.8,0.75,'mid',78,0.11),
  s('MRF','MRF','Tyre','NSE',128456.70,0.34,12345,54560,24.6,0.31,'mid',85,0.09),
  s('APOLLOTYRE','Apollo Tyres','Tyre','NSE',456.70,1.12,3456789,28960,14.8,0.66,'mid',74,0.09),
  s('CEATLTD','CEAT','Tyre','NSE',3234.50,0.98,234567,13040,19.4,0.62,'mid',72,0.08),
  s('OFSS','Oracle Financial Services','IT','NSE',9234.60,0.56,123456,79560,28.4,5.43,'mid',85,0.10),
  s('KPIT','KPIT Technologies','IT','NSE',1634.50,1.89,1234567,44560,56.4,0.31,'mid',75,0.16),
  s('TANLA','Tanla Platforms','IT','NSE',987.30,1.56,876543,13450,18.4,0.51,'mid',65,0.08),
  s('TATAELXSI','Tata Elxsi','IT','NSE',6789.30,0.78,234567,42340,42.6,0.74,'mid',80,0.12),
  s('ZEEL','Zee Entertainment','Media','NSE',145.60,-0.89,12345678,13450,0,0,'mid',45,-0.12),
  s('PVRINOX','PVR INOX','Entertainment','NSE',1456.70,0.67,876543,13560,85.4,0,'mid',62,0.07),
  s('IRCTC','Indian Railway Catering','Tourism','NSE',789.30,1.23,3456789,63450,42.6,1.27,'mid',80,0.11),
  s('INDIAMART','IndiaMart InterMESH','Internet','NSE',2567.80,0.89,234567,15450,34.8,0.78,'mid',72,0.10),
  s('NAUKRI','Info Edge India','Internet','NSE',6234.50,0.45,345678,80560,112.4,0.48,'mid',76,0.12),
  s('JUSTDIAL','Just Dial','Internet','NSE',1234.50,1.56,567890,10230,28.6,0,'mid',64,0.07),
  s('ANGELONE','Angel One','Fintech','NSE',2456.70,2.34,1234567,22340,18.4,1.63,'mid',74,0.13),
  s('CDSL','CDSL','Financial Services','NSE',1678.90,1.78,2345678,17560,42.6,0.60,'mid',78,0.14),
  s('BSE','BSE','Exchange','NSE',3456.70,2.12,567890,46870,38.4,0.58,'mid',80,0.15),
  s('MCX','Multi Commodity Exchange','Exchange','NSE',5234.80,1.67,345678,26780,48.6,0.48,'mid',79,0.12),
  s('NIACL','New India Assurance','Insurance','NSE',178.60,0.45,3456789,29340,12.4,2.24,'mid',72,0.06),
  s('STARHEALTH','Star Health Insurance','Insurance','NSE',456.70,0.89,2345678,26560,0,0,'mid',65,0.08),
  s('KAJARIACER','Kajaria Ceramics','Building Materials','NSE',1234.50,1.12,567890,19560,32.4,0.97,'mid',74,0.09),
  s('CENTURYPLY','Century Plyboards','Building Materials','NSE',678.90,1.45,1234567,15120,28.6,0.44,'mid',70,0.10),
  s('GREENPLY','Greenply Industries','Building Materials','NSE',345.60,1.23,876543,4230,24.8,0,'mid',65,0.08),
  s('WHIRLPOOL','Whirlpool of India','Consumer Durables','NSE',1567.80,0.67,234567,19890,0,0,'mid',60,-0.05),
  s('CROMPTON','Crompton Greaves Consumer','Consumer Durables','NSE',345.60,1.34,2345678,22340,32.4,0.87,'mid',72,0.09),
  s('DIXON','Dixon Technologies','Electronics','NSE',12456.70,2.34,234567,74560,112.4,0.12,'mid',79,0.18),
  s('AMBER','Amber Enterprises','Electronics','NSE',4567.80,1.89,123456,15230,45.6,0,'mid',70,0.14),
  s('BATAINDIA','Bata India','Footwear','NSE',1456.70,0.78,456789,18760,48.4,0.69,'mid',73,0.07),
  s('RELAXO','Relaxo Footwears','Footwear','NSE',745.60,0.56,345678,18540,56.8,0.40,'mid',70,0.07),
  s('VGUARD','V-Guard Industries','Electrical','NSE',345.80,1.12,1234567,15670,38.4,0.58,'mid',73,0.09),
  s('RBLBANK','RBL Bank','Banking','NSE',178.60,-0.45,8765432,10780,8.4,1.12,'mid',50,-0.08),
  s('FEDERALBNK','Federal Bank','Banking','NSE',178.90,0.89,12345678,37890,9.4,1.12,'mid',72,0.08),
  s('SOUTHBNK','South Indian Bank','Banking','NSE',24.56,1.23,23456789,6230,7.4,1.63,'mid',55,0.05),
  s('DCBBANK','DCB Bank','Banking','NSE',112.30,0.78,3456789,3560,9.4,1.07,'mid',60,0.05),
  s('IDFCFIRSTB','IDFC First Bank','Banking','NSE',67.80,-0.56,34567890,44560,24.6,0,'mid',55,-0.06),
  s('UJJIVANSFB','Ujjivan Small Finance','Banking','NSE',34.56,1.23,12345678,6780,7.4,2.31,'mid',60,0.07),
  s('EQUITASBNK','Equitas Small Finance','Banking','NSE',89.60,0.89,8765432,9870,9.6,1.12,'mid',62,0.07),
  s('NIPPONLIFE','Nippon Life India AMC','Asset Management','NSE',567.80,1.12,1234567,34560,28.8,1.41,'mid',76,0.11),
  s('CAMS','Computer Age Management','Financial Technology','NSE',3456.70,0.67,123456,16780,42.6,1.74,'mid',78,0.11),
  s('KFINTECH','KFin Technologies','Financial Technology','NSE',789.30,1.34,567890,12450,38.4,0.76,'mid',74,0.12),
  s('UTIAMC','UTI Asset Management','Asset Management','NSE',1234.50,0.89,234567,15670,22.4,2.44,'mid',76,0.10),
  s('LTTS','L&T Technology Services','IT','NSE',5678.40,0.89,234567,60540,38.4,0.89,'mid',82,0.13),
  s('CYIENT','Cyient','IT','NSE',1892.30,1.12,345678,20560,28.6,1.26,'mid',74,0.10),
  s('SONACOMS','Sona BLW Precision','Auto Parts','NSE',567.80,1.45,1234567,32450,48.6,0.35,'mid',74,0.13),
  s('CUMMINSIND','Cummins India','Engineering','NSE',3456.70,0.78,234567,95670,38.4,1.16,'mid',82,0.11),
  s('THERMAX','Thermax','Engineering','NSE',3789.30,0.67,123456,45120,42.6,0.40,'mid',80,0.10),
  s('SCHAEFFLER','Schaeffler India','Auto Parts','NSE',3456.80,0.56,89012,60120,34.6,0.43,'mid',81,0.10),
  s('TIINDIA','Tube Investments','Diversified','NSE',3567.80,1.12,234567,68900,42.8,0.28,'mid',79,0.13),
  s('GMRINFRA','GMR Airports Infra','Infrastructure','NSE',89.60,1.67,12345678,54560,0,0,'mid',62,0.12),
  s('IRB','IRB Infrastructure','Infrastructure','NSE',67.80,1.34,8765432,40230,24.8,1.48,'mid',65,0.10),
  s('ASHOKLEY','Ashok Leyland','Auto','NSE',234.50,1.12,12345678,68560,18.4,1.28,'mid',76,0.09),
  s('ESCORTS','Escorts Kubota','Auto','NSE',3234.50,0.78,234567,28900,22.6,0.62,'mid',74,0.09),
  s('SUNDRMFAST','Sundram Fasteners','Auto Parts','NSE',1234.50,0.89,345678,26010,24.8,0.73,'mid',76,0.09),
  s('MOTHERSON','Samvardhana Motherson','Auto Parts','NSE',178.90,1.23,12345678,158900,32.4,0.56,'mid',72,0.10),
  s('MINDA','Uno Minda','Auto Parts','NSE',1098.40,1.45,1234567,62340,42.6,0.36,'mid',75,0.13),
  s('TRENT','Trent','Retail','NSE',6789.30,1.34,567890,240560,312.4,0.07,'large',82,0.18),
  s('DMART','Avenue Supermarts','Retail','NSE',4567.80,0.56,456789,296780,86.4,0,'large',87,0.12),
  s('JUBLFOOD','Jubilant Foodworks','Food Services','NSE',678.90,0.89,2345678,44560,78.4,0,'mid',68,0.08),
  s('DEVYANI','Devyani International','Food Services','NSE',167.80,1.23,5678901,19870,0,0,'mid',60,0.09),
  s('SAPPHIRE','Sapphire Foods India','Food Services','NSE',1234.50,0.89,234567,7340,0,0,'mid',58,0.07),
  s('ZYDUSLIFE','Zydus Lifesciences','Pharma','NSE',1098.40,0.78,1234567,109560,22.4,0.64,'mid',79,0.10),
  s('GLENMARK','Glenmark Pharmaceuticals','Pharma','NSE',1234.50,1.12,876543,34560,18.4,0.32,'mid',68,-0.04),
  s('IPCALAB','IPCA Laboratories','Pharma','NSE',1567.80,0.89,345678,19870,24.6,0.32,'mid',74,0.09),
  s('NATCOPHARM','Natco Pharma','Pharma','NSE',1456.70,2.34,234567,25670,18.4,0.69,'mid',74,0.12),
  s('GRANULES','Granules India','Pharma','NSE',567.80,1.78,1234567,14230,15.6,0.53,'mid',68,0.09),
  s('ERIS','Eris Lifesciences','Pharma','NSE',1234.50,1.45,345678,16780,22.4,0.81,'mid',72,0.09),
  s('SUVEN','Suven Pharmaceuticals','Pharma','NSE',789.30,2.12,456789,20340,34.6,0,'mid',72,0.12),

  // ===== SMALL CAP =====
  s('SEQUENT','SeQuent Scientific','Pharma','NSE',145.60,1.56,2345678,4560,0,0,'small',45,-0.08),
  s('CAPLIPOINT','Caplin Point Laboratories','Pharma','NSE',2345.60,2.45,123456,17230,24.8,0.43,'small',72,0.14),
  s('SURYAROSNI','Surya Roshni','Electrical','NSE',456.70,1.89,567890,4230,14.8,0.44,'small',68,0.10),
  s('KPRMILL','KPR Mill','Textile','NSE',678.90,1.56,456789,9870,18.6,0.59,'small',70,0.11),
  s('VARDHMAN','Vardhman Textiles','Textile','NSE',456.70,0.89,234567,8900,12.4,0.88,'small',68,0.08),
  s('PAGEIND','Page Industries','Textile','NSE',34567.80,0.34,12345,38670,62.4,0.87,'small',80,0.10),
  s('ALKYLAMINE','Alkyl Amines Chemicals','Chemical','NSE',2234.50,1.67,123456,11230,28.6,0.54,'small',68,0.11),
  s('FINPIPE','Finolex Industries','Plastic','NSE',234.50,1.12,1234567,9230,18.4,1.28,'small',65,0.08),
  s('JYOTHYLAB','Jyothy Labs','FMCG','NSE',456.70,1.34,2345678,16780,38.4,1.31,'small',70,0.09),
  s('EMAMILTD','Emami','FMCG','NSE',678.90,0.89,1234567,14560,32.6,2.06,'small',72,0.08),
  s('MARICO','Marico','FMCG','NSE',789.30,0.78,2345678,102340,48.4,1.52,'large',80,0.09),
  s('REDINGTON','Redington India','IT Distribution','NSE',234.50,1.23,2345678,9870,12.6,2.13,'small',68,0.09),
  s('NETWORK18','Network18 Media','Media','NSE',89.60,-0.45,8765432,7890,0,0,'small',40,-0.15),
  s('TV18BRDCST','TV18 Broadcast','Media','NSE',34.56,-0.89,12345678,3450,0,0,'small',38,-0.18),
  s('HFCL','HFCL','Telecom Equipment','NSE',123.40,2.34,12345678,9870,24.8,0.41,'small',62,0.10),
  s('STLTECH','Sterlite Technologies','Telecom Equipment','NSE',156.70,1.78,5678901,6780,0,0,'small',48,-0.06),
  s('RAILTEL','RailTel Corporation','Telecom','NSE',456.70,2.12,2345678,14560,34.6,0.55,'small',72,0.12),
  s('IRFC','Indian Railway Finance','Financial Services','NSE',178.90,1.56,12345678,234560,18.4,0.84,'small',78,0.10),
  s('RVNL','Rail Vikas Nigam','Infrastructure','NSE',456.70,2.34,8765432,95560,28.6,0.66,'small',74,0.14),
  s('PNBHOUSING','PNB Housing Finance','NBFC','NSE',1023.40,1.45,1234567,16780,14.8,0,'small',62,0.09),
  s('MANAPPURAM','Manappuram Finance','NBFC','NSE',178.90,0.89,8765432,15120,9.4,2.23,'small',64,0.07),
  s('CREDITACC','CreditAccess Grameen','Microfinance','NSE',1234.50,1.45,567890,19560,18.4,0,'small',62,0.10),
  s('SPANDANA','Spandana Sphoorty','Microfinance','NSE',567.80,1.23,456789,7890,12.6,0,'small',55,0.07),
  s('INFIBEAM','Infibeam Avenues','Fintech','NSE',34.56,2.34,23456789,9870,28.6,0,'small',50,0.08),
  s('PAYTM','One 97 Communications','Fintech','NSE',892.30,0.71,8765432,56780,0,0,'small',48,-0.04),
  s('POLICYBZR','PB Fintech','Fintech','NSE',1789.30,1.89,1234567,80560,0,0,'small',60,0.15),
  s('CARTRADE','CarTrade Tech','Internet','NSE',1234.50,1.45,234567,5670,0,0,'small',52,0.05),
  s('NYKAA','FSN E-Commerce','E-Commerce','NSE',178.90,1.23,8765432,51230,0,0,'small',55,0.06),
  s('DELHIVERY','Delhivery','Logistics','NSE',456.70,1.56,3456789,33450,0,0,'small',58,0.09),
  s('XPRO','Xpro India','Plastic Films','NSE',1567.80,3.45,234567,3450,14.8,0,'small',65,0.14),
  s('GRAVITA','Gravita India','Metal Recycling','NSE',2345.60,2.12,345678,8900,24.6,0.43,'small',70,0.14),
  s('GOLDIAM','Goldiam International','Gems & Jewellery','NSE',456.70,1.89,567890,3450,18.4,0.88,'small',64,0.10),
  s('KALYANKJIL','Kalyan Jewellers','Gems & Jewellery','NSE',567.80,1.34,3456789,56780,45.6,0.35,'small',72,0.11),
  s('SENCO','Senco Gold','Gems & Jewellery','NSE',789.30,1.23,456789,8900,32.4,0.25,'small',68,0.10),
  s('DOMS','DOMS Industries','Stationery','NSE',2567.80,2.34,123456,18900,48.6,0,'small',68,0.13),
  s('IDEAFORGE','ideaForge Technology','Drones','NSE',456.70,3.45,456789,3450,0,0,'small',45,-0.06),
  s('BIKAJI','Bikaji Foods','FMCG','NSE',789.30,1.78,567890,18900,56.4,0,'small',68,0.11),
  s('CAMPUS','Campus Activewear','Footwear','NSE',245.60,1.12,1234567,7120,48.6,0,'small',60,0.07),
  s('VEDL','Vedanta','Mining','NSE',456.70,1.34,12345678,169560,12.4,8.77,'small',68,0.07),
  s('NMDC','NMDC','Mining','NSE',234.50,0.89,8765432,68790,8.4,4.68,'small',74,0.07),
  s('SAIL','Steel Authority of India','Steel','NSE',123.40,0.78,23456789,51230,8.4,2.44,'small',65,0.06),
  s('WELSPUNLIV','Welspun Living','Textile','NSE',178.90,1.12,3456789,17890,18.4,0.56,'small',62,0.09),
  s('GUJGASLTD','Gujarat Gas','Gas','NSE',567.80,0.89,1234567,39120,28.6,0.53,'small',72,0.09),
  s('MGL','Mahanagar Gas','Gas','NSE',1345.60,0.67,456789,13290,14.8,2.23,'small',74,0.08),
  s('IGL','Indraprastha Gas','Gas','NSE',456.70,0.78,2345678,31890,18.4,1.75,'small',75,0.09),
  s('GAIL','GAIL India','Gas','NSE',234.50,0.89,12345678,153040,12.4,3.41,'large',78,0.08),
  s('PETRONET','Petronet LNG','Gas','NSE',345.60,0.78,5678901,51870,12.8,2.90,'large',80,0.08),
  s('HINDPETRO','Hindustan Petroleum','Energy','NSE',389.40,1.12,8765432,82350,7.4,3.85,'large',74,0.07),
  s('IOC','Indian Oil Corporation','Energy','NSE',156.70,0.89,23456789,221760,6.8,5.12,'large',76,0.07),
  s('CHENNPETRO','Chennai Petroleum','Energy','NSE',1234.50,1.56,456789,18230,6.4,3.45,'small',58,0.05),
  s('MRPL','Mangalore Refinery','Energy','NSE',234.50,1.12,3456789,41230,8.4,2.11,'small',62,0.06),
  s('CASTROLIND','Castrol India','Energy','NSE',234.50,0.67,2345678,23170,18.6,3.85,'small',74,0.07),
  s('GNFC','Gujarat Narmada Valley Fertilizers','Chemical','NSE',789.30,1.12,678901,18230,10.4,1.89,'small',65,0.08),
  s('CHAMBLFERT','Chambal Fertilizers','Fertilizer','NSE',456.70,0.89,2345678,18930,10.8,2.41,'small',68,0.08),
  s('COROMANDEL','Coromandel International','Fertilizer','NSE',1234.50,0.78,456789,34560,22.4,1.62,'mid',74,0.09),
  s('DHANUKA','Dhanuka Agritech','Agro Chemical','NSE',1098.40,1.12,234567,5230,18.6,0.73,'small',68,0.09),
  s('RALLIS','Rallis India','Agro Chemical','NSE',345.60,0.89,567890,6730,24.8,1.16,'small',65,0.07),
  s('BAYER','Bayer CropScience','Agro Chemical','NSE',5678.90,0.56,45678,25670,32.6,0.53,'small',74,0.08),
  s('TATACOMM','Tata Communications','Telecom','NSE',1789.30,0.67,456789,51030,42.6,0.56,'mid',76,0.10),
  s('GTLINFRA','GTL Infrastructure','Telecom','NSE',2.34,-1.23,45678901,890,0,0,'small',18,-0.35),
  s('RCOM','Reliance Communications','Telecom','NSE',1.23,-2.45,23456789,340,0,0,'small',5,-0.60),
  s('YESBANK','Yes Bank','Banking','NSE',23.45,0.56,45678901,69870,0,0,'small',40,0.03),
  s('JPASSOCIAT','Jaiprakash Associates','Infrastructure','NSE',12.34,-1.45,12345678,3420,0,0,'small',15,-0.25),
  s('DHFL','DHFL (Restructured)','NBFC','NSE',2.45,-0.89,8765432,430,0,0,'small',8,-0.45),
  s('SUZLON','Suzlon Energy','Renewable Energy','NSE',56.70,2.12,23456789,79540,0,0,'small',60,0.15),
  s('GREENKO','Greenko Energy','Renewable Energy','NSE',456.70,1.89,1234567,22450,0,0,'small',65,0.18),
  s('RENUKA','Shree Renuka Sugars','Sugar','NSE',45.60,1.34,12345678,11230,0,1.10,'small',55,0.06),
  s('BALRAMCHIN','Balrampur Chini','Sugar','NSE',456.70,0.89,2345678,9230,12.4,1.75,'small',68,0.08),
  s('DWARIKESH','Dwarikesh Sugar','Sugar','NSE',123.40,1.12,3456789,3450,8.4,2.44,'small',62,0.07),
  s('RAJRATAN','Raj Ratan Global Wire','Steel','NSE',789.30,1.56,234567,3230,18.4,0.25,'small',65,0.11),
  s('WELCORP','Welspun Corp','Steel','NSE',678.90,1.12,1234567,17890,12.4,0.89,'small',67,0.09),
  s('RATNAMANI','Ratnamani Metals','Steel','NSE',3456.70,0.89,123456,16780,22.4,0.43,'small',74,0.10),
  s('JINDALSAW','Jindal SAW','Steel','NSE',345.60,1.12,2345678,9870,6.8,0.87,'small',65,0.08),
  s('JSWENERGY','JSW Energy','Power','NSE',567.80,1.34,3456789,99120,28.4,0.35,'mid',72,0.12),
  s('TORNTPOWER','Torrent Power','Power','NSE',1234.50,0.89,1234567,59120,22.6,1.21,'mid',76,0.10),
  s('CESC','CESC','Power','NSE',189.30,0.78,2345678,25120,12.4,1.59,'mid',72,0.08),
  s('NHPC','NHPC','Power','NSE',89.60,0.67,12345678,89120,18.4,2.45,'mid',76,0.08),
  s('SJVN','SJVN','Power','NSE',145.60,0.89,8765432,56780,22.6,1.72,'small',74,0.09),
  s('RECLTD','REC','Financial Services','NSE',567.80,1.12,5678901,149780,10.4,2.12,'mid',78,0.10),
  s('PFC','Power Finance Corp','Financial Services','NSE',456.70,0.89,7890123,149230,7.8,2.34,'mid',78,0.10),
  s('IREDA','IREDA','Financial Services','NSE',234.50,2.12,8765432,62340,22.4,0.43,'small',68,0.14),
  s('HAL','Hindustan Aeronautics','Defence','NSE',4567.80,0.78,456789,153560,30.6,0.44,'large',85,0.13),
  s('BEL','Bharat Electronics','Defence','NSE',345.60,1.12,8765432,252340,36.4,0.87,'large',84,0.12),
  s('BFUTL','BF Utilities','Defence','NSE',678.90,0.89,234567,3450,0,0,'small',58,0.07),
  s('MAZAGON','Mazagon Dock','Defence','NSE',4567.80,1.34,345678,92340,22.4,0.87,'mid',80,0.14),
  s('COCHINSHIP','Cochin Shipyard','Defence','NSE',1789.30,1.12,456789,23450,24.6,0.56,'small',72,0.11),
  s('DIXON2','Dixon Technologies B','Electronics','BSE',456.70,2.12,123456,12340,48.6,0,'small',62,0.13),
  s('FINEORG','Fine Organic Industries','Chemical','NSE',5678.90,0.89,45678,17450,28.4,0.53,'small',74,0.10),
  s('NOCIL','NOCIL','Chemical','NSE',234.50,0.78,567890,3780,18.4,1.28,'small',64,0.08),
  s('VINATIORGA','Vinati Organics','Chemical','NSE',1890.30,1.12,234567,19450,38.4,0.26,'small',72,0.11),
  s('CLEAN','Clean Science and Technology','Chemical','NSE',1456.70,1.34,345678,15340,38.6,0.52,'small',70,0.11),
  s('ANURAS','Anuras Group','Chemical','NSE',3456.70,0.89,123456,62340,34.6,0.28,'mid',75,0.12),
  s('DEEPAKNTR','Deepak Nitrite','Chemical','NSE',2345.60,1.12,456789,31450,22.4,0.43,'mid',72,0.11),
  s('APCOTEX','Apcotex Industries','Chemical','NSE',456.70,1.23,234567,4560,18.4,0.88,'small',64,0.09),
  s('GNFCPOLY','Gujarat Fluorochemicals','Chemical','NSE',4567.80,1.56,234567,49120,28.6,0.22,'mid',74,0.13),
  s('POLYPLEX','Polyplex Corp','Plastic Films','NSE',1567.80,1.12,123456,9870,10.4,0.89,'small',65,0.09),
  s('RPGLIFE','RPG Life Sciences','Pharma','NSE',2345.60,1.34,89012,9870,22.4,0.43,'small',68,0.11),
  s('WINDLAS','Windlas Biotech','Pharma','NSE',1234.50,1.45,123456,5340,18.6,0.65,'small',65,0.10),
  s('GLAND','Gland Pharma','Pharma','NSE',1890.30,0.89,234567,31230,22.4,0.53,'mid',72,0.09),
  s('SOLARA','Solara Active Pharma','Pharma','NSE',678.90,-1.12,345678,4560,0,0,'small',40,-0.12),
  s('STRIDES','Strides Pharma','Pharma','NSE',1234.50,0.78,456789,11230,24.6,0.81,'small',65,0.08),
  s('LAURUSLABS','Laurus Labs','Pharma','NSE',567.80,1.12,2345678,30120,18.4,0.35,'mid',68,0.09),
  s('MEDPLUS','Medplus Health','Pharma Retail','NSE',789.30,0.89,456789,9780,42.6,0,'small',64,0.10),
  s('APOLLOMED','Apollo Medics','Healthcare','NSE',1234.50,1.12,234567,7890,0,0,'small',60,0.09),
  s('RAINBOW','Rainbow Children Medicare','Healthcare','NSE',1456.70,1.23,234567,15120,48.6,0.34,'small',70,0.12),
  s('METROPOLIS','Metropolis Healthcare','Healthcare','NSE',1890.30,0.89,234567,9670,38.4,0.53,'mid',74,0.10),
  s('THYROCARE','Thyrocare Technologies','Healthcare','NSE',678.90,0.67,345678,3560,28.6,0.59,'small',65,0.08),
  s('KRSNAA','Krsnaa Diagnostics','Healthcare','NSE',789.30,1.12,234567,3450,24.8,0.38,'small',60,0.09),
  s('VIJAYA','Vijaya Diagnostic','Healthcare','NSE',567.80,0.89,345678,4890,34.6,0.53,'small',65,0.09),
];

// Reserve stocks pool - auto-added when companies get delisted
export const RESERVE_STOCKS: Stock[] = [
  s('TATATECH','Tata Technologies','IT','NSE',1234.50,1.23,456789,44560,34.6,0.44,'mid',78,0.14),
  s('JSWINFRA','JSW Infrastructure','Infrastructure','NSE',345.60,1.34,3456789,74120,28.4,0.35,'mid',72,0.13),
  s('SIGNATUREG','Signature Global','Real Estate','NSE',1456.70,2.12,567890,14560,0,0,'mid',65,0.14),
  s('APTUS','Aptus Value Housing','NBFC','NSE',345.60,1.23,1234567,14120,18.4,0,'mid',68,0.11),
  s('HOMEFIRST','Home First Finance','NBFC','NSE',1098.40,1.12,567890,9870,22.4,0.35,'small',70,0.12),
  s('SHRIRAMFIN','Shriram Finance','NBFC','NSE',2987.60,0.89,678901,111240,16.4,1.34,'large',80,0.12),
  s('BAJAJHLDNG','Bajaj Holdings','Diversified','NSE',8934.50,0.45,89012,94560,22.4,2.12,'large',85,0.09),
  s('MAZDOCK2','Garden Reach Shipbuilders','Defence','NSE',2234.50,1.56,345678,25670,22.4,0.44,'mid',72,0.13),
  s('PARAS','Paras Defence','Defence','NSE',878.90,2.34,567890,3560,34.6,0,'small',65,0.14),
  s('IDEACELL','Vodafone Idea','Telecom','NSE',14.56,-0.89,45678901,78900,0,0,'small',22,-0.20),
  s('WOCKPHARMA','Wockhardt','Pharma','NSE',789.30,0.78,456789,8900,0,0,'small',42,-0.06),
  s('ORCHPHARMA','Orchid Pharma','Pharma','NSE',456.70,1.12,567890,3450,0,0,'small',48,0.05),
  s('ZUARI','Zuari Agro Chemicals','Fertilizer','NSE',234.50,0.89,456789,3120,0,2.12,'small',50,0.04),
  s('GTPL','GTPL Hathway','Cable & Broadband','NSE',234.50,0.78,567890,3670,12.4,0.43,'small',60,0.07),
  s('HATHWAY','Hathway Cable','Cable & Broadband','NSE',23.45,-0.56,3456789,4560,0,0,'small',35,-0.10),
  s('TANISHQ2','Titan Jewellery (BSE)','Consumer','BSE',3456.70,0.43,123456,56780,89.4,0.35,'mid',78,0.11),
  s('NEWGEN','Newgen Software','IT','NSE',1234.50,1.89,345678,9870,38.6,0.35,'small',68,0.14),
  s('KRBL','KRBL','FMCG','NSE',345.60,0.89,567890,8230,12.4,1.45,'small',65,0.07),
  s('LTF','L&T Finance Holdings','NBFC','NSE',156.70,1.12,8765432,39120,14.6,0.64,'mid',72,0.10),
  s('SHYAMMETL','Shyam Metalics','Metal','NSE',678.90,1.34,456789,12340,10.4,0.89,'small',65,0.09),
];

// ===== INDICES =====
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
  { name: 'NIFTY SMALLCAP 100', value: 18345.60, change: 234.10, changePercent: 1.29, high: 18490, low: 18120 },
  { name: 'NIFTY REALTY', value: 1023.45, change: 18.50, changePercent: 1.84, high: 1034, low: 1008 },
  { name: 'NIFTY METAL', value: 9234.50, change: 123.40, changePercent: 1.35, high: 9290, low: 9145 },
  { name: 'NIFTY ENERGY', value: 36890.40, change: 289.30, changePercent: 0.79, high: 37050, low: 36680 },
  { name: 'NIFTY INFRA', value: 8456.70, change: 78.40, changePercent: 0.94, high: 8510, low: 8390 },
  { name: 'NIFTY MEDIA', value: 1890.40, change: -23.40, changePercent: -1.22, high: 1928, low: 1876 },
  { name: 'NIFTY PSU BANK', value: 7234.50, change: 98.60, changePercent: 1.38, high: 7290, low: 7150 },
  { name: 'NIFTY PVTBANK', value: 24567.80, change: 178.40, changePercent: 0.73, high: 24690, low: 24390 },
  { name: 'NIFTY CONSUMPTION', value: 11234.50, change: 89.30, changePercent: 0.80, high: 11290, low: 11130 },
  { name: 'NIFTY CPSE', value: 5678.90, change: 78.40, changePercent: 1.40, high: 5720, low: 5620 },
  { name: 'NIFTY DEFENCE', value: 8923.40, change: 156.70, changePercent: 1.79, high: 8990, low: 8830 },
  { name: 'NIFTY FINANCIAL SVCS', value: 24567.80, change: 234.50, changePercent: 0.96, high: 24690, low: 24340 },
  { name: 'NIFTY HEALTHCARE', value: 14567.80, change: 234.50, changePercent: 1.64, high: 14680, low: 14430 },
  { name: 'NIFTY RURAL', value: 10234.50, change: 89.30, changePercent: 0.88, high: 10310, low: 10150 },
  { name: 'NIFTY 500', value: 22345.60, change: 189.40, changePercent: 0.86, high: 22490, low: 22170 },
  { name: 'NIFTY ALPHA 50', value: 45678.90, change: 567.80, changePercent: 1.26, high: 45890, low: 45230 },
  { name: 'NIFTY LARGECAP 250', value: 18934.50, change: 156.70, changePercent: 0.83, high: 19050, low: 18780 },
  { name: 'NIFTY MIDSMALLCAP 400', value: 15678.90, change: 234.50, changePercent: 1.52, high: 15820, low: 15490 },
  { name: 'BSE 500', value: 45678.90, change: 345.60, changePercent: 0.76, high: 45890, low: 45280 },
  { name: 'BSE MIDCAP', value: 42345.60, change: 456.70, changePercent: 1.09, high: 42600, low: 41980 },
  { name: 'BSE SMALLCAP', value: 56789.30, change: 789.40, changePercent: 1.41, high: 57200, low: 56100 },
];

// Indian Market Holidays 2025-2026 (NSE)
const MARKET_HOLIDAYS = [
  // 2025
  '2025-01-14','2025-02-26','2025-03-14','2025-04-10','2025-04-14',
  '2025-04-18','2025-05-01','2025-08-15','2025-08-27','2025-10-02',
  '2025-10-20','2025-10-21','2025-11-05','2025-12-25',
  // 2026
  '2026-01-26','2026-03-06','2026-03-20','2026-04-01','2026-04-03',
  '2026-04-14','2026-04-30','2026-06-19','2026-08-15','2026-08-24',
  '2026-09-28','2026-10-06','2026-10-22','2026-10-23','2026-11-05',
  '2026-11-24','2026-12-25',
];

export type MarketOverride = 'force_open' | 'force_close' | 'default';

export function getMarketOverride(): MarketOverride {
  return (localStorage.getItem('surya_market_override') as MarketOverride) || 'default';
}

export function setMarketOverride(override: MarketOverride) {
  localStorage.setItem('surya_market_override', override);
}

// Check if market is open (NSE: 9:15 AM - 3:30 PM, Mon-Fri IST, no holidays)
export function isMarketOpen(): boolean {
  const override = getMarketOverride();
  if (override === 'force_open') return true;
  if (override === 'force_close') return false;

  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay();
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const marketOpen = 9 * 60 + 15;
  const marketClose = 15 * 60 + 30;

  if (day === 0 || day === 6) return false;

  const dateStr = ist.toISOString().slice(0, 10);
  if (MARKET_HOLIDAYS.includes(dateStr)) return false;

  return totalMinutes >= marketOpen && totalMinutes <= marketClose;
}

export function getMarketStatus(): { open: boolean; message: string; nextOpen?: string; override: MarketOverride } {
  const override = getMarketOverride();

  if (override === 'force_open') return { open: true, message: '🔓 Admin: Force Open (24/7)', override };
  if (override === 'force_close') return { open: false, message: '🔒 Admin: Market Halted', override };

  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = ist.getDay();
  const hours = ist.getHours();
  const minutes = ist.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  const dateStr = ist.toISOString().slice(0, 10);

  if (MARKET_HOLIDAYS.includes(dateStr)) return { open: false, message: 'Market Holiday', override };
  if (day === 0) return { open: false, message: 'Closed (Sunday)', nextOpen: 'Monday 9:15 AM', override };
  if (day === 6) return { open: false, message: 'Closed (Saturday)', nextOpen: 'Monday 9:15 AM', override };
  if (totalMinutes < 9 * 60 + 15) return { open: false, message: 'Pre-Market', nextOpen: 'Today 9:15 AM', override };
  if (totalMinutes > 15 * 60 + 30) return { open: false, message: 'Market Closed', nextOpen: day === 5 ? 'Monday 9:15 AM' : 'Tomorrow 9:15 AM', override };
  return { open: true, message: 'Market Open', override };
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
      time, open: parseFloat(open.toFixed(2)), high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)), close: parseFloat(currentPrice.toFixed(2)), volume
    });
  }

  return data;
}

// Simulate live price tick - respects market hours and health scores
export function simulatePriceTick(stock: Stock): Stock {
  const open = isMarketOpen();

  // Long-term drift: simulate ~1 tick per 1.5s, so per-year we need drift/year / (365*24*3600/1.5)
  // Approximate: we'll apply a tiny drift each tick
  const ticksPerYear = (365 * 24 * 3600) / 1.5;
  const driftPerTick = (stock.longTermDrift || 0.10) / ticksPerYear;

  // Health-based bankruptcy
  let newHealthScore = stock.healthScore;
  if (stock.healthScore < 20) {
    // Accelerating decline for sick companies
    const deathChance = (20 - stock.healthScore) * 0.0001;
    if (Math.random() < deathChance) {
      return { ...stock, isDelisted: true, price: 0, changePercent: -100, change: -stock.price };
    }
    newHealthScore = Math.max(0, stock.healthScore - Math.random() * 0.01);
  } else if (!open) {
    // Still apply slow long-term drift even when market closed
    const slowDrift = driftPerTick * 0.1;
    const newPrice = parseFloat((stock.price * (1 + slowDrift)).toFixed(2));
    return { ...stock, price: newPrice, healthScore: newHealthScore };
  }

  const baseVolatility = stock.capCategory === 'large' ? 0.002 : stock.capCategory === 'mid' ? 0.003 : 0.004;
  const volatility = baseVolatility + Math.random() * 0.002;

  // Sick companies have more downside bias
  const healthBias = stock.healthScore < 50 ? -(50 - stock.healthScore) * 0.0002 : 0;
  const change = (Math.random() - 0.495) * volatility + driftPerTick + healthBias;

  const newPrice = Math.max(0.05, parseFloat((stock.price * (1 + change)).toFixed(2)));
  const totalChange = newPrice - stock.prevClose;
  const totalChangePercent = parseFloat(((totalChange / stock.prevClose) * 100).toFixed(2));

  // Slowly adjust health score based on price trend
  if (stock.price > 0) {
    const priceRatio = newPrice / stock.prevClose;
    if (priceRatio < 0.95) newHealthScore = Math.max(0, newHealthScore - 0.5);
    else if (priceRatio > 1.05) newHealthScore = Math.min(100, newHealthScore + 0.2);
  }

  return {
    ...stock,
    price: newPrice,
    change: parseFloat(totalChange.toFixed(2)),
    changePercent: totalChangePercent,
    high: Math.max(stock.high, newPrice),
    low: Math.min(stock.low, newPrice),
    volume: stock.volume + Math.floor(Math.random() * 1000),
    healthScore: newHealthScore,
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
  return {
    ...index, value: newValue, change: totalChange, changePercent: totalChangePct,
    high: Math.max(index.high, newValue), low: Math.min(index.low, newValue)
  };
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
