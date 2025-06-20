---
sidebar_position: 2
---

# Launching the Build

To launch the build, you need the Next.js wrapper. You need to clone the repository with the web application:

https://github.com/evolute-studio/mage-duel-webgl.

## Moving the Build
Open the folder with the ready build that you created in the previous step, select and copy three folders:

- Build
- StreamingAssets

Open the `mage-duel-webgl/public` folder in the cloned repository and delete folders with the same names, then paste the copied files here.

## Build Version in Project

Open the file `mage-duel-webgl/components/UnityPlayer.tsx` and find in the **UnityPlayer** function `const version = "x.y.z"` and replace it with your version.

Also, for correct operation, you need to change the Service Worker version. It can be found at `mage-duel-webgl/public/sw.js`. At the beginning of the file, find `const CACHE` and change the cache version to yours.

## Environment Variables Setup

Open the file `mage-duel-webgl/.env.local` and set your server data:
```js title="mage-duel-webgl/.env.local"
NEXT_PUBLIC_RPC="http://localhost:5050" // local or slot katana 
NEXT_PUBLIC_TORII="http://localhost:8080" // local or slot torii
NEXT_PUBLIC_SLOT_PROJECT="KATANA" // during migration you can see the chain id name
NEXT_PUBLIC_GAME_ADDRESS="0x04202a9fbb17db7d04a92f3182cef8dd339a7aff995a9fd5fa04afd087cb69d6" // contract address
NEXT_PUBLIC_PLAYER_PROFILE_ADDRESS="0x04a1dc47e42dd54e5fbf54d7fe016900ebcfde4df06910457f7b6e15112707f3" // contract address
NEXT_PUBLIC_WORLD_ADDRESS="0x055a227da2ac221a6311ec2df35df5c6fc25b450696f6c68bb604c8c350d59b7" // world address
NEXT_PUBLIC_SLOT_DATA_VERSION=28 // when increased, automatically clears client data in storage
```

## Launch

First, install [pnpm](https://pnpm.io/installation). Then you need to install dependencies with the command:
```bash
pnpm install
```
After installing dependencies, you can launch the application with the command:
```bash
pnpm dev
```
Then go to the local address that was output in the terminal. (by default https://localhost:3000)
:::note
https connection is required for [Cartridge Controller]("https://cartridge.gg/controller") to work
:::
