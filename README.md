<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally and understand the
student-facing quiz experience.

View your app in AI Studio: https://ai.studio/apps/drive/1SxQiCKx_pupn2E-LbXlsRcSFgfWFuyP3

## Features at a Glance

- **Guided quiz flow** – learners enter their name, receive a fresh set of
  questions, and can freely navigate or skip items until they are ready to
  submit.
- **Timed sessions** – each attempt runs on a 20-minute countdown with an
  automatic submission that marks unanswered questions incorrect, plus a subtle
  warning that flashes when only 2 minutes 30 seconds remain.
- **History tracking** – the latest 50 attempts are saved per device with the
  student’s name, score, and per-question details so they can review or resume
  later.
- **AI explanations** – every completed question offers an optional Gemini
  explanation that loads on demand inside an accessible dialog.

## Run Locally

**Prerequisites:** Node.js and a Gemini API key.

1. Install dependencies: `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local)
3. Run the app: `npm run dev`

## Helpful Commands

- `npm run build` – produce the production bundle used for deployment.
- `npx tsc --noEmit` – run a type check to validate the TypeScript codebase.
