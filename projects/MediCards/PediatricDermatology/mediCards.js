import { loadDeckData } from './pediatric-dermatology.js';

function setStatusMessage(message) {
  const statusEl = document.getElementById('readStatus');
  if (statusEl) {
    statusEl.textContent = message;
  }
}

function disableInterface(disabled) {
  const interactiveElements = document.querySelectorAll('.controls button, .controls select');
  interactiveElements.forEach((element) => {
    element.disabled = disabled;
  });
}

function showDeckLoadError(message) {
  disableInterface(true);
  setStatusMessage(message);

  const selector = document.getElementById('cardSelector');
  if (selector) {
    selector.innerHTML = '';
  }

  const cardQuestion = document.getElementById('cardQuestion');
  const cardAnswer = document.getElementById('cardAnswer');
  const cardCount = document.getElementById('cardCount');
  const explanationPanel = document.getElementById('explanationPanel');

  if (cardQuestion) {
    cardQuestion.innerHTML = `<div class="card-error">${message}</div>`;
  }

  if (cardAnswer) {
    cardAnswer.innerHTML = '';
  }

  if (cardCount) {
    cardCount.textContent = '';
  }

  if (explanationPanel) {
    explanationPanel.hidden = true;
  }
}

class CardPresenter {
  constructor({ questionEl, answerEl, explanationEl, sourcesEl }) {
    this.questionEl = questionEl;
    this.answerEl = answerEl;
    this.explanationEl = explanationEl;
    this.sourcesEl = sourcesEl;
  }

  render(card) {
    this.renderQuestion(card);
    this.renderAnswer(card);
    this.renderExplanation(card);
    this.renderSources(card.sources || []);
  }

  renderQuestion(card) {
    const heading = this.createHeading(card.title);
    const content = this.createContentContainer();

    const promptParagraph = this.createPromptParagraph(card.prompt);
    if (promptParagraph) {
      content.append(promptParagraph);
    }

    if (Array.isArray(card.questionNotes)) {
      card.questionNotes.forEach((note) => {
        content.append(this.createParagraph(note));
      });
    }

    this.questionEl.replaceChildren(heading, content);
  }

  renderAnswer(card) {
    const heading = this.createHeading('Answer');
    const content = this.createContentContainer();

    if (Array.isArray(card.answerPoints) && card.answerPoints.length > 0) {
      const list = document.createElement('ul');
      list.className = 'card-points';
      card.answerPoints.forEach((point) => {
        const item = document.createElement('li');
        if (point.label) {
          const strong = document.createElement('strong');
          strong.textContent = `${point.label}: `;
          item.append(strong);
        }
        item.append(document.createTextNode(point.text));
        list.append(item);
      });
      content.append(list);
    }

    if (card.answerSummary) {
      const summary = document.createElement('div');
      summary.className = 'answer-summary';
      const label = document.createElement('strong');
      label.textContent = 'Why it matters: ';
      summary.append(label, document.createTextNode(card.answerSummary));
      content.append(summary);
    }

    const imageLink = this.buildImageSearch(card.imageSearch);
    if (imageLink) {
      content.append(imageLink);
    }

    this.answerEl.replaceChildren(heading, content);
  }

  renderExplanation(card) {
    const explanation = Array.isArray(card.explanation) ? card.explanation : [];
    if (!explanation.length) {
      this.explanationEl.replaceChildren();
      return;
    }

    const fragments = explanation.map((paragraph) => this.createParagraph(paragraph));
    this.explanationEl.replaceChildren(...fragments);
  }

  renderSources(sources) {
    this.sourcesEl.replaceChildren();

    if (!sources.length) {
      this.sourcesEl.hidden = true;
      return;
    }

    const heading = document.createElement('h3');
    heading.textContent = 'Sources';
    const list = document.createElement('ul');

    sources.forEach((source) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = source.label;
      item.append(link);
      list.append(item);
    });

