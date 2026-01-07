---
description: How to deploy the Next.js application to GitHub Pages from scratch
---

This guide covers how to deploy the application manually or automatically.

### 1. Verification Checklist
Before deploying, ensure these configurations are correct:

**A. `package.json`**
- Ensure `"homepage"` is set to your GitHub Pages URL:
  ```json
  "homepage": "https://twochar.github.io/Human-AI-Survey",
  ```

**B. `next.config.ts`**
- Ensure `output: 'export'` is set.
- Ensure `basePath` is set correctly for production:
  ```typescript
  const repoName = '/Human-AI-Survey';
  const isProd = process.env.NODE_ENV === 'production';
  
  const nextConfig = {
    output: 'export',
    basePath: isProd ? repoName : '',
    images: { unoptimized: true }, // Required for GH Pages
    // ...
  };
  ```

### 2. Clean Deployment (Manual)
If you want to ensure a completely fresh build:

1. Clear previous build artifacts:
   ```bash
   rm -rf .next out
   ```
   
2. Install fresh dependencies (optional, but good for "from scratch"):
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Run the deploy script:
   // turbo
   ```bash
   npm run deploy
   ```
   *This commands runs `next build` and then pushes the `out` folder to the `gh-pages` branch.*

### 3. Automated Deployment (GitHub Actions)
If you prefer to let GitHub handle it:

1. Push your latest code to the `main` branch:
   ```bash
   git add .
   git commit -m "feat: ready for deploy"
   git push origin main
   ```

2. on GitHub.com:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment**, switch **Source** to **GitHub Actions**.
   - GitHub will detect the workflow file in `.github/workflows/nextjs.yml` and run it.

### 4. Troubleshooting 404s
If images or styles are missing:
- It is usually a `basePath` issue.
- Verify that image srcs use: `${process.env.NEXT_PUBLIC_BASE_PATH}/image.png`.
