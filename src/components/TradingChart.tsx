import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { generateHistoricalData, TimeFrame } from '@/lib/marketData';
import { useApp } from '@/context/AppContext';

interface TradingChartProps {
  symbol: string;
  basePrice: number;
  height?: number;
}

const TIMEFRAMES: TimeFrame[] = ['1m', '5m', '15m', '1H', '1D', '1W', '1M'];
const PERIODS: Record<TimeFrame, number> = { '1m': 120, '5m': 100, '15m': 80, '1H': 72, '1D': 180, '1W': 52, '1M': 24 };

export default function TradingChart({ symbol, basePrice, height = 360 }: TradingChartProps) {
  const { isDarkMode, stocks } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const candleSeriesRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineSeriesRef = useRef<any>(null);
  const [timeframe, setTimeframe] = useState<TimeFrame>('1D');
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle');
  const [ohlcv, setOhlcv] = useState({ o: 0, h: 0, l: 0, c: 0 });

  const stock = stocks.find(s => s.symbol === symbol);

  useEffect(() => {
    if (!containerRef.current) return;

    const bg = isDarkMode ? '#1a1f2e' : '#ffffff';
    const textColor = isDarkMode ? '#94a3b8' : '#64748b';
    const gridColor = isDarkMode ? '#1e2533' : '#f1f5f9';
    const borderColor = isDarkMode ? '#2d3748' : '#e2e8f0';

    const chart = createChart(containerRef.current, {
      layout: { background: { type: ColorType.Solid, color: bg }, textColor },
      grid: { vertLines: { color: gridColor }, horzLines: { color: gridColor } },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor },
      timeScale: { borderColor, timeVisible: true, secondsVisible: false },
      width: containerRef.current.clientWidth,
      height,
    });

    chartRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current && chart) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [isDarkMode, height]);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;

    if (candleSeriesRef.current) { try { chart.removeSeries(candleSeriesRef.current); } catch {} candleSeriesRef.current = null; }
    if (lineSeriesRef.current) { try { chart.removeSeries(lineSeriesRef.current); } catch {} lineSeriesRef.current = null; }

    const data = generateHistoricalData(basePrice, PERIODS[timeframe], timeframe);

    if (chartType === 'candle') {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: '#22c55e', downColor: '#ef4444',
        borderUpColor: '#22c55e', borderDownColor: '#ef4444',
        wickUpColor: '#22c55e', wickDownColor: '#ef4444',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      series.setData(data.map(d => ({ time: d.time as any, open: d.open, high: d.high, low: d.low, close: d.close })));
      candleSeriesRef.current = series;
    } else {
      const series = chart.addSeries(LineSeries, { color: '#22c55e', lineWidth: 2 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      series.setData(data.map(d => ({ time: d.time as any, value: d.close })));
      lineSeriesRef.current = series;
    }

    chart.timeScale().fitContent();
  }, [timeframe, chartType, basePrice]);

  // Live update
  useEffect(() => {
    if (!stock || !candleSeriesRef.current) return;
    try {
      candleSeriesRef.current.update({
        time: Math.floor(Date.now() / 1000),
        open: stock.open, high: stock.high, low: stock.low, close: stock.price,
      });
    } catch {}
  }, [stock?.price]);

  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {ohlcv.o > 0 && (
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span>O: <span className="text-foreground font-medium">{ohlcv.o.toFixed(2)}</span></span>
              <span>H: <span className="gain-text font-medium">{ohlcv.h.toFixed(2)}</span></span>
              <span>L: <span className="loss-text font-medium">{ohlcv.l.toFixed(2)}</span></span>
              <span>C: <span className="text-foreground font-medium">{ohlcv.c.toFixed(2)}</span></span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5">
            {(['candle', 'line'] as const).map(t => (
              <button key={t} onClick={() => setChartType(t)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${chartType === t ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
                {t === 'candle' ? '🕯️ Candle' : '📈 Line'}
              </button>
            ))}
          </div>
          <div className="flex bg-muted rounded-lg p-0.5 overflow-x-auto scrollbar-hide">
            {TIMEFRAMES.map(tf => (
              <button key={tf} onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-all shrink-0 ${timeframe === tf ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div ref={containerRef} />
    </div>
  );
}
