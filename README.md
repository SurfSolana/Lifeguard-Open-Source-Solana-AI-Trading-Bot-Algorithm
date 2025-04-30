# Lifeguard: Your 24/7 Crypto Portfolio Protector

## What is Lifeguard?

Lifeguard is your personal crypto safety net, automatically moving your assets between Solana (SOL) and USD Coin (USDC) based on market sentiment. Think of it as a smart lifeguard who watches the crypto ocean and moves you to safety when the waves get too rough, or back into the water when conditions are ideal.

With Lifeguard, you can:
- Protect your portfolio during market downturns
- Automatically buy SOL when prices are favorable
- Convert to stable USDC when market sentiment turns negative
- All without having to constantly monitor the market yourself

## How Does Lifeguard Work?

### The Power of the Fear & Greed Index

Lifeguard uses the Crypto Fear & Greed Index (FGI) – a number from 0 to 100 that traditionally measures market sentiment:
- **0-25**: Extreme Fear (market is very negative)
- **26-45**: Fear (market is nervous)
- **46-55**: Neutral (market is undecided)
- **56-75**: Greed (market is optimistic)
- **76-100**: Extreme Greed (market is possibly overheated)

### Making Smart Trading Decisions

Through extensive backtesting of market data, Lifeguard has discovered that for SOL, an FGI reading of 42 is the optimal point to change positions:

- **When FGI rises above 42**: Lifeguard buys SOL (when market is greedy)
- **When FGI falls below 42**: Lifeguard converts SOL to USDC (when market is fearful)

This strategy has historically outperformed simply holding SOL by over 50%, turning what would have been losses into significant gains.

** NOTE: Lifeguard automatically determines the best midpoint to trade on based on ongoing backtests that happen each time a 4 hour data point is updated by CFGI.io - the numbers in this section are accurate as of April 18, 2025. The most recent data is available at [lifeguard.surfsolana.com](https://lifeguard.surfsolana.com)

### Set It and Forget It

Once connected to your wallet, Lifeguard works automatically:
1. It continuously monitors the Fear & Greed Index in real-time
2. When the FGI crosses the optimal threshold, Lifeguard executes trades
3. Your portfolio adjusts to market conditions without you lifting a finger
4. You stay protected in downturns while capitalizing on upswings

## Where Does the Data Come From?

### The Fear & Greed Index

Lifeguard uses real-time Fear & Greed Index data from SurfSolana, a specialized platform that calculates the FGI using multiple factors:

- **Market Momentum**: Price trends and volatility
- **Trading Volume**: Buying and selling activity
- **Social Media Sentiment**: What people are saying about crypto
- **Market Dominance**: Distribution of value among cryptocurrencies
- **Google Trends**: Search interest in crypto topics

This data is combined into a single number that accurately reflects market sentiment, updated throughout the day.

### Price Data

Lifeguard uses reliable price feeds from major crypto exchanges to ensure you're always getting fair market rates for your trades.

## How Can You Access This Data?

If you're curious about the data powering Lifeguard, you can access it in several ways:

### View the Live Index

The current Fear & Greed Index is displayed directly in the Lifeguard dashboard, showing you exactly what the market sentiment is at any given moment.

### Check Historical Data

You can view historical FGI values and how they've corresponded with price movements to understand how the strategy has performed over time.

### API Access (For the Curious)

The data comes from the SurfSolana API, which provides historical price and FGI data. Even if you don't code, it's good to know the data is:
- Transparent and accessible
- Updated regularly
- The same data that powers the Lifeguard strategy

Available at: https://api.surfsolana.com/SOL/4h/1_year.json

## See the Math for Yourself

Don't just take our word for it – you can verify how well this strategy works using our open-source backtest code. With minimal coding knowledge, you can:

1. View our transparent backtest results showing the strategy's performance
2. See exactly how the algorithm makes decisions

## Getting Started with Lifeguard

Ready to protect your crypto portfolio from market storms?

1. Visit [lifeguard.surfsolana.com](https://lifeguard.surfsolana.com)
2. Log in via email, SMS, or an existing Solana wallet
3. Depost the amount of SOL to protect
4. Let Lifeguard handle the rest

Join our community of crypto investors who sleep better at night knowing their assets are protected by [Lifeguard](https://lifeguard.surfsolana.com) – the 24/7 guardian of your digital wealth.

---

*Past performance is not indicative of future results. The backtest results represent historical performance under specific market conditions and are not guarantees of future performance.*
