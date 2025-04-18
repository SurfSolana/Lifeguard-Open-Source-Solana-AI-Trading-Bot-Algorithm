/**
 * # Lifeguard Backtest Algorithm
 * 
 * This repository contains a simplified version of the Lifeguard wallet's backtesting algorithm.
 * It demonstrates how the Fear & Greed Index (FGI) is used to create a trading strategy
 * that outperforms buy-and-hold in crypto markets.
 * 
 * ## Overview
 * 
 * The Lifeguard algorithm uses the Crypto Fear & Greed Index to automatically switch between
 * SOL and USDC based on market sentiment. When the FGI indicates extreme fear (below a certain midpoint),
 * it's often a good time to buy, and when it indicates extreme greed (above the midpoint), 
 * it might be time to sell and secure profits.
 * 
 * ## How It Works
 * 
 * 1. The algorithm analyzes historical price and FGI data across various timeframes
 * 2. For each FGI midpoint value (typically 0-100), it simulates trading SOL/USDC
 * 3. The optimal FGI midpoint is determined by comparing strategy returns
 * 4. The strategy with the highest outperformance vs. buy-and-hold is selected
 * 
 * ## Installation
 * 
 * This code uses TypeScript and requires Node.js and the tsx package to run directly.
 * 
 * ```bash
 * # Clone the repository
 * git clone https://github.com/lifeguard-wallet/backtest-algorithm.git
 * cd backtest-algorithm
 * 
 * # Install dependencies (node-fetch is needed for API requests)
 * npm install node-fetch
 * 
 * # Install tsx globally for running TypeScript directly
 * npm install -g tsx
 * 
 * # Or alternatively, install tsx locally
 * npm install tsx
 * ```
 * 
 * ## Running the Backtest
 * 
 * You can run the backtest script directly using tsx:
 * 
 * ```bash
 * # Global tsx installation
 * tsx backtest.ts
 * 
 * # Local tsx installation
 * npx tsx backtest.ts
 * 
 * # With command line arguments for asset and timeframe
 * tsx backtest.ts SOL 4h
 * ```
 * 
 * ## Usage in Your Own Projects
 * 
 * ```typescript
 * import { fetchHistoricalData, findOptimalMidpoint, backtest } from './lifeguard-backtest';
 * 
 * // Get historical data for SOL with 4h timeframe
 * fetchHistoricalData('SOL', '4h').then(data => {
 *   // Find the optimal FGI midpoint for this asset
 *   const optimalMidpoint = findOptimalMidpoint(data);
 *   console.log(`Optimal FGI midpoint: ${optimalMidpoint}`);
 *   
 *   // Run backtest with the optimal midpoint
 *   const result = backtest(data, optimalMidpoint);
 *   console.log(`Strategy return: ${result.strategyReturn.toFixed(2)}%`);
 *   console.log(`Outperformance vs. HODL: ${(result.strategyReturn - result.baselineReturn).toFixed(2)}%`);
 * });
 * ```
 * 
 * ## Requirements
 * 
 * - Node.js 16+
 * - npm or yarn
 * - Internet connection to fetch data from SurfSolana API
 * 
 * ## Disclaimer
 * 
 * This code is provided for educational and demonstration purposes only. Past performance
 * is not indicative of future results. The backtest results represent historical performance
 * under specific market conditions and are not a guarantee of future performance.
 */

/**
 * Main backtest function that simulates trading based on FGI values
 */
