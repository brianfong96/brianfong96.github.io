const cards = [
  {
    id: 'safety-net-red-flags',
    title: 'Smart Safety Net',
    shortLabel: 'Safety net',
    prompt: {
      lead: 'Escalate when',
      text: 'Which red flags demand urgent reassessment or referral?'
    },
    answerPoints: [
      { text: 'Fever, toxic appearance, or rapidly spreading cellulitis.' },
      { text: 'Neonates with pustules—consider HSV, bacterial sepsis, impetigo, or congenital candidiasis.' },
      { text: 'Periorbital swelling or visual changes from periocular hemangioma or impetigo complications.' },
      { text: 'Extensive eczema unresponsive to appropriate potency steroids.' },
      { text: 'Immunocompromised child, diagnostic uncertainty, or treatment failure.' }
    ],
    answerSummary:
      'Systemic illness, ocular involvement, or refractory disease signals the need for urgent escalation.',
    imageSearch: {
      query: 'pediatric dermatology emergency signs',
      label: 'Search Google Images for dermatology red flags'
    },
    explanation: [
      'Red-flag screening prevents missed invasive infections and vision-threatening hemangiomas. Neonates with pustules deserve rapid workup for HSV or bacterial sepsis, and any periocular swelling mandates ophthalmology evaluation.'
    ],
    sources: [
      {
        label: 'CDC – Clinical guidance for group A strep skin infections',
        url: 'https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/impetigo.html?utm_source=chatgpt.com'
      },
      {
        label: 'AAP – Infantile hemangioma guideline',
        url: 'https://publications.aap.org/pediatrics/article/143/1/e20183475/37268/Clinical-Practice-Guideline-for-the-Management-of?utm_source=chatgpt.com'
      },
      {
        label: 'AAAAI – Atopic dermatitis practice parameter',
        url: 'https://www.aaaai.org/Aaaai/media/Media-Library-PDFs/Allergist%20Resources/Statements%20and%20Practice%20Parameters/JTF-Atopic-Dermatitis-Guideline-2023-07-31-2026.pdf?utm_source=chatgpt.com'
      }
    ]
  }
];

export default {
  id: 'safety-net',
  label: 'Safety net',
  cards
};
