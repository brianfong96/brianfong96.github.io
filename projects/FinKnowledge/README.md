# FinKnowledge Testing

FinKnowledge Testing is an interactive quiz that drills core market literacy concepts such as Bollinger Bands, RSI, valuation ratios, and options. The in-browser experience shuffles questions from a curated bank, tracks score and elapsed time, and provides dual-layer explanations—an "explain like I'm five" (ELI5) primer followed by a technical breakdown—to reinforce each concept.

> **Tip:** The hero copy at the top of [`index.html`](./index.html) mirrors the opening summary below so visitors get the same overview when browsing the deployed site or the GitHub README preview. Keep both in sync when you revise messaging.

## Summary (mirrors the hero panel)

Sharpen your trading intuition with rapid-fire questions. Launch a timed multiple-choice drill that pulls randomized prompts from a curated financial-markets question bank. Track your accuracy, uncover the rationale behind each answer, and get both plain-language and technical explanations to reinforce the concept.

## At-a-glance

- **Format:** Timed, single-session multiple choice quiz
- **Question source:** [`questions.js`](./questions.js) exports an array of prompt objects consumed by [`app.js`](./app.js)
- **Feedback:** Instant scoring, color-coded options, ELI5 + technical explanations
- **Styling:** Custom glassmorphism-inspired design maintained in [`styles.css`](./styles.css)

## File layout

```
FinKnowledge/
├── app.js          # Quiz flow logic (state, timing, rendering)
├── index.html      # Page shell and semantic layout for the project
├── questions.js    # Question bank data (prompts, choices, answers, explanations)
├── styles.css      # Component-level styling for the FinKnowledge experience
├── README.md       # This guide
└── AGENTS.md       # Contribution playbook for future agents
```

## Local preview

Open `projects/FinKnowledge/index.html` in any modern browser. Because the project is fully client-side, no additional tooling is required.

If you are working in a live dev server environment (e.g., `npm serve` or VS Code's Live Preview), ensure the server serves the project root so that relative paths like `questions.js` resolve correctly.

## Updating the question bank

1. Edit [`questions.js`](./questions.js).
2. Each question object must include:
   - `prompt`: the question text (string)
   - `options`: an array of answer strings (display order matches what users see)
   - `answerIndex`: the integer index of the correct option in `options`
   - `explanation`: an object with `eli5` and `technical` strings
3. Keep messaging consistent—ELI5 copy should be plain-language and one to two sentences; technical copy can be more detailed.
4. When you add, remove, or reorder questions, confirm the quiz still renders correctly by opening the page in a browser and running through at least one full session.

## Keeping the overview current

Whenever you change the quiz's purpose, scope, or major features:

- Update the hero text in [`index.html`](./index.html) **and** the summary in this README.
- Refresh any supporting imagery if the UI changes.
- Mention significant updates in the root project listing (`projects/index.html`) so visitors can discover the new experience.

## Contributing

See [`AGENTS.md`](./AGENTS.md) for conventions, coding guidelines, and expectations for future enhancements.
