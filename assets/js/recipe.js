function toggleStep(stepEl) {
  const current = document.querySelector('.step.active');
  if (current === stepEl) {
    stepEl.classList.remove('active');
    stepEl.setAttribute('aria-expanded', 'false');
    updateProgress(null);
    return;
  }
  if (current) {
    current.classList.remove('active');
    current.setAttribute('aria-expanded', 'false');
  }
  stepEl.classList.add('active');
  stepEl.setAttribute('aria-expanded', 'true');
  stepEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateProgress(stepEl);
}

function updateProgress(activeStep) {
  const bar = document.getElementById('progress-indicator');
  if (!bar) return;
  if (!activeStep) {
    bar.style.width = '0%';
    return;
  }
  const steps = Array.from(document.querySelectorAll('.step'));
  const index = steps.indexOf(activeStep);
  const percent = ((index + 1) / steps.length) * 100;
  bar.style.width = percent + '%';
}

document.addEventListener('DOMContentLoaded', () => {
  const first = document.querySelector('.step');
  if (first) toggleStep(first);
});

function toggleTask(taskEl) {
  const checkbox = taskEl.querySelector('.task-check');
  if (!checkbox) return;
  if (taskEl.classList.contains('running')) {
    clearInterval(taskEl._timer);
    taskEl.classList.remove('running');
    taskEl.classList.add('done');
    checkbox.checked = true;
    const t = taskEl.querySelector('.timer');
    if (t) t.textContent = '';
    return;
  }
  if (taskEl.classList.contains('done')) {
    taskEl.classList.remove('done');
    checkbox.checked = false;
    return;
  }
  const duration = parseInt(taskEl.dataset.duration, 10);
  if (!duration) {
    taskEl.classList.add('done');
    checkbox.checked = true;
    return;
  }
  let remaining = duration * 60;
  const timerSpan = taskEl.querySelector('.timer');
  if (timerSpan) timerSpan.textContent = formatTime(remaining);
  taskEl.classList.add('running');
  taskEl._timer = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(taskEl._timer);
      taskEl.classList.remove('running');
      taskEl.classList.add('done');
      checkbox.checked = true;
      if (timerSpan) timerSpan.textContent = '';
    } else if (timerSpan) {
      timerSpan.textContent = formatTime(remaining);
    }
  }, 1000);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
