# Bio Roaster 🔥

Bio Roaster turns an Instagram bio into a playful roast. It runs entirely in your browser using local rules and punchline templates—**no API key, account, backend, or paid service required**.

## Features

- Roasts common bio themes like dance, travel, coffee, fitness, creator titles, and overused phrases.
- Generates a fresh variation when you choose **Roast again**.
- Keeps your bio in the browser; it is not sent to a roast API or saved by this app.
- Responsive interface, character counter, keyboard submit, and copy button.
- Open source under the MIT License.

> The roast generator is rule-based, not an AI model. It uses a small collection of local patterns and templates, so its jokes are quick and predictable—and it never needs API tokens.

## Run locally

### Requirements

- Node.js 22 or newer
- npm

### Setup

```bash
git clone https://github.com/karthikkumar6/bio-roaster.git
cd bio-roaster
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). There is no `.env.local` setup and no secret to configure.

## Production build

```bash
npm run build
npm run start
```

To deploy, import the repository into Vercel or another Next.js host. No environment variables are needed.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

## Privacy

Roasts are generated in the browser. The app has no roast API route, analytics, database, or third-party AI service. Your bio stays in the current page session and disappears when you leave or refresh.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the small contribution guide. Pull requests that improve the local roast patterns, accessibility, or mobile experience are welcome.

## License

This project is available under the [MIT License](LICENSE).
