const rarityLadder = [
  { pull: "Triple gold star", buyins: 5 },
  { pull: "Double gold star", buyins: 4 },
  { pull: "Gold star", buyins: 3 },
  { pull: "Double black star rare", buyins: 2 },
  { pull: "No star hit", buyins: 0, note: "Trade another pack to get chips." }
];

const packTimeline = [
  {
    time: "9:00",
    title: "Kickoff",
    detail: "Shuffle up and begin with your opening stack."
  },
  {
    time: "9:30",
    title: "Steady pace",
    detail: "Blinds rise and the room settles into a clean rhythm."
  },
  {
    time: "11:00",
    title: "Blind jump & freeze",
    detail: "If multiple players are still in, big blinds increase and buy-ins stop until 11:30."
  },
  {
    time: "Last hand",
    title: "Must be in",
    detail: "If you're not playing the last hand before 11:00, you forfeit your shot even as chip leader."
  }
];

const createRarityRow = (item) => `
  <tr>
    <td>${item.pull}</td>
    <td>${item.buyins === 0 ? "0 (trade another pack)" : `${item.buyins} buy-ins`}</td>
    <td>${item.buyins * 10} big blinds</td>
  </tr>
`;

const createPackTimelineItem = (stop) => `
  <div class="timeline-item">
    <strong>${stop.time}</strong>
    <div>
      <div class="title">${stop.title}</div>
      <p>${stop.detail}</p>
    </div>
  </div>
`;

const rarityTable = document.getElementById("rarity-table");
const packTimelineList = document.getElementById("pack-timeline");
const resultEl = document.getElementById("sim-result");
const detailEl = document.getElementById("sim-detail");
const resultElBack = document.getElementById("sim-result-back");
const detailElBack = document.getElementById("sim-detail-back");
const openBtn = document.getElementById("open-pack");
const tradeBtn = document.getElementById("trade-pack");
const cardContainer = document.getElementById("sim-card-container");

if (rarityTable) {
  const body = rarityTable.querySelector("tbody");
  if (body) {
    body.innerHTML = rarityLadder.map(createRarityRow).join("");
  }
}

if (packTimelineList) {
  packTimelineList.innerHTML = packTimeline.map(createPackTimelineItem).join("");
}

const outcomes = [
  { label: "Triple gold star!", buyins: 5 },
  { label: "Double gold star!", buyins: 4 },
  { label: "Gold star!", buyins: 3 },
  { label: "Double black star rare!", buyins: 2 },
  { label: "No special star this time.", buyins: 0 }
];

const weights = [1, 2, 3, 4, 8];
const weightTotal = weights.reduce((sum, w) => sum + w, 0);

const pickOutcome = () => {
  const roll = Math.random() * weightTotal;
  let cursor = 0;
  for (let i = 0; i < outcomes.length; i += 1) {
    cursor += weights[i];
    if (roll <= cursor) return outcomes[i];
  }
  return outcomes[outcomes.length - 1];
};

const updateDisplay = (title, buyins, extra, isBack = false) => {
  const resEl = isBack ? resultElBack : resultEl;
  const detEl = isBack ? detailElBack : detailEl;

  if (resEl) {
    resEl.textContent = title;
  }
  if (detEl) {
    if (buyins === 0) {
      detEl.textContent = extra || "No buy-ins from that pack - trade another and dive back in.";
    } else {
      const blinds = buyins * 10;
      detEl.textContent = `${buyins} buy-in${buyins > 1 ? "s" : ""} = ${blinds} big blinds ready to stack. ${extra || ""}`.trim();
    }
  }
};

if (openBtn) {
  openBtn.addEventListener("click", () => {
    cardContainer.classList.add("flipped");
    const outcome = pickOutcome();
    const extra =
      outcome.buyins === 0
        ? "You need another pack for chips."
        : "Slide them into play immediately.";
    updateDisplay(`You opened: ${outcome.label}`, outcome.buyins, extra, true);
  });
}

if (tradeBtn) {
  tradeBtn.addEventListener("click", () => {
    cardContainer.classList.remove("flipped");
    updateDisplay("Traded sealed pack for 1 buy-in", 1, "Simple, steady, and always valid.");
  });
}
