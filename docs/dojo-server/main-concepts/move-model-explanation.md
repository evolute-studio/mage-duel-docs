# Move Model and Event Sourcing 

This document explains the Move model in Mage Duel, how it tracks player actions, the different types of moves, and how the event sourcing pattern enables complete game history reconstruction.

## Overview

The Move model is the cornerstone of Mage Duel's event sourcing architecture. Every player action is recorded as a Move, creating an immutable chain of events that can reconstruct any game state at any point in time. This enables features like snapshots, game replay, and historical analysis.

---

## Move Model Structure

```rust
#[derive(Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct Move {
    #[key]
    pub id: felt252,
    pub player_side: PlayerSide,
    pub prev_move_id: Option<felt252>,
    pub tile: Option<u8>,
    pub rotation: u8,
    pub col: u8,
    pub row: u8,
    pub is_joker: bool,
    pub first_board_id: felt252,
    pub timestamp: u64,
}
```

---

## Field-by-Field Explanation

### Move Identity
#### `id: felt252`
**What it is:** Unique identifier for this specific move.

**Purpose:**
- Primary key for database storage and retrieval
- Links moves in the event sourcing chain
- Referenced by Board.last_move_id and other moves' prev_move_id
- Generated incrementally by move_id_generator

**Example:**
```rust
let move: Move = world.read_model(move_id);
```

---

### Game Context
#### `first_board_id: felt252`
**What it is:** Reference to the board where this move was made.

**Purpose:**
- Links move to its game context
- Enables querying all moves for a specific game
- Required for game state reconstruction
- Remains constant throughout a game's move chain

#### `timestamp: u64`
**What it is:** Block timestamp when the move was executed.

**Purpose:**
- Records exact timing of moves
- Enables move timeout enforcement
- Supports game analysis and replay
- Used for turn validation and game progression

---

### Event Sourcing Chain
#### `prev_move_id: Option<felt252>`
**What it is:** ID of the previous move in the game sequence.

**Event Sourcing Pattern:**
- `None`: This is the first move of the game
- `Some(move_id)`: Points to the previous move, creating a linked list

**Chain Structure:**
![](./img/moves_chain.png)

**Benefits:**
- Complete game history preservation
- Ability to reconstruct any game state
- Support for game snapshots and replays
- Immutable audit trail

---

### Player Information
#### `player_side: PlayerSide`
**What it is:** Which side made this move.

**Values:**
- `PlayerSide::Blue`: Move made by blue player
- `PlayerSide::Red`: Move made by red player

**Usage:**
- Turn validation (alternate players)
- Score attribution
- Game analysis and statistics
- Victory condition determination

---

### Move Action Details
#### `tile: Option<u8>`
**What it is:** The tile type that was placed (if any).

**Values:**
- `Some(tile_type)`: A tile was placed (normal move or joker)
- `None`: No tile was placed (skip move)

**Relationship with Tile System:**
```rust
// Convert to actual tile
let actual_tile: Tile = tile_value.into();

// Example values:
// Some(0) = Tile::CCCC
// Some(5) = Tile::CCRR  
// None = Skip move
```

#### `rotation: u8`
**What it is:** How the tile was rotated when placed.

**Values:**
- `0`: No rotation (0°)
- `1`: 90° clockwise
- `2`: 180° rotation
- `3`: 270° clockwise (90° counter-clockwise)

**For Skip Moves:** Always `0` (no meaningful rotation)

#### `col: u8` and `row: u8`
**What it is:** Board position where the tile was placed.

**Coordinate System:**
- `col`: Column (0-7, left to right)
- `row`: Row (0-7, top to bottom)
- Board position = `col * 8 + row`

**For Skip Moves:** Both are `0` (no meaningful position)

#### `is_joker: bool`
**What it is:** Whether this move used a joker tile.

**Values:**
- `true`: Player used a joker tile (chose their own tile type)
- `false`: Player used the top tile from deck or skipped

