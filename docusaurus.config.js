// @ts-nocheck
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

// @ts-ignore
const lightCodeTheme = require("prism-react-renderer").themes.github;
// @ts-ignore
const darkCodeTheme = require("prism-react-renderer").themes.dracula;
//const lightCodeTheme = require('prism-react-renderer/themes/github');
//const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Welcome to Powerloom Docs!',
  // tagline: 'Powerloom Protocol is the Composable Data Network that empowers builders to unlock rich data applications within Web3. It makes building advanced innovative contract-based applications in DeFi and web3 gaming more straightforward.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.powerloom.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'powerloom', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve("./sidebars.js"),
          // docLayoutComponent: "@theme/DocPage",
          // docItemComponent: "@theme/ApiItem",
          //docLayoutComponent: "@theme/DocPage",
          // docItemComponent: "@theme/ApiItem",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/powerloom/docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),

    ],

  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },

      typesense: {
        // Replace this with the name of your index/collection.
        // It should match the "index_name" entry in the scraper's "config.json" file.
        typesenseCollectionName: 'powerloom',
  
        typesenseServerConfig: {
          nodes: [
            {
              host: 'localhost',
              port: 8108,
              protocol: 'http',
            },
          ],
          apiKey: 'xyz',
        },
  
        // Optional: Typesense search parameters: https://typesense.org/docs/0.24.0/api/search.html#search-parameters
        typesenseSearchParameters: {},
  
        // Optional
        contextualSearch: true,
      },
  

      languageTabs: [
        {
          highlight: "bash",
          language: "curl",
          logoClass: "bash",
        },
        {
          highlight: "javascript",
          language: "nodejs",
          logoClass: "nodejs",
        },
        {
          highlight: "python",
          language: "python",
          logoClass: "python",
        },
        {
          highlight: "go",
          language: "go",
          logoClass: "go",
        },
      ],
      // Replace with your project's social card
      image: 'img/powerloom-social-card-CDN.png',
      navbar: {
        title: 'Powerloom',
        logo: {
          alt: 'Powerloom',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/powerloom',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            label: 'Discord',
            href: 'https://discord.com/invite/powerloom',
          },
          {
            label: 'X(Twitter)',
            href: 'https://x.com/Powerloom',
          },
          {
            label: 'Telegram',
            href: 'https://t.me/powerloomhq',
          },
          {
            label: 'Blog',
            href: 'https://blog.powerloom.io',
          },
          {
            label: 'LinkedIn',
            href: 'https://www.linkedin.com/company/powerloom/',
          },
          {
            label: 'Website',
            href: 'https://powerloom.io/',
          },
          {
            label: 'Careers',
            href: 'https://careers.powerloom.io/'
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Powerloom Network (BVI) Ltd.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['solidity']
      },

    }),

  plugins: [
  ],

  future: {
    v4: {
      removeLegacyPostBuildHeadAttribute: true, // required
    },
    experimental_faster: {
      ssgWorkerThreads: true,
      rspackBundler: true,
      rspackPersistentCache: true,
    },
  },

  themes: [
    'docusaurus-theme-search-typesense'
  ]
};

module.exports = config;