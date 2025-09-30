const cards = [
  {
    id: 'allergy-rhinitis',
    title: 'Allergic Rhinitis (± Conjunctivitis)',
    shortLabel: 'Allergic rhinitis',
    prompt: {
      lead: 'Clinic scenario',
      text: 'Child with seasonal sneezing, itching, and congestion—how do you confirm allergic rhinitis and control symptoms?'
    },
    answerPoints: [
      {
        label: 'History',
        text: 'Paroxysmal sneezing, nasal itching, clear rhinorrhea, and congestion with seasonal or perennial triggers; ask about sleep impact and associated atopy or conjunctival itching.'
      },
      {
        label: 'Exam',
        text: 'Allergic shiners, Dennie–Morgan lines, transverse nasal crease, pale or boggy turbinates, and watery, itchy eyes without purulence.'
      },
      {
        label: 'Testing',
        text: 'Diagnosis is clinical; order targeted skin-prick testing (SPT) or serum IgE only if the result will change management (e.g., candidacy for immunotherapy).'
      },
      {
        label: 'Management',
        text: 'Allergen avoidance and saline irrigation → daily intranasal corticosteroid; add second-generation oral or intranasal antihistamine for breakthrough symptoms. Consider short oral steroids for severe obstruction and refer for allergen immunotherapy when control remains poor.'
      }
    ],
    answerSummary:
      'Seasonal itch, sneeze, and congestion point to allergic rhinitis—treat with avoidance, saline, and daily intranasal steroids, layering on antihistamines or immunotherapy when needed.',
    imageSearch: {
      query: 'pediatric allergic rhinitis nasal crease turbinates',
      label: 'Search Google Images for allergic rhinitis findings'
    },
    explanation: [
      'Intranasal corticosteroids are the most effective monotherapy for allergic rhinitis, reducing mucosal inflammation and congestion. Assess trigger burden, reinforce adherence to spray technique, and monitor comorbid asthma or eczema for coordinated care.'
    ],
    sources: [
      {
        label: 'AAAAI/ACAAI Rhinitis Practice Parameter (2020)',
        url: 'https://www.jacionline.org/article/S0091-6749(20)31364-8/fulltext?utm_source=chatgpt.com'
      },
      {
        label: 'ARIA Care Pathways',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10046619/?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'allergy-food-ige',
    title: 'IgE-Mediated Food Allergy',
    shortLabel: 'Food allergy (IgE)',
    prompt: {
      lead: 'Rapid reaction',
      text: 'Minutes after peanut ingestion a child develops hives and vomiting—outline the diagnostic approach and long-term plan.'
    },
    answerPoints: [
      {
        label: 'History',
        text: 'Immediate (minutes to ≤2 hours) reproducible symptoms—urticaria, angioedema, wheeze, emesis, hypotension—after exposure to a specific food; review serving size, co-factors, and prior tolerance.'
      },
      {
        label: 'Exam',
        text: 'Normal between reactions; during an acute episode look for cutaneous, respiratory, gastrointestinal, or cardiovascular signs of anaphylaxis.'
      },
      {
        label: 'Testing',
        text: 'Order targeted SPT or serum specific IgE guided by history; component testing (e.g., Ara h 2 for peanut) clarifies risk. Oral food challenge remains the gold standard when history and testing conflict.'
      },
      {
        label: 'Management',
        text: 'Institute strict avoidance, provide an emergency action plan, and prescribe appropriate-dose epinephrine autoinjectors (0.1/0.15/0.3 mg by weight). Consider oral immunotherapy with an allergy specialist and re-evaluate regularly for tolerance (e.g., baked milk/egg ladders). Ensure nutrition support.'
      }
    ],
    answerSummary:
      'Confirm IgE food allergy with history-driven testing, equip families with epinephrine and avoidance strategies, and revisit tolerance under specialist supervision.',
    imageSearch: {
      query: 'child food allergy hives emergency action plan',
      label: 'Search Google Images for pediatric food allergy management'
    },
    explanation: [
      'Sensitization without clinical reactivity is common, so anchor testing to a compelling history. Education on label reading, cross-contact prevention, and when to use epinephrine reduces morbidity while families await potential tolerance.'
    ],
    sources: [
      {
        label: 'NIAID Guidelines for Food Allergy',
        url: 'https://www.niaid.nih.gov/diseases-conditions/guidelines-clinicians-and-patients-food-allergy?utm_source=chatgpt.com'
      },
      {
        label: 'AAAAI Food Allergy Practice Parameter',
        url: 'https://www.aaaai.org/practice-resources/statements-and-practice-parameters/food-allergy?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'anaphylaxis-acute',
    title: 'Anaphylaxis: Emergency Management',
    shortLabel: 'Anaphylaxis',
    prompt: {
      lead: 'Emergency',
      text: 'A child with peanut exposure develops hives, wheeze, and hypotension—detail the acute management steps.'
    },
    answerPoints: [
      {
        label: 'Recognition',
        text: 'Rapid-onset illness involving skin or mucosa plus respiratory compromise, hypotension, or severe gastrointestinal symptoms; anticipate biphasic reactions.'
      },
      {
        label: 'Immediate action',
        text: 'Administer intramuscular epinephrine 0.01 mg/kg (1 mg/mL) to the anterolateral thigh, max 0.3 mg for children; repeat every 5–15 minutes as needed.'
      },
      {
        label: 'Supportive care',
        text: 'Position supine with legs elevated, give high-flow oxygen, establish IV access for isotonic fluids, and add adjunctive therapies only after epinephrine (SABA for bronchospasm, H1/H2 antihistamines, corticosteroids).'
      },
      {
        label: 'Observation & discharge',
        text: 'Monitor at least 4–6 hours (longer if severe or high risk), then discharge with two epinephrine autoinjectors, a written action plan, and allergy referral.'
      }
    ],
    answerSummary:
      'Treat anaphylaxis with prompt IM epinephrine, supportive positioning and fluids, then observe before discharge with action plans and autoinjectors.',
    imageSearch: {
      query: 'anaphylaxis emergency pediatric epinephrine thigh injection',
      label: 'Search Google Images for pediatric anaphylaxis treatment'
    },
    explanation: [
      'Delays in epinephrine drive morbidity. Education on thigh injection technique, supine positioning, and recognizing biphasic reactions empowers families and first responders.'
    ],
    sources: [
      {
        label: 'World Allergy Organization Anaphylaxis Guidance 2020',
        url: 'https://www.worldallergy.org/resources/anaphylaxis?utm_source=chatgpt.com'
      },
      {
        label: 'AAAAI – Anaphylaxis Emergency Department Guidelines',
        url: 'https://www.aaaai.org/tools-for-the-public/conditions-library/allergies/anaphylaxis?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'urticaria-angioedema',
    title: 'Urticaria & Angioedema (Non-Anaphylactic)',
    shortLabel: 'Urticaria (chronic)',
    prompt: {
      lead: 'Clinic puzzle',
      text: 'Child with itchy wheals recurring for weeks—how do you evaluate and manage non-anaphylactic urticaria?'
    },
    answerPoints: [
      {
        label: 'History & triggers',
        text: 'Pruritic wheals lasting <24 hours per spot and migrating, often post-infectious; chronic if >6 weeks. Screen for physical triggers, medications, or autoimmune disease; ensure no systemic compromise.'
      },
      {
        label: 'Exam',
        text: 'Transient wheals or angioedema without respiratory distress or hypotension. Document absence of mucosal involvement suggestive of severe cutaneous adverse reactions.'
      },
      {
        label: 'Testing',
        text: 'Routine labs are unnecessary; pursue targeted workup (CBC, ESR/CRP, TSH) only if history suggests systemic disease or chronicity with red flags.'
      },
      {
        label: 'Management',
        text: 'Daily second-generation antihistamine at standard dose, uptitrating to fourfold dosing if needed. Short oral corticosteroid burst for severe flares. Avoid triggers and reserve epinephrine autoinjectors for patients with anaphylaxis risk.'
      }
    ],
    answerSummary:
      'Chronic urticaria hinges on high-dose second-generation antihistamines and minimal lab work unless the story points elsewhere.',
    imageSearch: {
      query: 'pediatric chronic urticaria wheals antihistamine',
      label: 'Search Google Images for pediatric urticaria'
    },
    explanation: [
      'Most pediatric chronic urticaria is idiopathic or post-viral. Educate families that lesions are fleeting and seldom dangerous, and escalate to omalizumab or cyclosporine only in refractory specialist-managed cases.'
    ],
    sources: [
      {
        label: 'EAACI Biologicals Guideline for Urticaria 2021',
        url: 'https://onlinelibrary.wiley.com/doi/10.1111/all.14859?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'allergic-asthma',
    title: 'Asthma – Allergic Phenotype',
    shortLabel: 'Asthma (allergic)',
    prompt: {
      lead: 'Wheezy child',
      text: 'Recurrent cough and wheeze triggered by allergens—how do you confirm allergic asthma and step therapy?'
    },
    answerPoints: [
      {
        label: 'History',
        text: 'Recurrent wheeze, cough, dyspnea, and nocturnal symptoms linked to viral infections, allergen exposure, exercise, or smoke; assess atopy and medication use.'
      },
      {
        label: 'Exam & testing',
        text: 'Often normal between flares; wheeze during exacerbation. Use spirometry with bronchodilator response ≥5–6 years and FeNO where available to characterize type 2 inflammation; allergy testing if results guide avoidance or biologics.'
      },
      {
        label: 'Management',
        text: 'Reliever: SABA or low-dose ICS–formoterol per age. Controller: start daily inhaled corticosteroid, stepping up to ICS–LABA or MART if poor control. Treat comorbid rhinitis, reinforce trigger reduction, spacer technique, asthma action plan, and yearly influenza vaccination.'
      }
    ],
    answerSummary:
      'Document variable airflow limitation with spirometry, control allergens, and escalate from daily ICS to combination therapy while reinforcing inhaler technique.',
    imageSearch: {
      query: 'pediatric asthma inhaler spacer education',
      label: 'Search Google Images for pediatric asthma management'
    },
    explanation: [
      'Allergic asthma shares pathways with rhinitis, so combined management improves outcomes. Frequent reliever use or exacerbations signal the need to step up therapy or assess adherence.'
    ],
    sources: [
      {
        label: 'GINA 2023 Pocket Guide',
        url: 'https://ginasthma.org/wp-content/uploads/2023/07/GINA-2023-Pocket-Guide-WMS.pdf?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'allergic-conjunctivitis',
    title: 'Allergic Conjunctivitis',
    shortLabel: 'Allergic conjunctivitis',
    prompt: {
      lead: 'Eye itch',
      text: 'Bilateral itchy, watery eyes without purulence—outline diagnosis and treatment.'
    },
    answerPoints: [
      {
        label: 'History & exam',
        text: 'Intense itching, tearing, mild lid edema, and conjunctival injection, often with concomitant rhinitis; vision remains normal and no purulent discharge.'
      },
      {
        label: 'Testing',
        text: 'Clinical diagnosis; allergy testing only when results will influence immunotherapy decisions.'
      },
      {
        label: 'Management',
        text: 'Allergen avoidance, cool compresses, lubricating drops, and topical antihistamine/mast-cell stabilizer drops. Reserve short topical ophthalmic steroids to an eye specialist for severe flares.'
      }
    ],
    answerSummary:
      'Allergic conjunctivitis presents with bilateral itchy, watery eyes—treat with avoidance, lubricants, and topical antihistamine/mast-cell stabilizers.',
    imageSearch: {
      query: 'allergic conjunctivitis child itchy watery eyes',
      label: 'Search Google Images for allergic conjunctivitis'
    },
    explanation: [
      'Avoid chronic vasoconstrictor drops. Address accompanying rhinitis and consider oral antihistamines for systemic relief.'
    ],
    sources: [
      {
        label: 'American Academy of Ophthalmology – Allergic Conjunctivitis PPP',
        url: 'https://www.aao.org/preferred-practice-pattern/allergic-conjunctivitis-ppp-2018?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'allergic-contact-dermatitis',
    title: 'Allergic Contact Dermatitis',
    shortLabel: 'Contact dermatitis',
    prompt: {
      lead: 'Delayed rash',
      text: 'Child develops a pruritic, well-demarcated rash 48 hours after wearing new earrings—what is the workup and management?'
    },
    answerPoints: [
      {
        label: 'Clues',
        text: 'Delayed (48–72 hour) pruritic erythema, papules, or vesicles at exposure sites (nickel, fragrances, neomycin); chronic cases show lichenification.'
      },
      {
        label: 'Testing',
        text: 'Consider patch testing when the allergen is unclear or dermatitis persists despite avoidance.'
      },
      {
        label: 'Treatment',
        text: 'Strict avoidance, mid-potency topical steroids for limited areas, emollients to restore barrier, and topical calcineurin inhibitors for sensitive sites (face, flexures).'
      }
    ],
    answerSummary:
      'Diagnose delayed contact dermatitis by exposure pattern, confirm with patch testing when needed, and manage with avoidance plus topical anti-inflammatories.',
    imageSearch: {
      query: 'pediatric allergic contact dermatitis nickel rash',
      label: 'Search Google Images for allergic contact dermatitis'
    },
    explanation: [
      'Education on hidden allergens (clothing fasteners, topical antibiotics) prevents recurrences. Widespread dermatitis may require a short oral steroid taper under supervision.'
    ],
    sources: [
      {
        label: 'American Contact Dermatitis Society – Pediatric Contact Dermatitis',
        url: 'https://www.contactderm.org/resources/pediatric?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'insect-sting-allergy',
    title: 'Insect Sting Allergy (Hymenoptera)',
    shortLabel: 'Sting allergy',
    prompt: {
      lead: 'Sting reaction',
      text: 'Child with large local swelling after a bee sting versus systemic hives—how do you differentiate and treat?'
    },
    answerPoints: [
      {
        label: 'History',
        text: 'Large local reactions cause swelling >10 cm that peaks at 24–48 hours; systemic reactions manifest as urticaria, respiratory compromise, or hypotension within minutes.'
      },
      {
        label: 'Testing',
        text: 'Order venom SPT or serum IgE only after systemic reactions or to guide immunotherapy; not indicated for isolated large local reactions.'
      },
      {
        label: 'Management',
        text: 'Local: cold compresses, oral antihistamines, short oral corticosteroid if severe. Systemic: prescribe epinephrine autoinjector, provide avoidance education, and refer for venom immunotherapy (>90% efficacy in preventing future anaphylaxis).'
      }
    ],
    answerSummary:
      'Differentiate benign large local swellings from systemic anaphylaxis—reserve venom testing and immunotherapy for systemic reactions while supplying epinephrine.',
    imageSearch: {
      query: 'hymenoptera sting allergy child swelling management',
      label: 'Search Google Images for insect sting allergy management'
    },
    explanation: [
      'Large local reactions seldom progress to anaphylaxis, so reassure families while reviewing signs of systemic involvement and the importance of prompt epinephrine use when indicated.'
    ],
    sources: [
      {
        label: 'AAAAI Practice Parameter: Stinging Insect Hypersensitivity (2017)',
        url: 'https://www.aaaai.org/Aaaai/media/MediaLibrary/PDF%20Documents/Practice%20and%20Parameters/Stinging-Insect-Allergy-2016.pdf?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'drug-allergy-immediate',
    title: 'Drug Allergy – Immediate Reactions',
    shortLabel: 'Drug allergy (immediate)',
    prompt: {
      lead: 'Medication reaction',
      text: 'A child labeled “penicillin allergic” developed hives within an hour of amoxicillin—what is the evidence-based approach?'
    },
    answerPoints: [
      {
        label: 'History',
        text: 'Clarify timing (minutes to <6 hours), symptoms (urticaria, angioedema, respiratory compromise), treatment received, and tolerance to related antibiotics; note that most reported penicillin allergies are not IgE mediated.'
      },
      {
        label: 'Risk stratification',
        text: 'Low-risk histories (isolated delayed rash, vague symptoms) are candidates for direct oral amoxicillin challenge; higher-risk presentations need penicillin skin testing followed by graded challenge.'
      },
      {
        label: 'Management',
        text: 'Avoid the culprit drug until evaluation. Document outcomes clearly to remove inaccurate allergy labels and expand antibiotic options.'
      }
    ],
    answerSummary:
      'Use history-based risk assessment, targeted testing, and supervised challenges to delabel inaccurate penicillin allergies and preserve first-line antibiotics.',
    imageSearch: {
      query: 'pediatric penicillin allergy evaluation oral challenge',
      label: 'Search Google Images for penicillin allergy testing'
    },
    explanation: [
      'True IgE-mediated penicillin allergy wanes over time; delabeling reduces broad-spectrum antibiotic use, resistance, and costs.'
    ],
    sources: [
      {
        label: 'AAAAI Penicillin Allergy Position Statement 2023',
        url: 'https://www.aaaai.org/Aaaai/media/Media-Library-PDFs/Allergist%20Resources/Statements%20and%20Practice%20Parameters/Penicillin-Allergy-Position-Statement.pdf?utm_source=chatgpt.com'
      },
      {
        label: 'CDC – IS IT REALLY A PENICILLIN ALLERGY?',
        url: 'https://www.cdc.gov/antibiotic-use/community/pdfs/penicillin-factsheet.pdf?utm_source=chatgpt.com'
      }
    ]
  }
];

export default {
  id: 'allergy-airway',
  label: 'Allergy & Airway Essentials',
  cards
};
