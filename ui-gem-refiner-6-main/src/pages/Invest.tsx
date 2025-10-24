import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, TrendingUp, TrendingDown, Plus, Minus, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAnalyticsData, saveAnalyticsData, updateSession } from "@/lib/analytics";

const Invest = () => {
  // Load initial data from analytics
  const initialData = getAnalyticsData();
  
  const [balance, setBalance] = useState(initialData.balance);
  const [investAmount, setInvestAmount] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [ethPrice, setEthPrice] = useState(3500);
  const [btcPrice, setBtcPrice] = useState(43250);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [portfolio, setPortfolio] = useState(initialData.portfolio.length > 0 ? initialData.portfolio : [
    { asset: "Ethereum", quantity: 2.5, avgPrice: 3200, type: "ethereum" },
    { asset: "Bitcoin", quantity: 0.5, avgPrice: 44000, type: "bitcoin" },
  ]);
  const [transactions, setTransactions] = useState(initialData.transactions.length > 0 ? initialData.transactions : [
    { id: 1, type: "buy", asset: "Ethereum", amount: 1.5, price: 3200, date: "2024-01-15", timestamp: Date.now() - 86400000 * 6 },
    { id: 2, type: "buy", asset: "Bitcoin", amount: 0.5, price: 44000, date: "2024-01-14", timestamp: Date.now() - 86400000 * 7 },
    { id: 3, type: "sell", asset: "Ethereum", amount: 1, price: 3100, date: "2024-01-13", timestamp: Date.now() - 86400000 * 8 },
  ]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchPrices = async () => {
      try {
        setLoading(true);
        
        // Simulate price fluctuation
        if (isMounted) {
          setEthPrice(prev => prev + (Math.random() - 0.5) * 50);
          setBtcPrice(prev => prev + (Math.random() - 0.5) * 200);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to fetch crypto prices. Using cached prices.');
          setLoading(false);
        }
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    
    // Track session every minute
    const sessionInterval = setInterval(() => {
      updateSession();
    }, 60000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
      clearInterval(sessionInterval);
    };
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    const data = getAnalyticsData();
    data.transactions = transactions;
    data.portfolio = portfolio;
    data.balance = balance;
    saveAnalyticsData(data);
  }, [transactions, portfolio, balance]);

  const getCurrentPrice = (assetType) => {
    return assetType === "ethereum" ? ethPrice : btcPrice;
  };

  const getAssetName = (assetType) => {
    return assetType === "ethereum" ? "Ethereum" : "Bitcoin";
  };

  const handleTrade = (tradeType) => {
    setError("");
    setSuccessMessage("");

    const amount = parseFloat(investAmount);
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (!selectedAsset) {
      setError("Please select an asset to trade");
      return;
    }

    const currentPrice = getCurrentPrice(selectedAsset);
    const assetName = getAssetName(selectedAsset);
    
    if (tradeType === "buy") {
      if (amount > balance) {
        setError(`Insufficient funds. You only have $${balance.toLocaleString()}`);
        return;
      }

      const quantity = amount / currentPrice;
      
      // Update portfolio
      setPortfolio(prev => {
        const existing = prev.find(p => p.type === selectedAsset);
        if (existing) {
          const newQuantity = existing.quantity + quantity;
          const newAvgPrice = ((existing.avgPrice * existing.quantity) + (currentPrice * quantity)) / newQuantity;
          return prev.map(p => 
            p.type === selectedAsset 
              ? { ...p, quantity: newQuantity, avgPrice: newAvgPrice }
              : p
          );
        } else {
          return [...prev, { 
            asset: assetName, 
            quantity, 
            avgPrice: currentPrice, 
            type: selectedAsset 
          }];
        }
      });

      // Update balance
      setBalance(prev => prev - amount);

      // Add transaction with timestamp
      setTransactions(prev => [{
        id: Date.now(),
        type: "buy",
        asset: assetName,
        amount: quantity,
        price: currentPrice,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now()
      }, ...prev]);

      setSuccessMessage(`Successfully bought ${quantity.toFixed(4)} ${assetName} for $${amount.toLocaleString()}`);
      setInvestAmount("");
      
    } else {
      // Sell
      const portfolioItem = portfolio.find(p => p.type === selectedAsset);
      if (!portfolioItem) {
        setError(`You don't own any ${assetName}`);
        return;
      }

      const quantity = amount / currentPrice;
      if (quantity > portfolioItem.quantity) {
        setError(`Insufficient ${assetName}. You only have ${portfolioItem.quantity.toFixed(4)}`);
        return;
      }

      // Update portfolio
      setPortfolio(prev => {
        return prev.map(p => {
          if (p.type === selectedAsset) {
            const newQuantity = p.quantity - quantity;
            return newQuantity > 0.0001 
              ? { ...p, quantity: newQuantity }
              : null;
          }
          return p;
        }).filter(Boolean);
      });

      // Update balance
      setBalance(prev => prev + amount);

      // Add transaction with timestamp
      setTransactions(prev => [{
        id: Date.now(),
        type: "sell",
        asset: assetName,
        amount: quantity,
        price: currentPrice,
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now()
      }, ...prev]);

      setSuccessMessage(`Successfully sold ${quantity.toFixed(4)} ${assetName} for $${amount.toLocaleString()}`);
      setInvestAmount("");
    }
  };

  const calculateProfit = (tx) => {
    const currentPrice = tx.asset === "Ethereum" ? ethPrice : btcPrice;
    if (tx.type === "buy") {
      return (currentPrice - tx.price) * tx.amount;
    }
    return 0; // Sold positions don't show ongoing profit
  };

  const totalProfit = portfolio.reduce((sum, item) => {
    const currentPrice = getCurrentPrice(item.type);
    return sum + ((currentPrice - item.avgPrice) * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Demo Investment
            <span className="block text-primary">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Practice trading with zero risk
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-6 border-primary/50">
            <AlertDescription className="text-primary">{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Wallet & Portfolio Summary */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    Virtual Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary mb-2">
                    ${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                </CardContent>
              </Card>

              <Card className={totalProfit >= 0 ? 'border-primary/30' : 'border-destructive/30'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {totalProfit >= 0 ? <TrendingUp className="w-5 h-5 text-primary" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
                    Portfolio P&L
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-4xl font-bold mb-2 ${totalProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Profit/Loss</p>
                </CardContent>
              </Card>
            </div>

            {/* Trading Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Invest Now
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant={selectedAsset === "ethereum" ? "default" : "outline"}
                    size="lg"
                    className="h-24"
                    onClick={() => setSelectedAsset("ethereum")}
                  >
                    <div className="text-left w-full">
                      <div className="text-xl font-bold">Ethereum</div>
                      <div className="text-sm opacity-80">${ethPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    </div>
                  </Button>
                  <Button
                    variant={selectedAsset === "bitcoin" ? "default" : "outline"}
                    size="lg"
                    className="h-24"
                    onClick={() => setSelectedAsset("bitcoin")}
                  >
                    <div className="text-left w-full">
                      <div className="text-xl font-bold">Bitcoin</div>
                      <div className="text-sm opacity-80">${btcPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    </div>
                  </Button>
                </div>

                {selectedAsset && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Investment Amount ($)
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                      {investAmount && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ≈ {(parseFloat(investAmount) / getCurrentPrice(selectedAsset)).toFixed(6)} {getAssetName(selectedAsset)}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        variant="default" 
                        className="flex-1" 
                        size="lg"
                        onClick={() => handleTrade("buy")}
                        disabled={loading}
                      >
                        <Plus className="mr-2" />
                        Buy
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        size="lg"
                        onClick={() => handleTrade("sell")}
                        disabled={loading}
                      >
                        <Minus className="mr-2" />
                        Sell
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No transactions yet</p>
                  ) : (
                    transactions.slice(0, 10).map((tx) => {
                      const profit = calculateProfit(tx);
                      return (
                        <div key={tx.id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-accent/50 transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'buy' ? 'bg-primary/20' : 'bg-destructive/20'}`}>
                              {tx.type === 'buy' ? <Plus className="w-5 h-5 text-primary" /> : <Minus className="w-5 h-5 text-destructive" />}
                            </div>
                            <div>
                              <div className="font-semibold">{tx.type.toUpperCase()} {tx.asset}</div>
                              <div className="text-sm text-muted-foreground">{tx.date}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{tx.amount.toFixed(4)} @ ${tx.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                            {tx.type === 'buy' && (
                              <div className={`text-sm ${profit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                                {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Current Portfolio */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Current Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolio.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No assets yet</p>
                ) : (
                  portfolio.map((item, index) => {
                    const currentPrice = getCurrentPrice(item.type);
                    const profit = (currentPrice - item.avgPrice) * item.quantity;
                    const profitPercent = ((currentPrice - item.avgPrice) / item.avgPrice) * 100;
                    
                    return (
                      <div key={index} className="border rounded-lg p-4 space-y-2 hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{item.asset}</span>
                          <span className={profit >= 0 ? 'text-primary' : 'text-destructive'}>
                            {profit >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Qty: {item.quantity.toFixed(4)}</div>
                          <div>Avg: ${item.avgPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                          <div>Current: ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        </div>
                        <div className={`text-lg font-semibold ${profit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                          {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invest;