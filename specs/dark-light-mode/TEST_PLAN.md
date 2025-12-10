# Manual Test Plan for Dark and Light Mode Feature

This document outlines the manual test steps for verifying the functionality of the dark and light mode feature as per `specs/dark-light-mode/spec.md`.

## User Story 1 - Toggle Theme (P1)

**Goal**: Implement a theme toggle mechanism, persist user preference, and visually adapt the main page to the selected theme.

### T004: Verify theme toggle changes page theme.

**Acceptance Scenario**: Given I am on the main page, When I click the theme toggle, Then the page's theme changes from light to dark (or dark to light).

**Steps**:
1. Navigate to the main page of the Docusaurus site (`http://localhost:3001/humanoid_robotics_book/` or equivalent).
2. Observe the initial theme (e.g., light mode with a white background).
3. Locate and click the theme toggle UI element (expected to be in the Navbar).
4. Verify that the page's visual theme changes (e.g., background becomes dark, text becomes light).
5. Click the theme toggle again.
6. Verify that the page's visual theme reverts to the original state.

### T005: Verify theme persists after refresh (dark mode).

**Acceptance Scenario**: Given the page is in dark mode, When I refresh the page, Then the page remains in dark mode.

**Steps**:
1. Navigate to the main page of the Docusaurus site.
2. If not already in dark mode, click the theme toggle to switch to dark mode.
3. Verify the page is in dark mode.
4. Refresh the browser page.
5. Verify that the page remains in dark mode after refresh.

### T006: Verify theme persists after refresh (light mode).

**Acceptance Scenario**: Given the page is in light mode, When I refresh the page, Then the page remains in light mode.

**Steps**:
1. Navigate to the main page of the Docusaurus site.
2. If not already in light mode, click the theme toggle to switch to light mode.
3. Verify the page is in light mode.
4. Refresh the browser page.
5. Verify that the page remains in light mode after refresh.