    this.sourcesEl.hidden = false;
    this.sourcesEl.append(heading, list);
  }

  createHeading(text) {
    const heading = document.createElement('h2');
    heading.textContent = text;
    return heading;
  }

  createContentContainer() {
    const container = document.createElement('div');
    container.className = 'card-content';
    return container;
  }

  createPromptParagraph(prompt) {
    if (!prompt || !prompt.text) {
      return null;
    }

    const paragraph = document.createElement('p');
    if (prompt.lead) {
      const lead = document.createElement('strong');
      lead.textContent = `${prompt.lead}: `;
      paragraph.append(lead);
    }
    paragraph.append(document.createTextNode(prompt.text));

    if (Array.isArray(prompt.details)) {
      prompt.details.forEach((detail) => {
        paragraph.append(document.createElement('br'));
        paragraph.append(document.createTextNode(detail));
      });
    }

    return paragraph;
  }

  createParagraph(text) {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  }

  buildImageSearch(imageSearch) {
    if (!imageSearch) {
      return null;
    }

    const link = document.createElement('a');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    if (imageSearch.url) {
      link.href = imageSearch.url;
    } else if (imageSearch.query) {
      const encoded = encodeURIComponent(imageSearch.query);
      link.href = `https://www.google.com/search?tbm=isch&q=${encoded}`;
    } else {
      return null;
    }

    link.textContent = imageSearch.label || 'View Google Image search results';

    const wrapper = document.createElement('p');
    wrapper.className = 'image-search';
    wrapper.append(link);
    return wrapper;
  }
}

class DeckController {
  constructor(deck) {
    this.deck = deck;
    this.sections = Array.isArray(deck.sections) ? deck.sections : [];
    this.filteredSections = [];
    this.cards = [];
    this.currentIndex = 0;

    this.cardWrapper = document.querySelector('.card-wrapper');
    this.cardElement = document.getElementById('flashCard');
    this.questionEl = document.getElementById('cardQuestion');
    this.answerEl = document.getElementById('cardAnswer');
    this.cardCountEl = document.getElementById('cardCount');
    this.sectionSelector = document.getElementById('sectionSelector');
    this.selector = document.getElementById('cardSelector');
    this.prevBtn = document.getElementById('prevCard');
    this.nextBtn = document.getElementById('nextCard');
    this.randomBtn = document.getElementById('randomCard');
    this.flipBtn = document.getElementById('flipCard');
    this.explanationBtn = document.getElementById('toggleExplanation');
    this.explanationPanel = document.getElementById('explanationPanel');
    this.explanationBody = document.getElementById('explanationText');
    this.sourcesEl = document.getElementById('sources');
    this.readBtn = document.getElementById('readAloud');
    this.stopBtn = document.getElementById('stopAudio');
    this.readStatus = document.getElementById('readStatus');

    this.cardPresenter = new CardPresenter({
      questionEl: this.questionEl,
      answerEl: this.answerEl,
      explanationEl: this.explanationBody,
      sourcesEl: this.sourcesEl
    });

    this.speechSupported = 'speechSynthesis' in window;
    this.audioPlayer = new Audio();
    this.ttsEndpoint = 'https://api.streamelements.com/kappa/v2/speech';
    this.currentAudioUrl = null;
    this.activeUtterance = null;
    this.narrationRequestToken = 0;
  }

  init() {
    this.populateSectionSelector();
    this.bindEvents();
    const initialSection = this.sectionSelector ? this.sectionSelector.value : 'all';
    this.applySectionFilter(initialSection);

    if (!this.speechSupported) {
      this.setReadStatus('Browser speech unavailable. Using online narrator when possible.');
    }
  }

  buildCardCatalog(sections) {
    this.cards = [];
    this.selector.innerHTML = '';

    let index = 0;

    sections.forEach((section) => {
      if (!Array.isArray(section.cards) || section.cards.length === 0) {
        return;
      }

      const optgroup = document.createElement('optgroup');
      optgroup.label = section.label || 'Cards';

      section.cards.forEach((card) => {
        this.cards.push(card);
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = `${index + 1}. ${card.shortLabel || card.title}`;
        optgroup.append(option);
        index += 1;
      });

      this.selector.append(optgroup);
    });

    return this.cards.length;
  }

