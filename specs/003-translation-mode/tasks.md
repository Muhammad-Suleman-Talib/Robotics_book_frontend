# Tasks for Feature: Translation Mode

**Feature Branch**: `003-translation-mode`
**Created**: 2025-12-09
**Spec**: `specs/003-translation-mode/spec.md`
**Plan**: `specs/003-translation-mode/plan.md`

## Phase 1: Setup

- [x] T001 Initialize Docusaurus i18n configuration in `book-site/docusaurus.config.ts`
- [x] T002 Create base i18n directories for English, Urdu, and French in `book-site/i18n/`
- [x] T003 Generate initial translation files for basic Docusaurus elements (e.g., Navbar, Footer) for English, Urdu, and French within `book-site/i18n/`

## Phase 2: Foundational

### User Story 4: Language Selector (Priority: P1)

- [x] T004 [US4] Create a React component for the language selector in `book-site/src/components/LanguageSelector/index.tsx`
- [x] T005 [US4] Implement logic within the language selector to read and update Docusaurus i18n context in `book-site/src/components/LanguageSelector/index.tsx`
- [x] T006 [US4] Integrate the LanguageSelector component into the Docusaurus Navbar or a suitable global location in `book-site/src/theme/NavbarItem/index.tsx` (or similar)
- [x] T007 [US4] Implement a mechanism to persist selected language preference using browser local storage in `book-site/src/utils/languageStorage.ts`
- [x] T008 [US4] Apply appropriate styling for the language selector, including RTL support for Urdu, in `book-site/src/components/LanguageSelector/styles.module.css`
- [x] T009 [US4] Add a basic test for language preference persistence in `book-site/src/utils/__tests__/languageStorage.test.ts`
- [x] T010 [US4] Add a basic test for language selector component rendering in `book-site/src/components/LanguageSelector/__tests__/LanguageSelector.test.tsx`

## Phase 3: User Story 1: View Content in English (Priority: P1)

- [x] T011 [US1] Create a sample English translation file for an existing chapter (e.g., `intro.md`) in `book-site/i18n/en/docusaurus-plugin-content-docs/current/intro.md`
- [x] T012 [US1] Verify that Docusaurus correctly displays the English translated content when English is selected.

## Phase 4: User Story 2: View Content in Urdu (Priority: P1)

- [x] T013 [US2] Create a sample Urdu translation file for an existing chapter (e.g., `intro.md`) in `book-site/i18n/ur/docusaurus-plugin-content-docs/current/intro.md`
- [x] T014 [US2] Ensure Docusaurus configuration properly handles RTL for Urdu content in `book-site/docusaurus.config.ts`
- [x] T015 [US2] Verify that Docusaurus correctly displays the Urdu translated content with proper RTL layout when Urdu is selected.

## Phase 5: User Story 3: View Content in French (Priority: P2)

- [x] T016 [US3] Create a sample French translation file for an existing chapter (e.g., `intro.md`) in `book-site/i18n/fr/docusaurus-plugin-content-docs/current/intro.md`
- [x] T017 [US3] Verify that Docusaurus correctly displays the French translated content when French is selected.

## Final Phase: Polish & Cross-Cutting Concerns

- [x] T018 Document Docusaurus i18n setup and translation process in `docs/i18n_guide.md`
- [x] T019 Review all translated content for consistency and quality (manual task)
- [x] T020 Optimize loading of translation files for performance, if necessary (P)