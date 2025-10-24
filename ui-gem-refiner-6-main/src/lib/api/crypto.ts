const CRYPTO_API_KEY = '7aabc12ae44c49189ee8bd952765c2cd';

export type TimeRange = '1' | '7' | '30';
export type CryptoSymbol = 'ETH' | 'BTC';

interface CryptoData {
  price: number;
  change: number;
  trend: 'up' | 'down';
  sparkline: number[];
}

export interface CombinedCryptoData {
  ethereum: CryptoData;
  bitcoin: CryptoData;
}

export async function fetchCryptoCurrency(symbol: CryptoSymbol, timeRange: TimeRange): Promise<CryptoData> {
  const daysMap: Record<TimeRange, number> = {
    '1': 1,
    '7': 7,
    '30': 30
  };

  const days = daysMap[timeRange];

  try {
    // Get current price and 24h change using pricemultifull
    const priceUrl = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${CRYPTO_API_KEY}`;
    const priceResponse = await fetch(priceUrl);
    
    if (!priceResponse.ok) {
      throw new Error(`Failed to fetch ${symbol} price data`);
    }
    
    const priceData = await priceResponse.json();
    
    if (priceData.Response === 'Error') {
      throw new Error(priceData.Message);
    }
    
    const currentPrice = priceData.RAW?.[symbol]?.USD?.PRICE || 0;
    const change24h = priceData.RAW?.[symbol]?.USD?.CHANGEPCT24HOUR || 0;
    
    // For longer time ranges, calculate change from historical data
    let priceChange = change24h;
    
    if (days > 1) {
      const histEndpoint = days <= 7
        ? `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=USD&limit=${days * 24}&api_key=${CRYPTO_API_KEY}`
        : `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=${days}&api_key=${CRYPTO_API_KEY}`;
      
      const histResponse = await fetch(histEndpoint);
      
      if (histResponse.ok) {
        const histData = await histResponse.json();
        
        if (histData.Data?.Data && histData.Data.Data.length > 1) {
          const dataPoints = histData.Data.Data;
          const startPrice = dataPoints[0].close;
          
          if (startPrice > 0) {
            priceChange = ((currentPrice - startPrice) / startPrice) * 100;
          }
        }
      }
    }
    
    // Generate sparkline
    const sparkline: number[] = [];
    const histEndpoint = days <= 7
      ? `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=USD&limit=${Math.min(days * 24, 168)}&api_key=${CRYPTO_API_KEY}`
      : `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=${days}&api_key=${CRYPTO_API_KEY}`;
    
    const sparkResponse = await fetch(histEndpoint);
    
    if (sparkResponse.ok) {
      const sparkData = await sparkResponse.json();
      const histData = sparkData.Data?.Data || [];
      
      if (histData.length > 0) {
        const sparklinePoints = 10;
        const step = Math.max(1, Math.floor(histData.length / sparklinePoints));
        
        for (let i = 0; i < histData.length && sparkline.length < sparklinePoints; i += step) {
          sparkline.push(histData[i].close);
        }
        
        if (sparkline.length < sparklinePoints && histData.length > 0) {
          sparkline.push(histData[histData.length - 1].close);
        }
      }
    }
    
    // Fallback sparkline if API fails
    if (sparkline.length === 0) {
      for (let i = 0; i < 10; i++) {
        sparkline.push(currentPrice);
      }
    }

    return {
      price: currentPrice,
      change: priceChange,
      trend: priceChange >= 0 ? 'up' : 'down',
      sparkline
    };
  } catch (error) {
    console.error(`Error fetching ${symbol} data:`, error);
    throw error;
  }
}

export async function fetchCryptoData(timeRange: TimeRange): Promise<CombinedCryptoData> {
  const [ethereum, bitcoin] = await Promise.all([
    fetchCryptoCurrency('ETH', timeRange),
    fetchCryptoCurrency('BTC', timeRange)
  ]);

  return {
    ethereum,
    bitcoin
  };
}