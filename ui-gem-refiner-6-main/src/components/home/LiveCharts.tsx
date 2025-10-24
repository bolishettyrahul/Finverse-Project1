import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchCryptoData, type CombinedCryptoData, type TimeRange } from "@/lib/api/crypto";

export const LiveCharts = () => {
  const [cryptoData, setCryptoData] = useState<CombinedCryptoData | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('7');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCryptoData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCryptoData(timeRange);
      setCryptoData(data);
    } catch (err) {
      setError('Failed to load crypto data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCryptoData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadCryptoData();
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  const timeRangeLabels: Record<TimeRange, string> = {
    '1': 'Last 24 hours',
    '7': 'Last 7 days',
    '30': 'Last 30 days'
  };

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Live Market
            <span className="block text-primary">Pulse</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Real-time market data powered by AI
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {(['1', '7', '30'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground shadow-neon'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              {range === '1' ? '24H' : range === '7' ? '1W' : '1M'}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-center text-destructive mb-8">{error}</div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Ethereum Card */}
          <Card className="glass border-primary/30 hover:border-primary/50 hover:shadow-neon transition-all animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  Ethereum (ETH)
                </span>
                <span className="text-primary">
                  {isLoading ? '...' : `$${cryptoData?.ethereum.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-2 ${cryptoData?.ethereum.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                  {cryptoData?.ethereum.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                  <span className="font-semibold">
                    {isLoading ? '...' : `${cryptoData?.ethereum.change.toFixed(2)}%`}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{timeRangeLabels[timeRange]}</span>
              </div>
              
              {/* Sparkline */}
              <div className="flex items-end justify-between h-16 gap-1">
                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : (
                  cryptoData?.ethereum.sparkline.map((value, i) => {
                    const max = Math.max(...(cryptoData?.ethereum.sparkline || []));
                    const min = Math.min(...(cryptoData?.ethereum.sparkline || []));
                    const height = ((value - min) / (max - min)) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bitcoin Card */}
          <Card className="glass border-gold/30 hover:border-gold/50 hover:shadow-gold transition-all animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gold animate-pulse" />
                  Bitcoin (BTC)
                </span>
                <span className="text-gold">
                  {isLoading ? '...' : `$${cryptoData?.bitcoin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-2 ${cryptoData?.bitcoin.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                  {cryptoData?.bitcoin.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                  <span className="font-semibold">
                    {isLoading ? '...' : `${cryptoData?.bitcoin.change.toFixed(2)}%`}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{timeRangeLabels[timeRange]}</span>
              </div>
              
              {/* Sparkline */}
              <div className="flex items-end justify-between h-16 gap-1">
                {isLoading ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : (
                  cryptoData?.bitcoin.sparkline.map((value, i) => {
                    const max = Math.max(...(cryptoData?.bitcoin.sparkline || []));
                    const min = Math.min(...(cryptoData?.bitcoin.sparkline || []));
                    const height = ((value - min) / (max - min)) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-gold/50 to-gold rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ticker Bar */}
        <div className="glass border-white/10 rounded-lg p-4 overflow-hidden">
          <div className="flex items-center gap-8 animate-[wave-flow_20s_linear_infinite]">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-muted-foreground">ETH</span>
                <span className="text-primary font-semibold">
                  {isLoading ? '...' : `$${cryptoData?.ethereum.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                </span>
                <span className={cryptoData?.ethereum.trend === 'up' ? 'text-primary' : 'text-destructive'}>
                  {isLoading ? '...' : `${cryptoData?.ethereum.change.toFixed(2)}%`}
                </span>
                <span className="mx-4">•</span>
                <span className="text-muted-foreground">BTC</span>
                <span className="text-gold font-semibold">
                  {isLoading ? '...' : `$${cryptoData?.bitcoin.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                </span>
                <span className={cryptoData?.bitcoin.trend === 'up' ? 'text-primary' : 'text-destructive'}>
                  {isLoading ? '...' : `${cryptoData?.bitcoin.change.toFixed(2)}%`}
                </span>
                <span className="mx-4">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};