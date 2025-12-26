const CARDS = {
  // Spades
  sA: '&#127137;', s2: '&#127138;', s3: '&#127139;', s4: '&#127140;', s5: '&#127141;',
  s6: '&#127142;', s7: '&#127143;', s8: '&#127144;', s9: '&#127145;', s10: '&#127146;',
  sJ: '&#127147;', sQ: '&#127149;', sK: '&#127150;',
  
  // Hearts
  hA: '&#127153;', h2: '&#127154;', h3: '&#127155;', h4: '&#127156;', h5: '&#127157;',
  h6: '&#127158;', h7: '&#127159;', h8: '&#127160;', h9: '&#127161;', h10: '&#127162;',
  hJ: '&#127163;', hQ: '&#127165;', hK: '&#127166;',
  
  // Diamonds
  dA: '&#127169;', d2: '&#127170;', d3: '&#127171;', d4: '&#127172;', d5: '&#127173;',
  d6: '&#127174;', d7: '&#127175;', d8: '&#127176;', d9: '&#127177;', d10: '&#127178;',
  dJ: '&#127179;', dQ: '&#127181;', dK: '&#127182;',
  
  // Clubs
  cA: '&#127185;', c2: '&#127186;', c3: '&#127187;', c4: '&#127188;', c5: '&#127189;',
  c6: '&#127190;', c7: '&#127191;', c8: '&#127192;', c9: '&#127193;', c10: '&#127194;',
  cJ: '&#127195;', cQ: '&#127197;', cK: '&#127198;',

  // Back
  back: '&#127136;'
};

