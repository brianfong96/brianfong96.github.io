const cards = [
  {
    id: 'testing-cliff-notes',
    title: 'Testing Cliff Notes',
    shortLabel: 'Testing cheatsheet',
    prompt: {
      lead: 'Order wisely',
      text: 'Which diagnostic tests actually change management in pediatric allergy and derm cases?'
    },
    answerPoints: [
      { label: 'Skin-prick tests / serum IgE', text: 'Order only when history suggests IgE-mediated allergy and results will change avoidance, immunotherapy, or desensitization plans; remember positive tests indicate sensitization, not clinical allergy.' },
      { label: 'Oral food challenge', text: 'Gold standard for confirming or ruling out food allergy and assessing tolerance (e.g., baked milk/egg ladders); perform in supervised settings.' },
      { label: 'Spirometry & FeNO', text: 'Use spirometry ≥5–6 years old to document reversible airflow obstruction; add FeNO when available to gauge type 2 inflammation and adherence.' },
      { label: 'Patch testing', text: 'Evaluate persistent or unclear dermatitis for allergic contact triggers.' },
      { label: 'Tryptase', text: 'Draw 1–3 hours after suspected anaphylaxis when diagnosis is uncertain or to evaluate for mast cell disorders.' }
    ],
    answerSummary:
      'Tie testing to history—reserve IgE studies, spirometry, patch testing, and tryptase for scenarios where results guide therapy, and use oral food challenges to confirm tolerance.',
    imageSearch: {
      query: 'pediatric allergy testing skin prick spirometry patch test',
      label: 'Search Google Images for pediatric allergy testing'
    },
    explanation: [
      'Avoid broad “screening” panels that detect sensitization without context. Document pre-test probability, counsel families on limitations, and plan follow-up to interpret results together.'
    ],
    sources: [
      {
        label: 'AAAAI/ACAAI Food Allergy Diagnostic Guideline',
        url: 'https://www.aaaai.org/practice-resources/statements-and-practice-parameters/food-allergy?utm_source=chatgpt.com'
      },
      {
        label: 'GINA 2023 – Lung Function Testing',
        url: 'https://ginasthma.org/wp-content/uploads/2023/07/GINA-2023-Pocket-Guide-WMS.pdf?utm_source=chatgpt.com'
      },
      {
        label: 'American Contact Dermatitis Society – Patch Testing',
        url: 'https://www.contactderm.org/resources/pediatric?utm_source=chatgpt.com'
      }
    ]
  }
];

export default {
  id: 'tests',
  label: 'Testing Playbook',
  cards
};
