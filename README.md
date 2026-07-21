# Dutch Vocabulary Flashcards

A responsive Next.js + TypeScript flashcard app for English-speaking learners of Dutch. The included vocabulary is a small **CEFR-aligned demonstration dataset**, not official CEFR vocabulary.

## Features

- Choose A1, A2, B1, B2, C1, or C2 vocabulary.
- Flip cards to reveal English translations and example sentences.
- Pronounce Dutch words with the browser Web Speech API using `nl-NL` when available.
- Mark cards as Again, Learning, or Know and persist progress in `localStorage`.
- Progress dashboard with totals and per-level summaries.
- Previous, next, shuffle, restart-session, keyboard shortcuts, light/dark mode, and responsive layout.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Checks

```bash
npm run format
npm run lint
npm test
npm run build
```

## Limitations

- Vocabulary levels are demo classifications and should be replaced by a verified dataset for production use.
- Pronunciation depends on the user's browser and operating-system voices.
- Progress is local to one browser profile because there is no account system.

## Version two ideas

- Spaced-repetition scheduling.
- Larger sourced vocabulary sets.
- Search and category filters.
- Import/export progress.
- Listening and typing exercises.
