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
      label: "Introduction",
      items: [
        "unity-client/introduction/overview",
        "unity-client/introduction/initialization",
      ],
    },
    {
      type: "category",
      label: "Project Structure",
      items: [
        "unity-client/project-structure/main-components",
        "unity-client/core-mechanics/tile-placing",
        "unity-client/project-structure/menu", 
        "unity-client/project-structure/session"],
    },
    {
      type: "category",
      label: "Data Transfer",
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
      label: "Deployment",
      items: [
        "unity-client/deployment/build-creation",
        "unity-client/deployment/build-launch",
        //"unity-client/deployment/deployment",
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
      label: "Introduction",
      items: ["dojo-server/introduction/quick-start"],
    },
    {
      type: "category",
      label: "Main Concepts",
      items: [
        "dojo-server/main-concepts/matchmaking-system",
        "dojo-server/main-concepts/tile-structure-explanation",
        "dojo-server/main-concepts/board-model-explanation"
      ],
    },
    {
      type: "category",
      label: "API Reference",
      items: [
        "dojo-server/api-reference/overview", 
        {
          type: 'category',
          label: 'Libs',
          items: [
            "dojo-server/api-reference/libs/achievements", 
          ],
        },
        {
          type: 'category',
          label: 'Models',
          items: [
            "dojo-server/api-reference/models/game", 
            "dojo-server/api-reference/models/player", 
            "dojo-server/api-reference/models/union-find",
            "dojo-server/api-reference/models/shop"
          ],
        },
      ],
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
