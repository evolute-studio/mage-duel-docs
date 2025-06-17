# Matchmaking System Explanation

This document explains how the matchmaking system works in Mage Duel, based on the game contract implementation.

## Overview

Mage Duel uses a simple host-guest matchmaking system where one player creates a game and waits for another player to join. The system supports both regular games and games created from snapshots.

---

## Matchmaking Flow

### 1. Game Creation Phase

#### Regular Game Creation
```rust
fn create_game(ref self: ContractState)
```

**What happens:**
1. Player calls `create_game()` function
2. System checks if player is already in a game
3. If not in game, creates new `Game` model with:
   - `status: GameStatus::Created` (waiting for opponent)
   - `board_id: None` (board not created yet)
   - `snapshot_id: None` (not from snapshot)
4. Emits `GameCreated` event
5. Awards achievement for game creation

**Player State After Creation:**
- Status: `GameStatus::Created` 
- Waiting for another player to join
- No board exists yet

#### Snapshot Game Creation
```rust
fn create_game_from_snapshot(ref self: ContractState, snapshot_id: felt252)
```

**What happens:**
1. Player provides snapshot ID they want to play from
2. System reads snapshot data (original board, move number)
3. Creates new board by restoring state to snapshot point
4. Sets game status to `GameStatus::Created`
5. Links game to the newly created board and snapshot

**Key Difference:**
- Board is pre-created from historical state
- Game starts from middle of previous game
- Both players get same starting position

---

### 2. Game Joining Phase

```rust
fn join_game(ref self: ContractState, host_player: ContractAddress)
```

**Prerequisites for Joining:**
- Host must have `GameStatus::Created`
- Guest must not be in any active game
- Guest cannot join their own game
- Guest status must not be `Created` or `InProgress`

**What happens when someone joins:**

#### For Regular Games:
1. **Board Creation**: Creates new 8×8 board with:
   - Player1 (host) assigned to Blue side
   - Player2 (guest) assigned to Red side  
   - Each player gets 3 jokers (from rules)
   - Random initial edge configuration
   - First tile drawn from deck

2. **UnionFind Initialization**: Creates empty scoring structure

3. **Game State Update**:
   - Both players: `GameStatus::InProgress`
   - Both linked to same `board_id`

#### For Snapshot Games:
1. **Board Assignment**: Uses pre-created board from snapshot
2. **Player Assignment**: Guest becomes Player2 on existing board
3. **Game State Update**: Both players set to `InProgress`

**Events Emitted:**
- `GameStarted` with host, guest, and board_id

---

### 3. Game States

```rust
enum GameStatus {
    Created,             // Game created, waiting for opponent
    InProgress,          // Game active with both players
    Finished,            // Game completed
    Canceled,            // Game cancelled before completion
}
```

### State Transitions

```
Regular Flow:
None → Created (host creates) → InProgress (guest joins) → Finished (game ends)

Cancellation Flow:
Created → Canceled (host cancels before guest joins)
InProgress → Canceled (either player cancels during game)
```

---

## Matchmaking Rules

### Who Can Create Games
- Any player not currently in a game
- Players with `GameStatus::Finished` or `GameStatus::Canceled`
- Only one active game per player at a time

### Who Can Join Games  
- Players not in any active game
- Cannot join own created game
- Guest cannot have `Created` or `InProgress` status

### Game Cancellation
```rust
fn cancel_game(ref self: ContractState)
```

**Before Game Starts (Created state):**
- Host can cancel unilaterally
- Sets host status to `Canceled`
- No impact on other players

**During Active Game (InProgress state):**
- Either player can cancel
- Both players set to `Canceled` status
- Board marked as `GameState::Finished`
- Other player notified via event

---

## Practical Examples

### Scenario 1: Normal Matchmaking
```
1. Alice calls create_game()
   - Alice status: Created
   - Waiting for opponent

2. Bob calls join_game(Alice's address)
   - New board created
   - Alice: Blue side, status InProgress  
   - Bob: Red side, status InProgress
   - Game begins
```

### Scenario 2: Snapshot Matchmaking
```
1. Alice calls create_game_from_snapshot(snapshot_123)
   - Snapshot contains board state from move 15 of old game
   - New board created with that exact state
   - Alice status: Created
   - Waiting for opponent

2. Charlie calls join_game(Alice's address)  
   - Charlie assigned to existing board
   - Both start playing from move 15 state
   - Alice & Charlie: status InProgress
```

### Scenario 3: Cancellation Before Start
```
1. Alice calls create_game()
   - Alice status: Created

2. Alice calls cancel_game() (before anyone joins)
   - Alice status: Canceled
   - Alice can create new game
```

### Scenario 4: Cancellation During Game
```
1. Alice and Bob playing (both InProgress)

2. Alice calls cancel_game()
   - Alice status: Canceled
   - Bob status: Canceled  
   - Board marked finished
   - Neither can continue this game
```

---

## Key Design Decisions

### 1. One Game Per Player
- Players can only be in one game at a time
- Prevents confusion and resource conflicts
- Simple state management

### 2. Host-Guest Model
- Clear roles: host creates, guest joins
- Host controls game creation parameters
- Guest chooses which game to join

### 3. Immediate Board Creation for Snapshots
- Snapshot games pre-create board during `create_game_from_snapshot`
- Regular games create board during `join_game`
- Enables validation of snapshot before matchmaking

### 4. Symmetric Cancellation
- Either player can cancel active game
- Both players affected equally
---

## Integration Points

### With Player System
- Game completion updates player statistics
- Balance rewards distributed after games

### With Achievement System  
- Game creation triggers achievements
- Game completion and wins tracked
- Only controller players receive achievements

### With Board System
- Matchmaking triggers board creation
- UnionFind scoring initialized with new boards

---

## Error Handling

### Common Rejection Scenarios

**create_game() fails when:**
- Player already has `Created` or `InProgress` status
- Emits `GameCreateFailed` event

**join_game() fails when:**
- Host doesn't have `Created` status
- Guest has `Created` or `InProgress` status  
- Trying to join own game
- Emits `GameJoinFailed` event

**cancel_game() scenarios:**
- Always succeeds for the caller
- May affect opponent if game is `InProgress`
- Emits `GameCanceled` events

---

## Summary

The matchmaking system is designed for simplicity and reliability:

1. **Simple States**: Clear progression from Created → InProgress → Finished
2. **One-to-One Matching**: Direct host-guest pairing, no queues
3. **Flexible Start Points**: Support both new games and snapshot replays  
4. **Symmetric Rules**: Both players have equal capabilities once matched
5. **Clean Cancellation**: Either player can exit, both are affected

This creates a straightforward but effective matchmaking experience that supports the game's core mechanics while enabling advanced features like snapshot-based game creation.