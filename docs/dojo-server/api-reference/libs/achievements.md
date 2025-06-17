# Achievements Trait

This document provides reference for the AchievementsTrait implementation used for tracking player accomplishments in Mage Duel.

## Overview

The AchievementsTrait provides functions to track and award achievements based on player actions during gameplay. It integrates with an external achievement store system and validates player eligibility.

---

## AchievementsTrait Implementation

### Structure Definition

```rust
#[generate_trait]
pub impl AchievementsImpl of AchievementsTrait {
    // Achievement tracking functions
}
```

---

## Achievement Functions

### `play_game`

Awards achievement for playing a game.

```rust
fn play_game(world: WorldStorage, player_address: ContractAddress)
```

**Parameters:**
- `world`: World storage instance
- `player_address`: Player's contract address

**Behavior:**
- Checks if player can receive achievements
- Awards progress for `Task::Seasoned` achievement
- Records timestamp of achievement

### `win_game`

Awards achievement for winning a game.

```rust
fn win_game(world: WorldStorage, player_address: ContractAddress)
```

**Parameters:**
- `world`: World storage instance  
- `player_address`: Player's contract address

**Behavior:**
- Checks if player can receive achievements
- Awards progress for `Task::Winner` achievement
- Records timestamp of achievement

### `build_road`

Awards achievements for road construction.

```rust
fn build_road(world: WorldStorage, player_address: ContractAddress, edges_count: u32)
```

**Parameters:**
- `world`: World storage instance
- `player_address`: Player's contract address
- `edges_count`: Number of edges in the completed road

**Behavior:**
- Checks if player can receive achievements
- Awards `Task::FirstRoad` for any road completion
- Awards `Task::RoadBuilder` if road has 7+ edges
- Validates non-zero player address

### `build_city`

Awards achievements for city construction.

```rust
fn build_city(world: WorldStorage, player_address: ContractAddress, edges_count: u32)
```

**Parameters:**
- `world`: World storage instance
- `player_address`: Player's contract address  
- `edges_count`: Number of edges in the completed city

**Behavior:**
- Checks if player can receive achievements
- Awards `Task::FirstCity` for any city completion
- Awards `Task::CityBuilder` if city has 10+ edges
- Validates non-zero player address

### `unlock_bandi`

Awards achievement for unlocking Bandi character.

```rust
fn unlock_bandi(world: WorldStorage, player_address: ContractAddress)
```

**Parameters:**
- `world`: World storage instance
- `player_address`: Player's contract address

**Behavior:**
- Checks if player can receive achievements
- Awards progress for `Task::Bandi` achievement

### `unlock_golem`

Awards achievement for unlocking Golem character.

```rust
fn unlock_golem(world: WorldStorage, player_address: ContractAddress)
```

**Parameters:**
- `world`: World storage instance
- `player_address`: Player's contract address

**Behavior:**
- Checks if player can receive achievements
- Awards progress for `Task::Golem` achievement

### `unlock_mammoth`

Awards achievement for unlocking Mammoth character.

```rust
fn unlock_mammoth(world: WorldStorage, player_address: ContractAddress)
```

**Parameters:**
- `world`: World storage instance
- `player_address`: Player's contract address

**Behavior:**
- Checks if player can receive achievements
- Awards progress for `Task::Mammoth` achievement

### `create_game`

Awards achievement for creating a game.

```rust
fn create_game(world: WorldStorage, player_address: ContractAddress)
```

**Parameters:**
- `world`: World storage instance
- `player_address`: Player's contract address

**Behavior:**
- Checks if player can receive achievements
- Awards progress for `Task::Test` achievement

### `can_recieve_achievement`

Validates if player is eligible to receive achievements.

```rust
fn can_recieve_achievement(world: WorldStorage, player_address: ContractAddress) -> bool
```

**Parameters:**
- `world`: World storage instance
- `player_address`: Player's contract address

**Returns:**
- `bool`: `true` if player can receive achievements, `false` otherwise

**Behavior:**
- Reads player data from world storage
- Checks if player has controller role (full account)
- Only controllers can receive achievements

---

## Achievement Types

Based on the function calls, the following achievements are tracked:

| Achievement | Task ID | Trigger | Requirements |
|-------------|---------|---------|--------------|
| Seasoned | `Task::Seasoned` | Playing a game | Complete any game |
| Winner | `Task::Winner` | Winning a game | Win any game |
| First Road | `Task::FirstRoad` | Building a road | Complete any road |
| Road Builder | `Task::RoadBuilder` | Building large road | Complete road with 7+ edges |
| First City | `Task::FirstCity` | Building a city | Complete any city |
| City Builder | `Task::CityBuilder` | Building large city | Complete city with 10+ edges |
| Bandi | `Task::Bandi` | Character unlock | Unlock Bandi character |
| Golem | `Task::Golem` | Character unlock | Unlock Golem character |
| Mammoth | `Task::Mammoth` | Character unlock | Unlock Mammoth character |
| Test | `Task::Test` | Game creation | Create any game |

---

## Usage Patterns

### Game Completion

```rust
// [Achivement] Seasoned
let mut world = self.world_default();
AchievementsTrait::play_game(world, player1_address);
AchievementsTrait::play_game(world, player2_address);

// [Achivement] Winner
if winner == Option::Some(1) {
    AchievementsTrait::win_game(world, player1_address);
} else if winner == Option::Some(2) {
    AchievementsTrait::win_game(world, player2_address);
}
```

### Component Completion

```rust
// When a road is completed
if component_type == ComponentType::Road {
    let edge_count = calculate_road_edges(component);
    AchievementsImpl::build_road(world, player_address, edge_count);
}

// When a city is completed
if component_type == ComponentType::City {
    let edge_count = calculate_city_edges(component);
    AchievementsImpl::build_city(world, player_address, edge_count);
}
```

### Character Unlocks

```rust
// When player unlocks new characters
match skin_id {
    0 | 1 => {}, // Default skin, no achievement => {},
    2 => AchievementsTrait::unlock_bandi(world, player_id), //[Achievements] Bandi skin
    3 => AchievementsTrait::unlock_golem(world, player_id), //[Achievements] Golem skin
    4 => AchievementsTrait::unlock_mammoth(world, player_id), //[Achievements] Mammoth skin
    _ => {},
    
}
```

### Game Management

```rust
// When player creates a new game
fn create_game(ref self: ContractState) {
    let mut world = self.world_default();

    let host_player = get_caller_address();
    
    // Game creating logic
    
    //[Achievements] Create game
    AchievementsTrait::create_game(world, host_player);
}
```

---

## Integration with External Systems

### Achievement Store

The trait uses an external achievement store system:

```rust
let store = StoreTrait::new(world);
store.progress(player_id, task_id, count: 1, time: time);
```

**Store Interface:**
- `StoreTrait::new(world)`: Creates store instance
- `store.progress(player_id, task_id, count, time)`: Records achievement progress

### Player System Integration

Achievement eligibility is tied to player roles:

```rust
let player: Player = world.read_model(player_address);
player.is_controller() // Only controllers receive achievements
```

---

## Validation Rules

### Player Eligibility

1. **Controller Role Required**: Only players with controller role can receive achievements
2. **Non-Zero Address**: Some functions validate non-zero player addresses
3. **Early Return**: Functions return early if player is ineligible

### Achievement Thresholds

1. **Road Builder**: Requires roads with 7+ edges
2. **City Builder**: Requires cities with 10+ edges
3. **Basic Achievements**: No special requirements beyond completion

---

## Common Operations

### Check Achievement Eligibility

```rust
if AchievementsImpl::can_recieve_achievement(world, player_address) {
    // Player can receive achievements
    award_achievement(world, player_address, task_id);
}
```

---

## Error Handling

### Silent Failures

All achievement functions use silent failure patterns:

```rust
if !Self::can_recieve_achievement(world, player_address) {
    return; // Silent return if ineligible
}
```

### Address Validation

Some functions include additional address validation:

```rust
if player_address.is_non_zero() {
    // Process achievement
}
```

---

## Best Practices

### Performance

1. **Early Returns**: Check eligibility first to avoid unnecessary processing
2. **Batch Operations**: Group related achievements when possible
3. **Minimal Storage**: Achievement data is handled by external store

### Security

1. **Role Validation**: Always check player controller status
2. **Address Validation**: Verify non-zero addresses where required
3. **Silent Failures**: Don't expose achievement eligibility to potential exploits

### Integration

1. **Consistent Timing**: Use `get_block_timestamp()` for all achievements
2. **Proper Conversion**: Convert addresses to felt252 for store compatibility
3. **External Store**: Delegate storage to dedicated achievement system