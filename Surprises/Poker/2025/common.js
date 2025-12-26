(() => {
  const decor = document.querySelector("[data-decor]");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!decor || prefersReduced) return;

  const mode = decor.dataset.decor || "chips";
  const total = mode === "both" ? 25 : 14;
  
  const pokemonDecor = ["pokeball", "greatball", "ultraball", "masterball", "gastly"];
  const types = mode === "both" ? ["chip", ...pokemonDecor] : [mode.slice(0, -1)];

  const create = (type) => {
    const span = document.createElement("span");
    
    if (type === 'gastly') {
        span.className = "silhouette gastly";
    } else {
        span.className = type;
    }

    const size = 10 + Math.random() * 12;
    span.style.setProperty("--size", `${size}px`);
    span.style.left = `${Math.random() * 100}%`;
    span.style.top = `${Math.random() * 100}%`;
    span.style.animationDelay = `${Math.random() * 4}s`;
    span.style.animationDuration = `${14 + Math.random() * 8}s`;
    span.style.opacity = `${0.25 + Math.random() * 0.2}`;
    decor.appendChild(span);
  };

  for (let i = 0; i < total; i += 1) {
    const type = types[Math.floor(Math.random() * types.length)];
    create(type);
  }
})();