const tabData = {
  overview: {
    title: "Pokemon Pack Poker Tourney 2025",
    content: `
      <div class="hero">
        <div>
          <div class="eyebrow">Free buy-in finale</div>
          <h1>FIRST EVER 2025 YEAR END POKEMON PACK POKER TOURNEY! ♠️</h1>
          <p>I'm hosting my first tournament to wrap up 2025. No cash involved, just POKEMON PACKS.</p>
          <ul style="list-style: none; padding: 0; margin: 1rem 0;">
            <li style="margin-bottom: 0.5rem;"><strong>Buy-in:</strong> Buy in with pokemon packs, NOT CASH! First pack is ON THE HOUSE.</li>
            <li style="margin-bottom: 0.5rem;"><strong>Unlimited Re-buys:</strong> Take a shot (for you or a friend), get a pack!</li>
            <li style="margin-bottom: 0.5rem;"><strong>Vibe:</strong> No pressure to play. Keep it, trade it, or rip it for yourself. Special cards can earn more buy ins!</li>
          </ul>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="card">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg" alt="Pikachu" style="width: 100px; height: 100px; margin: 0 auto;"/>
          </div>
          <div class="schedule-box" style="background: rgba(255,255,255,0.5); padding: 1rem; border-radius: 12px; border: 1px solid var(--edge);">
            <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted);">Schedule</h3>
            <ul style="margin: 0; padding: 0; list-style: none; display: grid; gap: 0.5rem;">
              <li><strong>7:00 - 9:00</strong> Dinner / Warm up games</li>
              <li><strong>9:00 - 11:00</strong> Tourney</li>
              <li><strong>11:00 - 11:30</strong> Raised stakes</li>
              <li><strong>12:00 AM</strong> Countdown</li>
            </ul>
          </div>
        </div>
      </div>
    `,
  },
  prize: {
    title: "Prize",
    content: `
      <h2>Grand Prize: Prismatic Evolutions Packs</h2>
      <div class="card">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/133.svg" alt="Eevee" style="width: 100px; height: 100px; margin: 0 auto;"/>
        <p style="margin-top: 1rem;">This is the newest special set featuring Eevee and every single one of its evolutions (Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon, Glaceon, and Sylveon).</p>
        <p><strong>The ultimate chase here is the GOD PACK.</strong> If you hit this, you don't just get one rare card—you pull every single Eeveelution Special Illustration Rare in one pack.</p>
        
        <div style="margin-top: 1.5rem; text-align: center;">
            <a href="https://www.instagram.com/reel/DSVlzinEl0v/" target="_blank" style="display: inline-block; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: white; padding: 0.75rem 1.5rem; border-radius: 999px; text-decoration: none; font-weight: bold; box-shadow: 0 4px 15px rgba(220, 39, 67, 0.3);">
                Watch God Pack Pull on Instagram 📸
            </a>
        </div>
      </div>
    `,
  },
  rules: {
    title: "Tourney Rules",
    content: `
      <h2>Tourney Rules</h2>
      <div class="grid">
        <div class="card">
          <h3>General Rules</h3>
          <ul class="list" aria-label="Event facts">
            <li>
              <span class="badge" aria-hidden="true"></span>
              <span>Free buy-in: first Pokemon pack provided.</span>
            </li>
            <li>
              <span class="badge" aria-hidden="true"></span>
              <span>1 buy-in = 10 big blinds. Unlimited re-entries via packs.</span>
            </li>
            <li>
              <span class="badge" aria-hidden="true"></span>
              <span><strong>Shot for a Pack:</strong> You can buy in more by taking a shot for a pack! If you don't drink, a friend can drink on your behalf.</span>
            </li>
            <li>
              <span class="badge" aria-hidden="true"></span>
              <span>Runs 9:00-11:00. If one player is left and the tourney hasn't ended yet (11pm), they still haven't won yet. Anyone can still rebuy to play too.</span>
            </li>
            <li>
              <span class="badge" aria-hidden="true"></span>
              <span>At 11:00, no new buy ins. Blinds continue to increase until 11:30.</span>
            </li>
          </ul>
        </div>
        
        <div class="card">
          <h3>Pack Rarity Values</h3>
          <ul class="rarity-list" style="list-style: none; padding: 0; display: grid; gap: 0.5rem;">
            <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--edge); padding-bottom: 0.25rem;">
              <span>Sealed Pack</span> <strong>200 (2 Blacks)</strong>
            </li>
            <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--edge); padding-bottom: 0.25rem;">
              <span>No Hit Pack</span> <strong>100 (1 Black)</strong>
            </li>
            <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--edge); padding-bottom: 0.25rem;">
              <span>2 Black Star (Double Rare)</span> <strong>400 (4 Blacks)</strong>
            </li>
            <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--edge); padding-bottom: 0.25rem;">
              <span>Gold Star (IR)</span> <strong>600 (1 White, 1 Black)</strong>
            </li>
            <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--edge); padding-bottom: 0.25rem;">
              <span>SIR (Double Gold Star)</span> <strong>800 (1 White, 3 Blacks)</strong>
            </li>
            <li style="display: flex; justify-content: space-between;">
              <span>Hyper Rare (3 Gold Stars)</span> <strong>1100 (2 Whites, 1 Black)</strong>
            </li>
          </ul>
        </div>
      </div>
    `,
  },
  guide: {
    title: "Poker Guide",
    content: `
      <h2>Poker Guide</h2>
      
      <div class="guide-layout">
        <div class="guide-sidebar">
          <div class="toc-container">
            <h3>Table of Contents</h3>
            <ul>
              <li><a href="#hands">Poker Hands</a></li>
              <li><a href="#showdown">Showdown Rules</a></li>
              <li><a href="#chips">Chip Values</a></li>
              <li><a href="#betting">Betting & Blinds</a></li>
            </ul>
          </div>
        </div>

        <div class="guide-content">
          <div class="guide-section" id="hands">
            <h3>Poker Hands (Strongest to Weakest)</h3>
        <div class="hands-visual-list">
          <div class="hand-item">
            <div class="hand-cards">${CARDS.s10} ${CARDS.sJ} ${CARDS.sQ} ${CARDS.sK} ${CARDS.sA}</div>
            <div class="hand-name">Royal Flush</div>
          </div>
          <div class="hand-item">
            <div class="hand-cards">${CARDS.h9} ${CARDS.h10} ${CARDS.hJ} ${CARDS.hQ} ${CARDS.hK}</div>
            <div class="hand-name">Straight Flush</div>
          </div>
          <div class="hand-item">
            <div class="hand-cards">${CARDS.sA} ${CARDS.hA} ${CARDS.dA} ${CARDS.cA} ${CARDS.h2}</div>
            <div class="hand-name">Four of a Kind</div>
          </div>
          <div class="hand-item">
            <div class="hand-cards">${CARDS.sA} ${CARDS.hA} ${CARDS.dA} ${CARDS.sK} ${CARDS.hK}</div>
            <div class="hand-name">Full House</div>
          </div>
          <div class="hand-item">
            <div class="hand-cards">${CARDS.h2} ${CARDS.h5} ${CARDS.h7} ${CARDS.h9} ${CARDS.hJ}</div>
            <div class="hand-name">Flush</div>
          </div>
          <div class="hand-item">
            <div class="hand-cards">${CARDS.s5} ${CARDS.h6} ${CARDS.d7} ${CARDS.c8} ${CARDS.s9}</div>
            <div class="hand-name">Straight</div>
          </div>
          <div class="hand-item">
            <div class="hand-cards">${CARDS.sA} ${CARDS.hA} ${CARDS.dA} ${CARDS.s2} ${CARDS.h3}</div>
            <div class="hand-name">Three of a Kind</div>
          </div>
          <div class="hand-item">
            <div class="hand-cards">${CARDS.sA} ${CARDS.hA} ${CARDS.sK} ${CARDS.hK} ${CARDS.s2}</div>
            <div class="hand-name">Two Pair</div>
          </div>
          <div class="hand-item">
            <div class="hand-cards">${CARDS.sA} ${CARDS.hA} ${CARDS.s2} ${CARDS.h3} ${CARDS.d4}</div>
            <div class="hand-name">One Pair</div>
          </div>
          <div class="hand-item">
            <div class="hand-cards">${CARDS.sA} ${CARDS.h2} ${CARDS.d4} ${CARDS.c6} ${CARDS.s8}</div>
            <div class="hand-name">High Card</div>
          </div>
        </div>
      </div>

      <div class="guide-section" id="showdown">
        <h3>Showdown Rules</h3>
        <p><strong>Suits have NO ranking:</strong> Spades  is equal to Hearts . If two players have the exact same hand rank (e.g. both have a Royal Flush), they split the pot.</p>
        
        <h4>The Kicker Rule</h4>
        <p>If players have the same hand type (e.g. both have One Pair), the winner is determined by the <strong>Kicker</strong> (the highest non-paired card).</p>
        
        <div class="example-box">
          <p><strong>Player A:</strong> Pair of Kings, Ace Kicker</p>
          <div class="hand-cards">${CARDS.sK} ${CARDS.hK} ${CARDS.sA} ${CARDS.h5} ${CARDS.d2}</div>
          <p><strong>Player B:</strong> Pair of Kings, Queen Kicker</p>
          <div class="hand-cards">${CARDS.sK} ${CARDS.hK} ${CARDS.sQ} ${CARDS.h5} ${CARDS.d2}</div>
          <p><em>Player A wins because Ace > Queen.</em></p>
        </div>

        <div class="example-box">
          <p><strong>Split Pot Example:</strong></p>
          <p>If both players have: Pair of Kings with A, J, 9 kickers.</p>
          <div class="hand-cards">${CARDS.sK} ${CARDS.hK} ${CARDS.sA} ${CARDS.hJ} ${CARDS.d9}</div>
          <p><em>It's a tie! The pot is split equally.</em></p>
        </div>
      </div>

      <div class="guide-section" id="chips">
        <h3>Chip Values</h3>
        <div class="chip-grid">
          <div class="chip-item"><span class="chip red"></span> Red: 10</div>
          <div class="chip-item"><span class="chip green"></span> Green: 20</div>
          <div class="chip-item"><span class="chip blue"></span> Blue: 50</div>
          <div class="chip-item"><span class="chip black"></span> Black: 100</div>
          <div class="chip-item"><span class="chip white"></span> White: 500</div>
        </div>
      </div>

      <div class="guide-section" id="betting">
        <h3>Betting & Blinds</h3>
        <p><strong>The Blinds:</strong> Forced bets to ensure there is action in every pot.</p>
        <ul class="list" style="margin-bottom: 1rem;">
          <li><strong>Small Blind (SB):</strong> 10 chips. Posted by the player to the immediate left of the Dealer button.</li>
          <li><strong>Big Blind (BB):</strong> 20 chips. Posted by the player to the left of the Small Blind.</li>
        </ul>
        <p><em>The positions rotate clockwise after every hand.</em></p>

        <h4 style="margin-top: 1.5rem;">Your Actions</h4>
        <ul class="list">
          <li><strong>Check:</strong> Pass action to the next player (if no one has bet).</li>
          <li><strong>Bet:</strong> Put chips in the pot. Others must match to stay in.</li>
          <li><strong>Call:</strong> Match the current bet amount.</li>
          <li><strong>Raise:</strong> Increase the bet amount.</li>
          <li><strong>Fold:</strong> Give up your cards and any chips you've put in.</li>
        </ul>
        
        <p style="margin-top: 1.5rem; border-top: 1px solid var(--edge); padding-top: 1rem;"><strong>Buy-in:</strong> 200 (2 Blacks) for a sealed pack</p>
      </div>

        </div> <!-- End guide-content -->
      </div> <!-- End guide-layout -->
    `,
  },
  "trial-play": {
    title: "Trial Play",
    content: `
      <h2>Trial Play</h2>
      <p>Practice against 3 bots! You start with 200 chips. Blinds 10/20.</p>
      
      <div id="poker-table">
        <div class="pot-display">Pot: <span id="pot-amount">0</span></div>
        <div id="chip-pile"></div>
        <div class="community-area" id="community-cards"></div>
        <div class="game-log" id="game-log">Waiting to start...</div>
        
        <!-- Seats -->
        <div class="seat" data-player="0" id="seat-0">
          <div class="avatar"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg" alt="You"></div>
          <div class="player-info">You: <span class="stack">200</span></div>
          <div class="hand-container" id="hand-0"></div>
          <div class="dealer-button" style="display:none;">D</div>
        </div>
        
        <div class="seat" data-player="1" id="seat-1">
          <div class="avatar"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg" alt="Bot 1"></div>
          <div class="player-info">Bot 1: <span class="stack">200</span></div>
          <div class="hand-container" id="hand-1"></div>
          <div class="dealer-button" style="display:none;">D</div>
        </div>
        
        <div class="seat" data-player="2" id="seat-2">
          <div class="avatar"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/4.svg" alt="Bot 2"></div>
          <div class="player-info">Bot 2: <span class="stack">200</span></div>
          <div class="hand-container" id="hand-2"></div>
          <div class="dealer-button" style="display:none;">D</div>
        </div>
        
        <div class="seat" data-player="3" id="seat-3">
          <div class="avatar"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/7.svg" alt="Bot 3"></div>
          <div class="player-info">Bot 3: <span class="stack">200</span></div>
          <div class="hand-container" id="hand-3"></div>
          <div class="dealer-button" style="display:none;">D</div>
        </div>
      </div>

      <div class="game-controls" id="game-controls">
        <div class="action-row">
          <button class="btn ghost" id="btn-fold">Fold</button>
          <button class="btn ghost" id="btn-check">Check</button>
          <button class="btn primary" id="btn-bet">Bet</button>
        </div>
        <div class="slider-container">
          <input type="range" id="bet-slider" min="20" max="200" step="10" value="20">
          <span id="bet-val">20</span>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 1rem;">
        <button id="start-game-btn" class="btn primary">Start New Game</button>
      </div>
    `,
  },
};

