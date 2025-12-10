# Tasks for Dark and Light Mode Implementation

This document outlines the tasks required to implement the dark and light mode feature, as specified in `specs/dark-light-mode/spec.md` and planned in `specs/dark-light-mode/plan.md`.

## Phase 1: Setup

- [X] T001 Verify `book-site/src/css/custom.css` exists. If not, create it with basic theme variables.
- [X] T002 Verify `book-site/postcss.config.js` is correctly configured for Tailwind CSS.

## Phase 2: Foundational

- [X] T003 Ensure necessary Docusaurus theme context and hooks are available for use in components.

## Phase 3: User Story 1 - Toggle Theme (P1)

**Goal**: Implement a theme toggle mechanism, persist user preference, and visually adapt the main page to the selected theme.

### Tests

- [X] T004 Implement manual test plan for acceptance scenario 1: Verify theme toggle changes page theme.
- [X] T005 Implement manual test plan for acceptance scenario 2: Verify theme persists after refresh (dark mode).
- [X] T006 Implement manual test plan for acceptance scenario 3: Verify theme persists after refresh (light mode).

### Implementation

- [X] T007 [US1] Create `book-site/src/components/ThemeToggle/index.tsx` for the theme switch UI.
- [X] T008 [US1] Create `book-site/src/components/ThemeToggle/styles.module.css` for styling the toggle.
- [X] T009 [US1] Implement theme switching logic within `book-site/src/components/ThemeToggle/index.tsx` using Docusaurus theme hooks.
- [X] T010 [US1] Implement persistence of theme preference in `book-site/src/components/ThemeToggle/index.tsx` using local storage.
- [X] T011 [US1] Integrate `ThemeToggle` into the Docusaurus Navbar by creating `book-site/src/theme/NavbarItem/ThemeToggle/index.tsx`.
- [X] T012 [US1] Update `book-site/src/css/custom.css` with dark and light mode specific CSS variables and styles.
- [X] T013 [US1] Modify `book-site/docusaurus.config.ts` to configure Docusaurus theme settings for dark/light mode.
- [X] T014 [US1] Ensure `book-site/src/pages/index.tsx` (main page) correctly applies and reacts to theme changes.

## Phase 4: Polish & Cross-Cutting Concerns

- [X] T015 Verify visual consistency across different Docusaurus pages (docs, blog) in both dark and light modes.
- [X] T016 Review and update any relevant documentation regarding the new theme feature.
- [X] T017 Conduct a final round of manual testing to ensure all acceptance criteria and edge cases are handled.

## Dependencies

- Phase 1 tasks must be completed before Phase 2.
- Phase 2 tasks must be completed before Phase 3.
- All implementation tasks within User Story 1 (T007-T014) can be considered as part of a single deliverable for this user story.

## Parallel Execution Examples

- Tasks T004, T005, T006 (manual test plan creation) can be done in parallel.
- Tasks T007 and T008 (component creation and styling) can be done in parallel.
- Tasks T015 and T016 can be done in parallel.

## Implementation Strategy

The implementation will follow an MVP-first approach, focusing on completing User Story 1 to deliver core theme toggling functionality. Subsequent polish and cross-cutting concerns will be addressed once the primary user story is validated. Each task is designed to be independently testable where applicable, adhering to TDD principles for new components.