**Joker Mechanics:**
- Jokers allow players to place any tile type they want
- Limited quantity per player (usually 3)
- Costs joker from player's joker count
- Provides strategic flexibility

---

## Three Types of Moves

### 1. Normal Tile Move

**Characteristics:**
- `tile`: `Some(tile_type)` - tile from deck top
- `is_joker`: `false`
- `col`, `row`: Valid board position (0-7)
- `rotation`: Valid rotation (0-3)

**Example:**
```rust
Move {
    id: 42,
    player_side: PlayerSide::Blue,
    prev_move_id: Some(41),
    tile: Some(5),        // CCRR tile
    rotation: 2,          // 180° rotation
    col: 3,
    row: 4,
    is_joker: false,      // Using deck tile
    first_board_id: 10,
    timestamp: 1640995200,
}
```

**What happens:**
- Player takes the revealed top tile from deck
- Places it at specified position with rotation
- New tile is drawn from deck (if available)
- Turn passes to opponent

### 2. Joker Move

**Characteristics:**
- `tile`: `Some(tile_type)` - player's chosen tile
- `is_joker`: `true`
- `col`, `row`: Valid board position (0-7)
- `rotation`: Valid rotation (0-3)

**Example:**
```rust
Move {
    id: 43,
    player_side: PlayerSide::Red,
    prev_move_id: Some(42),
    tile: Some(0),        // CCCC tile (player's choice)
    rotation: 1,          // 90° rotation
    col: 2,
    row: 5,
    is_joker: true,       // Using joker
    first_board_id: 10,
    timestamp: 1640995260,
}
```

**What happens:**
- Player chooses any available tile type
- Places it at specified position with rotation
- Player's joker count decreases by 1
- Top tile remains unchanged
- Turn passes to opponent

### 3. Skip Move

**Characteristics:**
- `tile`: `None` - no tile placed
- `is_joker`: `false`
- `col`: `0` (meaningless)
- `row`: `0` (meaningless)
- `rotation`: `0` (meaningless)

**Example:**
```rust
Move {
    id: 44,
    player_side: PlayerSide::Blue,
    prev_move_id: Some(43),
    tile: None,           // No tile placed
    rotation: 0,          // No rotation
    col: 0,               // No position
    row: 0,               // No position
    is_joker: false,      // Not a joker
    first_board_id: 10,
    timestamp: 1640995320,
}
```

**What happens:**
- Player cannot or chooses not to place current tile
- Board state remains unchanged
- Current tile is returned to deck, new tile drawn
- Turn passes to opponent

---

## Event Sourcing Pattern

### What is Event Sourcing?

Event sourcing is a pattern where state changes are stored as a sequence of events. Instead of storing the current state, we store all the events that led to that state.

**Benefits:**
- **Complete History**: Every action is preserved
- **State Reconstruction**: Can rebuild any point in time
- **Auditability**: Full audit trail of all changes
- **Snapshots**: Can create new games from any point
- **Debugging**: Can trace exactly what happened

### Move Chain Traversal

```rust
// Reconstruct complete game history
fn get_move_history(latest_move_id: felt252, world: @WorldStorage) -> Array<Move> {
    let mut moves = ArrayTrait::new();
    let mut current_move_id = Option::Some(latest_move_id);
    
    // Traverse backwards through the chain
    loop {
        match current_move_id {
            Option::Some(move_id) => {
                let move: Move = world.read_model(move_id);
                moves.append(move);
                current_move_id = move.prev_move_id;
            },
            Option::None => break, // Reached first move
        }
    }
    
    // Reverse to get chronological order
    reverse_array(moves)
}
```

### State Reconstruction

```rust
// Rebuild board state from move history
fn reconstruct_board_state(board_id: felt252, target_move: u8, world: @WorldStorage) -> Board {
    let board: Board = world.read_model(board_id);
    let moves = get_move_history(board.last_move_id.unwrap(), world);
    
    // Start with empty board
    let mut reconstructed_state = create_empty_board_state();
    
    // Apply moves in chronological order up to target
    for i in 0..min(target_move.into(), moves.len()) {
        let move = *moves.at(i);
        apply_move_to_state(ref reconstructed_state, move);
    }
    
    reconstructed_state
}
```

