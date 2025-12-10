import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI & Humanoid Robotics book',
  tagline: 'A comprehensive guide to Physical AI and Humanoid Robotics.',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://muhammad-suleman-talib.github.io', // Keep for now, but Vercel will provide its own URL
  // Set the /<baseUrl>/ pathname under which your site is served
  // For Vercel deployment, it is typically '/'
  baseUrl: '/',

  // GitHub pages deployment config. These are not needed for Vercel.
  // organizationName: 'muhammad-suleman-talib',
  // projectName: 'humanoid_robotics_book',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".

  clientModules: [require.resolve('./src/theme/Root.tsx')],

  plugins: [ // plugins array
    [
      require.resolve('docusaurus-plugin-search-local'),
      {
        hashed: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'ROBOTICS_AI',
      logo: {
        alt: 'ROBOTICS_AI Logo',
        src: 'img/AUTHOR.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'bookSidebar', // Will be defined in sidebars.ts
          position: 'left',
          label: 'Book',
        },
        // {to: '/blog', label: 'Blog', position: 'left'}, // Keep blog for now, can remove later if not needed

        {
          href: 'https://github.com/muhammad-suleman-talib/humanoid_robotics_book',
          label: 'GitHub',
          position: 'right',
        },

        {
          type: 'search', // Add this line for search
          position: 'right', // You can change the position as needed (left, right)
        },
        {
          type: 'custom',
          position: 'right',
          component: '@site/src/theme/NavbarItem/ThemeToggle',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: { // Algolia configuration at the top level of themeConfig
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'YOUR_INDEX_NAME',
      contextualSearch: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
