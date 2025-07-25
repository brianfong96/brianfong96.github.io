function toggleStep(stepEl) {
  const currentActive = document.querySelector('.step.active');

  if (currentActive === stepEl) {
    stepEl.classList.toggle('done');
    stepEl.classList.remove('active');
    stepEl.setAttribute('aria-expanded', 'false');
    updateProgress(stepEl);
    return;
  }

  if (currentActive) {
    currentActive.classList.add('done');
  }

  document.querySelectorAll('.step').forEach(section => {
    section.classList.remove('active');
    section.setAttribute('aria-expanded', 'false');
  });

  stepEl.classList.add('active');
  stepEl.setAttribute('aria-expanded', 'true');
  stepEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateProgress(stepEl);
}

function updateProgress(activeStep) {
  const steps = Array.from(document.querySelectorAll('.step'));
  const index = steps.indexOf(activeStep);
  const percent = ((index + 1) / steps.length) * 100;
  document.getElementById('progress-indicator').style.width = percent + '%';
}

document.addEventListener('DOMContentLoaded', () => {
  const firstStep = document.querySelector('.step');
  if (firstStep) {
    toggleStep(firstStep);
  }
});

function toggleTask(taskEl, event) {
  if (event) {
    event.stopPropagation();
  }
  if (taskEl.classList.contains('running')) {
    clearInterval(taskEl._timer);
    taskEl.classList.remove('running');
    taskEl.classList.toggle('done');
    taskEl.querySelector('.timer').textContent = '';
    return;
  }

  if (taskEl.classList.contains('done')) {
    taskEl.classList.remove('done');
    return;
  }

  const duration = parseInt(taskEl.dataset.duration, 10);
  if (!duration) {
    taskEl.classList.add('done');
    return;
  }

  let remaining = duration * 60;
  const timerSpan = taskEl.querySelector('.timer');
  timerSpan.textContent = formatTime(remaining);
  taskEl.classList.add('running');

  taskEl._timer = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(taskEl._timer);
      taskEl.classList.remove('running');
      taskEl.classList.add('done');
      timerSpan.textContent = '';
    } else {
      timerSpan.textContent = formatTime(remaining);
    }
  }, 1000);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