---

## Posible integration with Other Systems

### Board State Updates

```rust
// Update board when move is made
fn execute_move(move: Move, ref board: Board, world: WorldStorage) {
    match move.tile {
        Option::Some(tile_type) => {
            // Place tile on board
            update_board_state(ref board, tile_type.into(), move.rotation, move.col, move.row, move.is_joker, move.player_side);
            
            // Update joker count if joker used
            if move.is_joker {
                update_board_joker_number(ref board, move.player_side, true);
            }
        },
        Option::None => {
            // Skip move - redraw tile
            redraw_tile_from_board_deck(ref board);
        }
    }
    
    // Update move chain
    board.last_move_id = Option::Some(move.id);
    board.moves_done += 1;
    board.last_update_timestamp = move.timestamp;
}
```

### Achievement Integration

```rust
// Award achievements based on move patterns
fn check_move_achievements(move: Move, world: WorldStorage) {
    // First move achievement
    if move.prev_move_id.is_none() {
        AchievementsTrait::first_move(world, get_player_from_side(move.player_side, world));
    }
    
    // Joker usage achievement
    if move.is_joker {
        AchievementsTrait::joker_used(world, get_player_from_side(move.player_side, world));
    }
    
    // Skip move achievement (strategic skipping)
    if move.tile.is_none() {
        AchievementsTrait::strategic_skip(world, get_player_from_side(move.player_side, world));
    }
}
```

---

## Move Execution in Game System

Now let's look at how moves are actually processed in the game system. The `make_move` function in the game contract demonstrates the complete move execution pipeline.

### Make Move Function Flow

```rust
fn make_move(
    ref self: ContractState, 
    joker_tile: Option<u8>, 
    rotation: u8, 
    col: u8, 
    row: u8
)
```

#### 1. Initial Validation

**Player Verification:**
```rust
let player = get_caller_address();
let game: Game = world.read_model(player);

// Check if player is in a game
if game.board_id.is_none() {
    world.emit_event(@PlayerNotInGame { player_id: player, board_id: 0 });
    return;
}
```

**Game State Validation:**
```rust
if game.status == GameStatus::Finished {
    world.emit_event(@GameIsAlreadyFinished { player_id: player, board_id });
    return;
}
```

#### 2. Turn and Timing Validation

**Turn Order Check:**
```rust
let prev_move_id = board.last_move_id;
if prev_move_id.is_some() {
    let prev_move: Move = world.read_model(prev_move_id.unwrap());
    let prev_player_side = prev_move.player_side;
    
    // Current player must be different from last move player
    if player_side == prev_player_side {
        // Handle timeout scenarios
    }
}
```

**Timeout Management:**
```rust
const MOVE_TIME: u64 = 65; // 60 seconds + 5 seconds latency buffer

let time_delta = current_time - board.last_update_timestamp;

if player_side == prev_player_side {
    if time_delta > MOVE_TIME && time_delta <= 2 * MOVE_TIME {
        // Auto-skip opponent's turn due to timeout
        self._skip_move(another_player, another_player_side, ref board, false);
    }
    
    if time_delta <= MOVE_TIME || time_delta > 2 * MOVE_TIME {
        world.emit_event(@NotYourTurn { player_id: player, board_id });
        return;
    }
} else {
    if time_delta > MOVE_TIME {
        world.emit_event(@NotYourTurn { player_id: player, board_id });
        return;
    }
}
```

#### 3. Tile Selection Logic

**Joker vs Normal Tile:**
```rust
let is_joker = joker_tile.is_some();

// Validate joker availability
if is_joker && joker_number == 0 {
    world.emit_event(@NotEnoughJokers { player_id: player, board_id });
    return;
}

// Determine which tile to place
let tile = match joker_tile {
    Option::Some(tile_index) => tile_index,      // Player chose joker tile
    Option::None => {
        match board.top_tile {
            Option::Some(top_tile) => top_tile,  // Use deck's top tile
            Option::None => panic!("No tiles in the deck"),
        }
    },
};
```

