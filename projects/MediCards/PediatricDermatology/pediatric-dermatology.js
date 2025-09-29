window.mediCardsDeck = {
  deckName: 'Pediatric Dermatology',
  cards: [
    {
      title: 'Atopic Dermatitis (Eczema)',
      shortLabel: 'Atopic dermatitis',
      question:
        '<strong>Presentation:</strong> Pruritic, xerotic patches that begin on infant cheeks/extensors and later favor flexures.<br><br>What is the skin-directed, stepwise treatment plan for a flare?',
      answer:
        '<ul><li>Daily lukewarm baths with gentle cleansers, followed by liberal emollients; consider wet wraps.</li><li>Topical anti-inflammatories by site/age: low-to-mid potency steroids, or calcineurin inhibitors for delicate areas.</li><li>Escalate to ruxolitinib 1.5% cream (≥2 years, non-immunocompromised) or other systemic therapy if refractory.</li><li>Add dilute bleach baths and targeted antimicrobials only when secondary infection is present.</li></ul>',
      explanation:
        '<p>Atopic dermatitis in children is usually clinical. Therapy begins with barrier repair and short lukewarm bathing, layering emollients immediately afterward. Match steroid potency to body site and age, reserving calcineurin inhibitors for the face, folds, and maintenance. Recent FDA action allows ruxolitinib cream down to age 2 in non-immunocompromised patients. Bacterial swabs and antibiotics are reserved for evident infection, while bleach baths help prevent recurrence. Escalate care for uncontrolled disease that impairs sleep, growth, or psychosocial wellbeing.</p>',
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
          label: 'FDA expands Opzelura approval to ages 2–11',
          url: 'https://www.managedhealthcareexecutive.com/view/fda-expands-approval-of-opzelura-cream-to-children-ages-2-to-11-with-atopic-dermatitis?utm_source=chatgpt.com'
        }
      ]
    },
    {
      title: 'Diaper Dermatitis',
      shortLabel: 'Diaper rash',
      question:
        '<strong>Presentation:</strong> Beefy erythema across convex diaper surfaces; satellite papules or pustules imply Candida.<br><br>Which bedside treatments are first-line, and when do you add medications?',
      answer:
        '<ul><li>Frequent diaper changes, open-air time, and thick zinc oxide or petrolatum barrier with every change.</li><li>Apply topical azole (miconazole or clotrimazole) if Candida is suspected.</li><li>Use a short course of low-potency steroid (hydrocortisone 1%–2.5%) for significant inflammation, avoiding stronger agents under occlusion.</li></ul>',
      explanation:
        '<p>Classic irritant diaper dermatitis spares the inguinal folds, whereas Candida involvement brings maceration and satellite lesions. Management centers on moisture control and barrier protection. A topical azole targets yeast when KOH or clinical cues point to Candida. Brief, low-potency topical steroids can calm inflammation but higher potencies risk atrophy under occlusion.</p>',
      sources: [
        {
          label: 'American Academy of Pediatrics – Diaper Rash',
          url: 'https://publications.aap.org/pediatriccare/article/doi/10.1542/aap.ppcqr.396155/1621/Diaper-Rash?utm_source=chatgpt.com'
        }
      ]
    },
    {
      title: 'Impetigo',
      shortLabel: 'Impetigo basics',
      question:
        '<strong>Presentation:</strong> Honey-colored crusts (nonbullous) or flaccid bullae.<br><br>How do you choose between topical and systemic therapy?',
      answer:
        '<ul><li>For limited lesions, prescribe topical mupirocin or retapamulin for 5 days.</li><li>Use oral therapy (e.g., cephalexin) when lesions are numerous, there is an outbreak, or systemic features exist; tailor to local MRSA prevalence.</li><li>Consider culture for outbreaks, treatment failure, or diagnostic uncertainty.</li></ul>',
      explanation:
        '<p>Impetigo is usually clinical, driven by <em>S. aureus</em> or group A strep. Localized disease responds well to topical agents, reducing systemic exposure. Multiple lesions, school outbreaks, or failure of topicals warrant an oral β-lactam, with MRSA-active choices when risk is high. While rare, families should be counseled about post-streptococcal glomerulonephritis as a delayed complication.</p>',
      sources: [
        {
          label: 'CDC – Clinical Guidance for Impetigo',
          url: 'https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/impetigo.html?utm_source=chatgpt.com'
        }
      ]
    },
    {
      title: 'Tinea Infections',
      shortLabel: 'Tinea patterns',
      question:
        '<strong>Presentation:</strong> Annular plaques with leading scale (corporis/pedis) or patchy alopecia with scale and kerion (capitis).<br><br>Which diagnostics and treatments are most reliable for kids?',
      answer:
        '<ul><li>Confirm with KOH scraping; send fungal culture for scalp disease or atypical cases.</li><li>Treat corporis/pedis with topical allylamine or azole; avoid steroid combinations.</li><li>For tinea capitis, prescribe systemic therapy (griseofulvin 20–25 mg/kg/day microsize for 6–8 weeks or weight-based terbinafine) plus antifungal shampoo to limit shedding.</li></ul>',
      explanation:
        '<p>Dermatophyte infections mimic eczema, so bedside microscopy is valuable. Topicals suffice for corporis/pedis but not capitis, where follicles harbor fungus. Griseofulvin remains effective, especially for <em>Microsporum</em>, while terbinafine is favored for <em>Trichophyton</em>. Adjunctive selenium sulfide or ketoconazole shampoo reduces spore transmission during the first two treatment weeks.</p>',
      sources: [
        {
          label: 'American Academy of Family Physicians – Common Tinea Infections',
          url: 'https://www.aafp.org/pubs/afp/issues/2008/0515/p1415.html?utm_source=chatgpt.com'
        }
      ]
    },
    {
      title: 'Scabies',
      shortLabel: 'Scabies essentials',
      question:
        '<strong>Presentation:</strong> Intense nocturnal pruritus with papules and burrows on wrists, finger webs, waistline, or scalp in infants.<br><br>Describe the recommended treatment course and household precautions.',
      answer:
        '<ul><li>Apply permethrin 5% cream to the entire body (include scalp/face in infants), leave on 8–14 hours, and repeat in 7 days; FDA-approved for ages ≥2 months.</li><li>Treat close contacts simultaneously and decontaminate linens and clothing (hot wash/dry or seal for 3 days).</li><li>Consider mineral oil scraping or dermoscopy for confirmation when the diagnosis is uncertain.</li></ul>',
      explanation:
        '<p>Clinical history of family-wide itch is often enough to begin therapy. Proper application includes finger/toe webs, under nails, and post-bath when skin is cool. Reinfection is common without simultaneous contact treatment and environmental precautions. Post-scabetic pruritus can persist for weeks—reassure families and manage with emollients or mild steroids.</p>',
      sources: [
        {
          label: 'CDC – Clinical Care of Scabies',
          url: 'https://www.cdc.gov/scabies/hcp/clinical-care/index.html?utm_source=chatgpt.com'
        }
      ]
    },
    {
      title: 'Molluscum Contagiosum',
      shortLabel: 'Molluscum',
      question:
        '<strong>Presentation:</strong> Umbilicated, skin-colored papules often clustered in atopic children.<br><br>When is active treatment indicated, and what are the options?',
      answer:
        '<ul><li>Watchful waiting is reasonable because lesions spontaneously resolve over months to years.</li><li>Treat when lesions are numerous, spreading, symptomatic, genital, or causing distress.</li><li>Clinic options include cantharidin (FDA-approved ≥2 years), curettage, cryotherapy, or other office-directed modalities.</li></ul>',
      explanation:
        '<p>Molluscum is benign yet bothersome, especially in children with atopic dermatitis who auto-inoculate through scratching. Shared decision-making helps decide between observation and procedures. When treating, protect surrounding skin, manage secondary eczema, and counsel on avoiding picking or sharing towels to prevent spread.</p>',
      sources: [
        {
          label: 'Texas Children’s – Molluscum Contagiosum Guidelines',
          url: 'https://www.texaschildrens.org/sites/default/files/uploads/molluscum%20contagiosum_0.pdf?utm_source=chatgpt.com'
        },
        {
          label: 'FDA – Ycanth (Cantharidin) Label',
          url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/212905s000lbl.pdf?utm_source=chatgpt.com'
        }
      ]
    },
    {
      title: 'Hand-Foot-Mouth Disease',
      shortLabel: 'HFMD',
      question:
        '<strong>Presentation:</strong> Low-grade fever, painful oral ulcers, and vesicles on hands, feet, and buttocks.<br><br>What supportive care guidance should families receive?',
      answer:
        '<ul><li>Encourage hydration and offer pain control (acetaminophen/ibuprofen as age-appropriate).</li><li>Reassure that most children may return to daycare/school once afebrile, feeling well, and drooling is controlled.</li><li>Viral testing is rarely needed; focus on symptomatic management.</li></ul>',
      explanation:
        '<p>HFMD is a self-limited enteroviral illness. The main risks are dehydration from painful stomatitis and discomfort-related sleep disruption. Educate caregivers about typical illness duration (7–10 days), hand hygiene, and red flags such as persistent fever, neurologic symptoms, or inability to maintain oral intake.</p>',
      sources: [
        {
          label: 'CDC – Hand, Foot, and Mouth Disease Overview',
          url: 'https://www.cdc.gov/hand-foot-mouth/about/index.html?utm_source=chatgpt.com'
        }
      ]
    },
    {
      title: 'Seborrheic Dermatitis (Cradle Cap)',
      shortLabel: 'Cradle cap',
      question:
        '<strong>Presentation:</strong> Greasy scale or crust on the infant scalp with minimal itch and a well-appearing baby.<br><br>Which home treatments do you recommend, and when do you escalate?',
      answer:
        '<ul><li>Advise gentle daily shampooing, softening scales with mineral oil or petrolatum, then brushing to lift debris.</li><li>If persistent or extensive, add ketoconazole 2% cream or shampoo.</li><li>Reassure families that the condition is benign and self-limited.</li></ul>',
      explanation:
        '<p>Cradle cap reflects sebaceous activity and Malassezia colonization in infants. Moisturizing the scalp before combing loosens adherent scale. Antifungal therapy is rarely necessary but effective for widespread or refractory disease. Lack of inflammation or systemic symptoms helps distinguish it from eczema or psoriasis.</p>',
      sources: [
        {
          label: 'HealthyChildren.org – What is Cradle Cap?',
          url: 'https://www.healthychildren.org/English/ages-stages/baby/bathing-skin-care/Pages/Cradle-Cap.aspx?utm_source=chatgpt.com'
        }
      ]
    },
    {
      title: 'Infantile Hemangioma',
      shortLabel: 'Infantile hemangioma',
      question:
        '<strong>Presentation:</strong> Rapidly growing vascular plaque/nodule in the first months of life.<br><br>Which lesions warrant early referral and what is the frontline therapy?',
      answer:
        '<ul><li>Refer urgently if the lesion threatens function (eye, airway), is ulcerated, large facial/segmental, or high risk for disfigurement.</li><li>Oral propranolol (2–3 mg/kg/day divided) is first-line for high-risk infantile hemangiomas per AAP guideline.</li><li>Topical timolol can be considered for small superficial lesions.</li></ul>',
      explanation:
        '<p>Infantile hemangiomas proliferate rapidly between 1 and 3 months; early risk stratification prevents functional compromise and scarring. Systemic propranolol, started ideally before 5 months of age, accelerates involution and minimizes complications. Imaging is reserved for segmental patterns, airway involvement, or when diagnosis is uncertain.</p>',
      sources: [
        {
          label: 'AAP Guideline – Management of Infantile Hemangiomas',
          url: 'https://publications.aap.org/pediatrics/article/143/1/e20183475/37268/Clinical-Practice-Guideline-for-the-Management-of?utm_source=chatgpt.com'
        }
      ]
    },
    {
      title: 'Acne (Preadolescent & Adolescent)',
      shortLabel: 'Acne plan',
      question:
        '<strong>Presentation:</strong> Comedones with inflammatory papules/pustules; evaluate for endocrine clues in prepubertal patients.<br><br>Outline the evidence-based treatment ladder.',
      answer:
        '<ul><li>Mild disease: topical benzoyl peroxide ± topical retinoid; add topical antibiotic only in combination with benzoyl peroxide.</li><li>Moderate to severe: continue topicals and add oral doxycycline or minocycline for limited courses.</li><li>Severe, scarring, or refractory cases: consider oral isotretinoin and dermatology referral.</li></ul>',
      explanation:
        '<p>Combination topical therapy targets follicular keratinization and inflammation. Oral antibiotics reduce inflammatory lesions but should be paired with benzoyl peroxide to deter resistance and limited to about 3 months. Hormonal modulation (combined oral contraceptives or spironolactone) supports female patients when age-appropriate. Early isotretinoin prevents scarring in nodulocystic acne.</p>',
      sources: [
        {
          label: 'JAAD – Guidelines for Acne Management',
          url: 'https://www.jaad.org/article/S0190-9622%2823%2903389-3/fulltext?utm_source=chatgpt.com'
        }
      ]
    },
    {
      title: 'Psoriasis (Pediatric)',
      shortLabel: 'Pediatric psoriasis',
      question:
        '<strong>Presentation:</strong> Well-demarcated erythematous plaques with silvery scale on scalp, trunk, and extensor surfaces.<br><br>What are the cornerstones of management for children?',
      answer:
        '<ul><li>Topical corticosteroids paired with vitamin D analogs; use calcineurin inhibitors for face/genitals.</li><li>Monitor for psoriatic arthritis symptoms and avoid prolonged high-potency steroid use.</li><li>Escalate to phototherapy or systemic agents for moderate-to-severe or refractory disease in collaboration with dermatology.</li></ul>',
      explanation:
        '<p>Pediatric psoriasis impacts quality of life and carries joint involvement risk. Combination topical regimens balance efficacy with steroid-sparing benefits. Persistent or widespread disease may require narrowband UVB, methotrexate, biologics, or other systemic therapy guided by specialists.</p>',
      sources: [
        {
          label: 'JAAD/NPF – Pediatric Psoriasis Guidelines',
          url: 'https://www.jaad.org/article/S0190-9622%2819%2932655-6/fulltext?utm_source=chatgpt.com'
        }
      ]
    },
    {
      title: 'Urticaria (Acute)',
      shortLabel: 'Acute urticaria',
      question:
        '<strong>Presentation:</strong> Transient, itchy wheals with or without angioedema; always assess for anaphylaxis.<br><br>How do you control symptoms and counsel families?',
      answer:
        '<ul><li>Start second-generation oral H1 antihistamines (cetirizine, loratadine, fexofenadine) and titrate to control.</li><li>Reserve short corticosteroid bursts for severe, refractory cases.</li><li>Administer intramuscular epinephrine immediately if anaphylaxis signs are present.</li></ul>',
      explanation:
        '<p>Acute urticaria often follows infections, foods, or medications and resolves within days to weeks. Non-sedating antihistamines are preferred for daytime use and can be dosed up to fourfold in older children under supervision. Educate caregivers about triggers, anaphylaxis warning signs, and the generally self-limited course.</p>',
      sources: [
        {
          label: 'AAP Pediatrics in Review – Urticaria, Angioedema, and Anaphylaxis',
          url: 'https://publications.aap.org/pediatricsinreview/article/41/6/283/35410/Urticaria-Angioedema-and-Anaphylaxis?utm_source=chatgpt.com'
        }
      ]
    },
    {
      title: 'Fast Diagnostic Clues',
      shortLabel: 'Rapid tests',
      question:
        '<strong>Scenario:</strong> You are triaging rashes in clinic.<br><br>Which quick tests help separate look-alike diagnoses?',
      answer:
        '<ul><li>KOH prep distinguishes dermatophyte infections from eczema or psoriasis.</li><li>Bacterial culture supports management of widespread or refractory impetigo.</li><li>Mineral oil scraping or dermoscopy can document scabies mites, eggs, or scybala.</li></ul>',
      explanation:
        '<p>Judicious bedside testing streamlines management without over-ordering labs. A KOH scraping highlights branching hyphae of tinea, while cultures refine antibiotic choice for impetigo. Although scabies remains a clinical diagnosis, identifying mites or ova helps families commit to thorough decontamination and simultaneous treatment of contacts.</p>',
      sources: [
        {
          label: 'AAFP – Diagnosis and Management of Tinea Infections',
          url: 'https://www.aafp.org/pubs/afp/issues/2014/1115/p702.html?utm_source=chatgpt.com'
        },
        {
          label: 'CDC – Clinical Guidance for Impetigo',
          url: 'https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/impetigo.html?utm_source=chatgpt.com'
        },
        {
          label: 'CDC – Clinical Care of Scabies',
          url: 'https://www.cdc.gov/scabies/hcp/clinical-care/index.html?utm_source=chatgpt.com'
        }
      ]
    }
  ]
};
