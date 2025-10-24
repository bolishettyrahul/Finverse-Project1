import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, Heart, Send, TrendingUp, TrendingDown, Clock, Activity, BarChart3, PieChart, Award, Flame, Calendar, Shield, Zap, Trophy } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { getAnalyticsData, calculatePerformanceMetrics, calculateRiskMetrics, getPortfolioHistory, getDailyProfitLoss } from "@/lib/analytics";

const About = () => {
  const [analyticsData, setAnalyticsData] = useState(getAnalyticsData());
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("30d");
  const [filterType, setFilterType] = useState<"all" | "buy" | "sell">("all");
  const [currentSessionTime, setCurrentSessionTime] = useState(0);

  // Current prices for calculations
  const currentPrices = {
    ethereum: 3500,
    bitcoin: 43250,
  };

  useEffect(() => {
    // Update analytics data every minute
    const interval = setInterval(() => {
      setAnalyticsData(getAnalyticsData());
    }, 60000);

    // Update current session time every second
    const sessionInterval = setInterval(() => {
      const data = getAnalyticsData();
      const elapsed = Math.floor((Date.now() - data.currentSessionStart) / 1000);
      setCurrentSessionTime(elapsed);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(sessionInterval);
    };
  }, []);

  // Calculate metrics
  const performanceMetrics = calculatePerformanceMetrics(
    analyticsData.transactions,
    analyticsData.portfolio,
    analyticsData.balance,
    currentPrices
  );

  const riskMetrics = calculateRiskMetrics(
    analyticsData.transactions,
    analyticsData.portfolio,
    currentPrices
  );

  // Get chart data
  const portfolioHistory = getPortfolioHistory(analyticsData.transactions, timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90);
  const dailyProfitLoss = getDailyProfitLoss(analyticsData.transactions, 7);

  // Portfolio allocation for pie chart
  const portfolioAllocation = analyticsData.portfolio.map(item => ({
    name: item.asset,
    value: item.quantity * (currentPrices[item.type as keyof typeof currentPrices] || item.avgPrice),
  }));

  // Filter transactions
  const filteredTransactions = analyticsData.transactions.filter(tx => {
    if (filterType === "all") return true;
    return tx.type === filterType;
  });

  // Format time helper
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m ${secs}s`;
  };

  // Format date helper
  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Get streak badge
  const getStreakBadge = (streak: number) => {
    if (streak >= 100) return { label: "Legend", icon: Trophy, color: "text-purple-500" };
    if (streak >= 30) return { label: "Master", icon: Award, color: "text-gold" };
    if (streak >= 7) return { label: "Rising Star", icon: Flame, color: "text-primary" };
    return null;
  };

  const streakBadge = getStreakBadge(analyticsData.streakCount);

  // Colors for charts
  const COLORS = ['#0EA5E9', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

  // Login calendar data (last 30 days)
  const loginCalendar = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    const session = analyticsData.loginSessions.find(s => s.date === dateStr);
    return {
      date: dateStr,
      day: date.getDate(),
      hasLogin: !!session && session.duration >= 3600,
      duration: session?.duration || 0,
    };
  });

  // Risk level color
  const getRiskColor = (level: string) => {
    if (level === "Low") return "text-green-500";
    if (level === "Medium") return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            Performance
            <span className="block text-primary">Analytics</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your trading performance and improve your skills
          </p>
        </div>

        {/* Daily Login & Streak Section */}
        <div className="mb-12 max-w-7xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-6">Daily Activity Tracking</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* Current Session */}
            <Card className="glass border-primary/30 hover:shadow-neon transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Current Session</p>
                </div>
                <p className="text-3xl font-bold text-primary">{formatTime(currentSessionTime)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {currentSessionTime >= 3600 ? "✓ Minimum 1h reached" : `${formatTime(3600 - currentSessionTime)} until 1h`}
                </p>
              </CardContent>
            </Card>

            {/* Login Streak */}
            <Card className="glass border-gold/30 hover:shadow-gold transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-5 h-5 text-gold" />
                  <p className="text-sm text-muted-foreground">Login Streak</p>
                </div>
                <p className="text-3xl font-bold text-gold">{analyticsData.streakCount} days</p>
                {streakBadge && (
                  <Badge variant="outline" className="mt-2">
                    <streakBadge.icon className={`w-3 h-3 mr-1 ${streakBadge.color}`} />
                    {streakBadge.label}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Total Sessions */}
            <Card className="glass border-primary/30 hover:shadow-neon transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
                <p className="text-3xl font-bold">{analyticsData.loginSessions.length}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analyticsData.loginSessions.reduce((sum, s) => sum + s.duration, 0) / 3600 | 0}h total
                </p>
              </CardContent>
            </Card>

            {/* Last Active */}
            <Card className="glass border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Last Active</p>
                </div>
                <p className="text-3xl font-bold">{formatDate(analyticsData.lastActive)}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(analyticsData.lastActive).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Login Calendar */}
          <Card className="glass border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                30-Day Login History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-2">
                {loginCalendar.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded flex items-center justify-center text-xs font-semibold transition-all ${
                      day.hasLogin
                        ? 'bg-primary/80 text-white hover:bg-primary'
                        : 'bg-muted/20 text-muted-foreground hover:bg-muted/40'
                    }`}
                    title={`${day.date}${day.hasLogin ? ` - ${formatTime(day.duration)}` : ''}`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                💡 Hover over dates to see session duration. Green = 1hr+ session completed.
              </p>
            </CardContent>
          </Card>

          {/* Streak Achievements */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold" />
                Streak Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className={`border rounded-lg p-4 text-center ${analyticsData.streakCount >= 7 ? 'border-primary/50 bg-primary/5' : 'border-muted/20'}`}>
                  <Flame className={`w-8 h-8 mx-auto mb-2 ${analyticsData.streakCount >= 7 ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="font-semibold">7-Day Streak</p>
                  <p className="text-xs text-muted-foreground">Rising Star</p>
                  {analyticsData.streakCount >= 7 && <Badge className="mt-2">Unlocked!</Badge>}
                </div>
                <div className={`border rounded-lg p-4 text-center ${analyticsData.streakCount >= 30 ? 'border-gold/50 bg-gold/5' : 'border-muted/20'}`}>
                  <Award className={`w-8 h-8 mx-auto mb-2 ${analyticsData.streakCount >= 30 ? 'text-gold' : 'text-muted-foreground'}`} />
                  <p className="font-semibold">30-Day Streak</p>
                  <p className="text-xs text-muted-foreground">Master Trader</p>
                  {analyticsData.streakCount >= 30 && <Badge className="mt-2 bg-gold">Unlocked!</Badge>}
                </div>
                <div className={`border rounded-lg p-4 text-center ${analyticsData.streakCount >= 100 ? 'border-purple-500/50 bg-purple-500/5' : 'border-muted/20'}`}>
                  <Trophy className={`w-8 h-8 mx-auto mb-2 ${analyticsData.streakCount >= 100 ? 'text-purple-500' : 'text-muted-foreground'}`} />
                  <p className="font-semibold">100-Day Streak</p>
                  <p className="text-xs text-muted-foreground">Legend</p>
                  {analyticsData.streakCount >= 100 && <Badge className="mt-2 bg-purple-500">Unlocked!</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics Dashboard */}
        <div className="mb-12 max-w-7xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-6">Performance Metrics</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Total Returns</p>
                </div>
                <p className={`text-3xl font-bold ${performanceMetrics.totalReturns >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {performanceMetrics.totalReturns >= 0 ? '+' : ''}{performanceMetrics.totalReturns.toFixed(2)}%
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                </div>
                <p className="text-3xl font-bold text-primary">{performanceMetrics.winRate.toFixed(1)}%</p>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Total Trades</p>
                </div>
                <p className="text-3xl font-bold">{performanceMetrics.totalTrades}</p>
                <p className="text-xs text-primary mt-1">{performanceMetrics.profitableTrades} profitable</p>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Avg Trade P/L</p>
                </div>
                <p className={`text-3xl font-bold ${performanceMetrics.avgTradeProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  ${performanceMetrics.avgTradeProfit.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                </div>
                <p className="text-3xl font-bold text-primary">${performanceMetrics.totalValue.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="glass border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-muted-foreground">Best Asset</p>
                </div>
                {performanceMetrics.bestAsset ? (
                  <>
                    <p className="text-xl font-bold">{performanceMetrics.bestAsset.asset}</p>
                    <p className="text-sm text-green-500">+{performanceMetrics.bestAsset.profitPercent.toFixed(2)}%</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No assets</p>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-red-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-muted-foreground">Worst Asset</p>
                </div>
                {performanceMetrics.worstAsset ? (
                  <>
                    <p className="text-xl font-bold">{performanceMetrics.worstAsset.asset}</p>
                    <p className={`text-sm ${performanceMetrics.worstAsset.profitPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {performanceMetrics.worstAsset.profitPercent >= 0 ? '+' : ''}{performanceMetrics.worstAsset.profitPercent.toFixed(2)}%
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No assets</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="mb-12 max-w-7xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-6">Risk Analysis</h2>
          
          <div className="grid md:grid-cols-5 gap-6 mb-8">
            <Card className="glass border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                </div>
                <p className={`text-2xl font-bold ${getRiskColor(riskMetrics.riskLevel)}`}>
                  {riskMetrics.riskLevel}
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Volatility</p>
                </div>
                <p className="text-2xl font-bold">{riskMetrics.volatility.toFixed(2)}%</p>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <PieChart className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Diversification</p>
                </div>
                <p className="text-2xl font-bold text-primary">{riskMetrics.diversificationScore.toFixed(0)}%</p>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  <p className="text-sm text-muted-foreground">Max Drawdown</p>
                </div>
                <p className="text-2xl font-bold text-destructive">-{riskMetrics.maxDrawdown.toFixed(2)}%</p>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                </div>
                <p className="text-2xl font-bold">{riskMetrics.sharpeRatio.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="mb-12 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-heading font-bold">Performance Charts</h2>
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Portfolio Value Over Time */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Portfolio Value Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={portfolioHistory}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorValue)" name="Portfolio Value ($)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Daily Profit/Loss */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Daily Profit/Loss
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyProfitLoss}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="profit" fill="#0EA5E9" name="Profit/Loss ($)">
                      {dailyProfitLoss.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Portfolio Allocation */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Portfolio Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolioAllocation.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={portfolioAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {portfolioAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                        formatter={(value: any) => `$${value.toFixed(2)}`}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No portfolio data yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cumulative Returns */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Cumulative Returns vs Initial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={portfolioHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="returns" stroke="#0EA5E9" strokeWidth={2} name="Returns (%)" dot={{ fill: '#0EA5E9' }} />
                    <Line type="monotone" dataKey={() => 0} stroke="#888" strokeDasharray="5 5" name="Initial Investment" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transaction History Analytics */}
        <div className="mb-20 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-heading font-bold">Transaction History Analytics</h2>
            <div className="flex gap-4">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  <SelectItem value="buy">Buy Only</SelectItem>
                  <SelectItem value="sell">Sell Only</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => {
                const csv = filteredTransactions.map(tx => 
                  `${tx.date},${tx.type},${tx.asset},${tx.amount},${tx.price}`
                ).join('\n');
                const blob = new Blob([`Date,Type,Asset,Amount,Price\n${csv}`], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'transactions.csv';
                a.click();
              }}>
                Export CSV
              </Button>
            </div>
          </div>

          <Card className="glass border-white/10">
            <CardContent className="p-6">
              {filteredTransactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No transactions yet. Start trading to see your history!</p>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.slice(0, 20).map((tx) => {
                    const profit = tx.type === "buy" 
                      ? (currentPrices[tx.asset.toLowerCase() as keyof typeof currentPrices] - tx.price) * tx.amount
                      : 0;
                    
                    return (
                      <div key={tx.id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-accent/50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'buy' ? 'bg-primary/20' : 'bg-destructive/20'}`}>
                            {tx.type === 'buy' ? <TrendingUp className="w-5 h-5 text-primary" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
                          </div>
                          <div>
                            <div className="font-semibold">{tx.type.toUpperCase()} {tx.asset}</div>
                            <div className="text-sm text-muted-foreground">{tx.date} • {formatDate(tx.timestamp)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{tx.amount.toFixed(4)} @ ${tx.price.toLocaleString()}</div>
                          {tx.type === 'buy' && (
                            <div className={`text-sm font-semibold ${profit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                              {profit >= 0 ? '+' : ''}${profit.toFixed(2)} P/L
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          <Card className="glass border-primary/30 hover:shadow-neon transition-all animate-fade-in">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl glass border-primary/30 flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold">Mission</h3>
              <p className="text-muted-foreground">
                To democratize financial education by providing a risk-free platform 
                where anyone can learn and practice investing.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-gold/30 hover:shadow-gold transition-all animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl glass border-gold/30 flex items-center justify-center">
                <Eye className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-2xl font-heading font-bold">Vision</h3>
              <p className="text-muted-foreground">
                A world where financial literacy is accessible to everyone, 
                regardless of their background or experience level.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-primary/30 hover:shadow-neon transition-all animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl glass border-primary/30 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-bold">Values</h3>
              <p className="text-muted-foreground">
                Education first, transparency always, innovation constantly, 
                and accessibility for all.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* About Content */}
        <div className="max-w-4xl mx-auto mb-20 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Card className="glass border-white/10">
            <CardContent className="p-8 md:p-12 space-y-6 text-lg">
              <h2 className="text-3xl font-heading font-bold mb-6">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Finverse, we believe that financial knowledge shouldn't be a privilege—it should 
                be a right. Our platform bridges the gap between complex financial markets and 
                everyday people who want to understand how investing works.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through our AI-powered demo investment simulator, users can experience real market 
                conditions, practice trading strategies, and learn from their decisions—all without 
                risking a single dollar of real money.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We combine cutting-edge technology with educational content to create an immersive 
                learning experience that prepares you for the real world of investing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <Card className="glass border-primary/30 hover:shadow-neon transition-all">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-heading font-bold mb-8 text-center">
                Get in Touch
              </h2>
              <form className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Your Name
                  </label>
                  <Input
                    placeholder="John Doe"
                    className="glass border-white/20 focus:border-primary/50 focus:shadow-neon transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="glass border-white/20 focus:border-primary/50 focus:shadow-neon transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us how we can help you..."
                    rows={6}
                    className="glass border-white/20 focus:border-primary/50 focus:shadow-neon transition-all resize-none"
                  />
                </div>
                <Button variant="neon" size="lg" className="w-full">
                  Send Message
                  <Send className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-center gap-6 mb-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              GitHub
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Discord
            </a>
          </div>
          <p className="text-muted-foreground">
            © 2025 Finverse. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;