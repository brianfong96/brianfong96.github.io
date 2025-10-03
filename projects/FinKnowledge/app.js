const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const introCard = document.getElementById('intro-card');
const questionCard = document.getElementById('question-card');
const summaryCard = document.getElementById('summary-card');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const feedback = document.getElementById('feedback');
const feedbackEli5 = document.getElementById('feedback-eli5');
const feedbackTechnical = document.getElementById('feedback-technical');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const progressDisplay = document.getElementById('progress');
const questionCountInput = document.getElementById('question-count');
const summaryText = document.getElementById('summary-text');
const yearSpan = document.getElementById('year');

yearSpan.textContent = new Date().getFullYear();

const MIN_QUESTION_COUNT = 5;
const MAX_QUESTION_COUNT = questionBank.length;
const DEFAULT_QUESTION_COUNT = Math.min(10, MAX_QUESTION_COUNT);

if (questionCountInput) {
  questionCountInput.min = MIN_QUESTION_COUNT;
  questionCountInput.max = MAX_QUESTION_COUNT;
  if (!questionCountInput.value) {
    questionCountInput.value = DEFAULT_QUESTION_COUNT;
  }
}

let shuffledQuestions = [];
let currentIndex = 0;
let score = 0;
let timerInterval = null;
let startTime = null;

const initialQuestionTotal = questionCountInput
  ? Number.parseInt(questionCountInput.value, 10) || DEFAULT_QUESTION_COUNT
  : MAX_QUESTION_COUNT;
scoreDisplay.textContent = `0 / ${initialQuestionTotal}`;
progressDisplay.textContent = `0 / ${initialQuestionTotal}`;

function clampQuestionCount(rawValue) {
  const parsed = Number.parseInt(rawValue, 10);
  if (Number.isNaN(parsed)) {
    return DEFAULT_QUESTION_COUNT;
  }
  return Math.max(
    MIN_QUESTION_COUNT,
    Math.min(parsed, MAX_QUESTION_COUNT)
  );
}

function sampleQuestions(count) {
  const workingSet = [...questionBank];
  for (let i = workingSet.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [workingSet[i], workingSet[j]] = [workingSet[j], workingSet[i]];
  }
  return workingSet.slice(0, count);
}

function formatTime(elapsedMs) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function startTimer() {
  startTime = Date.now();
  timerDisplay.textContent = '00:00';
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    timerDisplay.textContent = formatTime(elapsed);
  }, 250);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetQuiz(desiredCount = DEFAULT_QUESTION_COUNT) {
  const questionTotal = clampQuestionCount(desiredCount);
  shuffledQuestions = sampleQuestions(questionTotal);
  score = 0;
  currentIndex = 0;
  if (questionCountInput) {
    questionCountInput.value = questionTotal;
  }
  scoreDisplay.textContent = `0 / ${questionTotal}`;
  progressDisplay.textContent = `0 / ${questionTotal}`;
  feedback.classList.add('hidden');
  nextBtn.disabled = true;
  summaryCard.classList.add('hidden');
  questionCard.classList.remove('hidden');
  introCard.classList.add('hidden');
  renderQuestion();
  startTimer();
}

function renderQuestion() {
  const question = shuffledQuestions[currentIndex];
  questionText.textContent = question.prompt;
  optionsContainer.innerHTML = '';
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => handleAnswer(index));
    optionsContainer.appendChild(button);
  });
  progressDisplay.textContent = `${currentIndex + 1} / ${shuffledQuestions.length}`;
  feedback.classList.add('hidden');
  feedbackEli5.textContent = '';
  feedbackTechnical.textContent = '';
  nextBtn.disabled = true;
}

function handleAnswer(selectedIndex) {
  const question = shuffledQuestions[currentIndex];
  const buttons = optionsContainer.querySelectorAll('button');
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === question.answerIndex) {
      button.classList.add('correct');
    }
    if (index === selectedIndex && index !== question.answerIndex) {
      button.classList.add('incorrect');
    }
  });

  if (selectedIndex === question.answerIndex) {
    score += 1;
  }

  scoreDisplay.textContent = `${score} / ${shuffledQuestions.length}`;
  feedbackEli5.textContent = `ELI5: ${question.explanation.eli5}`;
  feedbackTechnical.textContent = question.explanation.technical;
  feedback.classList.remove('hidden');
  nextBtn.disabled = false;
}

function showSummary() {
  stopTimer();
  questionCard.classList.add('hidden');
  summaryCard.classList.remove('hidden');
  const elapsed = startTime ? formatTime(Date.now() - startTime) : '00:00';
  summaryText.textContent = `You answered ${score} out of ${shuffledQuestions.length} questions correctly in ${elapsed}.`;
}

startBtn.addEventListener('click', () => {
  const desiredCount = questionCountInput
    ? questionCountInput.value
    : DEFAULT_QUESTION_COUNT;
  resetQuiz(desiredCount);
});

nextBtn.addEventListener('click', () => {
  if (nextBtn.disabled) return;
  currentIndex += 1;
  if (currentIndex >= shuffledQuestions.length) {
    showSummary();
  } else {
    renderQuestion();
  }
});

restartBtn.addEventListener('click', () => {
  stopTimer();
  const desiredCount = questionCountInput
    ? questionCountInput.value
    : shuffledQuestions.length || DEFAULT_QUESTION_COUNT;
  resetQuiz(desiredCount);
});
