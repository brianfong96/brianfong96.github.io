# Contribution guide for FinKnowledge Testing

This file defines expectations for anyone modifying files within the `projects/FinKnowledge` directory (including nested folders). Please follow these rules when you touch code, content, or assets here.

## Project purpose
- Preserve the experience as a self-contained financial knowledge quiz with timed multiple-choice questions, score tracking, and dual-layer explanations (ELI5 + technical).
- Any additional features should enhance learning without introducing external dependencies or backend requirements.

## Coding conventions
- Keep **quiz flow logic** isolated in [`app.js`](./app.js). Do not reintroduce question data or static content into the logic file.
- Store question data exclusively in [`questions.js`](./questions.js). Each question object must contain `prompt`, `options`, `answerIndex`, and an `explanation` object with both `eli5` and `technical` strings.
- Prefer semantic HTML within [`index.html`](./index.html); avoid inline styles. Components should be styled via [`styles.css`](./styles.css).
- Maintain accessibility considerations (e.g., button semantics, ARIA labels, focus states).

## Documentation requirements
- When you change copy in the hero area of `index.html`, update the corresponding summary in [`README.md`](./README.md).
- Document any new features or workflow changes in `README.md` so GitHub visitors can understand the quiz without opening the code.
- If you add new assets (images, etc.), reference them with valid relative paths and confirm they render in the GitHub preview.

## Testing expectations
- After modifying logic or data, manually run through at least one quiz session to verify timing, scoring, and explanation rendering.
- Note in your final report which manual or automated checks you performed.

## Pull request notes
- Summaries should highlight user-facing changes (new questions, UX tweaks, bug fixes) and mention updates to documentation when applicable.
- Include screenshots when you alter visual presentation in a noticeable way.

Thanks for helping keep FinKnowledge Testing polished and consistent!
