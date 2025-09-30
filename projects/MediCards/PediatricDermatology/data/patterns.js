const cards = [
  {
    id: 'quick-differentials',
    title: 'Quick Differentials by Clue',
    shortLabel: 'Differential clues',
    prompt: {
      lead: 'Pattern pearls',
      text: 'Match rapid visual clues to their most likely pediatric diagnosis.'
    },
    answerPoints: [
      { label: 'Honey-colored crusts', text: 'Think impetigo—look for superficial erosions with golden crusts near nose or mouth.' },
      { label: 'Annular scaly border', text: 'Tinea corporis until proven otherwise; confirm with KOH scraping from the active edge.' },
      { label: 'Nocturnal itch in finger webs', text: 'Classic for scabies; inspect for burrows and treat household contacts.' },
      { label: 'Umbilicated dome papules', text: 'Molluscum contagiosum, especially in atopic skin or after pool exposure.' },
      { label: 'Flexural itchy plaques with xerosis', text: 'Atopic dermatitis—ask about chronic itch, atopy, and sleep disruption.' },
      { label: 'Diaper rash in folds with satellite pustules', text: 'Candida diaper dermatitis; start topical antifungal plus barrier care.' }
    ],
    answerSummary:
      'Visual shortcuts—crusts, rings, burrows, and papule morphology—rapidly narrow pediatric dermatology differentials.',
    imageSearch: {
      query: 'pediatric dermatology impetigo tinea scabies molluscum candida diaper rash',
      label: 'Search Google Images for pediatric rash clues'
    },
    explanation: [
      'Teaching quick pattern recognition shortens time to treatment. Pair clues with confirmatory tests (KOH, scraping, cultures) when findings are atypical or therapy fails.'
    ],
    sources: [
      {
        label: 'American Academy of Dermatology – Pediatric Dermatology Atlas',
        url: 'https://www.aad.org/member/education/pediatric-resources?utm_source=chatgpt.com'
      }
    ]
  }
];

export default {
  id: 'pattern-clues',
  label: 'Quick Differentials',
  cards
};
