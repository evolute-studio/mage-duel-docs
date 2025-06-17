# Player

This document provides comprehensive reference for the Player model and its associated functionality in the Mage Duel game.

## Overview

The Player model represents user profiles in the game system, tracking identity, statistics, account status, and customization options. It serves as the foundation for player management and authentication.

---

## Player Model

### Structure Definition

```rust
#[derive(Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub player_id: ContractAddress,
    pub username: felt252,
    pub balance: u32,
    pub games_played: felt252,
    pub active_skin: u8,
    pub role: u8, // 0: Guest, 1: Controller, 2: Bot
}
```

### Field Documentation

#### Primary Key
- **`player_id: ContractAddress`**
  - Unique identifier for the player
  - Uses the player's wallet/contract address
  - Primary key for database queries and lookups
  - Immutable once set

#### Identity & Customization
- **`username: felt252`**
  - Player's chosen in-game display name
  - Stored as `felt252` for efficient onchain storage
  - May have constraints on length and characters
  - Can potentially be updated by player

- **`active_skin: u8`**
  - Currently equipped skin or avatar identifier
  - References a skin ID from the game's cosmetic system
  - Allows players to customize their appearance
  - Value of `0` typically represents default/no skin

#### Game Statistics
- **`balance: u32`**
  - Current balance of in-game currency or points
  - Used for purchasing items, skins, or entry fees
  - Updated through gameplay rewards and transactions
  - Maximum value: 4,294,967,295 (2^32 - 1)

- **`games_played: felt252`**
  - Total number of games completed by the player
  - Incremented upon game completion (win or loss)
  - Used for experience calculation and matchmaking
  - Stored as `felt252` to support very large numbers

#### Account Management
- **`role: u8`**
  - Defines the player's account type and permissions
  - Three distinct roles with different capabilities:
    - **`0` - Guest**: Temporary or limited access account
    - **`1` - Controller**: Full access player account
    - **`2` - Bot**: Automated player for AI opponents

---

## Player Trait Implementation

### Trait Definition

```rust
#[generate_trait]
pub impl PlayerImpl of PlayerTrait {
    fn is_bot(self: @Player) -> bool {
        *self.role == 2
    }
    fn is_controller(self: @Player) -> bool {
        *self.role == 1
    }
    fn is_guest(self: @Player) -> bool {
        *self.role == 0
    }
}
```

### Helper Functions

#### `is_bot() -> bool`
**Purpose**: Determines if the player is an AI bot

**Returns**: `true` if player role is 2 (Bot), `false` otherwise

**Use Cases**:
- Applying different game logic for AI players
- Excluding bots from certain features or statistics
- Implementing bot-specific behaviors

**Example**:
```rust
let player: Player = world.read_model(player_address);
if player.is_bot() {
    // Handle AI player logic
    apply_bot_difficulty_settings();
} else {
    // Handle human player logic
    show_tutorial_hints();
}
```

#### `is_controller() -> bool`
**Purpose**: Checks if the player has full account privileges

**Returns**: `true` if player role is 1 (Controller), `false` otherwise

**Use Cases**:
- Granting access to premium features
- Allowing ranked gameplay
- Enabling social features like friend systems

**Example**:
```rust
let player: Player = world.read_model(player_address);
if player.is_controller() {
    // Grant full access
    enable_ranked_matches();
    enable_friend_system();
} else {
    // Limited access
    redirect_to_registration();
}
```

#### `is_guest() -> bool`
**Purpose**: Identifies guest accounts with limited access

**Returns**: `true` if player role is 0 (Guest), `false` otherwise

**Use Cases**:
- Applying usage limitations
- Prompting for account registration
- Restricting certain game modes

**Example**:
```rust
let player: Player = world.read_model(player_address);
if player.is_guest() {
    // Apply guest limitations
    limit_daily_games(3);
    show_registration_prompt();
} else {
    // Full access to game features
    enable_unlimited_play();
}
```

