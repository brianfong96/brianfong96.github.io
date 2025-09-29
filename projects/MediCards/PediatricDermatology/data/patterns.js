const cards = [
  {
    id: 'pattern-eczema-distribution',
    title: 'Pattern Finder: Eczema Distribution',
    shortLabel: 'Eczema distribution',
    prompt: {
      lead: 'Pattern recognition',
      text: 'Which distribution clues steer you toward atopic dermatitis?'
    },
    answerPoints: [
      { text: 'Infants: cheeks and extensor surfaces dominate.' },
      {
        text: 'Children and adolescents: flexural surfaces such as antecubital and popliteal fossae, neck, and wrists.'
      },
      {
        text: 'Expect ill-defined, symmetric patches that evolve from erythema and vesicles to crusting and lichenification.'
      }
    ],
    answerSummary:
      'Age-based distribution and border quality distinguish eczema from psoriasis or contact dermatitis.',
    imageSearch: {
      query: 'atopic dermatitis distribution flexural',
      label: 'Search Google Images for eczema distribution'
    },
    explanation: [
      'Atopic dermatitis migrates with age—extensors early, flexures later. Ill-defined margins and symmetry strengthen the diagnosis, while well-demarcated or unilateral plaques should prompt alternate considerations.'
    ],
    sources: [
      {
        label: 'American Academy of Dermatology – Childhood eczema overview',
        url: 'https://www.aad.org/public/diseases/eczema/childhood/atopic-dermatitis?utm_source=chatgpt.com'
      }
    ]
  }
];

export default {
  id: 'pattern-clues',
  label: 'Pattern insights',
  cards
};
