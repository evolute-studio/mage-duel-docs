---
sidebar_position: 1
---

# Data Synchronization

## Overview

Data synchronization between the server and client is managed through a set of models and tools. This document describes the process of generating, managing, and accessing synchronized data.

## Model Generation

### Prerequisites
- Server build with Unity bindings generation
- Access to dojo project folder

### Generation Process
1. Run the following command in the dojo project:
```bash
sozo build --unity
```

### Generated Files Location
Generated models and contracts will be available at:
`mage-duel-onchain/bindings/unity`

### Client Integration
Move the generated scripts to the following client directories:
- `Assets/TerritoryWars/Models`
- `Assets/TerritoryWars/Contracts`

:::note
Custom events are not automatically generated. Create these scripts manually based on existing examples.
:::

## Core Components

### Dojo Unity SDK
The main synchronization is handled by two key components:

#### WorldManager
- **Purpose**: Client-side model storage
- **Functionality**: Local model retrieval
- **Location**: Part of Dojo Unity SDK

#### SynchronizationManager
- **Purpose**: Model and event synchronization
- **Functionality**: 
  - Model synchronization
  - Event handling
  - Query-based model retrieval
- **Location**: Part of Dojo Unity SDK

## Model Access

### DojoLayer
The `DojoLayer` static script provides methods for:
- Retrieving dojo models
- Converting to client models

For detailed information about models, see [Models Documentation](models.md).

### Implementation Example
Example of retrieving a client player model:

```csharp
public async Task<PlayerProfile> GetPlayerProfile(string playerId)
{
    // Check if model exists locally
    evolute_duel_Player player = WorldManager.EntityModel<evolute_duel_Player>(
        "player_id", 
        new FieldElement(playerId)
    );

    // Synchronize if not found
    if (player == null)
    {
        await SynchronizationMaster.SyncPlayer(new FieldElement(playerId));
        player = WorldManager.EntityModel<evolute_duel_Player>(
            "player_id", 
            new FieldElement(playerId)
        );
    }

    // Return default if still not found
    if (player == null)
    {
        return default;
    }

    // Convert to client model
    PlayerProfile profile = new PlayerProfile().SetData(player);
    return profile;
}
```

## Adding New Models

To add support for a new model, follow these steps:

1. **Create Query**
   - Add corresponding query in `DojoQueries` class

2. **Add Synchronization Method**
   - Implement method in `CustomSynchronizationManager`
   - Follow existing examples

3. **Create Client Model**
   - Location: `Assets/TerritoryWars/DataModels`
   - Purpose: Convert server data to client-friendly format

4. **Add Conversion Method**
   - Implement in `DojoLayer`
   - Create method following pattern: `await DojoLayer.NewMethod()`

:::warning
If a model is not visible, check [IncomingModelsFilter](data-filtering.md) for potential filtering rules.
:::
