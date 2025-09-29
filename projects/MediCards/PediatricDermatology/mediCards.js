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
  const stopBtn = document.getElementById('stopAudio');
  const readStatus = document.getElementById('readStatus');

  const speechSupported = 'speechSynthesis' in window;
  const audioPlayer = new Audio();
  const ttsEndpoint = 'https://api.streamelements.com/kappa/v2/speech';
  let currentAudioUrl = null;
  let activeUtterance = null;

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
      <div class="card-content">${card.answer}${buildAnswerSupplement(card)}</div>
    `;

    explanationText.innerHTML = card.explanation;
    renderSources(card.sources || []);
    cardCountEl.textContent = `Card ${currentIndex + 1} of ${deck.cards.length}`;
    selector.value = String(currentIndex);
  }

  function buildAnswerSupplement(card) {
    const extras = [];

    if (card.answerSummary) {
      extras.push(
        `<div class="answer-summary"><strong>Why it matters:</strong> ${card.answerSummary}</div>`
      );
    }

    const imageLink = buildImageSearchLink(card);
    if (imageLink) {
      extras.push(imageLink);
    }

    return extras.join('');
  }

  function buildImageSearchLink(card) {
    if (card.imageSearchUrl) {
      const label = card.imageSearchLabel || 'View Google image search results';
      return `<p class="image-search"><a href="${card.imageSearchUrl}" target="_blank" rel="noopener noreferrer">${label}</a></p>`;
    }

    if (!card.imageSearchQuery) {
      return '';
    }

    const encoded = encodeURIComponent(card.imageSearchQuery);
    const label = card.imageSearchLabel || `See Google Images for ${card.imageSearchQuery}`;
    return `<p class="image-search"><a href="https://www.google.com/search?tbm=isch&q=${encoded}" target="_blank" rel="noopener noreferrer">${label}</a></p>`;
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
    stopNarration(undefined, { suppressStatus: true });
    cardWrapper.classList.remove('transitioning');
    void cardWrapper.offsetWidth; // trigger reflow for animation restart
    cardWrapper.classList.add('transitioning');
    cardElement.classList.remove('is-flipped');
    explanationPanel.hidden = true;
    explanationBtn.textContent = 'Explanation';
    applyCardContent(deck.cards[currentIndex]);
    setReadStatus('Card ready. Tap “Read Aloud” to hear the question.');
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
    stopNarration(undefined, { suppressStatus: true });
    cardElement.classList.toggle('is-flipped');
    const isAnswerShowing = cardElement.classList.contains('is-flipped');
    const message = isAnswerShowing
      ? 'Answer showing. Tap “Read Aloud” to hear it.'
      : 'Question showing. Tap “Read Aloud” to hear it.';
    setReadStatus(message);
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

  function resetNarrationControl(message) {
    readBtn.disabled = false;
    readBtn.dataset.state = 'ready';
    readBtn.textContent = 'Read Aloud';
    stopBtn.disabled = true;
    if (message) {
      setReadStatus(message);
    }
  }

  function stopNarration(statusMessage, options = {}) {
    const { suppressStatus = false } = options;
    narrationRequestToken += 1;
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
      currentAudioUrl = null;
    }
    if (activeUtterance) {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    }
    if (suppressStatus) {
      resetNarrationControl();
    } else {
      resetNarrationControl(statusMessage || 'Narration stopped.');
    }
  }

  function setReadStatus(message) {
    if (!readStatus) return;
    readStatus.textContent = message;
  }

  audioPlayer.addEventListener('ended', () => {
    stopNarration('Playback complete.');
  });

  audioPlayer.addEventListener('error', () => {
    stopNarration('Unable to play the generated audio.');
  });

  let narrationRequestToken = 0;

  async function speakCard() {
    if (readBtn.dataset.state === 'playing' || readBtn.dataset.state === 'loading') {
      return;
    }

    stopNarration(undefined, { suppressStatus: true });

    const card = deck.cards[currentIndex];
    const isAnswerShowing = cardElement.classList.contains('is-flipped');
    const narrationToken = ++narrationRequestToken;

    const questionText = stripHtml(card.question);
    const answerText = stripHtml(card.answer);
    const answerSummary = card.answerSummary ? stripHtml(card.answerSummary) : '';
    const narrationSegments = [card.title];

    if (isAnswerShowing) {
      if (answerText) {
        narrationSegments.push(answerText);
      }
      if (answerSummary) {
        narrationSegments.push(answerSummary);
      }
    } else {
      if (questionText) {
        narrationSegments.push(questionText);
      }
    }

    const narrationText = narrationSegments.join('. ').replace(/\s+/g, ' ').trim();

    if (!narrationText) {
      setReadStatus('Nothing to narrate for this card.');
      return;
    }

    if (activeUtterance) {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    }
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
      currentAudioUrl = null;
    }

    readBtn.disabled = true;
    readBtn.dataset.state = 'loading';
    readBtn.textContent = 'Generating audio...';
    stopBtn.disabled = false;
    setReadStatus(
      `Requesting ${isAnswerShowing ? 'answer' : 'question'} narration from the cloud service...`
    );

    try {
      const response = await fetch(ttsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voice: 'Brian', text: narrationText })
      });

      if (!response.ok) {
        throw new Error(`TTS request failed with status ${response.status}`);
      }

      const audioBlob = await response.blob();

      if (narrationToken !== narrationRequestToken) {
        return;
      }

      currentAudioUrl = URL.createObjectURL(audioBlob);
      audioPlayer.src = currentAudioUrl;
      readBtn.dataset.state = 'playing';
      readBtn.textContent = isAnswerShowing ? 'Playing answer...' : 'Playing question...';
      setReadStatus(
        `Playing the ${isAnswerShowing ? 'answer' : 'question'}. Use Stop to end playback early.`
      );
      await audioPlayer.play();
    } catch (error) {
      console.error('Cloud TTS failed; falling back to browser speech if available.', error);
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
        currentAudioUrl = null;
      }

      if (speechSupported) {
        if (narrationToken !== narrationRequestToken) {
          return;
        }

        setReadStatus('Online TTS unavailable. Using browser speech synthesis.');
        activeUtterance = new SpeechSynthesisUtterance(narrationText);
        activeUtterance.lang = 'en-US';
        activeUtterance.rate = 1;
        activeUtterance.onend = () => {
          activeUtterance = null;
          resetNarrationControl('Playback complete.');
        };
        activeUtterance.onerror = () => {
          activeUtterance = null;
          resetNarrationControl('Unable to narrate this card.');
        };
        readBtn.dataset.state = 'playing';
        readBtn.textContent = isAnswerShowing ? 'Speaking answer...' : 'Speaking question...';
        stopBtn.disabled = false;
        window.speechSynthesis.speak(activeUtterance);
      } else {
        resetNarrationControl('Audio narration is unavailable right now.');
      }
    }
  }

  function stripHtml(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  populateSelector();
  goToCard(0);
  resetNarrationControl();

  selector.addEventListener('change', (event) => {
    goToCard(Number(event.target.value));
  });
  prevBtn.addEventListener('click', previousCard);
  nextBtn.addEventListener('click', nextCard);
  randomBtn.addEventListener('click', randomCard);
  flipBtn.addEventListener('click', flipCard);
  cardElement.addEventListener('click', flipCard);
  explanationBtn.addEventListener('click', toggleExplanation);
  readBtn.addEventListener('click', speakCard);
  stopBtn.addEventListener('click', () => stopNarration());

  if (!speechSupported) {
    setReadStatus('Browser speech unavailable. Using online narrator when possible.');
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
