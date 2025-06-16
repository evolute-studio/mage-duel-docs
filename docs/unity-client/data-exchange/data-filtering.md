---
sidebar_position: 2
---

# Data Filtering

## Filtering Mechanisms

The main script that handles model filtering is `Assets/TerritoryWars/General/IncomingModelsFilter.cs`. Its principle is simple: when a model arrives at the client, it checks whether it relates to the player or the session they are currently in. If not - it is deleted. 

:::note
By default, all new models are allowed through
:::

The client has several states, and each state has its own filter:
```csharp
public enum ApplicationStates
{
    Initializing,
    Menu,
    MatchTab,
    SnapshotTab,
    Session,
    Leaderboard,
}
```