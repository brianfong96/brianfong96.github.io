const cards = [
  {
    id: 'lesion-erythema',
    title: 'Lesion Type: Erythema',
    shortLabel: 'Erythema',
    prompt: {
      lead: 'Spot it',
      text: 'When you see a diffuse red patch on inflamed skin, what are you looking at and why does it matter?'
    },
    answerPoints: [
      {
        label: 'Definition',
        text: 'Blanchable redness from dilated superficial vessels signaling inflammation or irritation.'
      },
      {
        label: 'Clinical pearl',
        text: 'Track temperature, tenderness, and borders to distinguish cellulitis from eczema flare.'
      }
    ],
    answerSummary:
      'Erythema reflects superficial vasodilation from inflammation, so borders, warmth, and tenderness guide your differential.',
    imageSearch: {
      query: 'pediatric erythema skin lesion',
      label: 'Search Google Images for erythema examples'
    },
    explanation: [
      'Erythema is a primary lesion that reflects inflammatory vasodilation. In pediatrics it often accompanies eczema flares, drug eruptions, or cellulitis. Documenting borders and associated edema helps determine whether infection or dermatitis is more likely.'
    ],
    sources: [
      {
        label: 'DermNet – Primary skin lesions',
        url: 'https://dermnetnz.org/topics/primary-skin-lesions?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'lesion-papule',
    title: 'Lesion Type: Papule',
    shortLabel: 'Papule',
    prompt: {
      lead: 'Define it',
      text: 'What is a papule and how does it guide your pediatric dermatology workup?'
    },
    answerPoints: [
      {
        label: 'Definition',
        text: 'Solid, raised lesion under 1 cm; color ranges from skin-toned to erythematous.'
      },
      {
        label: 'Clinical pearl',
        text: 'Assess umbilication, scale, and distribution to separate inflammatory papules from infectious causes.'
      }
    ],
    answerSummary:
      'Papules are small solid bumps—surface changes such as umbilication or scale refine the differential.',
    imageSearch: {
      query: 'pediatric papule skin lesion example',
      label: 'Search Google Images for papules'
    },
    explanation: [
      'Papules represent dermal cellular infiltration or edema. In children, papular eruptions can signal eczema, viral exanthems, or arthropod reactions. Combine palpation with surface findings to narrow possibilities.'
    ],
    sources: [
      {
        label: 'DermNet – Primary skin lesions',
        url: 'https://dermnetnz.org/topics/primary-skin-lesions?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'lesion-vesicle',
    title: 'Lesion Type: Vesicle',
    shortLabel: 'Vesicle',
    prompt: {
      lead: 'Fluid clue',
      text: 'Which lesion is a tiny fluid-filled blister and where do you expect to see it in pediatrics?'
    },
    answerPoints: [
      {
        label: 'Definition',
        text: 'Small (under 1 cm) clear fluid-filled blister.'
      },
      {
        label: 'Clinical pearl',
        text: 'Common in acute eczema, varicella, and hand-foot-mouth disease—inspect for surrounding erythema or oral lesions.'
      }
    ],
    answerSummary:
      'Vesicles signal acute inflammation or viral infection, so distribution and mucosal findings steer management.',
    imageSearch: {
      query: 'pediatric vesicle blister skin',
      label: 'Search Google Images for vesicles'
    },
    explanation: [
      'Vesicles form when fluid collects between epidermal layers. Their presence shifts suspicion toward acute eczema flares, viral exanthems, or bullous impetigo. Always assess for pain, honey crust, or systemic symptoms to rule out infection.'
    ],
    sources: [
      {
        label: 'DermNet – Vesicles',
        url: 'https://dermnetnz.org/topics/blistering-diseases?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'lesion-plaque',
    title: 'Lesion Type: Plaque',
    shortLabel: 'Plaque',
    prompt: {
      lead: 'Shape check',
      text: 'What defines a plaque and which pediatric rashes form them?'
    },
    answerPoints: [
      {
        label: 'Definition',
        text: 'Raised, flat-topped lesion over 1 cm created by coalescing papules.'
      },
      {
        label: 'Clinical pearl',
        text: 'Look for plaques in psoriasis, nummular eczema, or tinea corporis with an active border.'
      }
    ],
    answerSummary:
      'Plaques reflect confluent papules—texture, border, and scale separate eczema from psoriasis or tinea.',
    imageSearch: {
      query: 'pediatric plaque skin lesion',
      label: 'Search Google Images for skin plaques'
    },
    explanation: [
      'Plaques often signal chronic inflammatory dermatoses. Sharply demarcated borders point to psoriasis, while annular plaques with trailing scale suggest tinea. Chronic scratching can convert papules into lichenified plaques.'
    ],
    sources: [
      {
        label: 'DermNet – Primary skin lesions',
        url: 'https://dermnetnz.org/topics/primary-skin-lesions?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'lesion-lichenification',
    title: 'Lesion Type: Lichenification',
    shortLabel: 'Lichenification',
    prompt: {
      lead: 'Chronic clue',
      text: 'What is lichenification and what does it reveal about disease timing?'
    },
    answerPoints: [
      {
        label: 'Definition',
        text: 'Thickened skin with exaggerated lines from chronic rubbing or scratching.'
      },
      {
        label: 'Clinical pearl',
        text: 'Signals long-standing atopic dermatitis or lichen simplex—ask about itch control and sleep disruption.'
      }
    ],
    answerSummary:
      'Lichenification equals chronic itch; address triggers and potent topical anti-inflammatories.',
    imageSearch: {
      query: 'lichenification chronic eczema child',
      label: 'Search Google Images for lichenification'
    },
    explanation: [
      'Chronic inflammation drives pruritus, thickening the epidermis and accentuating skin markings. Recognizing lichenification prompts escalation to medium-potency steroids, wet wraps, or systemic therapy if quality of life is impaired.'
    ],
    sources: [
      {
        label: 'DermNet – Lichenification',
        url: 'https://dermnetnz.org/topics/lichen-simplex?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'lesion-excoriation',
    title: 'Lesion Type: Excoriation',
    shortLabel: 'Excoriation',
    prompt: {
      lead: 'Scratch marks',
      text: 'How do you describe excoriations and what complications raise concern?'
    },
    answerPoints: [
      {
        label: 'Definition',
        text: 'Linear erosions from scratching that may crust or bleed.'
      },
      {
        label: 'Clinical pearl',
        text: 'Excoriations invite secondary infection—screen for impetigo, scabies, or poorly controlled itch.'
      }
    ],
    answerSummary:
      'Excoriations are self-inflicted breaks that raise infection risk; treat the itch and monitor for impetigo.',
    imageSearch: {
      query: 'excoriation scratching child skin',
      label: 'Search Google Images for excoriations'
    },
    explanation: [
      'Scratching disrupts the epidermal barrier, letting bacteria colonize and causing stinging. Address pruritus with topical anti-inflammatories and consider bleach baths when excoriations are widespread.'
    ],
    sources: [
      {
        label: 'DermNet – Excoriations',
        url: 'https://dermnetnz.org/topics/excoriation-skin-picking-disorder?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'lesion-crusting',
    title: 'Lesion Type: Crusting',
    shortLabel: 'Crusting',
    prompt: {
      lead: 'Surface change',
      text: 'What does crusting indicate and how is it formed?'
    },
    answerPoints: [
      {
        label: 'Definition',
        text: 'Dried serum, blood, or pus on the skin surface.'
      },
      {
        label: 'Clinical pearl',
        text: 'Honey-colored crusting suggests impetigo; thin serous crust follows vesicle rupture in eczema.'
      }
    ],
    answerSummary:
      'Crusts are dried exudate—color and distribution point to infection versus resolving dermatitis.',
    imageSearch: {
      query: 'honey crust impetigo child',
      label: 'Search Google Images for skin crusting'
    },
    explanation: [
      'Crusting forms when exudate dries over inflamed skin. Golden crusts prompt impetigo coverage, whereas serous crust in eczema signals acute weeping that still needs anti-inflammatory therapy.'
    ],
    sources: [
      {
        label: 'DermNet – Impetigo overview',
        url: 'https://dermnetnz.org/topics/impetigo?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'lesion-scaling',
    title: 'Lesion Type: Scaling',
    shortLabel: 'Scaling',
    prompt: {
      lead: 'Texture tell',
      text: 'What is scaling and why does it help separate eczema from fungal disease?'
    },
    answerPoints: [
      {
        label: 'Definition',
        text: 'Flakes of stratum corneum shed from the surface.'
      },
      {
        label: 'Clinical pearl',
        text: 'Diffuse fine scale fits eczema or seborrhea; leading-edge scale favors tinea corporis.'
      }
    ],
    answerSummary: 'Scale character directs your differential—diffuse versus annular edge matters.',
    imageSearch: {
      query: 'pediatric skin scaling example',
      label: 'Search Google Images for scaling lesions'
    },
    explanation: [
      'Scaling reflects abnormal keratinization or inflammation. Annular scaling with central clearing suggests tinea, while greasy scalp scale in infants suggests seborrheic dermatitis.'
    ],
    sources: [
      {
        label: 'DermNet – Scaling skin conditions',
        url: 'https://dermnetnz.org/topics/scaly-skin?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'lesion-erosion',
    title: 'Lesion Type: Erosion',
    shortLabel: 'Erosion',
    prompt: {
      lead: 'Surface loss',
      text: 'How do you recognize an erosion and what usually precedes it?'
    },
    answerPoints: [
      {
        label: 'Definition',
        text: 'Shallow loss of epidermis that typically heals without scarring.'
      },
      {
        label: 'Clinical pearl',
        text: 'Often follows vesicle or bulla rupture—watch for secondary infection in moist areas.'
      }
    ],
    answerSummary:
      'Erosions expose superficial dermis after blister rupture, so protect the barrier and monitor for infection.',
    imageSearch: {
      query: 'skin erosion after blister pediatric',
      label: 'Search Google Images for skin erosions'
    },
    explanation: [
      'Erosions result from partial epidermal loss and are common in eczema flares, impetigo, and hand-foot-mouth disease. Keeping the area clean and moist accelerates re-epithelialization.'
    ],
    sources: [
      {
        label: 'DermNet – Erosions and ulcers',
        url: 'https://dermnetnz.org/topics/erosions-and-ulcers?utm_source=chatgpt.com'
      }
    ]
  },
  {
    id: 'lesion-fissure',
    title: 'Lesion Type: Fissure',
    shortLabel: 'Fissure',
    prompt: {
      lead: 'Painful clue',
      text: 'What is a fissure and how does it influence management?'
    },
    answerPoints: [
      {
        label: 'Definition',
        text: 'Linear crack in thickened skin that can extend into the dermis.'
      },
      {
        label: 'Clinical pearl',
        text: 'Common in chronic lichenified eczema—aggressive moisturization and potent topical steroids reduce recurrence.'
      }
    ],
    answerSummary:
      'Fissures indicate chronic inflammation with barrier breakdown—restore moisture and control inflammation to heal them.',
    imageSearch: {
      query: 'skin fissure eczema child',
      label: 'Search Google Images for skin fissures'
    },
    explanation: [
      'Fissures form when thickened, dry skin splits under tension. Pain limits adherence to topical regimens, so incorporate occlusive therapy, wet wraps, and systemic options when needed.'
    ],
    sources: [
      {
        label: 'DermNet – Fissures',
        url: 'https://dermnetnz.org/topics/fissures?utm_source=chatgpt.com'
      }
    ]
  }
];

export default {
  id: 'lesion-vocabulary',
  label: 'Lesion vocabulary',
  cards
};
