import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Info, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchCryptoCurrency, type TimeRange } from "@/lib/api/crypto";
import { useToast } from "@/hooks/use-toast";

type TimeFilter = "1D" | "1W" | "1M";

const Market = () => {
  const [ethFilter, setEthFilter] = useState<TimeFilter>("1W");
  const [btcFilter, setBtcFilter] = useState<TimeFilter>("1W");
  const [ethData, setEthData] = useState<any>(null);
  const [btcData, setBtcData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  const filterToRange = (filter: TimeFilter): TimeRange => {
    switch(filter) {
      case "1D": return "1";
      case "1W": return "7";
      case "1M": return "30";
    }
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const ethRange = filterToRange(ethFilter);
      const btcRange = filterToRange(btcFilter);
      
      console.log('Fetching crypto data...', { ethRange, btcRange });
      
      // Fetch data for both cryptocurrencies with their respective timeframes
      const [ethResponse, btcResponse] = await Promise.all([
        fetchCryptoCurrency('ETH', ethRange),
        fetchCryptoCurrency('BTC', btcRange)
      ]);
      
      console.log('Crypto data received:', { ethResponse, btcResponse });
      
      setEthData(ethResponse);
      setBtcData(btcResponse);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Error loading crypto data:", error);
      toast({
        title: "Error",
        description: "Failed to load cryptocurrency data. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [ethFilter, btcFilter, toast]);

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      loadData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [loadData]);

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatSparklineData = (sparkline: number[]) => {
    return sparkline.map((value, index) => ({
      index,
      value: parseFloat(value.toFixed(2))
    }));
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            Live Market
            <span className="block text-primary">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Real-time cryptocurrency market data
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={loadData}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ethereum Panel */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass border-primary/30 hover:shadow-neon transition-all animate-fade-in">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                    <span className="text-2xl">Ethereum (ETH/USD)</span>
                  </CardTitle>
                  <div className="flex gap-2">
                    {(["1D", "1W", "1M"] as TimeFilter[]).map((filter) => (
                      <Button
                        key={filter}
                        size="sm"
                        variant={ethFilter === filter ? "neon" : "ghost"}
                        onClick={() => setEthFilter(filter)}
                      >
                        {filter}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading && !ethData ? (
                  <div className="text-center py-8 text-muted-foreground">Loading Ethereum data...</div>
                ) : ethData ? (
                  <>
                    {/* Price Display */}
                    <div>
                      <div className="text-4xl font-heading font-bold text-primary mb-2">
                        {formatPrice(ethData.price)}
                      </div>
                      <div className={`flex items-center gap-2 text-xl ${ethData.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                        {ethData.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                        <span className="font-semibold">
                          {ethData.change >= 0 ? '+' : ''}{ethData.change.toFixed(2)}%
                        </span>
                        <span className="text-sm text-muted-foreground">{ethFilter}</span>
                      </div>
                    </div>

                    {/* Real Chart */}
                    <div className="h-64 glass rounded-lg p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formatSparklineData(ethData.sparkline)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            dataKey="index" 
                            stroke="rgba(255,255,255,0.5)"
                            tick={false}
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.5)"
                            domain={['auto', 'auto']}
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.8)', 
                              border: '1px solid rgba(0,255,135,0.3)',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                            formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, 'Price']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="hsl(145 100% 50%)" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="glass p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Current Price</div>
                        <div className="text-lg font-semibold text-primary">{formatPrice(ethData.price)}</div>
                      </div>
                      <div className="glass p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Change</div>
                        <div className={`text-lg font-semibold ${ethData.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                          {ethData.change >= 0 ? '+' : ''}{ethData.change.toFixed(2)}%
                        </div>
                      </div>
                      <div className="glass p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Trend</div>
                        <div className={`text-lg font-semibold ${ethData.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                          {ethData.trend === 'up' ? 'Bullish' : 'Bearish'}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No data available</div>
                )}
              </CardContent>
            </Card>

            {/* Bitcoin Panel */}
            <Card className="glass border-gold/30 hover:shadow-gold transition-all animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gold animate-pulse" />
                    <span className="text-2xl">Bitcoin (BTC/USD)</span>
                  </CardTitle>
                  <div className="flex gap-2">
                    {(["1D", "1W", "1M"] as TimeFilter[]).map((filter) => (
                      <Button
                        key={filter}
                        size="sm"
                        variant={btcFilter === filter ? "gold" : "ghost"}
                        onClick={() => setBtcFilter(filter)}
                      >
                        {filter}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {loading && !btcData ? (
                  <div className="text-center py-8 text-muted-foreground">Loading Bitcoin data...</div>
                ) : btcData ? (
                  <>
                    {/* Price Display */}
                    <div>
                      <div className="text-4xl font-heading font-bold text-gold mb-2">
                        {formatPrice(btcData.price)}
                      </div>
                      <div className={`flex items-center gap-2 text-xl ${btcData.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                        {btcData.trend === 'up' ? <TrendingUp /> : <TrendingDown />}
                        <span className="font-semibold">
                          {btcData.change >= 0 ? '+' : ''}{btcData.change.toFixed(2)}%
                        </span>
                        <span className="text-sm text-muted-foreground">{btcFilter}</span>
                      </div>
                    </div>

                    {/* Real Chart */}
                    <div className="h-64 glass rounded-lg p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formatSparklineData(btcData.sparkline)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            dataKey="index" 
                            stroke="rgba(255,255,255,0.5)"
                            tick={false}
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.5)"
                            domain={['auto', 'auto']}
                            tick={{ fill: 'rgba(255,255,255,0.7)' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.8)', 
                              border: '1px solid rgba(255,215,0,0.3)',
                              borderRadius: '8px',
                              color: '#fff'
                            }}
                            formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, 'Price']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="hsl(48 100% 56%)" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="glass p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Current Price</div>
                        <div className="text-lg font-semibold text-gold">{formatPrice(btcData.price)}</div>
                      </div>
                      <div className="glass p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Change</div>
                        <div className={`text-lg font-semibold ${btcData.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                          {btcData.change >= 0 ? '+' : ''}{btcData.change.toFixed(2)}%
                        </div>
                      </div>
                      <div className="glass p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Trend</div>
                        <div className={`text-lg font-semibold ${btcData.trend === 'up' ? 'text-primary' : 'text-destructive'}`}>
                          {btcData.trend === 'up' ? 'Bullish' : 'Bearish'}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No data available</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="glass border-white/10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  About Market Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Live cryptocurrency data powered by CryptoCompare API, providing 
                  real-time prices and historical trends.
                </p>
                <p>
                  Data updates automatically every 60 seconds to ensure you have 
                  the most current market information.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <div className="font-semibold text-foreground mb-2">Features:</div>
                  <ul className="space-y-1">
                    <li>• Real-time price tracking</li>
                    <li>• Historical price charts</li>
                    <li>• Multiple timeframe analysis</li>
                    <li>• Auto-refresh functionality</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <CardHeader>
                <CardTitle className="text-primary">Market Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {ethData && (
                  <div className="p-3 glass rounded-lg">
                    <div className="font-semibold mb-1">Ethereum Trend</div>
                    <p className="text-muted-foreground">
                      {ethData.trend === 'up' 
                        ? 'Bullish momentum with positive price action' 
                        : 'Bearish pressure with downward movement'}
                    </p>
                  </div>
                )}
                {btcData && (
                  <div className="p-3 glass rounded-lg">
                    <div className="font-semibold mb-1">Bitcoin Analysis</div>
                    <p className="text-muted-foreground">
                      {btcData.trend === 'up'
                        ? 'Strong upward trend indicating market confidence'
                        : 'Consolidation phase with potential support levels'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market;