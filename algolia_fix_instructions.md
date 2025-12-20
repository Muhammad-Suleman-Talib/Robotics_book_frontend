It appears that the Algolia indexes 'humanoid_robotics_book' and 'docs' do not exist in your Algolia account. The Algolia search functionality in Docusaurus relies on having a properly configured index in your Algolia account with your site's content indexed into it.

To resolve this, please follow these steps:

1.  **Log in to your Algolia Account:** Go to the Algolia website and log in to your dashboard.
2.  **Verify/Create an Index:**
    *   Check if you have any existing indices that contain your Docusaurus documentation.
    *   If not, you will need to create a new index. You can name it something simple like `docusaurus_docs` or `robotics_book`.
3.  **Index Your Docusaurus Content:**
    *   Docusaurus typically uses a tool called `docusaurus-algolia-docsearch` to push your site's content to Algolia. This usually involves setting up an Algolia Crawler (recommended for continuous indexing) or running a script as part of your CI/CD pipeline (e.g., in your Vercel build process or GitHub Actions).
    *   You can find more detailed instructions on how to set this up in the official Docusaurus documentation for Algolia search.
4.  **Provide the Correct `indexName`:** Once you have a valid index with indexed content, please provide me with the exact `indexName` so I can update your `docusaurus.config.ts` file accordingly.

**Regarding the dark mode issue:**
We still have an pending change to fix the dark mode. We need to set `respectPrefersColorScheme: false` and remove the custom `theme.js` script. This will ensure that your site defaults to dark mode regardless of the user's system preferences. I will proceed with these changes as soon as you confirm the Algolia index name.