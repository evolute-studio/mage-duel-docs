---
sidebar_position: 3
---

# General Information

## Project Structure

- `Assets/Prefabs` - prefabs
- `Assets/Plugins/WebGL/Wrapper.jslib` - main jslib file that serves as a bridge between Unity Client and Next.js wrapper web app
- `Assets/Resources` - some configuration scriptable objects for characters, tile sprites
- `Assets/Scenes` - scenes, the main ones are StartScene, Menu, Session
- `Assets/Sprites` - sprites
- `Assets/TerritoryWars` - main codebase is here

## Main Scripts

- `EntryPoint` - manages initial client loading, account creation calls, data synchronization, state verification, etc.
- `DojoGameManager` - Contains logic for creating player and bot accounts, synchronization logic, etc.
- `GlobalContext` - Contains common structures, accessible as a singleton field of DojoGameManager. Contains SessionContext.
- `SessionContext` - Contains session information, all board data structures, players, etc. Accessible both through GlobalContext and SessionManager
- `SessionManager` - main script that manages the session, has a builder component. More details [here](../session/session-manager.md).
- `BoardManager` - responsible for tile placement, their storage, etc.
- `TileData` - main class for storing tile information.
- `TileSelector` - script that manages the process of placing local player tiles. Selection of possible positions, their display, tile placement call.
- `DojoLayer` - new script through which you can easily get dojo models and immediately convert them to client models.
- `EventHandler` - handles tracking dojo events and updating dojo models. Filters and converts to client events
- `GameUI` - main UI script in session
- `GameConfiguration` - game configuration
