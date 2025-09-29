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

export async function loadDeckData() {
  const sections = [];

  for (const section of deckSections) {
    const module = await import(section.module);
    const definition = module.default;

    if (!definition || !Array.isArray(definition.cards)) {
      console.warn(`Deck section "${section.id}" did not export a valid cards array.`);
      continue;
    }

    const sortedCards = sortCards(definition.cards).map((card) => normalizeCard(card, section.id));
    sections.push({
      id: section.id,
      label: section.label || definition.label,
      cards: sortedCards
    });
  }

  const flattenedCards = sections.flatMap((section) => section.cards);

  return {
    name: deckName,
    sections,
    cards: flattenedCards
  };
}