---

## Role System Details

### Role Hierarchy and Permissions

| Role | Value | Name | Permissions |
|------|-------|------|-------------|
| 0 | Guest | Limited trial access | Basic gameplay, limited games per day |
| 1 | Controller | Full player account | All features, ranked play, social features |
| 2 | Bot | AI opponent | Automated gameplay, testing scenarios |

### Role Transitions

**Guest → Controller**:
- Player completes registration process
- Verified wallet connection
- Profile completion

**Controller → Bot**:
- Administrative action only
- Used for creating AI opponents
- Typically irreversible

**Bot → Controller**:
- Not typically allowed
- Administrative override required
- Special circumstances only

---

## Usage Patterns

### Creating a New Player

```rust
let new_player = Player {
    player_id: caller_address,
    username: chosen_name,
    balance: 0,
    games_played: 0,
    active_skin: 0, // Default skin
    role: 0, // Start as guest
};
world.write_model(@new_player);
```

### Updating Player Statistics

```rust
// After game completion
let mut player: Player = world.read_model(player_address);
player.games_played += 1;
player.balance += match game_result {
    GameResult::Win => 100,
    GameResult::Loss => 25,
    GameResult::Draw => 50,
};
world.write_model(@player);
```

### Role-Based Feature Access

```rust
fn can_access_feature(player: @Player, feature: Feature) -> bool {
    match feature {
        Feature::BasicPlay => true, // All roles can play
        Feature::RankedPlay => player.is_controller(),
        Feature::TournamentPlay => player.is_controller(),
        Feature::BotTesting => player.is_controller() || player.is_bot(),
    }
}
```

### Player Profile Queries

```rust
// Get player profile
let player: Player = world.read_model(player_address);

// Check if player exists
let player_exists = match world.try_read_model(player_address) {
    Option::Some(player) => true,
    Option::None => false,
};

// Get multiple players
let mut players = ArrayTrait::new();
for address in player_addresses {
    let player: Player = world.read_model(*address);
    players.append(player);
}
```

---

## Integration with Other Systems

### Game System Integration

```rust
// Before starting a game
let player1: Player = world.read_model(player1_address);
let player2: Player = world.read_model(player2_address);

// Validate both players can play
assert!(can_start_game(@player1, @player2), 'Players cannot start game');

// Apply role-specific logic
if player1.is_bot() || player2.is_bot() {
    setup_bot_game_mode();
} else {
    setup_pvp_game_mode();
}
```

### Balance Management

```rust
// Deduct game entry fee
fn charge_entry_fee(player_address: ContractAddress, fee: u32) -> bool {
    let mut player: Player = world.read_model(player_address);
    
    if player.balance >= fee {
        player.balance -= fee;
        world.write_model(@player);
        true
    } else {
        false // Insufficient balance
    }
}

// Award game rewards
fn award_points(player_address: ContractAddress, points: u32) {
    let mut player: Player = world.read_model(player_address);
    player.balance += points;
    world.write_model(@player);
}
```

### Skin System Integration

```rust
// Equip new skin
fn equip_skin(player_address: ContractAddress, skin_id: u8) -> bool {
    let mut player: Player = world.read_model(player_address);
    
    // Verify player owns the skin
    if player_owns_skin(player_address, skin_id) {
        player.active_skin = skin_id;
        world.write_model(@player);
        true
    } else {
        false
    }
}
```

---

## Validation and Constraints

### Username Validation

```rust
fn is_valid_username(username: felt252) -> bool {
    // Check if username meets requirements
    // - Not empty
    // - Within length limits
    // - No forbidden characters
    // Implementation depends on felt252 encoding
    username != 0
}
```

### Role Validation

```rust
fn is_valid_role(role: u8) -> bool {
    role <= 2 // Only 0, 1, 2 are valid
}
```

---

This Player model serves as the foundation for user management in Mage Duel, enabling player identification, role-based access control, progression tracking, and customization features.