const tabLinks = document.querySelectorAll(".tab-link");
const tabPanes = document.querySelectorAll(".tab-pane");

const dealRandomHand = () => {
  const suits = ['s', 'h', 'd', 'c'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  let hand = [];
  for (let i = 0; i < 5; i++) {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    hand.push(CARDS[suit + value]);
  }
  document.getElementById('trial-hand').innerHTML = hand.join(' ');
  document.getElementById('hand-result').textContent = "Good Luck!";
};

const switchTab = (tab) => {
  tabLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.tab === tab);
  });

  tabPanes.forEach((pane) => {
    pane.classList.toggle("active", pane.id === tab);
  });

  const tabContent = tabData[tab].content;
  document.getElementById(tab).innerHTML = tabContent;

  if (tab === 'trial-play') {
    if (typeof initPokerGame === 'function') {
      initPokerGame();
    }
  }
};

tabLinks.forEach((link) => {
  link.addEventListener("click", () => {
    switchTab(link.dataset.tab);
  });
});

// Initial load
switchTab("overview");

// Back to Top Logic
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* --- Poker Game Logic --- */

let game = null;

function initPokerGame() {
  const startBtn = document.getElementById('start-game-btn');
  
  // If game exists and is running, restore UI
  if (game && game.players[0].stack > 0) {
    if (startBtn) startBtn.style.display = 'none';
    game.restoreUI();
  } else if (startBtn) {
    startBtn.addEventListener('click', () => {
      game = new PokerGame();
      game.startRound();
      startBtn.style.display = 'none';
    });
  }

  // Controls
  const btnFold = document.getElementById('btn-fold');
  const btnCheck = document.getElementById('btn-check');
  const btnBet = document.getElementById('btn-bet');
  
  if (btnFold) btnFold.addEventListener('click', () => game.humanAction('fold'));
  if (btnCheck) btnCheck.addEventListener('click', () => game.humanAction('check'));
  if (btnBet) btnBet.addEventListener('click', () => {
    const amount = parseInt(document.getElementById('bet-slider').value);
    game.humanAction('bet', amount);
  });
  
  const slider = document.getElementById('bet-slider');
  const valDisplay = document.getElementById('bet-val');
  if (slider) {
    slider.addEventListener('input', (e) => {
      valDisplay.textContent = e.target.value;
      const btnBet = document.getElementById('btn-bet');
      if (game && btnBet) {
         const toCall = game.currentBet - game.players[0].bet;
         if (toCall > 0) {
             btnBet.textContent = "Raise " + e.target.value;
         } else {
             btnBet.textContent = "Bet " + e.target.value;
         }
      }
    });
  }
}

