---
sidebar_position: 1
---

# Data Synchronization

## General Information

Information on the server is stored in [models](models.md). To use them on the client, you need to generate C# scripts during server build, which is done like this:

```bash
sozo build --unity
```

The generated models and contracts will be located in the dojo project folder: `territory-wars-dojo/bindings/unity`.
The received scripts need to be moved to the client at the following paths:

- `Assets/TerritoryWars/Models`
- `Assets/TerritoryWars/Contracts`.

:::note
Custom events are not generated! These scripts are easiest to create by example.
:::

The main synchronization happens through two scripts from the **Dojo Unity SDK**:

- `WorldManager` - stores models on the client and has logic for their local retrieval
- `SynchronizationManager` - synchronizes models, events, has logic for retrieving models by query

## Getting a Model

To get the required model, you need to use the static script `DojoLayer`, which has a set of methods for retrieving **dojo models** and converting them to **client models**.

You can learn more about models [here](models.md).

Use the ready-made methods or add additional ones based on the existing examples.

For example, how to get a client player model:

```csharp
public async Task<PlayerProfile> GetPlayerProfile(string playerId)
{
    evolute_duel_Player player = WorldManager.EntityModel<evolute_duel_Player>("player_id", new FieldElement(playerId));
    if (player == null)
    {
        await SynchronizationMaster.SyncPlayer(new FieldElement(playerId));
        player = WorldManager.EntityModel<evolute_duel_Player>("player_id", new FieldElement(playerId));
    }
    if (player == null)
    {
        return default;
    }
    PlayerProfile profile = new PlayerProfile().SetData(player);
    return profile;
}
```

First, it will check if the required model is already on the client through **WorldManager**, if not - synchronization is performed.

More details on how to get a model that is not in the project:

- First, you need to create the corresponding **Query** in the **DojoQueries** class.
- Then in the **CustomSynchronizationManager** script, add a method following the example.
- It's advisable to create a corresponding **client model**, as some field types or data representations from the server are not convenient to use directly on the client. Client models are located in the folder: `Assets/TerritoryWars/DataModels`
- You need to create a corresponding conversion method in **DojoLayer**.
- Call the method `await DojoLayer.NewMethod()`.

Done!

:::warning
If you don't see your model, it might be filtered by [IncomingModelsFilter](data-filtering.md)
:::
