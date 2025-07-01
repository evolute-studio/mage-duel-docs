# Quick Start Guide

Welcome to **Mage Duel** development! This guide will get you up and running with the onchain game in under 15 minutes. By the end, you'll have a local game instance running and understand how to make your first contribution.

## What is Mage Duel?

Mage Duel is a fully onchain strategic game where two mages compete to shape the world using magical power called "Evolute". Players build Cities, Roads, and Fields by placing tiles on a shared board, with the goal of controlling the most territory.

**Key Features:**
- 🔗 **Fully Onchain**: All game logic runs on Starknet using Cairo smart contracts
- 🎯 **Strategic Gameplay**: Territory control through tile placement and pattern matching
- 🎲 **Fair Randomness**: Blockchain-based entropy for unpredictable tile draws
- 📸 **Snapshots**: Games can be forked from any point in history
---

## Prerequisites

Before starting, make sure you have:

### Required Knowledge
- **Game Rules**: Read the [Mage Duel Playbook](https://evolute.notion.site/playbook) to understand the game mechanics, victory conditions, and tile placement rules
- **Cairo Basics**: Familiarity with Cairo syntax and concepts from the [Cairo Book](https://book.cairo-lang.org/) - especially chapters on structs, traits, and basic smart contract patterns
- **Dojo Framework**: Understanding of Dojo's Entity-Component-System (ECS) architecture from the [Dojo Overview](https://dojoengine.org/overview) - focus on Models, Systems, and World concepts

### Technical Requirements
- **Git** installed on your system
- **Rust** (latest stable version)
- Basic knowledge of command line operations
- Basic understanding of blockchain concepts

## Step 1: Install Required Tools

### Install Cairo and Dojo Toolchain

You can just use [Dojo installation guide](https://book.dojoengine.orginstallation).

### Verify Installation

After installation, you should have access to these tools:

```bash
# Verify installations
cairo --version
sozo --version
katana --version
torii --version
```

**Expected output should show version numbers for each tool.**

---

## Step 2: Clone and Build the Project

### Clone the Repository

```bash
git clone https://github.com/evolute-studio/mage-duel-onchain.git
cd mage-duel-onchain
```

### Build the Game Contracts

```bash
# Build all Cairo smart contracts
sozo build
```

**What this does:** Compiles all Cairo smart contracts defined in the project, including game logic, player models, and world systems.

---

## Step 3: Start Local Development Environment

### 1. Start the Local Blockchain Sequencer (Katana)

Open a new terminal and start Katana - your local Starknet sequencer:

```bash
katana --dev --dev.no-fee
```

**Keep this terminal running** - this is your local blockchain where the game will run.

**Expected output:**
```
2025-06-16T16:08:17.360511Z  INFO katana_core::backend: Genesis initialized



██╗  ██╗ █████╗ ████████╗ █████╗ ███╗   ██╗ █████╗
██║ ██╔╝██╔══██╗╚══██╔══╝██╔══██╗████╗  ██║██╔══██╗
█████╔╝ ███████║   ██║   ███████║██╔██╗ ██║███████║
██╔═██╗ ██╔══██║   ██║   ██╔══██║██║╚██╗██║██╔══██║
██║  ██╗██║  ██║   ██║   ██║  ██║██║ ╚████║██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝


PREDEPLOYED CONTRACTS
==================


...


ACCOUNTS SEED
=============
0
    
2025-06-16T16:08:17.379795Z  INFO katana_node: Starting node. chain=0x4b4154414e41
2025-06-16T16:08:17.383477Z  INFO rpc: RPC server started. addr=127.0.0.1:5050
```

### 2. Deploy the Game World

In your original terminal (in the project directory):

```bash
# Deploy all contracts to your local blockchain
sozo migrate
```

**Important:** Copy the World Address from the output! You'll need it for the next step.

**Expected output:**
```bash
🌍 World deployed at block 2 with txn hash: 0x0586...
⛩️ Migration successful with world at address 0x055a227da2ac221a6311ec2df35df5c6fc25b450696f6c68bb604c8c350d59b7
```

### 3. Start the Indexer (Torii)

Open another terminal and start Torii with your World Address:

```bash
# Replace <World Address> with the address from the previous step
torii --world <World Address>
```

**Expected output:**
```
2025-06-16T16:13:39.150936Z  INFO torii::relay::server: Relay peer id. peer_id=12D3KooWQnx2PmJNzg2nq9MnBvuPW8Exv6HnKh55MDxYBWKFFsJW
2025-06-16T16:13:39.202528Z  INFO torii:runner: Starting torii endpoint. endpoint=127.0.0.1:8080
2025-06-16T16:13:39.202566Z  INFO torii:runner: Serving Graphql playground. endpoint=127.0.0.1:8080/graphql
2025-06-16T16:13:39.202572Z  INFO torii:runner: Serving SQL playground. endpoint=127.0.0.1:8080/sql
2025-06-16T16:13:39.202575Z  INFO torii:runner: Serving MCP endpoint. endpoint=127.0.0.1:8080/mcp
2025-06-16T16:13:39.202578Z  INFO torii:runner: Serving World Explorer. url=https://worlds.dev/torii?url=127.0.0.1%3A8080%2Fgraphql
2025-06-16T16:13:39.202581Z  INFO torii:runner: Serving ERC artifacts at path path=/tmp/.tmpIQbXJS

...
```

---

## Step 4: Test the Game

Now let's verify everything works by running a complete game simulation using the predefined scripts.

### Run Game Simulation

The project includes convenient scripts in `Scarb.toml` that simulate a full game:

```bash
# Player 1 creates a game
scarb run create_game

# Player 2 joins the game (game starts automatically)
scarb run join_game

# Players make alternating moves
scarb run make_move1  # Player 1's move
scarb run make_move2  # Player 2's move

# Continue with more moves...
scarb run make_joker_move1 # Player 1's move using joker
scarb run make_joker_move1 # Player 2's move using joker

scarb run skip_move1 # Player 1 skipes move
scarb run skip_move2 # Player 1 skipes move

#Game finished after two skips
```

**What you should see:**
- Transaction hashes for each action
- Game state updates in the Katana terminal
- GraphQL events in the Torii terminal

### Verify with GraphQL

Visit [http://localhost:8080/graphql](http://localhost:8080/graphql) in your browser to explore the game state using the GraphQL playground.

**Try this query to see games:**
```graphql
query {
  evoluteDuelGameModels {
    edges{
      node{
        player
        status
        board_id{option Some}
        snapshot_id{option Some}
      }
    }
  }
}
```

---

## Step 5: Understanding the Project Structure

Now that you have the game running, let's understand how it's organized:

```
mage-duel-onchain/
├── src/
│   ├── libs/
│   │   └── achievements.cairo   # Lib that emits achievement events
│   ├── models/          # Game data structures
│   │   ├── game.cairo   # Core game state
│   │   ├── player.cairo # Player information
│   │   ├── scoring.cairo # Models for scsoring
│   │   └── skins.cairo   # Models for skins
│   ├── systems/         # Game logic contracts
│   │   ├── helpers/
│   │   │   ├── board.cairo # Board operations  
│   │   │   ├── city_scoring.cairo # Scoring logic for city edges
│   │   │   ├── road_scoring.cairo # Scoring logic for road edges
│   │   │   ├── tile_helpers.cairo # Tile types convertors
│   │   │   ├── union_find.cairo # Union Find algorithm
│   │   │   └── validation.cairo # Validation of tile placement
│   │   ├── game.cairo   # Game management
│   │   └── player_profile_actions.cairo # Player profile actions
│   ├── types/         # Game types
│   ├── utils/         # Game utils
│   ├── events.cairo        # Game events
│   └── lib.cairo        # Main module exports
├── Scarb.toml           # Project configuration & scripts
└── README.md            # Basic project information
```

### Key Concepts to Understand

1. **Models** (`src/models/`): Define the data structures stored onchain
2. **Systems** (`src/systems/`): Contain the business logic for game actions
3. **World**: The central contract that orchestrates all models and systems
4. **Sozo**: Tool for building and deploying Dojo projects
5. **Katana**: Local Starknet sequencer for development
6. **Torii**: Indexer that provides GraphQL API for game data

---

## Step 6: Make Your First Change

Let's make a simple change to understand the development workflow.

### 1. Modify a Model

Open `src/models/player.cairo` and change data type for player balance:

```rust
#[derive(Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub player_id: ContractAddress,
    pub username: felt252,
    pub balance: u64, // Changed from u32 to u64
    pub games_played: felt252,
    pub active_skin: u8,
    pub role: u8, // 0: Guest, 1: Controller, 2: Bot
}
```

### 2. Rebuild and Redeploy

```bash
# Rebuild the contracts
sozo build

# Redeploy with your changes
sozo migrate
```

### 3. Test Your Change

```bash
# Check balance of some player with updated data type
scarb run balance
```

**Congratulations!** You've made your first contribution to Mage Duel.

---

## Next Steps

Now that you have the basics working, here's what to explore next:

### 🧠 **Learn the Game Mechanics**
- Read the [Game Rules Playbook](https://evolute.notion.site/playbook)
- Understand how tile placement and scoring work
- Study the victory conditions

### 🎮 **Try the Live Game**
- Play online at [mageduel.evolute.network](https://mageduel.evolute.network/)
- Compare your local changes with the production version

### 🔧 **Explore the Architecture**
- [Matchmaking System](../main-concepts/matchmaking-system) 
- [Tile Structure](../main-concepts/tile-structure-explanation)
- [Board](../main-concepts/board-model-explanation)
- [Move Model and Event Sourcing](../main-concepts/move-model-explanation)
- [Scoring System](../main-concepts/scoring_documentation)
- [Snapshot](../main-concepts/snapshot_documentation)

---

## Troubleshooting

### Common Issues

**"sozo command not found"**
- Run `dojoup` to reinstall Dojo tools
- Restart your terminal after installation

**"katana connection failed"**
- Make sure Katana is running with `katana --dev --dev.no-fee`
- Check that port 5050 is not blocked

**"Migration failed"**
- Check if you followed [models upgrading guide](https://dojoengine.org/framework/models/upgrades)
- Try `sozo clean` to clear build artifacts
- Ensure you're in the project root directory

**"GraphQL not working"**
- Verify Torii is running with the correct World Address
- Check that port 8080 is available

### Getting Help

- **Discord**:
  - Join the [Evolute Discord](https://discord.gg/s7XXRGRwVw)
  - Join the [Dojo Community Discord](https://discord.gg/dojoengine)
- **GitHub Issues**: Report bugs in the [project repository](https://github.com/evolute-studio/mage-duel-onchain/issues)
- **Documentation**: Refer to the [official Dojo documentation](https://book.dojoengine.org/) and [Cairo Book](https://book.cairo-lang.org/)

---

## Summary

You now have a complete Mage Duel development environment running! Here's what you accomplished:

✅ Installed Cairo and Dojo development tools  
✅ Built and deployed the game locally  
✅ Ran a small game simulation  
✅ Made your first code modification  
✅ Verified everything works with GraphQL  

**Total time:** ~15 minutes
