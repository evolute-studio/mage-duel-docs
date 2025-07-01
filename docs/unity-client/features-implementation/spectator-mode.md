---
sidebar_position: 1
---

# Spectator mode

Spectator mode - a feature that allows other players who are not playing in a specific match to view it in real-time.

## Important

- players in spectator mode do not connect directly to the game, they simply track events and model changes for the selected board and display it to themselves.
- spectators have no control elements, only an exit to menu button

## Implementation steps

### Preparation

- implement logic for [model access](../data-exchange/data-synchronization.md#model-access).
- extend logic for [event processing](../data-exchange/events.md)
- check the **UnionFind** filter for model updates in **EventsHandler**
- create a simple OnGUI element for connecting to a board

### Implementation

- in **SessionManager** add appropriate flow for loading session in spectator mode
- best to split **GameLoopManager** into three classes:
  - base: GameLoopManagerBase
  - for player: GameLoopManagerPlayer
  - for spectator: GameLoopManagerSpectator
- adapt all other dependent scripts and systems

### UI

- create a point in Menu - **Live Games**
- create a system based on **MatchesTabController**

### Final

- polishing
- testing
