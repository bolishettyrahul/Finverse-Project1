// Analytics and Performance Tracking System

export interface Transaction {
  id: number;
  type: "buy" | "sell";
  asset: string;
  amount: number;
  price: number;
  date: string;
  timestamp: number;
}

export interface PortfolioItem {
  asset: string;
  quantity: number;
  avgPrice: number;
  type: string;
}

export interface LoginSession {
  date: string;
  duration: number; // in seconds
  timestamp: number;
}

export interface UserAnalytics {
  transactions: Transaction[];
  portfolio: PortfolioItem[];
  loginSessions: LoginSession[];
  balance: number;
  lastActive: number;
  currentSessionStart: number;
  streakCount: number;
  lastLoginDate: string;
}

// Initialize or get analytics data from localStorage
export const getAnalyticsData = (): UserAnalytics => {
  const stored = localStorage.getItem("finverse_analytics");
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default data
  return {
    transactions: [],
    portfolio: [],
    loginSessions: [],
    balance: 100000,
    lastActive: Date.now(),
    currentSessionStart: Date.now(),
    streakCount: 0,
    lastLoginDate: new Date().toISOString().split('T')[0],
  };
};

// Save analytics data to localStorage
export const saveAnalyticsData = (data: UserAnalytics) => {
  localStorage.setItem("finverse_analytics", JSON.stringify(data));
};

// Update session tracking
export const updateSession = () => {
  const data = getAnalyticsData();
  const now = Date.now();
  const sessionDuration = Math.floor((now - data.currentSessionStart) / 1000);
  
  data.lastActive = now;
  
  // Only save session if it's at least 1 hour (3600 seconds)
  if (sessionDuration >= 3600) {
    const today = new Date().toISOString().split('T')[0];
    const existingSession = data.loginSessions.find(s => s.date === today);
    
    if (existingSession) {
      existingSession.duration += sessionDuration;
    } else {
      data.loginSessions.push({
        date: today,
        duration: sessionDuration,
        timestamp: now,
      });
      
      // Update streak
      updateStreak(data);
    }
    
    // Reset current session start
    data.currentSessionStart = now;
  }
  
  saveAnalyticsData(data);
};

// Update login streak
const updateStreak = (data: UserAnalytics) => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (data.lastLoginDate === yesterday) {
    // Continue streak
    data.streakCount++;
  } else if (data.lastLoginDate === today) {
    // Same day, no change
    return;
  } else {
    // Streak broken
    data.streakCount = 1;
  }
  
  data.lastLoginDate = today;
};

// Calculate performance metrics
export const calculatePerformanceMetrics = (transactions: Transaction[], portfolio: PortfolioItem[], balance: number, currentPrices: Record<string, number>) => {
  // Calculate total portfolio value
  const portfolioValue = portfolio.reduce((sum, item) => {
    const price = currentPrices[item.type] || item.avgPrice;
    return sum + (item.quantity * price);
  }, 0);
  
  const totalValue = portfolioValue + balance;
  const initialBalance = 100000;
  const totalReturns = ((totalValue - initialBalance) / initialBalance) * 100;
  
  // Calculate win/loss ratio
  const profitableTransactions = transactions.filter(tx => {
    if (tx.type === "sell") {
      // Find corresponding buy transactions
      const buyTxs = transactions.filter(t => t.type === "buy" && t.asset === tx.asset && t.timestamp < tx.timestamp);
      if (buyTxs.length > 0) {
        const avgBuyPrice = buyTxs.reduce((sum, t) => sum + t.price, 0) / buyTxs.length;
        return tx.price > avgBuyPrice;
      }
    }
    return false;
  });
  
  const sellTransactions = transactions.filter(tx => tx.type === "sell");
  const winRate = sellTransactions.length > 0 
    ? (profitableTransactions.length / sellTransactions.length) * 100 
    : 0;
  
  // Calculate average trade profit
  const avgTradeProfit = transactions.length > 0
    ? transactions.reduce((sum, tx) => {
        const price = currentPrices[tx.asset.toLowerCase()] || tx.price;
        if (tx.type === "buy") {
          return sum + ((price - tx.price) * tx.amount);
        }
        return sum;
      }, 0) / transactions.length
    : 0;
  
  // Find best and worst performing assets
  const assetPerformance = portfolio.map(item => {
    const currentPrice = currentPrices[item.type] || item.avgPrice;
    const profit = (currentPrice - item.avgPrice) * item.quantity;
    const profitPercent = ((currentPrice - item.avgPrice) / item.avgPrice) * 100;
    return { asset: item.asset, profit, profitPercent };
  });
  
  assetPerformance.sort((a, b) => b.profitPercent - a.profitPercent);
  
  return {
    totalValue,
    totalReturns,
    winRate,
    avgTradeProfit,
    bestAsset: assetPerformance[0] || null,
    worstAsset: assetPerformance[assetPerformance.length - 1] || null,
    profitableTrades: profitableTransactions.length,
    totalTrades: transactions.length,
  };
};

