import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Mage Duel",
  tagline: "A game about dueling mages",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://docs.mageduel.evolute.network/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          sidebarCollapsible: true,
          sidebarCollapsed: false,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //ditUrl:
          //  'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    //image: "img/docusaurus-social-card.jpg",
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: "Mage Duel",
      logo: {
        alt: "Mage Duel Logo",
        src: "img/logo.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "unityClientSidebar",
          position: "left",
          label: "Unity Client",
          to: "/docs/unity-client/intro",
          className: "navbar__item--unity-client",
        },
        {
          type: "docSidebar",
          sidebarId: "dojoServerSidebar",
          position: "left",
          label: "Dojo Server",
          to: "/docs/dojo-server/intro",
          className: "navbar__item--dojo-server",
        },
        {
          href: "https://github.com/evolute-studio",
          //label: "GitHub",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
        {
          href: "https://discord.gg/WJqjpEFhm3",
          //label: "Discord",
          position: "right",
          className: "header-discord-link",
          "aria-label": "Discord server",
        },
        {
          href: "https://x.com/evolute_studio",
          //label: "X",
          position: "right",
          className: "header-x-link",
          "aria-label": "X channel",
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["csharp"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
