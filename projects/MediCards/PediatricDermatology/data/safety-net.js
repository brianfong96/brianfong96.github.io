const cards = [
  {
    id: 'red-flags-refer',
    title: 'Red Flags → Refer',
    shortLabel: 'Red flags',
    prompt: {
      lead: 'Escalate fast',
      text: 'Which findings mandate specialist referral for pediatric allergy/derm patients?'
    },
    answerPoints: [
      { label: 'Anaphylaxis history', text: 'Any child with anaphylaxis or rapid multi-system reactions requires allergy referral for trigger clarification and emergency planning.' },
      { label: 'Diagnostic uncertainty', text: 'Recurring rashes, wheeze, or suspected food allergy with unclear etiology should be co-managed to avoid missed systemic disease.' },
      { label: 'Growth or nutrition impact', text: 'Failure to thrive or feeding aversion tied to suspected food allergy demands multidisciplinary assessment.' },
      { label: 'Refractory disease', text: 'Severe eczema needing systemic therapy, poorly controlled asthma despite step-up treatment, or chronic urticaria unresponsive to high-dose antihistamines.' },
      { label: 'High-risk procedures', text: 'Patients who may benefit from immunotherapy, oral food desensitization, or biologics.' }
    ],
    answerSummary:
      'Escalate care for anaphylaxis risk, unclear diagnoses, growth compromise, refractory disease, or when advanced therapies like immunotherapy are needed.',
    imageSearch: {
      query: 'pediatric allergy referral criteria anaphylaxis eczema asthma',
      label: 'Search Google Images for pediatric allergy referral clues'
    },
    explanation: [
      'Early subspecialty involvement optimizes safety and avoids unnecessary dietary restriction. Communicate current medications and previous reactions to streamline advanced testing or desensitization.'
    ],
    sources: [
      {
        label: 'AAAAI – Referral Guidelines for Allergic Disease',
        url: 'https://www.aaaai.org/conditions-treatments/library/allergy-library/when-to-refer?utm_source=chatgpt.com'
      },
      {
        label: 'AAP – Atopic Dermatitis Treatment Escalation',
        url: 'https://www.aap.org/en/patient-care/atopic-dermatitis/treatment-of-atopic-dermatitis/?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'urgent-ed-triggers',
    title: 'When to Urgently Refer or Send to ED',
    shortLabel: 'ED triggers',
    prompt: {
      lead: 'Red-alert scenarios',
      text: 'Identify bedside clues that require emergency department transfer or urgent specialty input.'
    },
    answerPoints: [
      { label: 'Rapidly spreading painful rash with fever', text: 'Suggests invasive infection (cellulitis, necrotizing fasciitis) or toxin-mediated disease—needs emergent evaluation.' },
      { label: 'Suspected eczema herpeticum', text: 'Monomorphic punched-out vesicles/erosions, fever, or malaise in atopic skin—urgent antiviral therapy required.' },
      { label: 'Progressive swelling with breathing difficulty', text: 'Anaphylaxis or airway edema—administer epinephrine and transfer to emergency care.' },
      { label: 'Vesiculobullous lesions with mucosal involvement', text: 'Concern for Stevens–Johnson syndrome/toxic epidermal necrolysis—hospitalize immediately.' },
      { label: 'Neonate (<28 days) with widespread vesicles/pustules or fever', text: 'Risk of disseminated HSV, bacterial sepsis, or Listeria—needs full sepsis workup.' }
    ],
    answerSummary:
      'Painful febrile rashes, mucosal blistering, airway compromise, or neonatal vesicles demand emergency evaluation rather than outpatient follow-up.',
    imageSearch: {
      query: 'pediatric dermatology emergency eczema herpeticum stevens johnson',
      label: 'Search Google Images for pediatric dermatology emergencies'
    },
    explanation: [
      'Have low threshold to escalate when systemic symptoms accompany skin findings. Document timing, medications, and exposures to aid ED teams.'
    ],
    sources: [
      {
        label: 'American Academy of Dermatology – Dermatologic Emergencies',
        url: 'https://www.aad.org/member/clinical-quality/guidelines/dermatologic-emergencies?utm_source=chatgpt.com'
      },
      {
        label: 'AAP Red Book – Eczema Herpeticum',
        url: 'https://publications.aap.org/redbook/resources?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'quick-doses',
    title: 'Quick Doses: Epinephrine Autoinjectors',
    shortLabel: 'Epinephrine doses',
    prompt: {
      lead: 'Dose check',
      text: 'Which intramuscular epinephrine doses align with pediatric weight ranges?'
    },
    answerPoints: [
      { label: 'Dose formula', text: '0.01 mg/kg of 1 mg/mL (1:1,000) solution administered IM in the mid-anterolateral thigh; typical max dose 0.3 mg for children.' },
      { label: 'Autoinjector sizes', text: '0.1 mg (suitable for ~7.5–15 kg), 0.15 mg (≈15–30 kg), and 0.3 mg (≥30 kg). Use clinical judgment when a child falls between categories.' },
      { label: 'Practical tips', text: 'Hold injector in place for full delivery per device instructions, follow with leg immobilization for 3–10 seconds, and call EMS after administration.' }
    ],
    answerSummary:
      'Calculate epinephrine at 0.01 mg/kg and match autoinjector strengths to weight bands (0.1, 0.15, 0.3 mg) with prompt EMS activation after use.',
    imageSearch: {
      query: 'pediatric epinephrine autoinjector dosing 0.1 mg 0.15 mg 0.3 mg',
      label: 'Search Google Images for epinephrine autoinjector dosing'
    },
    explanation: [
      'Document weight at each visit to ensure correct device is prescribed. Families should always carry two autoinjectors in case symptoms persist or biphasic reactions occur.'
    ],
    sources: [
      {
        label: 'World Allergy Organization Anaphylaxis Guidelines',
        url: 'https://www.worldallergy.org/resources/anaphylaxis?utm_source=chatgpt.com'
      },
      {
        label: 'FDA – EpiPen Prescribing Information',
        url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/019430s086lbl.pdf?utm_source=chatgpt.com'
      }
    ]
  }
];

export default {
  id: 'safety-net',
  label: 'Safety Net & Dosing',
  cards
};
