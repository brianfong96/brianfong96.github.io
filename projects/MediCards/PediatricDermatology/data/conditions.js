const cards = [
  {
    id: 'condition-acne',
    title: 'Acne (Preadolescent & Adolescent)',
    shortLabel: 'Acne',
    prompt: {
      lead: 'Clue',
      text: 'Comedones with inflammatory papules in a teen—what is the guideline-based treatment ladder?'
    },
    answerPoints: [
      { label: 'Mild', text: 'Benzoyl peroxide with or without a topical retinoid; add topical antibiotic only with benzoyl peroxide.' },
      {
        label: 'Moderate to severe',
        text: 'Add oral doxycycline or minocycline for limited duration, always paired with topical benzoyl peroxide.'
      },
      {
        label: 'Severe or scarring',
        text: 'Consider oral isotretinoin and refer to dermatology; combine oral contraceptives or spironolactone for select females.'
      }
    ],
    answerSummary:
      'Pair retinoids with benzoyl peroxide, limit antibiotic monotherapy, and escalate to isotretinoin for scarring disease.',
    imageSearch: {
      query: 'teen acne treatment benzoyl peroxide',
      label: 'Search Google Images for acne treatments'
    },
    explanation: [
      'Combination therapy improves efficacy and limits antimicrobial resistance. Reinforce adherence, gentle cleansers, and non-comedogenic moisturizers to support long-term control.'
    ],
    sources: [
      {
        label: 'JAAD – Guidelines of care for acne vulgaris',
        url: 'https://www.jaad.org/article/S0190-9622%2823%2903389-3/fulltext?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'condition-atopic-presentation',
    title: 'Atopic Dermatitis: Presentation',
    shortLabel: 'Atopic dermatitis (presentation)',
    prompt: {
      lead: 'Clue',
      text: 'Itchy eczematous patches in flexures signal which diagnosis, and what exam findings back it up?'
    },
    answerPoints: [
      {
        label: 'Presentation',
        text: 'Pruritic, xerotic patches beginning on infant cheeks and extensors then shifting to flexures.'
      },
      { label: 'Look for', text: 'Xerosis, lichenification, excoriations, and signs of superinfection.' },
      { label: 'Testing', text: 'Usually clinical; swab only if crusted or oozing lesions suggest impetigo.' }
    ],
    answerSummary:
      'Age-specific distribution and barrier breakdown clinch an atopic dermatitis diagnosis without routine labs.',
    imageSearch: {
      query: 'atopic dermatitis flexural rash child',
      label: 'Search Google Images for atopic dermatitis presentation'
    },
    explanation: [
      'Documenting itch plus chronic relapsing lesions fulfills atopic dermatitis diagnostic criteria. Reserve bacterial cultures for impetiginized areas and monitor growth and sleep to identify severe disease early.'
    ],
    sources: [
      {
        label: 'American Academy of Pediatrics – Treatment of Atopic Dermatitis',
        url: 'https://www.aap.org/en/patient-care/atopic-dermatitis/treatment-of-atopic-dermatitis/?utm_source=chatgpt.com'
      },
      {
        label: 'AAAAI 2023 Atopic Dermatitis Guideline',
        url: 'https://www.aaaai.org/Aaaai/media/Media-Library-PDFs/Allergist%20Resources/Statements%20and%20Practice%20Parameters/JTF-Atopic-Dermatitis-Guideline-2023-07-31-2026.pdf?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'condition-atopic-therapy',
    title: 'Atopic Dermatitis: Stepwise Therapy',
    shortLabel: 'Atopic dermatitis (therapy)',
    prompt: {
      lead: 'Management',
      text: 'Build the stepwise plan for calming an atopic dermatitis flare.'
    },
    answerPoints: [
      {
        label: 'Skin care',
        text: 'Daily liberal emollients after short lukewarm baths; wet wraps during flares.'
      },
      {
        label: 'Topical anti-inflammatories',
        text: 'Low to mid potency steroids by site and age; add calcineurin inhibitors for delicate areas.'
      },
      {
        label: 'Infection control',
        text: 'Dilute bleach baths for recurrent infections; reserve systemic or topical antibiotics for clear infection.'
      },
      {
        label: 'Escalate',
        text: 'Consider ruxolitinib 1.5% cream for ages two and older or systemic therapy when severe or refractory.'
      }
    ],
    answerSummary:
      'Layer barrier repair, anti-inflammatory therapy, and infection prevention; escalate quickly if quality of life suffers.',
    imageSearch: {
      query: 'atopic dermatitis wet wrap therapy children',
      label: 'Search Google Images for atopic dermatitis treatments'
    },
    explanation: [
      'Barrier restoration anchors therapy, while topical steroids tailored to body site control inflammation. Calcineurin inhibitors and new JAK creams provide steroid-sparing options, and early referral prevents prolonged sleep disruption or growth issues.'
    ],
    sources: [
      {
        label: 'American Academy of Pediatrics – Treatment of Atopic Dermatitis',
        url: 'https://www.aap.org/en/patient-care/atopic-dermatitis/treatment-of-atopic-dermatitis/?utm_source=chatgpt.com'
      },
      {
        label: 'AAAAI 2023 Atopic Dermatitis Guideline',
        url: 'https://www.aaaai.org/Aaaai/media/Media-Library-PDFs/Allergist%20Resources/Statements%20and%20Practice%20Parameters/JTF-Atopic-Dermatitis-Guideline-2023-07-31-2026.pdf?utm_source=chatgpt.com'
      },
      {
        label: 'Managed Healthcare Executive – Opzelura label expansion',
        url: 'https://www.managedhealthcareexecutive.com/view/fda-expands-approval-of-opzelura-cream-to-children-ages-2-to-11-with-atopic-dermatitis?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'condition-diaper-dermatitis',
    title: 'Diaper Dermatitis',
    shortLabel: 'Diaper dermatitis',
    prompt: {
      lead: 'Presentation',
      text: 'Beefy erythema across convex diaper surfaces with satellite pustules—what is it and how do you treat it?'
    },
    answerPoints: [
      {
        label: 'Likely diagnosis',
        text: 'Irritant diaper dermatitis with Candida involvement when satellites are present.'
      },
      { label: 'Testing', text: 'KOH prep if the diagnosis is uncertain.' },
      {
        label: 'Treatment',
        text: 'Thick barrier paste every change, open-air time, topical azole for Candida, and brief low-potency steroid for marked inflammation.'
      }
    ],
    answerSummary:
      'Moisture control plus antifungal or low-dose steroid therapy soothes diaper dermatitis while protecting thin skin.',
    imageSearch: {
      query: 'diaper dermatitis candida satellite lesions',
      label: 'Search Google Images for diaper dermatitis'
    },
    explanation: [
      'Barrier dysfunction drives irritant diaper dermatitis. Candida superinfection introduces satellite pustules and fold involvement, prompting topical azole therapy alongside aggressive barrier protection.'
    ],
    sources: [
      {
        label: 'AAP Pediatric Care – Diaper Rash',
        url: 'https://publications.aap.org/pediatriccare/article/doi/10.1542/aap.ppcqr.396155/1621/Diaper-Rash?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'condition-hand-foot-mouth',
    title: 'Hand-Foot-Mouth Disease',
    shortLabel: 'Hand-foot-mouth disease',
    prompt: {
      lead: 'Clue',
      text: 'Low fever plus oral ulcers and palm or sole vesicles—what is the diagnosis and mainstay of care?'
    },
    answerPoints: [
      { label: 'Diagnosis', text: 'Hand-foot-mouth disease, usually from coxsackievirus.' },
      { label: 'Testing', text: 'Clinical; viral testing rarely needed.' },
      {
        label: 'Treatment',
        text: 'Supportive care with hydration and pain control. Children can attend daycare when afebrile, well, and without uncontrolled drooling.'
      }
    ],
    answerSummary:
      'Hand-foot-mouth disease is a clinical diagnosis—focus on comfort and hydration while counseling on contagion.',
    imageSearch: {
      query: 'hand foot mouth disease child rash',
      label: 'Search Google Images for HFMD'
    },
    explanation: [
      'Hand-foot-mouth vesicles rupture into painful erosions, so analgesia and cold fluids improve intake. Families should watch for dehydration and recognize that viral shedding continues for weeks.'
    ],
    sources: [
      {
        label: 'CDC – About hand, foot, and mouth disease',
        url: 'https://www.cdc.gov/hand-foot-mouth/about/index.html?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'condition-impetigo',
    title: 'Impetigo',
    shortLabel: 'Impetigo',
    prompt: {
      lead: 'Clue',
      text: 'Honey-colored crusts on the face after eczema scratching—what is the diagnosis and first-line therapy?'
    },
    answerPoints: [
      {
        label: 'Diagnosis',
        text: 'Impetigo (nonbullous or bullous) from Staphylococcus aureus or Streptococcus pyogenes.'
      },
      {
        label: 'Testing',
        text: 'Culture for outbreaks, treatment failure, or MRSA risk.'
      },
      {
        label: 'Treatment',
        text: 'Topical mupirocin or retapamulin for limited lesions; oral cephalexin (or MRSA-active agent) for widespread disease.'
      },
      { label: 'Watch for', text: 'Rare post-streptococcal glomerulonephritis.' }
    ],
    answerSummary:
      'Crusted lesions need targeted anti-staphylococcal therapy, with cultures guiding community MRSA coverage.',
    imageSearch: {
      query: 'pediatric impetigo honey crust',
      label: 'Search Google Images for impetigo'
    },
    explanation: [
      'Topical therapy suffices for localized impetigo, while widespread disease requires oral antibiotics covering group A strep and MSSA. Document lesion count and household contacts to manage outbreaks.'
    ],
    sources: [
      {
        label: 'CDC – Clinical guidance for impetigo',
        url: 'https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/impetigo.html?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'condition-infantile-hemangioma',
    title: 'Infantile Hemangioma',
    shortLabel: 'Infantile hemangioma',
    prompt: {
      lead: 'Clue',
      text: 'Rapidly growing red-purple plaque in an infant—what should you remember about timing, risk, and treatment?'
    },
    answerPoints: [
      { label: 'Growth', text: 'Peaks by three to five months; most proliferation complete by five months.' },
      {
        label: 'High-risk sites',
        text: 'Periocular, airway, beard area, ulcerated, segmental, or multiple lesions.'
      },
      {
        label: 'Workup',
        text: 'Clinical; imaging for deep or uncertain lesions or syndromic concern. Screen for PHACE or LUMBAR when indicated.'
      },
      {
        label: 'Treatment',
        text: 'Early risk stratification; oral propranolol first-line for threatening lesions; topical timolol for small superficial lesions; meticulous ulcer care.'
      }
    ],
    answerSummary:
      'Refer high-risk hemangiomas early—propranolol within the first month prevents functional loss and disfigurement.',
    imageSearch: {
      query: 'infantile hemangioma infant face',
      label: 'Search Google Images for infantile hemangioma'
    },
    explanation: [
      'Because rapid growth occurs in the first months, prompt recognition and referral enable timely propranolol therapy. Segmental facial lesions warrant evaluation for PHACE syndrome, while lumbosacral lesions can signal LUMBAR association.'
    ],
    sources: [
      {
        label: 'AAP – Infantile hemangioma guideline',
        url: 'https://publications.aap.org/pediatrics/article/143/1/e20183475/37268/Clinical-Practice-Guideline-for-the-Management-of?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'condition-molluscum',
    title: 'Molluscum Contagiosum',
    shortLabel: 'Molluscum contagiosum',
    prompt: {
      lead: 'Pearl',
      text: 'Umbilicated pearly papules on flexural skin—what is the typical course and when do you treat?'
    },
    answerPoints: [
      { label: 'Diagnosis', text: 'Molluscum contagiosum, common in atopic children.' },
      { label: 'Course', text: 'Self-resolves over months to years.' },
      {
        label: 'Treatment',
        text: 'Reassurance or procedures (curettage, cryotherapy, cantharidin). Use cantharidin (Ycanth) for ages two and older when lesions are numerous, spreading, symptomatic, or psychosocially distressing.'
      }
    ],
    answerSummary:
      'Most molluscum clears without intervention; treat when lesions bother the child or complicate eczema.',
    imageSearch: {
      query: 'molluscum contagiosum child lesions',
      label: 'Search Google Images for molluscum'
    },
    explanation: [
      'Lesions autoinoculate along lines of trauma, so eczema control is key. When therapy is requested, discuss realistic timelines and potential irritation from destructive modalities.'
    ],
    sources: [
      {
        label: 'Texas Children’s – Molluscum contagiosum referral guide',
        url: 'https://www.texaschildrens.org/sites/default/files/uploads/molluscum%20contagiosum_0.pdf?utm_source=chatgpt.com'
      },
      {
        label: 'FDA – Ycanth label',
        url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/212905s000lbl.pdf?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'condition-psoriasis',
    title: 'Psoriasis (Pediatric)',
    shortLabel: 'Psoriasis',
    prompt: {
      lead: 'Pattern',
      text: 'Well-demarcated erythematous plaques with silvery scale on extensor surfaces—what is the diagnosis and management overview?'
    },
    answerPoints: [
      { label: 'Diagnosis', text: 'Plaque psoriasis; screen for psoriatic arthritis symptoms.' },
      {
        label: 'Treatment',
        text: 'Topical corticosteroids (potency by site and age) plus vitamin D analogs; calcineurin inhibitors for face and genitals.'
      },
      {
        label: 'Escalation',
        text: 'Phototherapy or systemic and biologic therapy for moderate-severe or refractory disease in partnership with dermatology.'
      }
    ],
    answerSummary:
      'Psoriasis features sharply bordered plaques—combine topical steroids with adjuncts and escalate early for joint symptoms.',
    imageSearch: {
      query: 'pediatric psoriasis plaque',
      label: 'Search Google Images for pediatric psoriasis'
    },
    explanation: [
      'Pediatric psoriasis can impair quality of life and carries arthritis risk. Encourage moisturizers, manage triggers, and partner with dermatology for systemic therapy when body surface area or impact is high.'
    ],
    sources: [
      {
        label: 'JAAD – Pediatric psoriasis guideline',
        url: 'https://www.jaad.org/article/S0190-9622%2819%2932655-6/fulltext?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'condition-scabies',
    title: 'Scabies',
    shortLabel: 'Scabies',
    prompt: {
      lead: 'Clue',
      text: 'Intense nocturnal itch with burrows in finger webs—how do you confirm and treat?'
    },
    answerPoints: [
      {
        label: 'Diagnosis',
        text: 'Scabies—clinical plus mineral oil scraping or dermoscopy when uncertain.'
      },
      {
        label: 'Treatment',
        text: 'Permethrin 5% cream neck-down (include scalp in infants) repeated in seven days; treat close contacts and decontaminate linens.'
      },
      {
        label: 'Escalate',
        text: 'Oral ivermectin for outbreaks or refractory cases (check age and weight guidance).'
      }
    ],
    answerSummary:
      'Treat the patient and contacts with permethrin, repeat in a week, and manage the environment to prevent reinfestation.',
    imageSearch: {
      query: 'scabies burrow pediatric',
      label: 'Search Google Images for scabies'
    },
    explanation: [
      'Scabies mites tunnel in thin skin, creating pruritic papules and burrows. Confirming mites can bolster adherence, but treatment should start promptly to relieve symptoms and curb spread.'
    ],
    sources: [
      {
        label: 'CDC – Clinical care of scabies',
        url: 'https://www.cdc.gov/scabies/hcp/clinical-care/index.html?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'condition-seborrheic-dermatitis',
    title: 'Seborrheic Dermatitis (Cradle Cap)',
    shortLabel: 'Seborrheic dermatitis',
    prompt: {
      lead: 'Presentation',
      text: 'Greasy yellow scale on an otherwise content infant’s scalp—what is the diagnosis and how do you counsel parents?'
    },
    answerPoints: [
      { label: 'Diagnosis', text: 'Infantile seborrheic dermatitis (cradle cap).' },
      {
        label: 'Treatment',
        text: 'Gentle daily shampoo, soften scale with mineral oil or petrolatum and brush off; consider ketoconazole 2% cream or shampoo if extensive or persistent.'
      },
      { label: 'Prognosis', text: 'Typically resolves by six to twelve months.' }
    ],
    answerSummary:
      'Cradle cap is benign—focus on gentle keratolysis and reassure about spontaneous resolution.',
    imageSearch: {
      query: 'infant cradle cap seborrheic dermatitis',
      label: 'Search Google Images for cradle cap'
    },
    explanation: [
      'Seborrheic dermatitis stems from Malassezia overgrowth in sebaceous areas. Emphasize gentle removal rather than aggressive scrubbing to avoid scalp irritation.'
    ],
    sources: [
      {
        label: 'HealthyChildren.org – What is cradle cap?',
        url: 'https://www.healthychildren.org/English/ages-stages/baby/bathing-skin-care/Pages/Cradle-Cap.aspx?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'condition-tinea',
    title: 'Tinea Infections',
    shortLabel: 'Tinea infections',
    prompt: {
      lead: 'Case',
      text: 'Round scaly patches with alopecia and “black dots” in the scalp—what test and treatment are needed?'
    },
    answerPoints: [
      {
        label: 'Diagnosis',
        text: 'Tinea capitis (or corporis or pedis when annular with an active border).'
      },
      {
        label: 'Testing',
        text: 'KOH prep; fungal culture to identify the organism.'
      },
      {
        label: 'Treatment',
        text: 'Oral griseofulvin or terbinafine for capitis with adjunct selenium sulfide or ketoconazole shampoo; topical allylamine or azole for corporis or pedis.'
      }
    ],
    answerSummary:
      'Confirm dermatophytes with KOH and treat scalp disease systemically—topicals alone fail.',
    imageSearch: {
      query: 'tinea capitis black dot child',
      label: 'Search Google Images for tinea infections'
    },
    explanation: [
      'Tinea capitis requires systemic therapy for follicular penetration. Choosing terbinafine versus griseofulvin depends on the suspected organism, while antifungal shampoos limit transmission.'
    ],
    sources: [
      {
        label: 'AAFP – Common tinea infections in children',
        url: 'https://www.aafp.org/pubs/afp/issues/2008/0515/p1415.html?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'condition-urticaria',
    title: 'Urticaria (Acute)',
    shortLabel: 'Urticaria',
    prompt: {
      lead: 'Clue',
      text: 'Transient pruritic wheals with or without angioedema—what evaluation and treatment steps are recommended?'
    },
    answerPoints: [
      { label: 'Evaluation', text: 'Usually none beyond history and exam; screen for anaphylaxis symptoms.' },
      {
        label: 'Treatment',
        text: 'Second-generation H1 antihistamines such as cetirizine, loratadine, or fexofenadine with up-titration for control.'
      },
      {
        label: 'Escalation',
        text: 'Reserve a short steroid burst for severe cases; administer IM epinephrine for anaphylaxis.'
      }
    ],
    answerSummary:
      'Treat acute urticaria with non-sedating antihistamines and be ready to manage anaphylaxis.',
    imageSearch: {
      query: 'acute urticaria wheals child',
      label: 'Search Google Images for urticaria'
    },
    explanation: [
      'Acute hives are usually self-limited and do not need laboratory workup. Educate families on avoiding known triggers, dosing antihistamines correctly, and using epinephrine for systemic reactions.'
    ],
    sources: [
      {
        label: 'AAP – Urticaria, angioedema, and anaphylaxis review',
        url: 'https://publications.aap.org/pediatricsinreview/article/41/6/283/35410/Urticaria-Angioedema-and-Anaphylaxis?utm_source=chatgpt.com'
      }
    ]
  }
];

export default {
  id: 'conditions',
  label: 'Condition playbooks',
  cards
};
