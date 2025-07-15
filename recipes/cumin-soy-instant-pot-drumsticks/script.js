function toggleStep(stepEl) {
  const isExpanded = stepEl.classList.contains('active');
  document.querySelectorAll('.step').forEach(section => {
    section.classList.remove('active');
    section.setAttribute('aria-expanded', 'false');
  });
  if (!isExpanded) {
    stepEl.classList.add('active');
    stepEl.setAttribute('aria-expanded', 'true');
    stepEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateProgress(stepEl);
  }
}

function setPreset(count) {
  document.getElementById('drumstickCount').value = count;
  updateFromDrumsticks();
}

function updateProgress(activeStep) {
  const steps = Array.from(document.querySelectorAll('.step'));
  const index = steps.indexOf(activeStep);
  const percent = ((index + 1) / steps.length) * 100;
  document.getElementById('progress-indicator').style.width = percent + '%';
}

function updateFromDrumsticks() {
  const input = document.getElementById('drumstickCount');
  const errorBox = document.getElementById('inputError');
  const count = parseInt(input.value, 10);

  if (!count || count <= 0) {
    errorBox.textContent = 'Please enter a valid drumstick count.';
    return;
  } else {
    errorBox.textContent = '';
  }

  const ratio = count / 6; // base recipe uses 6 drumsticks
  const oil = (1 * ratio).toFixed(2);
  const cumin = (1 * ratio).toFixed(2);
  const stock = (1 * ratio).toFixed(2);
  const soy = (1 * ratio).toFixed(2);
  const bay = Math.max(1, Math.round(2 * ratio));
  const chili = (0.5 * ratio).toFixed(2);
  const water = (0.5 * ratio).toFixed(2);

  document.getElementById('servingEstimate').textContent = `${count}`;

  document.getElementById('season-ingredients').innerHTML = `
    <li>${count} chicken drumsticks</li>
    <li>${oil} tbsp oil</li>
    <li>${cumin} tsp ground cumin</li>
    <li>${stock} tsp chicken stock powder</li>
    <li>${soy} tbsp soy sauce</li>
    <li>${bay} bay leaf/leaves</li>
    <li>${chili} tsp chili flakes</li>
  `;

  document.getElementById('water-ingredients').innerHTML = `
    <li>${water} cup(s) water</li>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  updateFromDrumsticks();
  const firstStep = document.querySelector('.step');
  if (firstStep) {
    toggleStep(firstStep);
  }
});
