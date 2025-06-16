---
sidebar_position: 2
---

# Фільтрація данних

## Механізми фільтрації

Головний скрипт, який займається фільтрацією моделей це `Assets/TerritoryWars/General/IncomingModelsFilter.cs`. Його принцип простий, коли на клієнт приходить модель, перевіряється чи ствосується вона до гравця або сесії в якій він зараз. Якщо ні - видаляється. 

:::note
По дефолту всі нові моделі пропускаються
:::


В клієнта є декілька станів і на кожний стан свій фільтр:
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