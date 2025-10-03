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
const summaryText = document.getElementById('summary-text');
const yearSpan = document.getElementById('year');

yearSpan.textContent = new Date().getFullYear();

let shuffledQuestions = [];
let currentIndex = 0;
let score = 0;
let timerInterval = null;
let startTime = null;

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

function shuffleQuestions() {
  shuffledQuestions = [...questionBank];
  for (let i = shuffledQuestions.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledQuestions[i], shuffledQuestions[j]] = [
      shuffledQuestions[j],
      shuffledQuestions[i]
    ];
  }
}

function resetQuiz() {
  score = 0;
  currentIndex = 0;
  shuffleQuestions();
  scoreDisplay.textContent = `0 / ${shuffledQuestions.length}`;
  progressDisplay.textContent = `0 / ${shuffledQuestions.length}`;
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
  resetQuiz();
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
  resetQuiz();
});
