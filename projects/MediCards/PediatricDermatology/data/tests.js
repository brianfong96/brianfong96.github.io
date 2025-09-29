const cards = [
  {
    id: 'tests-quick-table',
    title: 'Quick “Which Test?” Table',
    shortLabel: 'Test selector',
    prompt: {
      lead: 'Scenario',
      text: 'Clinic triage requires targeted testing—what rapid tests align with each diagnosis?'
    },
    answerPoints: [
      { text: 'KOH prep for suspected tinea corporis or capitis.' },
      { text: 'Bacterial culture for impetigo that is recurrent, associated with outbreaks, or not responding.' },
      { text: 'Skin scraping or dermoscopy to confirm scabies when needed.' },
      { text: 'No routine labs for classic AD, acne, pityriasis rosea, molluscum, or viral warts unless atypical or immunocompromised.' }
    ],
    answerSummary:
      'Match quick office tests to your differential and avoid unnecessary labs for classic inflammatory dermatoses.',
    imageSearch: {
      query: 'dermatology koh prep scabies scraping',
      label: 'Search Google Images for bedside dermatology tests'
    },
    explanation: [
      'Focused bedside diagnostics expedite therapy. KOH preps reveal branching hyphae, cultures tailor antibacterial therapy, and scrapings confirm mite infestations before undertaking extensive household treatment.'
    ],
    sources: [
      {
        label: 'AAFP – Diagnosis and management of tinea infections',
        url: 'https://www.aafp.org/pubs/afp/issues/2014/1115/p702.html?utm_source=chatgpt.com'
      },
      {
        label: 'CDC – Clinical guidance for impetigo',
        url: 'https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/impetigo.html?utm_source=chatgpt.com'
      },
      {
        label: 'CDC – Clinical care of scabies',
        url: 'https://www.cdc.gov/scabies/hcp/clinical-care/index.html?utm_source=chatgpt.com'
      }
    ]
  }
];

export default {
  id: 'tests',
  label: 'Diagnostic quick picks',
  cards
};
