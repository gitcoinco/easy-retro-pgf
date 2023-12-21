# OpenRPGF

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcarlbarrdahl%2Fpokt-rpgf&env=POSTGRES_URL,POSTGRES_PRISMA_URL,POSTGRES_URL_NON_POOLING,POSTGRES_USER,POSTGRES_HOST,POSTGRES_PASSWORD,POSTGRES_DATABASE,NEXTAUTH_SECRET,NEXTAUTH_URL)

[Fork OpenRPGF](https://github.com/carlbarrdahl/pokt-rpgf/fork)

**TODO**

- Introduction text about this project
- Screenshots
- Deployment Loom video

### Deploying

#### 1. Create a Postgres database

https://vercel.com/dashboard/stores?type=postgres

#### 2. Configure the environment variables

https://vercel.com/dashboard

Navigate to your project and add the Environment variables found on the Settings tab

See `.env.example` for examples

#### 3. Configure theme and metadata

Edit `tailwind.config.ts` and `src/config.ts`

_You can edit files directly in GitHub by navigating to a file and clicking the Pen icon to the right._

### Development

```sh
git clone https://github.com/carlbarrdahl/pokt-rpgf

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
