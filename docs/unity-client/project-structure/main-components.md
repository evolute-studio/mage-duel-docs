---
sidebar_position: 3
---

# Project Structure and Components

## Directory Structure

The project follows a standard Unity project structure with specific directories for different types of assets:

| Directory | Purpose |
|-----------|---------|
| `Assets/Prefabs` | Contains all prefabricated game objects |
| `Assets/Plugins/WebGL/Wrapper.jslib` | JavaScript bridge between Unity Client and Next.js wrapper |
| `Assets/Resources` | Configuration scriptable objects for characters and tile sprites |
| `Assets/Scenes` | Game scenes (StartScene, Menu, Session) |
| `Assets/Sprites` | All game sprites and textures |
| `Assets/TerritoryWars` | Main codebase location |

## Core Components

### Initialization and Management

#### EntryPoint
- **Purpose**: Manages initial client setup
- **Responsibilities**:
  - Client loading
  - Account creation
  - State verification

#### DojoGameManager
- **Purpose**: Core game management
- **Responsibilities**:
  - Player account creation
  - Bot account management
  - Data synchronization

### Context Management

#### GlobalContext
- **Access**: Through DojoGameManager singeltone
- **Contains**:
  - Common structures
  - SessionContext reference

#### SessionContext
- **Purpose**: Session data management
- **Access**: Through GlobalContext or SessionManager
- **Contains**:
  - Session information
  - Board data structures
  - Player data

#### SessionManagerContext
- **Purpose**: Session manager modules management
- **Access**: Through SessionManager
- **Contains**:
  - GameLoopManager
  - PlayersManager
  - JokerManager, ContestManager, etc.

### Game Logic

#### SessionManager
- **Purpose**: Session control
- **Features**:
  - Session lifecycle management
  - Builder component integration

#### BoardManager
- **Purpose**: Board management
- **Responsibilities**:
  - Tile placement
  - Tile storage
  - Board state management

### Tile System

#### TileData
- **Purpose**: Tile information storage
- **Type**: Main data class
- **Usage**: Core tile data structure

#### TileSelector
- **Purpose**: Tile placement management
- **Features**:
  - Position selection
  - Visual feedback
  - Placement validation
  - Tile placement execution

### Data and Event Handling

#### DojoLayer
- **Purpose**: Model management
- **Features**:
  - Dojo model retrieval
  - Client model conversion
  - Data transformation

#### EventHandler
- **Purpose**: Event management
- **Responsibilities**:
  - Dojo event tracking
  - Model updates
  - Event filtering
  - Client event conversion

### User Interface

#### GameUI
- **Purpose**: Session UI management
- **Scope**: Main UI controller for game sessions

#### GameConfiguration
- **Purpose**: Game settings management
- **Type**: Configuration container
