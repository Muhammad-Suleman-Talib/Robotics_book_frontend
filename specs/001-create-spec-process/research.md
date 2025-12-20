# Research for "Create Spec Process"

**Date**: 2025-12-13

## Research Findings

### 1. Python Version and Usage

*   **Decision**: Standardize on Python 3.11.
*   **Rationale**: The `process_book_page.py` script suggests some Python-based processing. Python 3.11 is a stable and widely supported version. Its role appears to be for custom content processing outside the main Docusaurus pipeline.
*   **Alternatives considered**: Python 3.9, 3.10. 3.11 was chosen for its modern features.

### 2. PowerShell Version and Usage

*   **Decision**: Require PowerShell 7.2 or higher.
*   **Rationale**: The project contains several `.ps1` scripts for automation (e.g., `create-new-feature.ps1`). PowerShell 7.2+ is cross-platform and has modern features that may be used by these scripts.
*   **Alternatives considered**: Windows PowerShell 5.1. PowerShell 7+ is preferred for its cross-platform nature.

### 3. Testing Framework

*   **Decision**: Implement Jest as the testing framework.
*   **Rationale**: Jest is the most common testing framework for React applications and is well-supported with Docusaurus. It will allow for unit and component testing.
*   **Alternatives considered**: Vitest, Mocha. Jest was chosen for its maturity and community support.

### 4. CI/CD Solution

*   **Decision**: Use GitHub Actions for CI/CD.
*   **Rationale**: Since the project is likely hosted on GitHub (given the `.git` directory), GitHub Actions is the most integrated solution. A workflow will be created to run `npm run build`, `npm run typecheck`, and any future test commands on each pull request. Vercel is already used for deployment (from `.vercel` directory), so the GitHub Action will trigger a Vercel deployment on merge to main.
*   **Alternatives considered**: GitLab CI, CircleCI. GitHub Actions is the most seamless choice.
