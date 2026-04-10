
  # APS Calculator Website

  This project is a web implementation of the APS Calculator flow (welcome, onboarding, calculate, results, university matching, and details) with the same visual direction and interaction style.

  Original design source:
  https://www.figma.com/design/qmiL7xNk0XMqONpc4n96an/APS-Calculator-Mobile-App

  ## Local development

  1. Install dependencies:

    npm install

  2. Start development server:

    npm run dev

  3. Build production assets:

    npm run build

  4. Preview production build locally:

    npm run preview

  ## Deployment

  ### Vercel

  The repository includes [vercel.json](vercel.json) to ensure SPA route rewrites (for example /matches or /university/3) correctly resolve to index.html.

  Deploy with Vercel CLI or by importing this repository into Vercel.

  ### Firebase Hosting

  This project is configured for Firebase Hosting with SPA rewrites to support routes like /matches and /university/3.

  1. Log in to Firebase CLI:

    npx firebase-tools login

  2. Link your Firebase project (first time only):

    npx firebase-tools use --add

  3. Deploy hosting:

    npm run deploy:firebase

  For preview channels:

    npm run deploy:firebase:preview
  