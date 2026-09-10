---
version: 1
slug: "blog-pricing-the-move-index-html"
primary_target: "blog/pricing-the-move/index.html"
related_targets: ["blog.html","assets/data/msft-options-snapshot.json","assets/css/options-volatility.css","assets/js/options-volatility.js","tests/options-volatility-test.js"]
---

Scope: blog/pricing-the-move/index.html and its dedicated data, CSS, JavaScript, index registration, and browser tests.
Mode: Read.
Audience: Readers with no options background who need the contract, calls, puts, and Greeks explained before seeing real market fields.
Job: Understand what an option is, distinguish calls from puts, understand implied volatility, calculate how Delta/Gamma/Theta/Vega/Rho combine into an approximate price change, read a dated option-chain snapshot, and see how one contract changes over time.
Proof: A frozen September 9, 2026 MSFT close and October 9 $490 call/put snapshot, plus nine trading days of actual MSFT price, call price, IV, probability, and days remaining. Historical Greek teaching estimates are derived from observed data with disclosed Black-Scholes assumptions.
Constraints: Static GitHub Pages site; continuous scroll; no collapsed content, sliders, editable numbers, tabs, or non-question controls; only reasoning-based multiple-choice questions; real-data caveats must distinguish last trade from bid/ask and frozen data from live quotes; paragraph jargon exposes definitions; responsive, keyboard accessible, no-JavaScript readable, and SPA compatible.
Direction: An eight-chapter beginner field guide in the Financial Research Desk identity. Options, calls, puts, and IV establish the inputs; the Greeks chapter translates each unit into dollars and combines them; the MSFT snapshot and synchronized history charts provide the evidence; references close the guide.
Memorable moment: Selecting one date draws the same crosshair through nine observed and estimated series and updates one shared readout, connecting MSFT price, call price, IV, probability, and all five Greeks.
Required views: Learning roadmap, option anatomy, call payoff, put payoff, dedicated IV explanation, five Greek definitions, combined Greek equation, four worked price-change scenarios, practical Greek use table, MSFT snapshot including Rho, call value decomposition, four-series observed history, five-series estimated Greek history, synchronized crosshair/readout, accessible historical tables, questions, glossary, and sources.
Implementation inventory: Eight fully expanded chapters; sticky desktop anchor navigation; chapter bridges; paragraph-only glossary popovers; seven reasoning questions with misconception-specific feedback; frozen JSON data asset with quote timestamps and model assumptions; semantic snapshot and historical tables; generated accessible SVG small multiples with one focus stop per chart, arrow-key date selection, and linked cross-graph highlighting; no-JavaScript table fallback; mobile card-form history with charts removed to avoid panning; lifecycle cleanup; desktop/mobile Puppeteer coverage.
Unresolved decisions: None.
