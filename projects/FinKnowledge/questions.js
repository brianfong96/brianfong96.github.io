const questionBank = [
  {
    prompt:
      'A stock is trading at $50 with a trailing EPS of $2. What is its trailing P/E ratio?',
    options: ['8', '25', '48', '52'],
    answerIndex: 1,
    explanation: {
      eli5: 'Price-to-earnings tells you how many dollars investors pay for each dollar a company earns.',
      technical:
        'The trailing price-to-earnings (P/E) ratio equals the current share price divided by earnings per share. Here, 50 ÷ 2 = 25, meaning investors value the company at 25 times its trailing earnings.'
    }
  },
  {
    prompt:
      'Which statement best describes the middle line in a standard Bollinger Bands setup?',
    options: [
      'It is a 20-period simple moving average that the bands envelope.',
      'It is a 14-period exponential moving average of volume.',
      'It is the intraday VWAP recalculated each bar.',
      'It is the median of daily highs and lows over 20 periods.'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'Bollinger Bands wrap price with a moving average in the middle and volatility-based guardrails.',
      technical:
        'Standard Bollinger Bands use a 20-period simple moving average (SMA) as the middle line. The upper and lower bands are typically two standard deviations above and below this SMA, expanding and contracting with volatility.'
    }
  },
  {
    prompt:
      'Price rips to the upper Bollinger Band while RSI prints 76. What does that usually signal?',
    options: [
      'Momentum is hot but stretched, so watch for potential mean reversion or consolidation.',
      'A confirmed bearish breakdown that should be shorted immediately.',
      'Volatility has collapsed and price should drift sideways.',
      'Market makers are hedged delta-neutral.'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'When both momentum and volatility bands are maxed out, the move may be overcooked.',
      technical:
        'An RSI above 70 indicates overbought momentum, and price tagging the upper Bollinger Band shows it is two standard deviations above the 20-period mean. The combination suggests strong trend strength but also statistically stretched conditions, often preceding pauses or pullbacks.'
    }
  },
  {
    prompt:
      'Which formula gives the upper Bollinger Band?',
    options: [
      'Middle band + (standard deviation × multiplier)',
      'Middle band − (average true range × multiplier)',
      'Middle band + (RSI ÷ 100)',
      'Middle band × (earnings yield)'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'The top band is the moving average plus a volatility cushion.',
      technical:
        'The upper Bollinger Band equals the middle band (20-period SMA) plus the standard deviation of price over the lookback multiplied by a chosen factor (commonly 2). This construction adapts to volatility expansion or contraction.'
    }
  },
  {
    prompt:
      'A company generates $5 million in net income and has 2 million shares outstanding. What is its basic EPS?',
    options: ['$2.50', '$3.00', '$7.50', '$10.00'],
    answerIndex: 0,
    explanation: {
      eli5: 'Earnings per share divides total profit into equal slices for each share.',
      technical:
        'Basic earnings per share (EPS) is calculated as net income available to common shareholders divided by the weighted-average shares outstanding. Here, $5,000,000 ÷ 2,000,000 = $2.50 per share.'
    }
  },
  {
    prompt:
      'You own a call option with a strike of $100 expiring next month. The underlying stock rallies to $110. What does the call option represent now?',
    options: [
      'A right to buy the stock at $100, now $10 in-the-money.',
      'An obligation to sell the stock at $100, now $10 out-of-the-money.',
      'A guarantee the stock will close at $110.',
      'A short position that gains when price falls.'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'A call option is like a coupon letting you buy lower than the current price when the market has moved higher.',
      technical:
        'A long call grants the holder the right, not obligation, to purchase the underlying at the strike price. With spot at $110 and strike $100, the option has $10 of intrinsic value (in-the-money) before time value.'
    }
  },
  {
    prompt:
      'RSI dips to 34 while price taps the lower Bollinger Band after a steady downtrend. What is a common interpretation?',
    options: [
      'Conditions are oversold and volatility is stretched lower, hinting at a possible relief bounce.',
      'Price is trending strongly higher and likely to break out.',
      'Volatility has vanished, so expect a range to persist indefinitely.',
      'A golden cross confirmation just triggered.'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'When momentum and price both look washed out, traders watch for a snapback.',
      technical:
        'An RSI below 30–35 signals bearish momentum extremes. Price contacting the lower Bollinger Band places it two standard deviations below the 20-period mean. Together, they highlight an oversold condition where mean-reversion traders anticipate a bounce.'
    }
  },
  {
    prompt:
      'How is Bollinger Band width commonly interpreted?',
    options: [
      'As a gauge of volatility expansion or contraction.',
      'As a measure of trading volume acceleration.',
      'As a sentiment indicator from options skew.',
      'As a count of consecutive up days.'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'The space between the bands tells you if the market is calm or swinging wildly.',
      technical:
        'Band width equals the difference between the upper and lower Bollinger Bands, often normalized by the middle band. Wider bands reflect higher standard deviation (volatility), while narrow bands signal compression and the potential for breakouts.'
    }
  },
  {
    prompt:
      'If a stock has a P/E of 20, what is its earnings yield?',
    options: ['5%', '20%', '2%', '0.2%'],
    answerIndex: 0,
    explanation: {
      eli5: 'Earnings yield is just the upside-down version of the P/E ratio.',
      technical:
        'Earnings yield is calculated as EPS divided by price, the reciprocal of P/E. A P/E of 20 implies an earnings yield of 1 ÷ 20 = 0.05, or 5%, representing the percentage of earnings generated per dollar invested.'
    }
  },
  {
    prompt:
      'You buy a protective put on a stock you own. What scenario does this strategy guard against?',
    options: [
      'A sharp decline in the stock price below the put strike.',
      'A sudden increase in dividend payouts.',
      'A sideways market with low volatility.',
      'A rapid rally that exceeds the call strike.'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'Owning a put is like insurance: if the stock tanks, the put cushions the fall.',
      technical:
        'A protective put combines a long stock position with a long put option. The put grants the right to sell shares at the strike, limiting downside if the stock collapses, while retaining upside participation above the strike.'
    }
  },
  {
    prompt: 'An option has a delta of 0.65. What does that imply?',
    options: [
      'The option price will move about $0.65 for each $1 move in the underlying.',
      'The option will expire in 0.65 days.',
      'The option is currently 65% out-of-the-money.',
      'The implied volatility is capped at 65%.'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'Delta measures how closely the option wiggles with the stock—0.65 means it follows about two thirds of the move.',
      technical:
        'Option delta approximates the first derivative of the option price with respect to the underlying. A delta of 0.65 suggests the premium should gain roughly $0.65 for each $1 increase in the underlying before second-order effects like gamma are considered.'
    }
  },
  {
    prompt:
      'A company posts $60 million in EBITDA and carries an enterprise value of $480 million. What is its EV/EBITDA multiple?',
    options: ['4', '6', '8', '10'],
    answerIndex: 2,
    explanation: {
      eli5: 'The multiple compares the company price tag to its operating earnings stream.',
      technical:
        'EV/EBITDA equals enterprise value divided by EBITDA. With EV at 480 and EBITDA at 60, the multiple is 480 ÷ 60 = 8x, showing investors pay eight times operating cash earnings for the business.'
    }
  },
  {
    prompt: 'What does a Sharpe ratio above 1.0 typically indicate?',
    options: [
      'The strategy delivered more excess return per unit of volatility than cash earned.',
      'The portfolio lagged the risk-free rate on a volatility-adjusted basis.',
      'The investment carried no drawdowns.',
      'The returns were entirely risk-free.'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'A Sharpe above one means you earned a good chunk of return for the bumpiness you endured.',
      technical:
        'The Sharpe ratio equals (portfolio return − risk-free rate) divided by the portfolio standard deviation. Values greater than 1 imply the strategy earned more excess return per unit of volatility than cash, signaling attractive risk-adjusted performance.'
    }
  },
  {
    prompt: 'An inverted yield curve most often signals what economic outlook?',
    options: [
      'Markets expect weaker growth or recession ahead.',
      'Inflation is about to surge uncontrollably.',
      'Corporate earnings are guaranteed to accelerate.',
      'Short-term policy rates will fall immediately.'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'When short-term loans cost more than long-term ones, it usually means investors see trouble on the horizon.',
      technical:
        'An inverted yield curve occurs when shorter maturities yield more than longer bonds, reflecting expectations for slowing growth, potential policy easing, or rising recession odds as investors lock in longer-term rates despite lower coupons.'
    }
  },
  {
    prompt:
      'According to put-call parity, what must hold for a non-dividend stock?',
    options: [
      'Call price − put price = underlying price − present value of strike.',
      'Call price + put price = twice the underlying price.',
      'Put price ÷ call price = implied volatility.',
      'Call price = put price when delta is zero.'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'Calls and puts on the same strike are linked, otherwise arbitrage traders could mint free money.',
      technical:
        'Put-call parity states C − P = S − Ke^(−rt) for European options on non-dividend-paying stocks, tying option prices to the underlying spot and discounted strike. Deviations invite arbitrage via synthetic long or short forwards.'
    }
  },
  {
    prompt:
      'A portfolio beta of 1.3 relative to the S&P 500 suggests what?',
    options: [
      'The portfolio tends to move 30% more than the market in the same direction.',
      'Returns are uncorrelated with the index.',
      'The portfolio will never decline when the index drops.',
      'Volatility is 30% of the benchmark.'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'A beta above one is like turning up the market’s volume knob—up moves and down moves both feel stronger.',
      technical:
        'Beta measures systematic sensitivity to a benchmark. A beta of 1.3 implies the portfolio’s returns change by roughly 1.3% for every 1% move in the index on average, indicating higher exposure to market swings.'
    }
  },
  {
    prompt:
      'Discounting $1,000 one year at a 4% annual rate gives what present value?',
    options: ['$960', '$961.54', '$964', '$976'],
    answerIndex: 1,
    explanation: {
      eli5: 'Money promised in the future is worth a bit less today after you account for the cost of waiting.',
      technical:
        'Present value equals future value divided by (1 + r)^n. Plugging in $1,000, r = 0.04, and n = 1 gives 1000 ÷ 1.04 ≈ $961.54.'
    }
  },
  {
    prompt:
      'Five-year Treasuries yield 3.1% while five-year TIPS yield 1.2%. What is the market-implied break-even inflation?',
    options: ['1.9%', '2.3%', '3.1%', '4.3%'],
    answerIndex: 0,
    explanation: {
      eli5: 'The gap between nominal and inflation-protected bonds shows how much inflation investors expect.',
      technical:
        'Break-even inflation approximates the nominal Treasury yield minus the TIPS real yield for the same maturity. Here 3.1% − 1.2% = 1.9%, signaling the inflation rate that equalizes returns between the two securities.'
    }
  },
  {
    prompt: 'A current ratio of 2.5 indicates what about a company’s liquidity?',
    options: [
      'It has $2.50 in current assets for every $1 of current liabilities.',
      'It can only cover 40% of near-term obligations.',
      'It is insolvent under GAAP rules.',
      'It will default once interest rates rise.'
    ],
    answerIndex: 0,
    explanation: {
      eli5: 'The firm has more than double the quick-to-use resources it needs to pay short-term bills.',
      technical:
        'The current ratio equals current assets divided by current liabilities. A value of 2.5 means liquid resources are 2.5 times obligations due within a year, generally signaling comfortable short-term coverage.'
    }
  }
];
