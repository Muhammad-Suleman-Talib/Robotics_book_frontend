import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: '📚 Humanoid Robotics Books',
  tagline: 'A comprehensive guide to Physical AI and Humanoid Robotics.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  organizationName: 'Muhammad-Suleman-Talib', // Usually your GitHub org/user name.
  projectName: 'Robotics_book_frontend', // Usually your repo name.
  url: 'https://Muhammad-Suleman-Talib.github.io',
  baseUrl: '/Robotics_book_frontend/',

  onBrokenLinks: 'throw',

  clientModules: [require.resolve('./src/theme/Root.tsx')],

  plugins: ['docusaurus-plugin-search-local'],

  scripts: ['/js/theme.js'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
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
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'ROBOTICS_AI',
      logo: {
        alt: 'ROBOTICS_AI Logo',
        src: 'img/book_icon.png',
      },
      items: [
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'bookSidebar', // Will be defined in sidebars.ts
        //   position: 'left',
        //   label: 'Book',
        // },
        // {to: '/blog', label: 'Blog', position: 'left'}, // Keep blog for now, can remove later if not needed

        {
          href: 'https://github.com/muhammad-suleman-talib/humanoid_robotics_book',
          label: 'GitHub',
          position: 'right',
        },
         {
          type: 'custom-auth-navbar-item',
          position: 'right',
        },

        {
          type: 'search',
          position: 'right',
        }
        // Custom Auth Navbar Item
        // {
        //   type: 'custom-auth-navbar-item',
        //   position: 'right',
        // },
        // Custom Auth Navbar Item
       

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
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Built by Muhammad Suleman Full_Stack AI Developer.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },

  } satisfies Preset.ThemeConfig,
};

export default config;