  populateSectionSelector() {
    if (!this.sectionSelector) {
      return;
    }

    const fragment = document.createDocumentFragment();

    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All topics';
    fragment.append(allOption);

    const sortedSections = [...this.sections].sort((a, b) => {
      const aLabel = (a.label || a.id || '').toLocaleLowerCase();
      const bLabel = (b.label || b.id || '').toLocaleLowerCase();
      return aLabel.localeCompare(bLabel);
    });

    sortedSections.forEach((section) => {
      const option = document.createElement('option');
      option.value = section.id;
      option.textContent = section.label || section.id;
      fragment.append(option);
    });

    this.sectionSelector.replaceChildren(fragment);
    this.sectionSelector.value = 'all';
  }

  applySectionFilter(sectionId) {
    if (!this.selector) {
      return;
    }

    this.stopNarration(undefined, { suppressStatus: true });
    this.cardElement.classList.remove('is-flipped');
    this.filteredSections =
      !sectionId || sectionId === 'all'
        ? this.sections
        : this.sections.filter((section) => section.id === sectionId);

    const totalCards = this.buildCardCatalog(this.filteredSections);
    this.currentIndex = 0;

    if (totalCards > 0) {
      this.enableControls();
      this.selector.disabled = false;
      this.showCard(0);
    } else {
      this.cards = [];
      this.disableControls();
      this.selector.disabled = true;
      this.showEmptyState(
        sectionId === 'all'
          ? 'No cards available for this deck.'
          : 'No cards available in this topic yet.'
      );
      this.setReadStatus('Select a different topic to see cards.');
    }
  }

  enableControls() {
    this.prevBtn.disabled = false;
    this.nextBtn.disabled = false;
    this.randomBtn.disabled = false;
    this.flipBtn.disabled = false;
    this.explanationBtn.disabled = false;
    this.readBtn.disabled = false;
    this.stopBtn.disabled = true;
    if (this.selector) {
      this.selector.disabled = false;
    }
    this.updateNavAvailability();
  }

  updateNavAvailability() {
    const singleCard = this.cards.length <= 1;
    if (this.prevBtn) {
      this.prevBtn.disabled = singleCard;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = singleCard;
    }
    if (this.randomBtn) {
      this.randomBtn.disabled = this.cards.length <= 1;
    }
  }

  showEmptyState(message) {
    if (this.cardWrapper) {
      this.cardWrapper.classList.remove('transitioning');
    }

    const empty = document.createElement('div');
    empty.className = 'card-empty';
    empty.textContent = message;

    this.questionEl.replaceChildren(empty);
    this.answerEl.replaceChildren();
    this.cardCountEl.textContent = '';
    this.explanationPanel.hidden = true;
    this.explanationBtn.textContent = 'Explanation';
    this.sourcesEl.replaceChildren();
  }

