import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  unityClientSidebar: [
    {
      type: "category",
      label: "Вступ",
      items: [
        "unity-client/introduction/overview",
        "unity-client/introduction/initialization",
        "unity-client/introduction/main-components",
      ],
    },
    {
      type: "category",
      label: "Обмін данних",
      items: [
        "unity-client/data-exchange/data-synchronization",
        "unity-client/data-exchange/data-filtering",
        "unity-client/data-exchange/models",
        "unity-client/data-exchange/events",
        "unity-client/data-exchange/server-functions-burner",
        "unity-client/data-exchange/server-functions-controller",
        
      ],
    },
    {
      type: "category",
      label: "Меню",
      items: ["unity-client/menu/menu-overview"],
    },
    {
      type: "category",
      label: "Сесія",
      items: [
        "unity-client/session/session-manager",
        "unity-client/session/board-manager",
        "unity-client/session/game-ui",
      ],
    },
    {
      type: "category",
      label: "Розгортання",
      items: [
        "unity-client/deployment/build-creation",
        "unity-client/deployment/build-launch",
        "unity-client/deployment/deployment",
      ],
    },
    {
      type: "category",
      label: "FAQ",
      items: ["unity-client/faq/faq"],
    },
  ],
  dojoServerSidebar: [
    {
      type: "category",
      label: "Dojo Server",
      link: {
        type: "doc",
        id: "dojo-server/intro",
      },
      items: ["dojo-server/installation"],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
