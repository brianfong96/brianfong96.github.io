(function () {
  const deck = window.mediCardsDeck;
  if (!deck || !Array.isArray(deck.cards) || deck.cards.length === 0) {
    console.error('No cards found for this deck. Ensure the data file defines window.mediCardsDeck.');
    return;
  }

  let currentIndex = 0;
  const cardWrapper = document.querySelector('.card-wrapper');
  const cardElement = document.getElementById('flashCard');
  const questionEl = document.getElementById('cardQuestion');
  const answerEl = document.getElementById('cardAnswer');
  const cardCountEl = document.getElementById('cardCount');
  const explanationPanel = document.getElementById('explanationPanel');
  const explanationText = document.getElementById('explanationText');
  const sourcesContainer = document.getElementById('sources');

  const selector = document.getElementById('cardSelector');
  const prevBtn = document.getElementById('prevCard');
  const nextBtn = document.getElementById('nextCard');
  const randomBtn = document.getElementById('randomCard');
  const flipBtn = document.getElementById('flipCard');
  const explanationBtn = document.getElementById('toggleExplanation');
  const readBtn = document.getElementById('readAloud');

  const speechSupported = 'speechSynthesis' in window;

  function populateSelector() {
    selector.innerHTML = '';
    deck.cards.forEach((card, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${index + 1}. ${card.shortLabel || card.title}`;
      selector.appendChild(option);
    });
  }

  function applyCardContent(card) {
    questionEl.innerHTML = `
      <h2>${card.title}</h2>
      <div class="card-content">${card.question}</div>
    `;

    answerEl.innerHTML = `
      <h2>Answer</h2>
      <div class="card-content">${card.answer}</div>
    `;

    explanationText.innerHTML = card.explanation;
    renderSources(card.sources || []);
    cardCountEl.textContent = `Card ${currentIndex + 1} of ${deck.cards.length}`;
    selector.value = String(currentIndex);
  }

  function renderSources(sources) {
    if (!sources.length) {
      sourcesContainer.innerHTML = '';
      sourcesContainer.hidden = true;
      return;
    }

    const listItems = sources
      .map(
        (source) =>
          `<li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label}</a></li>`
      )
      .join('');

    sourcesContainer.innerHTML = `
      <h3>Sources</h3>
      <ul>${listItems}</ul>
    `;
    sourcesContainer.hidden = false;
  }

  function goToCard(index) {
    const normalizedIndex = (index + deck.cards.length) % deck.cards.length;
    currentIndex = normalizedIndex;
    cardWrapper.classList.remove('transitioning');
    void cardWrapper.offsetWidth; // trigger reflow for animation restart
    cardWrapper.classList.add('transitioning');
    cardElement.classList.remove('is-flipped');
    explanationPanel.hidden = true;
    explanationBtn.textContent = 'Explanation';
    applyCardContent(deck.cards[currentIndex]);
  }

  function nextCard() {
    goToCard(currentIndex + 1);
  }

  function previousCard() {
    goToCard(currentIndex - 1);
  }

  function randomCard() {
    if (deck.cards.length <= 1) {
      return;
    }
    let newIndex = currentIndex;
    while (newIndex === currentIndex) {
      newIndex = Math.floor(Math.random() * deck.cards.length);
    }
    goToCard(newIndex);
  }

  function flipCard() {
    cardElement.classList.toggle('is-flipped');
  }

  function toggleExplanation() {
    const isHidden = explanationPanel.hidden;
    explanationPanel.hidden = !isHidden;
    if (!isHidden) {
      explanationBtn.textContent = 'Explanation';
    } else {
      explanationBtn.textContent = 'Hide Explanation';
    }
  }

  function speakCard() {
    if (!speechSupported) {
      readBtn.disabled = true;
      readBtn.textContent = 'Speech not supported';
      return;
    }

    window.speechSynthesis.cancel();
    const card = deck.cards[currentIndex];
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `${card.title}. Question: ${stripHtml(card.question)}. Answer: ${stripHtml(
      card.answer
    )}`;
    utterance.lang = 'en-US';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }

  function stripHtml(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  populateSelector();
  goToCard(0);

  if (!speechSupported) {
    readBtn.disabled = true;
    readBtn.textContent = 'Speech not supported';
  }

  selector.addEventListener('change', (event) => {
    goToCard(Number(event.target.value));
  });
  prevBtn.addEventListener('click', previousCard);
  nextBtn.addEventListener('click', nextCard);
  randomBtn.addEventListener('click', randomCard);
  flipBtn.addEventListener('click', flipCard);
  cardElement.addEventListener('click', flipCard);
  explanationBtn.addEventListener('click', toggleExplanation);
  if (speechSupported) {
    readBtn.addEventListener('click', speakCard);
  }

  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        previousCard();
        break;
      case 'ArrowRight':
        nextCard();
        break;
      case ' ':
        event.preventDefault();
        flipCard();
        break;
      case 'r':
      case 'R':
        randomCard();
        break;
      default:
        break;
    }
  });
})();
