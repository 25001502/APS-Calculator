
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
  