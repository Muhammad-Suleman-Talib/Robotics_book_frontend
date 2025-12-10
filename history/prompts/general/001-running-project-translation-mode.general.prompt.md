---
id: 001
title: Instructions for Running Project and Enabling Translation Mode
stage: general
date: 2025-12-09
surface: agent
model: (unknown)
feature: none
branch: (unknown)
user: (unknown)
command: run the project and translation mode come
labels: ["project-setup", "translation", "docusaurus"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - book-site/package.json
  - specs/003-translation-mode/spec.md
  - book-site/docusaurus.config.ts
tests: null
---

## Prompt

run the project and translation mode come

## Response snapshot

To run the project and access translation mode:

1.  Navigate to the `book-site` directory in your terminal.
2.  Run the command:
    ```bash
    npm run start
    ```
    This will start the Docusaurus development server, typically accessible at `http://localhost:3000`.
3.  Once the site is loaded, you should see a language selector in the navigation bar. This selector allows you to switch between English, Urdu, and French, enabling the translation mode.

## Outcome

- ✅ Impact: The user's request to run the project and enable translation mode was addressed by providing instructions on how to start the Docusaurus development server and utilize the built-in language selector for internationalization.
- 🧪 Tests: No new tests were created. The instructions provided are for manual verification by the user.
- 📁 Files: book-site/package.json, specs/003-translation-mode/spec.md, book-site/docusaurus.config.ts were inspected.
- 🔁 Next prompts: None, task completed.
- 🧠 Reflection: The i18n configuration in `docusaurus.config.ts` was key to understanding how translation mode is enabled.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Not applicable
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