#### 4. Move Validation

**Placement Validation:**
```rust
if !is_valid_move(
    tile.into(), 
    rotation, 
    col, 
    row, 
    board.state.span(), 
    board.initial_edge_state
) {
    world.emit_event(@InvalidMove { 
        player, 
        tile: Option::Some(tile), 
        rotation, 
        col, 
        row, 
        is_joker, 
        board_id 
    });
    return;
}
```

The `is_valid_move` function checks:
- Position is empty (not occupied)
- Position is within board bounds (0-7 for both col and row)
- Tile edges match adjacent tiles and board edges
- Rotation is valid (0-3)

#### 5. Move Creation and Storage

**Move Model Creation:**
```rust
let move_id = self.move_id_generator.read();

let move = Move {
    id: move_id,
    prev_move_id: board.last_move_id,    // Links to previous move
    player_side,
    tile: Option::Some(tile),            // The tile being placed
    rotation,
    col,
    row,
    is_joker,
    first_board_id: board_id,
    timestamp: get_block_timestamp(),
};

// Store the move
world.write_model(@move);
self.move_id_generator.write(move_id + 1);
```

#### 6. Board State Updates

**Deck Management:**
```rust
let top_tile = if !is_joker {
    draw_tile_from_board_deck(ref board)  // Draw new tile if not joker
} else {
    board.top_tile                        // Keep current tile if joker used
};
```

**Board State Update:**
```rust
update_board_state(ref board, tile.into(), rotation, col, row, is_joker, player_side);

// Update joker counts if joker was used
let (joker_number1, joker_number2) = update_board_joker_number(ref board, player_side, is_joker);

// Update move chain
board.last_move_id = Option::Some(move_id);
board.moves_done += 1;
```

#### 7. Scoring Calculations

**Points from Tile Placement:**
```rust
let (tile_city_points, tile_road_points) = calcucate_tile_points(tile.into());
let (edges_city_points, edges_road_points) = calculate_adjacent_edge_points(
    ref board.initial_edge_state, col, row, tile.into(), rotation
);
let (city_points, road_points) = (
    tile_city_points + edges_city_points, 
    tile_road_points + edges_road_points
);

// Add points to player's score
if player_side == PlayerSide::Blue {
    let (old_city_points, old_road_points) = board.blue_score;
    board.blue_score = (old_city_points + city_points, old_road_points + road_points);
} else {
    let (old_city_points, old_road_points) = board.red_score;
    board.red_score = (old_city_points + city_points, old_road_points + road_points);
}
```

**Connection-Based Scoring:**
```rust
// Connect city edges within the tile
connect_city_edges_in_tile(ref world, ref city_nodes, tile_position, tile, rotation, player_side);

// Connect to adjacent city edges and handle contests
let city_contest_result = connect_adjacent_city_edges(
    ref world, board_id, board.state.span(), ref board.initial_edge_state,
    ref city_nodes, tile_position, tile, rotation, player_side, player,
    ref visited, ref union_find.potential_city_contests
);

// Apply contest resolution if any
if city_contest_result.is_some() {
    let (winner, points_delta) = city_contest_result.unwrap();
    // Update scores based on contest winner
}
```

#### 8. Game End Detection

**Automatic Game End:**
```rust
if top_tile.is_none() && joker_number1 == 0 && joker_number2 == 0 {
    // No tiles left and no jokers available - finish the game
    self._finish_game(
        ref board, 
        union_find.potential_city_contests.span(), 
        union_find.potential_road_contests.span(),
        ref city_nodes,
        ref road_nodes,
    );
}
```

#### 9. Event Emission

