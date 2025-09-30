const cards = [
  {
    id: 'atopic-dermatitis-overview',
    title: 'Atopic Dermatitis – Overview',
    shortLabel: 'Atopic dermatitis (overview)',
    prompt: {
      lead: 'Classic case',
      text: 'Infant with chronic, relapsing itchy patches—what history and exam clinch the diagnosis?'
    },
    answerPoints: [
      {
        label: 'History',
        text: 'Pruritus (often worse at night), chronic or relapsing course, age-related distribution (face/extensors in infants, flexures in older children), irritant exposures, infection history, and family atopy.'
      },
      {
        label: 'Exam',
        text: 'Xerosis, erythematous patches or plaques with excoriations and lichenification; monitor for impetiginized honey crusts or oozing.'
      },
      {
        label: 'Testing',
        text: 'Diagnosis is clinical; obtain bacterial swab when lesions appear infected and reserve allergy testing for clear immediate-type food triggers.'
      }
    ],
    answerSummary:
      'Chronic itch with age-specific distribution and barrier dysfunction defines atopic dermatitis—labs are unnecessary unless infection or immediate food allergy is suspected.',
    imageSearch: {
      query: 'infant atopic dermatitis cheeks flexural eczema',
      label: 'Search Google Images for atopic dermatitis presentation'
    },
    explanation: [
      'Document sleep disruption and growth concerns to gauge severity. Early caregiver education on moisturizing routines prevents escalation to systemic therapies.'
    ],
    sources: [
      {
        label: 'American Academy of Pediatrics – Atopic Dermatitis Care',
        url: 'https://www.aap.org/en/patient-care/atopic-dermatitis/?utm_source=chatgpt.com'
      },
      {
        label: 'AAAAI/ACAAI Atopic Dermatitis Guideline 2023',
        url: 'https://www.aaaai.org/Aaaai/media/Media-Library-PDFs/Allergist%20Resources/Statements%20and%20Practice%20Parameters/JTF-Atopic-Dermatitis-Guideline-2023.pdf?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'atopic-dermatitis-management',
    title: 'Atopic Dermatitis – Comprehensive Management',
    shortLabel: 'Atopic dermatitis (management)',
    prompt: {
      lead: 'Therapy ladder',
      text: 'How do you calm flares, protect the barrier, and escalate care for difficult atopic dermatitis?'
    },
    answerPoints: [
      {
        label: 'Skin care',
        text: 'Daily lukewarm baths with gentle cleanser followed by liberal fragrance-free emollients (at least twice daily); add wet wraps during severe flares.'
      },
      {
        label: 'Anti-inflammatory therapy',
        text: 'Apply topical steroids matched to site (low potency for face/folds, medium for trunk/extremities) in short bursts; introduce topical calcineurin inhibitors or crisaborole for steroid-sparing maintenance.'
      },
      {
        label: 'Itch & infection',
        text: 'Short bedtime sedating antihistamines only when sleep is disrupted. Use topical mupirocin for localized impetigo, systemic anti-staphylococcal antibiotics for widespread infection, and consider bleach baths 2–3 times weekly for recurrent infections.'
      },
      {
        label: 'Escalation & referral',
        text: 'Refer when disease remains severe despite optimized topicals, growth falters, or systemic therapy/phototherapy is considered; urgent evaluation for suspected eczema herpeticum (monomorphic punched-out lesions).'
      }
    ],
    answerSummary:
      'Optimize moisturization, targeted topical anti-inflammatories, and infection control; escalate quickly to specialist therapies when quality of life suffers or complications arise.',
    imageSearch: {
      query: 'atopic dermatitis wet wrap bleach bath child',
      label: 'Search Google Images for atopic dermatitis management'
    },
    explanation: [
      'Weekend steroid maintenance or proactive calcineurin inhibitors reduce relapses. Document action plans covering flares, infection warning signs, and medication potency to avoid misuse.'
    ],
    sources: [
      {
        label: 'American Academy of Dermatology – Atopic Dermatitis Guidelines Update 2023',
        url: 'https://www.jaad.org/article/S0190-9622(22)02730-0/fulltext?utm_source=chatgpt.com'
      },
      {
        label: 'AAP – Eczema Management',
        url: 'https://www.aap.org/en/patient-care/atopic-dermatitis/treatment-of-atopic-dermatitis/?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'impetigo',
    title: 'Impetigo',
    shortLabel: 'Impetigo',
    prompt: {
      lead: 'Crusted lesions',
      text: 'Child with rapidly spreading honey-colored crusts around the nose—identify the diagnosis and treatment plan.'
    },
    answerPoints: [
      {
        label: 'History & exam',
        text: 'Non-bullous impetigo presents with papules that evolve into pustules and honey-colored crusts, often after skin trauma or eczema; bullous disease shows flaccid bullae.'
      },
      {
        label: 'Testing',
        text: 'Usually clinical; obtain bacterial culture when MRSA is suspected, during outbreaks, or after treatment failure.'
      },
      {
        label: 'Management',
        text: 'Limited lesions: topical mupirocin or retapamulin for 5 days. Extensive disease or MRSA risk: oral antibiotics (e.g., cephalexin, dicloxacillin, or clindamycin based on local resistance). Reinforce hygiene and exclude from daycare until 24 hours of therapy.'
      }
    ],
    answerSummary:
      'Classic honey-colored crusts signal impetigo—use topical therapy for localized disease and oral antibiotics when lesions are numerous or MRSA is a concern.',
    imageSearch: {
      query: 'pediatric impetigo honey colored crust',
      label: 'Search Google Images for impetigo'
    },
    explanation: [
      'Treat underlying eczema to prevent recurrence. Counsel on hand hygiene, not sharing towels, and trimming nails to limit spread.'
    ],
    sources: [
      {
        label: 'CDC – Clinical Guidance for Impetigo',
        url: 'https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/impetigo.html?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'tinea-corporis-capitis',
    title: 'Tinea Corporis & Capitis',
    shortLabel: 'Tinea infections',
    prompt: {
      lead: 'Annular rash',
      text: 'Ringlike scaly plaque on the arm or scaly alopecic patch on the scalp—what confirms tinea and how do you treat it?'
    },
    answerPoints: [
      {
        label: 'Clues',
        text: 'Corporis: annular plaques with active scaly border; capitis: patchy alopecia, scale, black dots, or boggy kerion, often with animal or fomite exposure.'
      },
      {
        label: 'Testing',
        text: 'Perform KOH scraping from the active border; send fungal culture when diagnosis is uncertain. Wood’s lamp aids Microsporum detection.'
      },
      {
        label: 'Treatment',
        text: 'Corporis: topical allylamine or azole applied 1–2 weeks beyond clearance. Capitis: oral antifungal (griseofulvin or terbinafine based on species/age) plus antifungal shampoo 2–3 times weekly for patient and close contacts; add short oral steroid for severe kerion with specialist input.'
      }
    ],
    answerSummary:
      'Confirm tinea with KOH microscopy and treat corporis topically but capitis with systemic antifungals and adjunctive shampoos.',
    imageSearch: {
      query: 'tinea corporis annular rash child kerion capitis',
      label: 'Search Google Images for tinea corporis and capitis'
    },
    explanation: [
      'Avoid topical steroids alone, which mask tinea (tinea incognito). Educate families on not sharing hair accessories or hats during treatment.'
    ],
    sources: [
      {
        label: 'American Family Physician – Diagnosis and Management of Tinea Infections',
        url: 'https://www.aafp.org/pubs/afp/issues/2014/1115/p702.html?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'scabies',
    title: 'Scabies',
    shortLabel: 'Scabies',
    prompt: {
      lead: 'Nighttime itch',
      text: 'Child with intense nocturnal pruritus and burrows between fingers—what is the diagnosis and treatment?'
    },
    answerPoints: [
      {
        label: 'History & exam',
        text: 'Itch worse at night, family members affected. Burrows, papules, and vesicles on finger webs, wrists, axillae, waistline; infants may involve scalp, palms, and soles.'
      },
      {
        label: 'Testing',
        text: 'Diagnosis is clinical; confirm with dermoscopy, burrow ink test, or skin scraping microscopy when feasible.'
      },
      {
        label: 'Management',
        text: 'Permethrin 5% cream from neck down (include scalp for infants), under nails, left on 8–12 hours then rinsed; repeat in 7–10 days. Treat all close contacts simultaneously, launder bedding/clothing hot or seal for ≥72 hours, and address post-scabetic itch with emollients or low-potency steroids.'
      }
    ],
    answerSummary:
      'Treat scabies with permethrin applied to all contacts, environmental decontamination, and symptomatic care for persistent itch.',
    imageSearch: {
      query: 'pediatric scabies burrows finger webs treatment',
      label: 'Search Google Images for scabies management'
    },
    explanation: [
      'Consider oral ivermectin for crusted scabies or failed topical therapy in children >15 kg per specialist guidance. Reinfection occurs if contacts are untreated.'
    ],
    sources: [
      {
        label: 'CDC – Clinical Care of Scabies',
        url: 'https://www.cdc.gov/scabies/hcp/clinical-care/index.html?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'molluscum-contagiosum',
    title: 'Molluscum Contagiosum',
    shortLabel: 'Molluscum',
    prompt: {
      lead: 'Umbilicated papules',
      text: 'Child with clusters of dome-shaped umbilicated papules—what counseling and treatment options do you offer?'
    },
    answerPoints: [
      {
        label: 'Key features',
        text: 'Discrete pearly papules with central umbilication; often surrounded by eczematous halos, especially in atopic children; spread via skin-to-skin contact or fomites (pools, towels).'
      },
      {
        label: 'Testing',
        text: 'Clinical diagnosis; no labs required.'
      },
      {
        label: 'Management',
        text: 'Reassure about self-resolution over months to 2 years. Consider treatment for symptomatic or spreading lesions: in-office cantharidin, curettage in older children, or topical retinoids/immunotherapy. Treat associated eczema with gentle skin care and mild steroids; advise against scratching or shaving.'
      }
    ],
    answerSummary:
      'Most molluscum clears spontaneously—treat only when symptomatic or psychosocially distressing while controlling surrounding eczema.',
    imageSearch: {
      query: 'molluscum contagiosum child umbilicated papules',
      label: 'Search Google Images for molluscum contagiosum'
    },
    explanation: [
      'Cover lesions for contact sports to limit spread. Post-inflammatory hypopigmentation may linger after treatment.'
    ],
    sources: [
      {
        label: 'CDC – Molluscum Contagiosum',
        url: 'https://www.cdc.gov/poxvirus/molluscum-contagiosum/clinicians/index.html?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'viral-warts',
    title: 'Viral Warts (HPV)',
    shortLabel: 'Viral warts',
    prompt: {
      lead: 'Stubborn papules',
      text: 'Child with hyperkeratotic papules that interrupt skin lines—what management options exist?'
    },
    answerPoints: [
      {
        label: 'Features',
        text: 'Verrucous papules with black punctate dots (thrombosed capillaries); plantar warts may be painful. Review habits like nail biting or shaving that spread lesions.'
      },
      {
        label: 'Testing',
        text: 'Clinical diagnosis; no laboratory confirmation needed.'
      },
      {
        label: 'Treatment',
        text: 'First-line salicylic acid with nightly application and occlusion plus weekly paring for 2–3 months. Office options include cryotherapy every 2–3 weeks, cantharidin, or immunotherapy (contact allergens). Counsel that spontaneous resolution is common.'
      }
    ],
    answerSummary:
      'Treat warts conservatively with salicylic acid and occlusion, reserving cryotherapy or immunotherapy for persistent lesions while noting many self-resolve.',
    imageSearch: {
      query: 'pediatric plantar wart salicylic acid treatment',
      label: 'Search Google Images for pediatric warts'
    },
    explanation: [
      'Combine salicylic acid with duct-tape occlusion to enhance efficacy. Address pain with cushioning pads for plantar lesions.'
    ],
    sources: [
      {
        label: 'American Academy of Dermatology – Warts in Children',
        url: 'https://www.aad.org/public/diseases/a-z/warts-treatment?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'acne',
    title: 'Acne (Preadolescent & Adolescent)',
    shortLabel: 'Acne',
    prompt: {
      lead: 'Breakouts',
      text: 'Teenager with comedones and inflammatory papules—how do you stage and treat acne?'
    },
    answerPoints: [
      {
        label: 'Assessment',
        text: 'Determine severity (comedonal vs inflammatory vs nodulocystic), distribution (face, chest, back), psychosocial impact, and medications (steroids, lithium).'
      },
      {
        label: 'Treatment',
        text: 'Mild: topical retinoid nightly plus benzoyl peroxide (BP). Moderate: add topical antibiotic (clindamycin) always with BP or consider oral doxycycline/minocycline for limited course. Severe/scarring: refer for isotretinoin; consider hormonal therapy (combined oral contraceptives, spironolactone) in appropriate menstruating patients.'
      },
      {
        label: 'Counseling',
        text: 'Use gentle cleansers, non-comedogenic moisturizers, avoid picking, and discuss sun protection and pregnancy prevention for teratogenic medications.'
      }
    ],
    answerSummary:
      'Match acne therapy to severity—pair retinoids with benzoyl peroxide, limit antibiotic monotherapy, and refer early for scarring nodular disease.',
    imageSearch: {
      query: 'teen acne treatment regimen benzoyl peroxide retinoid',
      label: 'Search Google Images for acne management'
    },
    explanation: [
      'Maintenance retinoid use prevents new lesions. Oral antibiotics should be paired with topical retinoid/BP and limited to 3–4 months to curb resistance.'
    ],
    sources: [
      {
        label: 'American Academy of Dermatology – Acne Guidelines 2024',
        url: 'https://www.jaad.org/article/S0190-9622(23)00389-3/fulltext?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'diaper-dermatitis',
    title: 'Diaper Dermatitis (Irritant & Candida)',
    shortLabel: 'Diaper dermatitis',
    prompt: {
      lead: 'Diaper rash',
      text: 'Infant with erythema in the diaper area—how do you distinguish irritant vs Candida and manage each?'
    },
    answerPoints: [
      {
        label: 'Pattern recognition',
        text: 'Irritant dermatitis: confluent erythema on convex surfaces sparing skin folds. Candida: beefy red plaques involving folds with satellite pustules, often after antibiotics or diarrhea.'
      },
      {
        label: 'Management basics',
        text: 'Frequent diaper changes, super-absorbent diapers, gentle cleansing, and thick barrier paste (zinc oxide or petrolatum) at each change; provide diaper-free time.'
      },
      {
        label: 'Targeted therapy',
        text: 'Add low-potency topical steroid briefly for severe irritant rash. Start topical antifungal (nystatin or azole) when Candida suspected; continue 2–3 days past resolution.'
      }
    ],
    answerSummary:
      'Differentiate irritant from Candida by fold involvement and satellite lesions, then pair barrier care with antifungals or mild steroids as indicated.',
    imageSearch: {
      query: 'diaper dermatitis candida satellite pustules treatment',
      label: 'Search Google Images for diaper dermatitis'
    },
    explanation: [
      'Avoid fragranced wipes and allow air exposure. Escalate for persistent rash, ulceration, or systemic illness to rule out immunodeficiency or histiocytosis.'
    ],
    sources: [
      {
        label: 'AAP – Diaper Rash Guidance',
        url: 'https://publications.aap.org/pediatriccare/article/doi/10.1542/aap.ppcqr.396155/1621/Diaper-Rash?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'pityriasis-rosea',
    title: 'Pityriasis Rosea',
    shortLabel: 'Pityriasis rosea',
    prompt: {
      lead: 'Herald patch',
      text: 'Adolescent with herald patch followed by oval salmon plaques on the trunk—what should you counsel?'
    },
    answerPoints: [
      {
        label: 'Features',
        text: 'Often preceded by mild viral prodrome; herald patch precedes a “Christmas tree” distribution of oval plaques along skin tension lines, occasionally involving face in children.'
      },
      {
        label: 'Testing',
        text: 'Clinical diagnosis; order RPR or other serologies only if lesions are atypical or involve palms/soles to rule out syphilis or other mimics.'
      },
      {
        label: 'Management',
        text: 'Self-limited over 6–10 weeks. Manage itch with emollients, low- to mid-potency topical steroids, or oral antihistamines; consider narrowband UVB or short-course antivirals in severe, early, or extensive cases.'
      }
    ],
    answerSummary:
      'Pityriasis rosea is self-resolving—focus on reassurance and pruritus control while ruling out mimics when distribution is atypical.',
    imageSearch: {
      query: 'pityriasis rosea herald patch christmas tree rash child',
      label: 'Search Google Images for pityriasis rosea'
    },
    explanation: [
      'Educate about post-inflammatory hyperpigmentation, particularly in darker skin types, and advise return if systemic symptoms develop.'
    ],
    sources: [
      {
        label: 'DermNet – Pityriasis Rosea',
        url: 'https://dermnetnz.org/topics/pityriasis-rosea?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'urticaria-acute',
    title: 'Urticaria (Acute)',
    shortLabel: 'Urticaria (acute)',
    prompt: {
      lead: 'Sudden hives',
      text: 'Child develops transient wheals after viral illness—how do you manage acute urticaria safely?'
    },
    answerPoints: [
      {
        label: 'History & exam',
        text: 'Onset within hours to days; lesions are transient (<24 hours) and migratory. Investigate infection, foods, medications, insect stings, and evaluate for angioedema or systemic symptoms (wheeze, hypotension, vomiting).'
      },
      {
        label: 'Testing',
        text: 'No routine labs in uncomplicated acute urticaria; testing is reserved for suspected anaphylaxis or systemic disease.'
      },
      {
        label: 'Management',
        text: 'Weight-based second-generation antihistamine daily until symptom-free for several days; add cool compresses. Provide epinephrine prescription and education when anaphylaxis risk factors or systemic symptoms are present.'
      }
    ],
    answerSummary:
      'Treat acute pediatric urticaria with non-sedating antihistamines and trigger avoidance, escalating to epinephrine only when systemic signs suggest anaphylaxis.',
    imageSearch: {
      query: 'pediatric acute urticaria wheals antihistamine',
      label: 'Search Google Images for acute urticaria'
    },
    explanation: [
      'Explain that viral infections are the most common cause in children and that hives may last up to 4–6 weeks before labeling as chronic.'
    ],
    sources: [
      {
        label: 'AAAAI – Acute Urticaria Guidance',
        url: 'https://www.aaaai.org/conditions-treatments/library/allergy-library/urticaria-hives?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'hand-foot-mouth',
    title: 'Hand-Foot-Mouth Disease',
    shortLabel: 'HFMD',
    prompt: {
      lead: 'Vesicles and ulcers',
      text: 'Toddler with low fever, oral ulcers, and vesicles on palms and soles—what is the management plan?'
    },
    answerPoints: [
      {
        label: 'Diagnosis',
        text: 'Clinical features include oral ulcerations, vesicles or papules on hands, feet, buttocks, and occasional eczema coxsackium; consider daycare exposure during enterovirus season.'
      },
      {
        label: 'Testing',
        text: 'Typically clinical; PCR reserved for severe, atypical, or outbreak situations.'
      },
      {
        label: 'Management',
        text: 'Supportive care with hydration, age-appropriate analgesics, and soft foods. Exclude from daycare while febrile or drooling uncontrollably; monitor for dehydration or neurologic complications.'
      }
    ],
    answerSummary:
      'HFMD requires supportive care—prioritize hydration, analgesia, and infection control while reassuring families about the benign course.',
    imageSearch: {
      query: 'hand foot mouth disease child mouth ulcers vesicles',
      label: 'Search Google Images for hand foot mouth disease'
    },
    explanation: [
      'Educate on frequent handwashing and disinfecting surfaces to limit spread; most children recover within 7–10 days.'
    ],
    sources: [
      {
        label: 'CDC – Hand, Foot, and Mouth Disease',
        url: 'https://www.cdc.gov/hand-foot-mouth/about/index.html?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'erythema-migrans',
    title: 'Erythema Migrans (Lyme Disease)',
    shortLabel: 'Erythema migrans',
    prompt: {
      lead: 'Expanding rash',
      text: 'Child in an endemic area has an expanding annular plaque days after a tick bite—how do you respond?'
    },
    answerPoints: [
      {
        label: 'Recognition',
        text: 'Expanding erythematous plaque ≥5 cm with or without central clearing, often accompanied by fatigue, headache, or arthralgia; may lack the classic bull’s-eye appearance.'
      },
      {
        label: 'Testing',
        text: 'Early serology can be negative; do not delay treatment for classic erythema migrans. Consider testing if presentation is atypical or disseminated.'
      },
      {
        label: 'Management',
        text: 'Start empiric antibiotics per local guidelines (e.g., amoxicillin or doxycycline depending on age). Refer urgently for signs of neurologic, cardiac, or rheumatologic involvement.'
      }
    ],
    answerSummary:
      'In endemic regions treat classic erythema migrans empirically with appropriate antibiotics and monitor for systemic Lyme manifestations.',
    imageSearch: {
      query: 'pediatric erythema migrans lyme expanding rash',
      label: 'Search Google Images for erythema migrans'
    },
    explanation: [
      'Educate families on tick avoidance and prompt removal. Document baseline symptoms and follow-up to detect dissemination.'
    ],
    sources: [
      {
        label: 'CDC – Lyme Disease Clinical Care',
        url: 'https://www.cdc.gov/lyme/hcp/clinical-care/index.html?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'infantile-hemangioma',
    title: 'Infantile Hemangiomas',
    shortLabel: 'Hemangiomas',
    prompt: {
      lead: 'Growing vascular lesion',
      text: 'An infant develops a bright red plaque that grows rapidly—when do you reassure versus refer?'
    },
    answerPoints: [
      {
        label: 'Natural history',
        text: 'Appear in first weeks of life, proliferate during first 3–5 months, then slowly involute over years; ulceration risk is highest on lips, diaper area, and flexures.'
      },
      {
        label: 'Risk assessment',
        text: 'High-risk features: segmental distribution, facial lesions near eye or airway, large (>5 cm), ulcerated, or multiple cutaneous lesions (>5) suggesting hepatic involvement.'
      },
      {
        label: 'Management',
        text: 'Observe uncomplicated small lesions. High-risk hemangiomas require early referral; oral propranolol (2–3 mg/kg/day divided) is first-line therapy when treatment indicated. Wound care for ulceration and consider imaging for lumbosacral or airway involvement.'
      }
    ],
    answerSummary:
      'Most infantile hemangiomas involute without therapy—identify high-risk lesions early for propranolol and specialist care to prevent functional compromise.',
    imageSearch: {
      query: 'infantile hemangioma propranolol treatment infant',
      label: 'Search Google Images for infantile hemangiomas'
    },
    explanation: [
      'Early referral (by 1 month of age) improves outcomes for high-risk lesions. Monitor for propranolol side effects (bradycardia, hypoglycemia) and educate parents on dosing with feeds.'
    ],
    sources: [
      {
        label: 'AAP Clinical Practice Guideline for Infantile Hemangiomas (2019)',
        url: 'https://publications.aap.org/pediatrics/article/143/1/e20183475/37124/Clinical-Practice-Guideline-for-the-Management-of?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'vitiligo',
    title: 'Vitiligo (Childhood)',
    shortLabel: 'Vitiligo',
    prompt: {
      lead: 'Depigmented patches',
      text: 'School-age child with well-demarcated depigmented macules—what evaluation and therapy do you consider?'
    },
    answerPoints: [
      {
        label: 'Assessment',
        text: 'Document distribution (segmental vs non-segmental), rate of spread, Koebner phenomenon, and psychosocial impact; inquire about family history of autoimmunity.'
      },
      {
        label: 'Workup',
        text: 'Diagnosis is clinical aided by Wood’s lamp accentuation. Screen for thyroid disease or other autoimmune conditions when symptoms or family history suggest risk.'
      },
      {
        label: 'Management',
        text: 'Sun protection, topical corticosteroids or calcineurin inhibitors for limited areas, and narrowband UVB phototherapy for more extensive disease. Offer psychological support and consider camouflage cosmetics.'
      }
    ],
    answerSummary:
      'Vitiligo care centers on restoring pigment with topical or light therapy while screening for associated autoimmunity and supporting mental health.',
    imageSearch: {
      query: 'pediatric vitiligo wood lamp treatment options',
      label: 'Search Google Images for pediatric vitiligo'
    },
    explanation: [
      'Early treatment improves repigmentation potential. Discuss sun protection to prevent burns and contrast with unaffected skin.'
    ],
    sources: [
      {
        label: 'American Academy of Dermatology – Vitiligo Treatment',
        url: 'https://www.aad.org/public/diseases/a-z/vitiligo-treatment?utm_source=chatgpt.com'
      }
    ]
  }
];

export default {
  id: 'conditions',
  label: 'Condition Playbooks',
  cards
};
