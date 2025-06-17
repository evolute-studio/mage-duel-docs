---
sidebar_position: 2
---

# Initialization

## Prerequisites

Before starting, ensure you have the following components installed:

| Component | Version |
|-----------|---------|
| Unity Editor | 6 6000.1.3f1 |
| Dojo Unity SDK | v1.5.0d |
| Dojo | v1.5.1 |
| Sozo | v1.5.1 |
| Katana | v1.5.3 |
| Torii | v1.5.5 |

## Repository Links

- [Unity Client](https://github.com/evolute-studio/mage-duel-client.git)
- [Server](https://github.com/evolute-studio/mage-duel-onchain.git)
- [Web Application](https://github.com/evolute-studio/mage-duel-webgl)
- [Dojo Engine Documentation](https://dojoengine.org/)

## Server Setup

### 1. Install Dojo

Follow the official [Dojo installation guide](https://dojoengine.org/installation#installing-dojo-with-dojoup) to install Dojo on your system.

### 2. Clone and Setup Server

```bash
git clone https://github.com/evolute-studio/mage-duel-onchain.git
cd mage-duel-onchain
```

### 3. Start Katana

Launch Katana with development settings:

```bash
katana --dev --dev.no-fee --http.cors_origins '*'
```

### 4. Build and Deploy

Execute the following commands in sequence:

```bash
# Build Unity-compatible contracts
sozo build --unity

# Deploy contracts to local Katana
sozo migrate

# Verify deployment status
sozo inspect
```

After running `sozo inspect`, verify the deployment status:
- **Synced** or **Updated**: Successful deployment
- **Created**: Contracts and models are not on Katana

![sozo_inspect_result](./img/1_sozo_inspect.png)

### 5. Configure and Start Torii

1. Copy the world address from the `sozo inspect` output
2. Insert it into `torii_config_dev.toml`
3. Start Torii:

```bash
torii --config torii_config_dev.toml
```

## Client Configuration

### 1. Open Unity Project

1. Open the Unity project
2. Navigate to `Assets/Scenes/StartScene.unity`

### 2. Configure Entry Point

1. In the hierarchy, locate the **EntryPoint** game object
2. In the Inspector, find the **Dojo Config** scriptable object
3. Configure the following addresses:
   - `World address`
   - `Game contract address`
   - `Player profile actions contract address`

:::note
All required addresses can be obtained using the `sozo inspect` command
:::

### 3. Additional Configuration

Reference configurations are available at: `Assets/TerritoryWars/DojoConfig/`

![client_connection_config](./img/2_client_connection_config.png)

### 4. Start Development

Once all configurations are complete, you can enter Play mode to begin development.