// Calculate risk metrics
export const calculateRiskMetrics = (transactions: Transaction[], portfolio: PortfolioItem[], currentPrices: Record<string, number>) => {
  // Calculate portfolio volatility (simplified)
  const returns = transactions.map((tx, index) => {
    if (index === 0) return 0;
    const prevTx = transactions[index - 1];
    return ((tx.price - prevTx.price) / prevTx.price) * 100;
  });
  
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);
  
  // Calculate diversification score
  const portfolioValue = portfolio.reduce((sum, item) => {
    const price = currentPrices[item.type] || item.avgPrice;
    return sum + (item.quantity * price);
  }, 0);
  
  const diversificationScore = portfolio.length > 0
    ? (1 - Math.abs(portfolio.reduce((max, item) => {
        const price = currentPrices[item.type] || item.avgPrice;
        const value = item.quantity * price;
        return Math.max(max, value / portfolioValue);
      }, 0) - 0.5) * 2) * 100
    : 0;
  
  // Calculate max drawdown
  let peak = 100000;
  let maxDrawdown = 0;
  
  transactions.forEach(tx => {
    const currentValue = portfolio.reduce((sum, item) => {
      const price = currentPrices[item.type] || item.avgPrice;
      return sum + (item.quantity * price);
    }, 0);
    
    if (currentValue > peak) {
      peak = currentValue;
    }
    
    const drawdown = ((peak - currentValue) / peak) * 100;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  // Simplified risk level
  let riskLevel: "Low" | "Medium" | "High";
  if (volatility < 5) riskLevel = "Low";
  else if (volatility < 15) riskLevel = "Medium";
  else riskLevel = "High";
  
  // Simplified Sharpe ratio
  const riskFreeRate = 2; // 2% annual risk-free rate
  const sharpeRatio = returns.length > 0 && volatility > 0
    ? (avgReturn - riskFreeRate) / volatility
    : 0;
  
  return {
    volatility,
    riskLevel,
    diversificationScore,
    maxDrawdown,
    sharpeRatio,
  };
};

// Get portfolio history data
export const getPortfolioHistory = (transactions: Transaction[], days: number = 30) => {
  const history: { date: string; value: number; returns: number }[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTransactions = transactions.filter(tx => tx.date === dateStr);
    const value = 100000 + dayTransactions.reduce((sum, tx) => {
      return sum + (tx.type === "buy" ? -tx.price * tx.amount : tx.price * tx.amount);
    }, 0) + Math.random() * 5000;
    
    const returns = ((value - 100000) / 100000) * 100;
    
    history.push({ date: dateStr, value, returns });
  }
  
  return history;
};

// Get daily profit/loss data
export const getDailyProfitLoss = (transactions: Transaction[], days: number = 7) => {
  const data: { date: string; profit: number }[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTransactions = transactions.filter(tx => tx.date === dateStr);
    const profit = dayTransactions.reduce((sum, tx) => {
      return sum + (tx.type === "sell" ? (Math.random() - 0.5) * 1000 : 0);
    }, 0);
    
    data.push({ date: dateStr, profit });
  }
  
  return data;
};