**Move Completed Events:**
```rust
world.emit_event(@Moved {
    move_id,
    player,
    prev_move_id: move.prev_move_id,
    tile: move.tile,
    rotation: move.rotation,
    col: move.col,
    row: move.row,
    is_joker: move.is_joker,
    board_id,
    timestamp: move.timestamp,
});

world.emit_event(@BoardUpdated {
    board_id: board.id,
    available_tiles_in_deck: board.available_tiles_in_deck.span(),
    top_tile: board.top_tile,
    state: board.state.span(),
    player1: board.player1,
    player2: board.player2,
    blue_score: board.blue_score,
    red_score: board.red_score,
    last_move_id: board.last_move_id,
    moves_done: board.moves_done,
    game_state: board.game_state,
});
```

---

## Skip Move Implementation

The `skip_move` function handles the third type of move:

### Skip Move Process

#### 1. Similar Initial Validation
```rust
fn skip_move(ref self: ContractState) {
    let player = get_caller_address();
    // Same player and game validation as make_move
}
```

#### 2. Deck Management for Skip
```rust
// Return current tile to deck and draw new one
redraw_tile_from_board_deck(ref board);
```

#### 3. Skip Move Creation
```rust
let move = Move {
    id: move_id,
    prev_move_id: board.last_move_id,
    player_side,
    tile: Option::None,        // No tile placed
    rotation: 0,               // No rotation
    col: 0,                    // No position
    row: 0,                    // No position
    is_joker: false,           // Not a joker
    first_board_id: board_id,
    timestamp: get_block_timestamp(),
};
```

#### 4. Game End Check for Double Skip
```rust
if prev_move.tile.is_none() && !prev_move.is_joker {
    // Previous move was also a skip - end the game
    self._finish_game(ref board, /* scoring data */);
}
```

---

## Error Handling in Move Processing

### Common Error Scenarios

**Invalid Move Validation:**
```rust
if !is_valid_move(tile, rotation, col, row, board.state, board.initial_edge_state) {
    world.emit_event(@InvalidMove { /* move details */ });
    println!("[Invalid move] \nBoard: {:?} \nMove: {:?}", board, move);
    return; // Move is rejected, no state changes
}
```

**Turn Validation Errors:**
```rust
// Wrong player's turn
world.emit_event(@NotYourTurn { player_id: player, board_id });

// Insufficient jokers
world.emit_event(@NotEnoughJokers { player_id: player, board_id });

// Player not in game
world.emit_event(@PlayerNotInGame { player_id: player, board_id: 0 });
```

### Transaction Safety

The move processing is designed to be atomic:
- All validations happen before any state changes
- If any validation fails, the function returns early
- No partial state updates occur on failed moves
- Events clearly indicate success or failure reasons

---

## Performance Considerations

### Gas Optimization

**Efficient Storage Updates:**
- Uses `write_member` for granular field updates instead of full model writes
- Minimizes storage operations by batching related changes
- Optimizes UnionFind data structure updates

**Computation Optimization:**
- Caches frequently accessed data
- Minimizes array operations and cloning
- Uses efficient data structures for node management
---

## Integration with Game Flow

### Complete Game Cycle

1. **Game Creation** → Initial board state
2. **Player Joins** → Game becomes active
3. **Move Loop:**
   - Player calls `make_move` or `skip_move`
   - System validates and processes move
   - Board state updates
   - Turn switches to opponent
   - Repeat until game end condition
4. **Game End** → Final scoring and cleanup


This integration shows how the Move model and event sourcing pattern work in practice, from initial validation through state updates to final game completion. The system ensures data integrity while providing rich gameplay features through sophisticated scoring and contest resolution mechanics.

1. **Complete Auditability**: Every action is permanently recorded
2. **State Reconstruction**: Any game state can be rebuilt from moves
3. **Snapshot Support**: New games can branch from any point
4. **Rich Analytics**: Detailed player behavior analysis
5. **Debugging Capabilities**: Full trace of game progression
6. **Flexible Gameplay**: Support for normal, joker, and skip moves
7. **Turn Validation**: Clear turn order through move chain
8. **Historical Preservation**: Games never lose their history

This architecture enables sophisticated features while maintaining data integrity and providing a foundation for advanced game analysis and replay capabilities.