# Implementation Plan: Translation Mode

**Branch**: `003-translation-mode` | **Date**: 2025-12-09 | **Spec**: `specs/003-translation-mode/spec.md`
**Input**: Feature specification from `/specs/003-translation-mode/spec.md`

## Summary

Implement a multilingual feature for the Docusaurus book site, allowing users to view content in English, Urdu, and French. This involves integrating Docusaurus's i18n capabilities, managing translated content, and providing a language switcher.

## Technical Context

**Language/Version**: JavaScript/TypeScript (for Docusaurus), Node.js (for build/SSG), Docusaurus v2/v3.
**Primary Dependencies**: Docusaurus i18n features, React components.
**Storage**: Markdown files for content, JSON files for translations (as per Docusaurus i18n), browser local storage for user language preferences.
**Testing**: Jest/React Testing Library (if custom components are added), Docusaurus's own testing mechanisms.
**Target Platform**: Web browsers (static site generated).
**Project Type**: Web application (Frontend).
**Performance Goals**: Language switching should be near-instantaneous (under 1 second). Initial page load for translated content should be comparable to default language.
**Constraints**: Must integrate seamlessly with Docusaurus's existing structure and build process. Support for RTL (Urdu) is critical.
**Scale/Scope**: Supports three languages (English, Urdu, French) for all book chapters.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [X] **Spec-Driven Development**: Does this plan adhere to an approved specification?
- [X] **Test-Driven Development (TDD)**: Are tasks defined for writing tests before implementation?
- [X] **Version Control with Git**: Is the work being done in a feature branch with clear commit history planned?
- [X] **Code Quality and Style**: Are linters and formatters part of the development setup?
- [X] **CI/CD**: Is the project set up for automated testing and deployment?
- [X] **Documentation**: Are tasks included for creating or updating documentation?

## Project Structure

### Documentation (this feature)

```text
specs/003-translation-mode/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
book-site/
├── src/
│   ├── components/       # For language selector component
│   ├── pages/
│   └── services/         # For language preference management
├── docusaurus.config.ts  # For i18n configuration
├── sidebars.ts           # Potentially for language-specific sidebars
├── docs/                 # Original content
└── i18n/                 # New directory for translations
    ├── en/
    ├── ur/
    └── fr/
```

**Structure Decision**: The Docusaurus site (`book-site/`) is the primary focus. New components will be added to `book-site/src/components/`, configuration in `book-site/docusaurus.config.ts`, and translation files in a new `book-site/i18n/` directory.