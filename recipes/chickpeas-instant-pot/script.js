
function setPreset(amount) {
  document.getElementById('driedChickpeas').value = amount;
  updateFromDried();
}


function updateFromDried() {
  const input = document.getElementById('driedChickpeas');
  const errorBox = document.getElementById('inputError');
  const dried = parseFloat(input.value);

  if (!dried || dried <= 0) {
    errorBox.textContent = 'Please enter a valid number greater than zero.';
    return;
  } else {
    errorBox.textContent = '';
  }

  const unit = document.querySelector('input[name="unit"]:checked').value;
  const dryCups = unit === 'grams' ? (dried / 200).toFixed(2) : dried;
  const cooked = (dryCups * 3).toFixed(1);
  const soakWater = (dryCups * 4).toFixed(1);
  const cookWater = (dryCups * 3).toFixed(1);

  document.getElementById('servingEstimate').textContent = `~${cooked}`;

  document.getElementById('soak-ingredients').innerHTML = `
    <li>${dryCups} cup(s) dried chickpeas</li>
    <li>${soakWater} cups water (for soaking)</li>
  `;

  document.getElementById('cook-ingredients').innerHTML = `
    <li>${dryCups} cup(s) soaked chickpeas</li>
    <li>${cookWater} cups water (for Instant Pot)</li>
    <li>1 tbsp oil</li>
    <li>Optional: onion, garlic, bay leaf, cumin</li>
  `;

  document.getElementById('yield-info').innerHTML = `
    <li>${dryCups} cup(s) dried chickpeas makes ~${cooked} cups cooked</li>
    <li>Approx. ${cooked} serving(s)</li>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  updateFromDried();
  const firstStep = document.querySelector('.step');
  if (firstStep) {
    toggleStep(firstStep);
  }
});

