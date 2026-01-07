This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Human-AI-Survey

## Deployment

This project is configured to be deployed to **GitHub Pages**.

### Prerequisite

Ensure you have access to the repository and have installed dependencies:

```bash
npm install
```

### Deploying Manually

You can deploy the application by running:

```bash
npm run deploy
```

This command will:
1. Build the application (`next build`).
2. Generate the static export in the `out/` directory.
3. Push the contents of `out/` to the `gh-pages` branch.

### GitHub Actions

A GitHub Actions workflow is also included in `.github/workflows/nextjs.yml`, which will attempt to build and deploy on every push to `main`. Ensure GitHub Pages is enabled in your repository settings (Settings > Pages) and set to source from "GitHub Actions".
