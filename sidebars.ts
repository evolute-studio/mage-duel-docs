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
      label: "Unity Client",
      link: {
        type: "doc",
        id: "unity-client/intro",
      },
      items: [
        {
          type: "category",
          label: "1. Вступ",
          items: [
            "unity-client/introduction/overview",
            "unity-client/introduction/dependencies",
            "unity-client/introduction/initialization",
          ],
        },
        {
          type: "category",
          label: "2. Запуск і підключення",
          items: [
            "unity-client/connection/server-startup",
            "unity-client/connection/client-configuration",
          ],
        },
        {
          type: "category",
          label: "3. Структура клієнту",
          items: [
            "unity-client/structure/main-components",
            "unity-client/structure/entry-point",
          ],
        },
        {
          type: "category",
          label: "4. Обмін данних",
          items: [
            "unity-client/data-exchange/data-synchronization",
            "unity-client/data-exchange/data-filtering",
            "unity-client/data-exchange/server-functions-burner",
            "unity-client/data-exchange/server-functions-controller",
            "unity-client/data-exchange/server-models",
            "unity-client/data-exchange/client-models",
            "unity-client/data-exchange/server-events",
            "unity-client/data-exchange/client-events",
          ],
        },
        {
          type: "category",
          label: "5. Меню",
          items: ["unity-client/menu/menu-overview"],
        },
        {
          type: "category",
          label: "6. Сесія",
          items: [
            "unity-client/session/session-manager",
            "unity-client/session/board-manager",
            "unity-client/session/game-ui",
          ],
        },
        {
          type: "category",
          label: "7. Розгортання",
          items: [
            "unity-client/deployment/build-creation",
            "unity-client/deployment/build-launch",
            "unity-client/deployment/deployment",
          ],
        },
        {
          type: "category",
          label: "8. FAQ",
          items: ["unity-client/faq/faq"],
        },
      ],
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