class PokerGame {
  constructor() {
    this.players = [
      { id: 0, name: 'You', stack: 200, hand: [], active: true, bet: 0, folded: false },
      { id: 1, name: 'Bot 1', stack: 200, hand: [], active: true, bet: 0, folded: false },
      { id: 2, name: 'Bot 2', stack: 200, hand: [], active: true, bet: 0, folded: false },
      { id: 3, name: 'Bot 3', stack: 200, hand: [], active: true, bet: 0, folded: false }
    ];
    this.dealerIdx = 0;
    this.sb = 10;
    this.bb = 20;
    this.deck = [];
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.turnIdx = 0;
    this.phase = 'preflop'; // preflop, flop, turn, river, showdown
  }

  restoreUI() {
    this.render();
    if (this.turnIdx === 0 && this.phase !== 'showdown') {
      this.enableControls();
    } else {
      this.disableControls();
    }
    // If round ended, show next hand button
    if (this.phase === 'showdown') {
       const startBtn = document.getElementById('start-game-btn');
       if (startBtn) {
         startBtn.style.display = 'inline-block';
         startBtn.textContent = "Next Hand";
         // Re-attach listener for next hand since button was recreated
         startBtn.onclick = () => {
            this.startRound();
            startBtn.style.display = 'none';
         };
       }
    }
  }

