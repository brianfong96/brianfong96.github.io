import { deckName, deckSections } from './deck-manifest.js';

function normalizeCard(card, categoryId) {
  return {
    ...card,
    categoryId,
    shortLabel: card.shortLabel || card.title
  };
}

function sortCards(cards) {
  return [...cards].sort((a, b) => {
    const aLabel = (a.shortLabel || a.title || '').toLocaleLowerCase();
    const bLabel = (b.shortLabel || b.title || '').toLocaleLowerCase();
    return aLabel.localeCompare(bLabel);
  });
}

async function loadSection(section) {
  try {
    const moduleUrl = new URL(section.module, import.meta.url);
    const module = await import(moduleUrl.href);
    const definition = module.default;

    if (!definition || !Array.isArray(definition.cards)) {
      console.warn(`Deck section "${section.id}" did not export a valid cards array.`);
      return null;
    }

    const sortedCards = sortCards(definition.cards).map((card) => normalizeCard(card, section.id));
    return {
      id: section.id,
      label: section.label || definition.label,
      cards: sortedCards
    };
  } catch (error) {
    console.error(`Unable to load deck section "${section.id}" from ${section.module}`, error);
    return null;
  }
}

export async function loadDeckData() {
  const resolvedSections = await Promise.all(deckSections.map((section) => loadSection(section)));
  const sections = resolvedSections.filter(Boolean);

  if (!sections.length) {
    throw new Error('No pediatric allergy & dermatology sections could be loaded.');
  }

  const flattenedCards = sections.flatMap((section) => section.cards);

  return {
    name: deckName,
    sections,
    cards: flattenedCards
  };
}
