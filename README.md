# OpenRPGF

![](./docs/screenshot.png)

## Deploying

### 1. Fork repo

[Fork OpenRPGF](https://github.com/gitcoinco/open-rpgf/fork)

1. Press `.env.example` in your newly created repo
2. Copy its contents and paste into a text editor

### 2. Create a Postgres database

https://vercel.com/dashboard/stores?type=postgres

1. Press Create Database button
2. Select Postgres, press continue, and give it a name and region
3. Press `.env.local` tab, Copy Snippet and paste into text editor

<div>
    <img width="45%" src="./docs/create_postgres.png">
    <img width="45%" src="./docs/create_postgres_details.png">
</div>

### 3. Create a WalletConnect Cloud account

https://cloud.walletconnect.com

1. Sign in or register for a new account
2. Create new Project
3. Copy ProjectId and paste into text editor

> Can we update the code to not require this step? Does Rainbowkit require WalletConnect?

<div>
    <img width="32%" src="./docs/walletconnect_create.png">
    <img width="32%" src="./docs/walletconnect_create2.png">
    <img width="32%" src="./docs/walletconnect_information.png">
</div>

### 3. Deploy to Vercel

https://vercel.com/new

1. Import the newly created repo
2. Open the Environment Variables panel
3. Select the first field and paste your variables from your text editor
4. Deploy!

<div>
<img width="45%" src="./docs/vercel_new.png">
<img width="45%" src="./docs/vercel_configure.png">
</div>

## Additional configuration

### Configure theme and metadata

Edit `tailwind.config.ts` and `src/config.ts`

_You can edit files directly in GitHub by navigating to a file and clicking the Pen icon to the right._

## Development

```sh
git clone https://github.com/gitcoinco/open-rpgf

bun install # (or pnpm / yarn / npm)

cp .env.example .env # and update .env variables

bun run dev

open localhost:3000
```

### Features

### EAS Types

- **Badgeholders** - Determines who are allowed to vote
- **Projects** - Registered projects
- **Approved Projects** - Approved projects and shown in the UI
- **Profiles** - Profile for projects and lists
- **Lists** - Collection of projects with a recommendation of vote allocations

### Technical details

- **EAS** - Projects, lists, profiles, etc are all stored on-chain in Ethereum Attestation Service
- **Batched requests with tRPC** - Multiple requests are batched into one (for example when the frontend requests the metadata for 24 projects they are batched into 1 request)
- **Server-side caching of requests to EAS and IFPS** - Immediately returns the data without calling EAS of ipfs.
- **SQL database for ballots** - Votes are stored privately in a Postgres database
