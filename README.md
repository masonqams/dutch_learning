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

## Using it on iPhone

This repository now includes an installable iPhone-friendly Progressive Web App (PWA) setup. It is not a native App Store `.ipa`; native iOS distribution requires Xcode, Apple signing, and TestFlight/App Store deployment.

### If you only want to test it from your MacBook

1. Install dependencies and start the local server:

   ```bash
   npm install
   npm run dev
   ```

2. Open `http://localhost:3000` on your MacBook.

### To open it from your iPhone on the same Wi-Fi network

1. On your MacBook, find your local network IP address:

   ```bash
   ipconfig getifaddr en0
   ```

2. Start Next.js so other devices on your Wi-Fi can reach it:

   ```bash
   npm run dev -- --hostname 0.0.0.0
   ```

3. On your iPhone, open Safari and go to:

   ```text
   http://YOUR_MACBOOK_IP_ADDRESS:3000
   ```

   For example, if your MacBook IP is `192.168.1.25`, open `http://192.168.1.25:3000`.

4. In Safari, tap **Share** → **Add to Home Screen**. The app will appear on your iPhone Home Screen as **Dutch Cards**.

### For a permanent iPhone link

Deploy the app to a web host such as Vercel, then open the deployed HTTPS URL in iPhone Safari and use **Share** → **Add to Home Screen**. A hosted HTTPS deployment is the easiest way to use the app like an iPhone app without going through the App Store.

### QR code for iPhone testing

A QR helper page is included at `/iphone-install-qr.html`.

1. Start the app for your local Wi-Fi network:

   ```bash
   npm run dev -- --hostname 0.0.0.0
   ```

2. In a second terminal, print your iPhone test URLs:

   ```bash
   npm run iphone:qr
   ```

3. Open the printed **QR page** URL on your MacBook, such as:

   ```text
   http://192.168.1.25:3000/iphone-install-qr.html
   ```

4. Scan the QR code with your iPhone Camera app. The QR code opens the test app in Safari.

5. In iPhone Safari, tap **Share** → **Add to Home Screen** to install the test app as **Dutch Cards**.

Do not scan a QR code for `localhost`; on an iPhone, `localhost` means the iPhone itself, not your MacBook.
