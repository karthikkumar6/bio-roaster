# Bio Roaster 🔥

Bio Roaster turns an Instagram bio into a playful, personal roast using OpenAI or Claude. Pick a provider, paste a bio, and get a short roast that responds to its details.

## Features

- OpenAI and Claude provider choices.
- Short roasts written in simple language and grounded in the bio's actual phrases.
- “Roast again” requests a fresh model response.
- 500-character input limit and a small per-IP request limit.
- Open source under the MIT License.

## Run locally

### Requirements

- Node.js 22 or newer
- npm
- An API key for OpenAI or Anthropic Claude

### Setup

```bash
git clone https://github.com/karthikkumar6/bio-roaster.git
cd bio-roaster
npm install
cp .env.example .env.local
```

Add **one** provider key to `.env.local`:

```dotenv
OPENAI_API_KEY=your_openai_key
```

Or use Claude:

```dotenv
ANTHROPIC_API_KEY=your_anthropic_key
```

Keep `.env.local` private. Never commit it or put a provider key in a `NEXT_PUBLIC_` variable. API requests are sent from the server, so the key is not included in browser code.

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), and select the provider whose key you configured.

## Deploy to Vercel

Import the repository into Vercel, then add either `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` under **Project Settings → Environment Variables**. Add it for Production (and Preview if wanted), save, and redeploy. Do not use the `NEXT_PUBLIC_` prefix. The page can be deployed without a key, but roasts will show a setup message until one is added.

The deployed app uses the configured provider's API balance. Set a usage limit in the provider dashboard before sharing the public link. The built-in per-IP limit is best-effort and is not a substitute for provider billing controls.

## Privacy

The selected provider receives the bio to create the roast. Bio Roaster does not save submitted bios in a database or log the text. The AI provider handles the request under its own terms and data policies. Do not paste a bio containing information you do not want to send to that provider.

## Tech stack

- Next.js App Router and route handlers
- React
- TypeScript
- Tailwind CSS
- OpenAI Responses API and Anthropic Messages API

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Contributions that improve roast quality, accessibility, or mobile experience are welcome.

## License

This project is available under the [MIT License](LICENSE).
