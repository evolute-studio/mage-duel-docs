---
sidebar_position: 2
---

# Initialization

## Prerequisites

- Unity Editor: Unity 6 6000.1.3f1
- Dojo Unity SDK: v1.5.0d
- Dojo: v1.5.1
- Sozo: v1.5.1
- Katana: v1.5.3
- Torii: v1.5.5

## Links

- Unity client repository: https://github.com/evolute-studio/mage-duel-client.git
- Server repository: https://github.com/evolute-studio/mage-duel-onchain.git
- Web application repository: https://github.com/evolute-studio/mage-duel-webgl
- Dojo Engine documentation: https://dojoengine.org/

## Starting Local Server

First, install Dojo by following these [instructions](https://dojoengine.org/installation#installing-dojo-with-dojoup)

Clone the server repository and navigate to it:

```bash
git https://github.com/evolute-studio/mage-duel-onchain.git
cd mage-duel-onchain
```

Start katana:

```bash
katana --dev --dev.no-fee --http.cors_origins '*'
```

Next, you need to build, migrate contracts and models to local katana, and verify the world and contract addresses:

```bash
sozo build --unity
sozo migrate
sozo inspect
```

After running `sozo inspect`, you will get output like this. If the **Status** column shows **Synced** or **Updated** - congratulations, everything went correctly. If it shows **Created** - contracts and models are not on Katana.

![sozo_inspect_result](./img/1_sozo_inspect.png)

The highlighted world address needs to be inserted into the torii configuration file `torii_config_dev.toml`.
After that, you can start torii:

```bash
torii --config torii_config_dev.toml
```

Congratulations! The server is created, running, and ready to work!

## Client Configuration

After opening the Unity project, you need to find the startup scene `Assets/Scenes/StartScene.unity`.
Find the **EntryPoint** game object in the hierarchy, set the **Dojo Config** which is a scriptable object, where you need to enter your local server data:

- `World address`
- `Game contract address`
- `Player profile actions contract address`

:::note
You can get these addresses using the `sozo inspect` command
:::

Examples of other configurations can be found here: `Assets/TerritoryWars/DojoConfig/`

![client_connection_config](./img/2_client_connection_config.png)

All settings are ready, you can start playmode.
