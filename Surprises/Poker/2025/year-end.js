const snapshotData = [
  {
    title: "Free buy-in night",
    body: "Sit for zero dollars. Your first Pokemon pack is on the house so everyone starts even.",
    accent: "var(--green)"
  },
  {
    title: "Prize spotlight",
    body: "Winner takes 4 Prismatic Evolution packs plus year-end glory.",
    accent: "var(--red)"
  },
  {
    title: "Structure",
    body: "1 buy-in = 10 big blinds. Unlimited re-entries using the pack system.",
    accent: "var(--gold)"
  }
];

const timelineData = [
  {
    time: "9:00",
    title: "Shuffle up",
    detail: "Doors open, seats fill, and the first hands are dealt."
  },
  {
    time: "9:30",
    title: "Momentum",
    detail: "Blinds build steadily while stacks settle into their rhythm."
  },
  {
    time: "10:30",
    title: "Deep stack stretch",
    detail: "Focused play, longer streets, and cleaner decisions."
  },
  {
    time: "11:00",
    title: "Final stretch",
    detail: "If more than one player remains, big blinds increase and no new buy-ins from 11:00 until 11:30."
  },
  {
    time: "11:30",
    title: "Last hands",
    detail: "Play continues until one winner remains."
  }
];

const createSnapshotCard = (item) => `
  <article class="card">
    <div class="stat">
      <div class="icon" style="background: linear-gradient(140deg, ${item.accent}, rgba(255,255,255,0.08))"></div>
      <div>
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </div>
    </div>
    <div class="badge" style="background: ${item.accent}; box-shadow: 0 0 0 5px ${item.accent}30"></div>
  </article>
`;

const createTimelineItem = (stop) => `
  <div class="timeline-item">
    <strong>${stop.time}</strong>
    <div>
      <div class="title">${stop.title}</div>
      <p>${stop.detail}</p>
    </div>
  </div>
`;

const snapshotGrid = document.getElementById("snapshot-grid");
const timelineList = document.getElementById("timeline");

if (snapshotGrid) {
  snapshotGrid.innerHTML = snapshotData.map(createSnapshotCard).join("");
}

if (timelineList) {
  timelineList.innerHTML = timelineData.map(createTimelineItem).join("");
}