  bindEvents() {
    if (this.sectionSelector) {
      this.sectionSelector.addEventListener('change', (event) => {
        this.applySectionFilter(event.target.value);
      });
    }

    if (this.selector) {
      this.selector.addEventListener('change', (event) => {
        const value = Number(event.target.value);
        if (!Number.isNaN(value)) {
          this.showCard(value);
        }
      });
    }

    this.prevBtn.addEventListener('click', () => this.showCard(this.currentIndex - 1));
    this.nextBtn.addEventListener('click', () => this.showCard(this.currentIndex + 1));
    this.randomBtn.addEventListener('click', () => this.randomCard());
    this.flipBtn.addEventListener('click', () => this.flipCard());
    this.cardElement.addEventListener('click', () => this.flipCard());
    this.explanationBtn.addEventListener('click', () => this.toggleExplanation());
    this.readBtn.addEventListener('click', () => this.speakCurrentCard());
    this.stopBtn.addEventListener('click', () => this.stopNarration());

    this.audioPlayer.addEventListener('ended', () => {
      this.stopNarration('Playback complete.');
    });

    this.audioPlayer.addEventListener('error', () => {
      this.stopNarration('Unable to play the generated audio.');
    });

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.showCard(this.currentIndex - 1);
          break;
        case 'ArrowRight':
          this.showCard(this.currentIndex + 1);
          break;
        case ' ': {
          const activeTag = ((document.activeElement && document.activeElement.tagName) || '').toUpperCase();
          if (['BUTTON', 'SELECT', 'INPUT', 'TEXTAREA'].includes(activeTag)) {
            return;
          }
          event.preventDefault();
          this.flipCard();
          break;
        }
        case 'r':
        case 'R':
          this.randomCard();
          break;
        default:
          break;
      }
    });
  }

  showCard(index) {
    if (this.cards.length === 0) {
      return;
    }

    const normalizedIndex = (index + this.cards.length) % this.cards.length;
    this.currentIndex = normalizedIndex;

    this.stopNarration(undefined, { suppressStatus: true });
    this.cardWrapper.classList.remove('transitioning');
    void this.cardWrapper.offsetWidth;
    this.cardWrapper.classList.add('transitioning');
    this.cardElement.classList.remove('is-flipped');
    this.explanationPanel.hidden = true;
    this.explanationBtn.textContent = 'Explanation';

    const card = this.cards[this.currentIndex];
    this.cardPresenter.render(card);
    this.cardCountEl.textContent = `Card ${this.currentIndex + 1} of ${this.cards.length}`;
    if (this.selector) {
      this.selector.value = String(this.currentIndex);
    }

    this.updateNavAvailability();

    this.setReadStatus('Card ready. Tap “Read Aloud” to hear the question.');
  }

  randomCard() {
    if (this.cards.length <= 1) {
      return;
    }

    let newIndex = this.currentIndex;
    while (newIndex === this.currentIndex) {
      newIndex = Math.floor(Math.random() * this.cards.length);
    }
    this.showCard(newIndex);
  }

  flipCard() {
    if (this.cards.length === 0) {
      return;
    }

    this.stopNarration(undefined, { suppressStatus: true });
    this.cardElement.classList.toggle('is-flipped');
    const isAnswerShowing = this.cardElement.classList.contains('is-flipped');
    const message = isAnswerShowing
      ? 'Answer showing. Tap “Read Aloud” to hear it.'
      : 'Question showing. Tap “Read Aloud” to hear it.';
    this.setReadStatus(message);
  }

  toggleExplanation() {
    const shouldShow = this.explanationPanel.hidden;
    this.explanationPanel.hidden = !shouldShow;
    this.explanationBtn.textContent = shouldShow ? 'Hide Explanation' : 'Explanation';
  }

  async speakCurrentCard() {
    if (!this.cards.length) {
      return;
    }

    const state = this.readBtn.dataset.state;
    if (state === 'loading' || state === 'playing') {
      return;
    }

    this.stopNarration(undefined, { suppressStatus: true });

    const card = this.cards[this.currentIndex];
    const isAnswerShowing = this.cardElement.classList.contains('is-flipped');
    const narrationText = this.composeNarrationText(card, isAnswerShowing ? 'answer' : 'question');

    if (!narrationText) {
      this.setReadStatus('Nothing to narrate for this card.');
      return;
    }

    if (this.activeUtterance) {
      window.speechSynthesis.cancel();
      this.activeUtterance = null;
    }

    if (this.currentAudioUrl) {
      URL.revokeObjectURL(this.currentAudioUrl);
      this.currentAudioUrl = null;
    }

    this.readBtn.disabled = true;
    this.readBtn.dataset.state = 'loading';
    this.readBtn.textContent = 'Generating audio...';
    this.stopBtn.disabled = false;
    this.setReadStatus(`Requesting ${isAnswerShowing ? 'answer' : 'question'} narration from the cloud service...`);

    const narrationToken = ++this.narrationRequestToken;

    try {
      await this.playCloudNarration(narrationText, isAnswerShowing, narrationToken);
    } catch (error) {
      console.error('Cloud TTS failed; falling back to browser speech if available.', error);
      if (narrationToken !== this.narrationRequestToken) {
        return;
      }

      if (this.speechSupported) {
        this.setReadStatus('Online TTS unavailable. Using browser speech synthesis.');
        const utterance = new SpeechSynthesisUtterance(narrationText);
        utterance.lang = 'en-US';
        utterance.rate = 1;
        utterance.onend = () => {
          if (this.activeUtterance === utterance) {
            this.activeUtterance = null;
            this.resetNarrationControl('Playback complete.');
          }
        };
        utterance.onerror = () => {
          if (this.activeUtterance === utterance) {
            this.activeUtterance = null;
            this.resetNarrationControl('Unable to narrate this card.');
          }
        };
        this.activeUtterance = utterance;
        this.readBtn.dataset.state = 'playing';
        this.readBtn.textContent = isAnswerShowing ? 'Speaking answer...' : 'Speaking question...';
        window.speechSynthesis.speak(utterance);
      } else {
        this.resetNarrationControl('Audio narration is unavailable right now.');
      }
    }
  }

  async playCloudNarration(text, isAnswerShowing, narrationToken) {
    const response = await fetch(this.ttsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voice: 'Brian', text })
    });

    if (!response.ok) {
      throw new Error(`TTS request failed with status ${response.status}`);
    }

    const audioBlob = await response.blob();

    if (narrationToken !== this.narrationRequestToken) {
      return;
    }

    if (this.currentAudioUrl) {
      URL.revokeObjectURL(this.currentAudioUrl);
    }

    this.currentAudioUrl = URL.createObjectURL(audioBlob);
    this.audioPlayer.src = this.currentAudioUrl;
    this.readBtn.dataset.state = 'playing';
    this.readBtn.textContent = isAnswerShowing ? 'Playing answer...' : 'Playing question...';
    this.setReadStatus(`Playing the ${isAnswerShowing ? 'answer' : 'question'}. Use Stop to end playback early.`);
    await this.audioPlayer.play();
  }

  composeNarrationText(card, face) {
    const segments = [card.title];

    if (face === 'answer') {
      segments.push(...this.composeAnswerSegments(card));
    } else {
      segments.push(...this.composeQuestionSegments(card));
    }

    return segments
      .map((segment) => (segment || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join('. ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  composeQuestionSegments(card) {
    const segments = [];
    if (card.prompt && card.prompt.text) {
      const lead = card.prompt.lead ? `${card.prompt.lead}: ` : '';
      segments.push(`${lead}${card.prompt.text}`);
      if (Array.isArray(card.prompt.details)) {
        segments.push(...card.prompt.details);
      }
    }

    if (Array.isArray(card.questionNotes)) {
      segments.push(...card.questionNotes);
    }

    return segments;
  }

  composeAnswerSegments(card) {
    const segments = [];

    if (Array.isArray(card.answerPoints)) {
      card.answerPoints.forEach((point) => {
        const label = point.label ? `${point.label}: ` : '';
        segments.push(`${label}${point.text}`);
      });
    }

    if (card.answerSummary) {
      segments.push(`Why it matters: ${card.answerSummary}`);
    }

    return segments;
  }

  stopNarration(statusMessage, options = {}) {
    const { suppressStatus = false } = options;
    this.narrationRequestToken += 1;

    this.audioPlayer.pause();
    this.audioPlayer.currentTime = 0;

    if (this.currentAudioUrl) {
      URL.revokeObjectURL(this.currentAudioUrl);
      this.currentAudioUrl = null;
    }

    if (this.activeUtterance) {
      window.speechSynthesis.cancel();
      this.activeUtterance = null;
    }

    if (suppressStatus) {
      this.resetNarrationControl();
    } else {
      this.resetNarrationControl(statusMessage || 'Narration stopped.');
    }
  }

  resetNarrationControl(message) {
    this.readBtn.disabled = false;
    this.readBtn.dataset.state = 'ready';
    this.readBtn.textContent = 'Read Aloud';
    this.stopBtn.disabled = true;

    if (message) {
      this.setReadStatus(message);
    }
  }

  disableControls() {
    this.prevBtn.disabled = true;
    this.nextBtn.disabled = true;
    this.randomBtn.disabled = true;
    this.flipBtn.disabled = true;
    this.explanationBtn.disabled = true;
    this.readBtn.disabled = true;
    this.stopBtn.disabled = true;
    if (this.selector) {
      this.selector.disabled = true;
    }
  }

  setReadStatus(message) {
    if (!this.readStatus) {
      return;
    }
    this.readStatus.textContent = message;
  }
}

(async function initialiseDeck() {
  setStatusMessage('Loading pediatric dermatology cards...');

  try {
    const deck = await loadDeckData();
    const controller = new DeckController(deck);
    controller.init();
  } catch (error) {
    console.error('Unable to load deck data.', error);
    showDeckLoadError('We could not load the pediatric dermatology cards. Please refresh the page or try again later.');
  }
})();