function backtest(
    data: FgiDataPoint[], 
    fgiMidpoint: number = 50
  ): BacktestResult {
    // Configuration
    const INITIAL_CAPITAL_USD = 1000;        // $1,000 starting capital
    const SOL_RESERVE_AMOUNT = 0.01;         // Amount of SOL to reserve for fees
    const PLATFORM_FEE_RATE = 0.0009;        // 0.09% platform fee
    const TX_FEE_SOL = 0.000025;             // Transaction fee in SOL
  
    // Ensure data is sorted by date
    data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
    // Initial state
    const initialPrice = data[0].price;
    const initialSolAmount = INITIAL_CAPITAL_USD / initialPrice;
    
    // Portfolio state
    let solBalance = initialSolAmount / 2;           // Start with 50% in SOL
    let usdcBalance = INITIAL_CAPITAL_USD / 2;       // Start with 50% in USDC
    let lastFgiScore = data[0].fgi;
    
    // Trading stats
    let numTrades = 0;
    let winningTrades = 0;
    let lastTradePrice = initialPrice;
  
    // Process each data point
    for (let i = 1; i < data.length; i++) {
      const { price, fgi, timestamp } = data[i];
  
      // Determine if we should swap based on FGI value
      // When FGI >= midpoint, go to SOL (bullish)
      // When FGI < midpoint, go to USDC (bearish)
      if (fgi >= fgiMidpoint && usdcBalance > 0) {
        // USDC to SOL (bullish)
        const platformFee = usdcBalance * PLATFORM_FEE_RATE;
        const solBought = (usdcBalance - platformFee) / price;
        
        solBalance += solBought - TX_FEE_SOL;
        usdcBalance = 0;
        
        // Track trade stats
        numTrades++;
        if (price < lastTradePrice) {
          winningTrades++; // Bought at a lower price than last trade
        }
        lastTradePrice = price;
        
      } else if (fgi < fgiMidpoint && solBalance > SOL_RESERVE_AMOUNT) {
        // SOL to USDC (bearish)
        const availableSol = solBalance - SOL_RESERVE_AMOUNT - TX_FEE_SOL;
        
        if (availableSol > 0) {
          const usdcBought = availableSol * price;
          const platformFee = usdcBought * PLATFORM_FEE_RATE;
          
          usdcBalance += (usdcBought - platformFee);
          solBalance = SOL_RESERVE_AMOUNT;
          
          // Track trade stats
          numTrades++;
          if (price > lastTradePrice) {
            winningTrades++; // Sold at a higher price than last trade
          }
          lastTradePrice = price;
        }
      }
      
      // Update last FGI score
      lastFgiScore = fgi;
    }
  
    // Calculate final results
    const finalPrice = data[data.length - 1].price;
    const finalPortfolioValue = solBalance * finalPrice + usdcBalance;
    const strategyReturn = ((finalPortfolioValue - INITIAL_CAPITAL_USD) / INITIAL_CAPITAL_USD) * 100;
    
    // Calculate baseline return (buy and hold)
    const finalBaselineValue = initialSolAmount * finalPrice;
    const baselineReturn = ((finalBaselineValue - INITIAL_CAPITAL_USD) / INITIAL_CAPITAL_USD) * 100;
  
    return {
      startDate: data[0].timestamp,
      endDate: data[data.length - 1].timestamp,
      startingPrice: initialPrice,
      endingPrice: finalPrice,
      baselineReturn,
      strategyReturn,
      numTrades,
      winningTrades,
      winRate: numTrades > 0 ? (winningTrades / numTrades) * 100 : 0,
      fgiMidpoint,
      endingSolBalance: solBalance,
      endingUsdcBalance: usdcBalance,
      totalPortfolioValueUSD: finalPortfolioValue
    };
  }
  
  /**
   * Find the optimal FGI midpoint by testing multiple values
   */
  function findOptimalMidpoint(data: FgiDataPoint[]): number {
    let bestMidpoint = 50;
    let bestReturn = -Infinity;
    
    // Test FGI midpoints from 20 to 80
    for (let midpoint = 20; midpoint <= 80; midpoint++) {
      const result = backtest(data, midpoint);
      
      if (result.strategyReturn > bestReturn) {
        bestReturn = result.strategyReturn;
        bestMidpoint = midpoint;
      }
    }
    
    return bestMidpoint;
  }
  
  // Import fetch for making API requests
  import fetch from 'node-fetch';
  
  // Types for our data
  interface FgiDataPoint {
    timestamp: string;
    price: number;  // Asset price (e.g., SOL/USD)
    fgi: number;    // Fear & Greed Index value (0-100)
  }
  
  interface BacktestResult {
    startDate: string;
    endDate: string;
    startingPrice: number;
    endingPrice: number;
    baselineReturn: number;   // Buy and hold strategy return
    strategyReturn: number;   // FGI strategy return
    numTrades: number;
    winningTrades: number;
    winRate: number;
    fgiMidpoint: number;
    endingSolBalance: number;
    endingUsdcBalance: number;
    totalPortfolioValueUSD: number;
  }
  
  /**
   * Fetch historical price and FGI data from the SurfSolana API
   * @param asset Asset symbol (e.g., 'SOL', 'BTC')
   * @param timeframe Timeframe for data (e.g., '15min', '1h', '4h', '24h')
   * @param period Time period for data (default: '1_year')
   * @returns Promise that resolves to an array of FGI data points
   */
  async function fetchHistoricalData(
    asset: string, 
    timeframe: string,
    period: string = '1_year'
  ): Promise<FgiDataPoint[]> {
    try {
      // Construct the API URL
      const apiUrl = `https://api.surfsolana.com/${asset}/${timeframe}/${period}.json`;
      console.log(`Fetching data from ${apiUrl}...`);
      
      // Fetch data from the API
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      // Parse the response as JSON
      const data: FgiDataPoint[] = await response.json();
      
      console.log(`Successfully fetched ${data.length} data points`);
      
      // Calculate min and max FGI values in the dataset
      const fgiValues = data.map(d => d.fgi);
      const minFgi = Math.min(...fgiValues);
      const maxFgi = Math.max(...fgiValues);
      console.log(`FGI range in dataset: ${minFgi} to ${maxFgi}`);
      
      return data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }
  
  /**
   * Run a complete backtest on an asset and timeframe
   * This is the main function you should use to test the strategy
   */
  async function runFullBacktest(
    asset: string = 'SOL',
    timeframe: string = '4h'
  ): Promise<void> {
    try {
      console.log(`Starting backtest for ${asset} on ${timeframe} timeframe...`);
      
      // 1. Fetch historical data
      const data = await fetchHistoricalData(asset, timeframe);
      
      // 2. Find the optimal FGI midpoint
      const optimalMidpoint = findOptimalMidpoint(data);
      console.log(`\nOptimal FGI midpoint for ${asset}: ${optimalMidpoint}`);
      
      // 3. Run backtest with the optimal midpoint
      const result = backtest(data, optimalMidpoint);
      
      // 4. Display results
      console.log('\n==== Backtest Results ====');
      console.log(`Time period: ${new Date(result.startDate).toLocaleDateString()} to ${new Date(result.endDate).toLocaleDateString()}`);
      console.log(`Starting price: ${result.startingPrice.toFixed(2)}`);
      console.log(`Ending price: ${result.endingPrice.toFixed(2)}`);
      console.log(`\nStrategy performance: ${result.strategyReturn.toFixed(2)}%`);
      console.log(`Buy & hold performance: ${result.baselineReturn.toFixed(2)}%`);
      console.log(`Outperformance: ${(result.strategyReturn - result.baselineReturn).toFixed(2)}%`);
      console.log(`\nNumber of trades: ${result.numTrades}`);
      console.log(`Win rate: ${result.winRate.toFixed(2)}%`);
      console.log(`\nEnding portfolio value: ${result.totalPortfolioValueUSD.toFixed(2)}`);
      console.log(`SOL balance: ${result.endingSolBalance.toFixed(6)} SOL`);
      console.log(`USDC balance: ${result.endingUsdcBalance.toFixed(2)}`);
    } catch (error) {
      console.error('Error running backtest:', error);
    }
  }
  
  // Example usage:
  // 1. Run a full backtest for SOL on 4h timeframe:
  //    runFullBacktest('SOL', '4h').then(() => console.log('Backtest complete!'));
  //
  // 2. Fetch data and run a manual backtest:
  //    fetchHistoricalData('SOL', '4h').then(data => {
  //      const result = backtest(data, 42); // Use FGI midpoint of 42
  //      console.log(`Strategy return: ${result.strategyReturn.toFixed(2)}%`);
  //      console.log(`Buy & hold return: ${result.baselineReturn.toFixed(2)}%`);
  //      console.log(`Outperformance: ${(result.strategyReturn - result.baselineReturn).toFixed(2)}%`);
  //    });
  
  export { backtest, findOptimalMidpoint, fetchHistoricalData, runFullBacktest };