  createDeck() {
    const suits = ['s', 'h', 'd', 'c'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    this.deck = [];
    for (let s of suits) {
      for (let v of values) {
        this.deck.push({ suit: s, value: v, id: s + v });
      }
    }
    // Shuffle
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  startRound() {
    // Check for bankruptcy
    if (this.players[0].stack <= 0) {
      this.log("Game Over! You ran out of chips.");
      const startBtn = document.getElementById('start-game-btn');
      if (startBtn) {
        startBtn.style.display = 'inline-block';
        startBtn.textContent = "Restart Game";
        startBtn.onclick = () => {
           game = new PokerGame();
           game.startRound();
           startBtn.style.display = 'none';
        };
      }
      return;
    }

    // Check for win
    const activeBots = this.players.slice(1).filter(p => p.stack > 0);
    if (activeBots.length === 0) {
      this.log("You Win! All bots are bankrupt.");
      return;
    }

    this.createDeck();
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = this.bb;
    this.phase = 'preflop';
    
    // Clear chip pile
    const pile = document.getElementById('chip-pile');
    if (pile) pile.innerHTML = '';

    this.players.forEach(p => {
      p.hand = [this.deck.pop(), this.deck.pop()];
      p.active = p.stack > 0;
      p.folded = !p.active;
      p.bet = 0;
      p.actedThisRound = false;
    });

    // Blinds
    const sbIdx = (this.dealerIdx + 1) % 4;
    const bbIdx = (this.dealerIdx + 2) % 4;
    
    this.placeBet(sbIdx, this.sb);
    this.placeBet(bbIdx, this.bb);
    
    this.turnIdx = (this.dealerIdx + 3) % 4; // UTG
    
    this.log("New Round Started. Blinds 10/20.");
    this.render();
    this.nextTurn();
  }

  placeBet(playerIdx, amount) {
    const p = this.players[playerIdx];
    const actualBet = Math.min(p.stack, amount);
    
    if (actualBet > 0) {
      this.animateBet(playerIdx, actualBet);
    }

    p.stack -= actualBet;
    p.bet += actualBet;
    this.pot += actualBet;
    if (p.bet > this.currentBet) this.currentBet = p.bet;
  }

  animateBet(playerIdx, amount) {
    const seat = document.getElementById(`seat-${playerIdx}`);
    if (!seat) return;
    
    const chip = document.createElement('div');
    chip.className = 'flying-chip';
    document.body.appendChild(chip);
    
    const startRect = seat.getBoundingClientRect();
    const potRect = document.getElementById('poker-table').getBoundingClientRect(); // Center of table roughly
    
    // Center of seat
    const startX = startRect.left + startRect.width / 2 - 12;
    const startY = startRect.top + startRect.height / 2 - 12;
    
    // Center of table with random jitter for pile effect
    const jitterX = (Math.random() - 0.5) * 60;
    const jitterY = (Math.random() - 0.5) * 60;
    const endX = potRect.left + potRect.width / 2 - 12 + jitterX;
    const endY = potRect.top + potRect.height / 2 - 12 + jitterY;
    
    chip.style.left = `${startX}px`;
    chip.style.top = `${startY}px`;
    
    // Trigger reflow
    chip.offsetHeight;
    
    chip.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;
    
    setTimeout(() => {
      chip.remove();
      
      // Add static chip to pile
      const pile = document.getElementById('chip-pile');
      if (pile) {
        const staticChip = document.createElement('div');
        staticChip.className = 'static-chip';
        // Position relative to pile center (50, 50)
        staticChip.style.left = `${50 + jitterX}px`;
        staticChip.style.top = `${50 + jitterY}px`;
        pile.appendChild(staticChip);
      }

      const potDisplay = document.querySelector('.pot-display');
      if (potDisplay) {
        potDisplay.classList.remove('animate');
        void potDisplay.offsetWidth; // trigger reflow
        potDisplay.classList.add('animate');
      }
    }, 600);
  }

  nextTurn() {
    // Check if round betting is done
    if (this.isBettingRoundComplete()) {
      this.nextPhase();
      return;
    }

    // Skip folded players
    let loopCount = 0;
    while (this.players[this.turnIdx].folded || this.players[this.turnIdx].stack === 0) {
      this.turnIdx = (this.turnIdx + 1) % 4;
      loopCount++;
      if (loopCount > 4) { this.nextPhase(); return; } // Should not happen
    }

    this.render();

    if (this.turnIdx === 0) {
      // Human turn
      this.enableControls();
    } else {
      // Bot turn
      this.disableControls();
      setTimeout(() => this.botAction(), 1000);
    }
  }

  isBettingRoundComplete() {
    // Everyone active must have matched the current bet or be all-in
    // And everyone must have had a chance to act (simple check: if everyone checked/called)
    // Simplified: If all active players have bet == currentBet (or are all-in)
    const activePlayers = this.players.filter(p => !p.folded && p.stack > 0);
    if (activePlayers.length === 0) return true;
    
    // If only one player left, end round
    const notFolded = this.players.filter(p => !p.folded);
    if (notFolded.length === 1) return true;

    return activePlayers.every(p => p.bet === this.currentBet) && this.players.every(p => p.actedThisRound || p.folded || p.stack === 0);
  }

  botAction() {
    const p = this.players[this.turnIdx];
    const toCall = this.currentBet - p.bet;
    const roll = Math.random();

    // Simple Logic: 80% Call/Check, 10% Fold, 10% Raise
    let action = 'call';
    if (toCall > 0) {
      if (roll < 0.1) action = 'fold';
      else if (roll > 0.9) action = 'raise';
    } else {
      if (roll > 0.9) action = 'raise';
      else action = 'check';
    }

    if (action === 'fold') {
      p.folded = true;
      this.log(`${p.name} folds.`);
    } else if (action === 'raise') {
      const raiseAmt = toCall + 20; // Min raise
      this.placeBet(this.turnIdx, raiseAmt);
      this.log(`${p.name} raises to ${p.bet}.`);
      // Reset acted flags for others
      this.players.forEach(pl => pl.actedThisRound = false);
    } else {
      // Call/Check
      this.placeBet(this.turnIdx, toCall);
      this.log(`${p.name} ${toCall > 0 ? 'calls' : 'checks'}.`);
    }
    
    p.actedThisRound = true;
    this.turnIdx = (this.turnIdx + 1) % 4;
    this.nextTurn();
  }

  humanAction(action, amount) {
    const p = this.players[0];
    const toCall = this.currentBet - p.bet;

    if (action === 'fold') {
      p.folded = true;
      this.log("You fold.");
    } else if (action === 'check') {
      if (toCall > 0) {
        // Treat as call if they click check but need to call
        this.placeBet(0, toCall);
        this.log("You call.");
      } else {
        this.log("You check.");
      }
    } else if (action === 'bet') {
      // Logic for bet/raise
      let betAmt = amount;
      if (betAmt < toCall) betAmt = toCall; // Minimum call
      if (betAmt > p.stack) betAmt = p.stack;
      
      this.placeBet(0, betAmt);
      if (betAmt > toCall) {
        this.log(`You raise to ${p.bet}.`);
        this.players.forEach(pl => pl.actedThisRound = false);
      } else {
        this.log("You call.");
      }
    }

    p.actedThisRound = true;
    this.disableControls();
    this.turnIdx = (this.turnIdx + 1) % 4;
    this.nextTurn();
  }

  nextPhase() {
    // Reset bets for next street
    this.players.forEach(p => { p.bet = 0; p.actedThisRound = false; });
    this.currentBet = 0;
    this.turnIdx = (this.dealerIdx + 1) % 4; // SB starts post-flop

    const activeCount = this.players.filter(p => !p.folded).length;
    if (activeCount === 1) {
      this.endRound();
      return;
    }

    if (this.phase === 'preflop') {
      this.phase = 'flop';
      this.communityCards.push(this.deck.pop(), this.deck.pop(), this.deck.pop());
      this.log("Flop dealt.");
    } else if (this.phase === 'flop') {
      this.phase = 'turn';
      this.communityCards.push(this.deck.pop());
      this.log("Turn dealt.");
    } else if (this.phase === 'turn') {
      this.phase = 'river';
      this.communityCards.push(this.deck.pop());
      this.log("River dealt.");
    } else if (this.phase === 'river') {
      this.phase = 'showdown';
      this.endRound();
      return;
    }
    
    this.render();
    this.nextTurn();
  }

  endRound() {
    this.phase = 'showdown';
    this.render();
    
    // Determine winner (Simplified: Random for now as full evaluator is huge)
    // In a real app, we'd use a library or a 7-card evaluator.
    // For this demo, we'll just pick a random active player to win the pot.
    const active = this.players.filter(p => !p.folded);
    const winner = active[Math.floor(Math.random() * active.length)];
    
    winner.stack += this.pot;
    this.log(`${winner.name} wins the pot of ${this.pot}!`);
    
    setTimeout(() => {
      this.dealerIdx = (this.dealerIdx + 1) % 4;
      document.getElementById('start-game-btn').style.display = 'inline-block';
      document.getElementById('start-game-btn').textContent = "Next Hand";
    }, 3000);
  }

  render() {
    document.getElementById('pot-amount').textContent = this.pot;
    
    // Community Cards
    const commContainer = document.getElementById('community-cards');
    commContainer.innerHTML = this.communityCards.map(c => this.renderCard(c)).join('');

    // Players
    this.players.forEach(p => {
      const seat = document.getElementById(`seat-${p.id}`);
      const handContainer = document.getElementById(`hand-${p.id}`);
      const stackSpan = seat.querySelector('.stack');
      const dealerBtn = seat.querySelector('.dealer-button');
      
      stackSpan.textContent = p.stack;
      dealerBtn.style.display = this.dealerIdx === p.id ? 'flex' : 'none';
      
      if (p.id === this.turnIdx && this.phase !== 'showdown') seat.classList.add('active');
      else seat.classList.remove('active');

      if (p.folded) seat.style.opacity = '0.5';
      else seat.style.opacity = '1';

      // Render Hand
      if (p.id === 0 || this.phase === 'showdown') {
        // Show cards
        handContainer.innerHTML = p.hand.map(c => this.renderCard(c)).join('');
      } else {
        // Show backs
        handContainer.innerHTML = `<div class="poker-card back"></div><div class="poker-card back"></div>`;
      }
    });
    
    // Update Slider
    const slider = document.getElementById('bet-slider');
    const toCall = this.currentBet - this.players[0].bet;
    const minBet = toCall > 0 ? toCall : 20;
    slider.min = minBet;
    slider.max = this.players[0].stack;
    slider.value = minBet;
    document.getElementById('bet-val').textContent = minBet;
    
    // Update Buttons
    const btnCheck = document.getElementById('btn-check');
    const btnBet = document.getElementById('btn-bet');
    if (toCall > 0) {
      btnCheck.textContent = "Call " + toCall;
      btnBet.textContent = "Raise " + slider.value;
    } else {
      btnCheck.textContent = "Check";
      btnBet.textContent = "Bet " + slider.value;
    }
  }

  renderCard(card) {
    // Use CARDS object if possible, or construct HTML
    // CARDS keys are sA, h10, etc.
    const key = card.suit + card.value;
    const entity = CARDS[key] || '?';
    const color = (card.suit === 'h' || card.suit === 'd') ? 'red' : 'black';
    return `<div class="poker-card" style="color: ${color}">${entity}</div>`;
  }

  log(msg) {
    document.getElementById('game-log').textContent = msg;
  }

  enableControls() {
    document.getElementById('game-controls').classList.add('active');
  }

  disableControls() {
    document.getElementById('game-controls').classList.remove('active');
  }
}

