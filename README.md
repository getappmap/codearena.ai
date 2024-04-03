## Getting Started

Requirements:

- Node 20+
- Docker

Build the project:

```bash
yarn
```

Start the database and load the environment:

```bash
eval $(./dev.sh)
```

Verify the environment:

```bash
echo $DATABASE_URL
echo $PGPORT
```

Build and load the schema:

```bash
yarn prisma generate && yarn prisma db push
```

Load the fixture data:

```bash
yarn node prisma/loadFixtures.js
```

Now you can run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the
file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to
automatically optimize and load Inter, a custom Google Font.

## Deployment

The project is deployed automatically to Heroku by the GitHub Actions workflow.

Note that schema updates have to be pushed manually.
