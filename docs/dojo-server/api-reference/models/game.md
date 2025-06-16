
# Game

### Board Model

The core model representing the game board state, including tile placement, player information, scores, and game progression.

```cairo
#[derive(Drop, Serde, Debug, Introspect, Clone)]
#[dojo::model]
pub struct Board {
    #[key]
    pub id: felt252,
    pub initial_edge_state: Span<u8>,
    pub available_tiles_in_deck: Array<u8>,
    pub top_tile: Option<u8>,
    pub state: Array<(u8, u8, u8)>,
    pub player1: (ContractAddress, PlayerSide, u8),
    pub player2: (ContractAddress, PlayerSide, u8),
    pub blue_score: (u16, u16),
    pub red_score: (u16, u16),
    pub last_move_id: Option<felt252>,
    pub game_state: GameState,
    pub moves_done: u8,
    pub last_update_timestamp: u64,
    pub commited_tile: Option<u8>,
    pub phase_started_at: u64,
}
```

**Key Field:**
- `id`: Unique identifier for the board (primary key)

**Core Game State:**
- `initial_edge_state`: Initial configuration of tiles at board edges as `Span<u8>`
- `available_tiles_in_deck`: Array of remaining tiles that can be drawn
- `top_tile`: Currently revealed tile on top of the deck (`None` if deck is empty)
- `state`: Array of placed tiles, each encoded as `(tile_number, rotation, side)`

**Player Information:**
- `player1`: Tuple containing `(ContractAddress, PlayerSide, joker_count)`
- `player2`: Tuple containing `(ContractAddress, PlayerSide, joker_count)`

**Scoring System:**
- `blue_score`: Tuple `(city_score, road_score)` for blue side
- `red_score`: Tuple `(city_score, road_score)` for red side

**Game Flow:**
- `last_move_id`: ID of the most recent move (`None` for new games)
- `game_state`: Current state using `GameState` enum
- `moves_done`: Counter of total moves made
- `last_update_timestamp`: Block timestamp of last board update

**Commit-Reveal System:**
- `commited_tile`: Tile committed but not yet revealed (`None` if no commitment)
- `phase_started_at`: Timestamp when current phase began

**Usage Example:**
```cairo
// Read board state
let board: Board = world.read_model(board_id);

// Check if game is finished
match board.game_state {
    GameState::InProgress => { /* game continues */ },
    GameState::Finished => { /* handle game end */ },
}

// Get current top tile
match board.top_tile {
    Option::Some(tile) => { /* tile available */ },
    Option::None => { /* deck empty */ },
}
```

---

### Move Model

Represents individual player moves with full event sourcing capability for game state reconstruction.

```cairo
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
    pub top_tile: Option<u8>,
}
```

**Key Field:**
- `id`: Unique identifier for the move (primary key)

**Player Context:**
- `player_side`: Which side made this move (`PlayerSide` enum)
- `first_board_id`: Reference to the board where this move was made

**Move Chain (Event Sourcing):**
- `prev_move_id`: ID of previous move (`None` for first move of game)
- This creates a linked list structure for reconstructing game history

**Move Details:**
- `tile`: Tile number placed (`None` represents a skip move)
- `rotation`: Tile rotation (0-3 representing 0°, 90°, 180°, 270°)
- `col`: Column position on board (0-based index)
- `row`: Row position on board (0-based index)
- `is_joker`: Whether this move used a joker tile

**State Context:**
- `timestamp`: Block timestamp when move was made
- `top_tile`: Tile revealed after this move (`None` if deck became empty)

**Move Types:**
- **Normal Move**: `tile` has value, `is_joker` is false
- **Joker Move**: `tile` has value, `is_joker` is true
- **Skip Move**: `tile` is `None` (when no legal placement exists)

**Usage Example:**
```cairo
// Read a specific move
let move: Move = world.read_model(move_id);

// Check move type
match move.tile {
    Option::Some(tile_num) => {
        if move.is_joker {
            // Handle joker move
        } else {
            // Handle normal tile placement
        }
    },
    Option::None => {
        // Handle skip move
    }
}

// Traverse move history
let mut current_move_id = latest_move_id;
loop {
    let move: Move = world.read_model(current_move_id);
    // Process move...
    
    match move.prev_move_id {
        Option::Some(prev_id) => current_move_id = prev_id,
        Option::None => break, // Reached first move
    }
}
```

---

### Rules Model

Defines the game configuration, including deck composition, board setup, and special mechanics.

```cairo
#[derive(Drop, Introspect, Serde)]
#[dojo::model]
pub struct Rules {
    #[key]
    pub id: felt252,
    pub deck: Span<u8>,
    pub edges: (u8, u8),
    pub joker_number: u8,
    pub joker_price: u16,
}
```

**Key Field:**
- `id`: Unique identifier for the rule set (primary key)

**Deck Configuration:**
- `deck`: Span defining the count of each tile type in the game deck
- Each position in the span represents how many tiles of that type are included

**Board Setup:**
- `edges`: Tuple `(city_edges, road_edges)` defining initial edge configuration
- Determines how many cities and roads are pre-placed on board edges

**Joker System:**
- `joker_number`: Number of joker tiles each player starts with
- `joker_price`: Cost in points to use a joker tile

**Usage Example:**
```cairo
// Read game rules
let rules: Rules = world.read_model(rules_id);

// Check deck composition
let tile_count_for_type_5 = *rules.deck.at(5);

// Get joker configuration
if rules.joker_number > 0 {
    // Jokers are available
    let cost = rules.joker_price;
}
```

---

### Game Model

Tracks individual player game sessions and their status.

```cairo
#[derive(Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct Game {
    #[key]
    pub player: ContractAddress,
    pub status: GameStatus,
    pub board_id: Option<felt252>,
    pub snapshot_id: Option<felt252>,
}
```

**Key Field:**
- `player`: Player's contract address (primary key)

**Game State:**
- `status`: Current game status using `GameStatus` enum
- `board_id`: Reference to active board (`None` if not in game)

**Snapshot Integration:**
- `snapshot_id`: If game was created from snapshot, contains snapshot ID
- `None` for games created from scratch

**Usage Example:**
```cairo
// Check player's current game
let game: Game = world.read_model(player_address);

match game.status {
    GameStatus::Created => {
        let board_id = game.board_id.unwrap();
        // Load and display created game
    },
    GameStatus::Canceled => {
        //Process game canceled
    }
    GameStatus::InProgress => {
        let board_id = game.board_id.unwrap();
        // Load and display active game
    },
    GameStatus::Finished => { /* show results */ },
}

// Check if game was created from snapshot
match game.snapshot_id {
    Option::Some(snap_id) => { /* handle snapshot-based game */ },
    Option::None => { /* regular new game */ },
}
```

---

### Snapshot Model

Stores game state snapshots for creating new games from specific points in game history.

```cairo
#[derive(Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct Snapshot {
    #[key]
    pub snapshot_id: felt252,
    pub player: ContractAddress,
    pub board_id: felt252,
    pub move_number: u8,
}
```

**Key Field:**
- `snapshot_id`: Unique identifier for the snapshot (primary key)

**Snapshot Context:**
- `player`: Address of player who created the snapshot
- `board_id`: Reference to the original board that was snapshotted
- `move_number`: Specific move number where snapshot was taken

**Snapshot Functionality:**
- Allows creating new games that start from this exact game state
- Enables community to fork interesting game positions
- Supports replay and analysis of specific game moments

**Usage Example:**
```cairo
// Read snapshot information
let snapshot: Snapshot = world.read_model(snapshot_id);

// Create new game from snapshot
let new_board_id = create_board_from_snapshot(ref world, snapshot.board_id, snapshot.move_number, board_id_generator);

// Verify snapshot creator
if snapshot.player == authorized_creator {
    // Allow snapshot usage
}
```

---

## Supporting Types

### PlayerSide Enum

```cairo
#[derive(Drop, Serde, Copy, IntrospectPacked, PartialEq, Debug)]
pub enum PlayerSide {
    Blue,
    Red,
}
```

Represents which side a player is on. Used throughout the game for:
- Score tracking (`blue_score` vs `red_score`)
- Move attribution
- Team-based mechanics

### GameState Enum

```cairo
#[derive(Copy, Drop, Serde, Debug, IntrospectPacked, PartialEq)]
pub enum GameState {
    InProgress,
    Finished,
}
```

Tracks the current state of a game:
- `InProgress`: Game is active, players can make moves
- `Finished`: Game has ended, no more moves possible

### GameStatus Enum

```cairo
#[derive(Drop, Serde, Copy, IntrospectPacked, PartialEq, Debug)]
pub enum GameStatus {
    Finished,
    Created,
    Canceled,
    InProgress,
}
```

Tracks player's individual game status:
- `Created`: Player created game, waiting for opponent to join
- `Canceled`: Player canceled game
- `InProgress`: Player is in active game
- `Finished`: Player's game has concluded

---

## Model Relationships

### Board ↔ Move Relationship
- `Board.last_move_id` → `Move.id`
- `Move.first_board_id` → `Board.id`
- Forms event sourcing chain for game state reconstruction

### Game ↔ Board Relationship
- `Game.board_id` → `Board.id`
- Links player sessions to active game boards

### Snapshot → Board Relationship
- `Snapshot.board_id` → `Board.id`
- References original board for snapshot creation

---

## Common Query Patterns

### Get Active Game for Player
```cairo
let game: Game = world.read_model(player_address);
if game.status == GameStatus::InProgress {
    let board_id = game.board_id.unwrap();
    let board: Board = world.read_model(board_id);
}
```

### Reconstruct Game History
```cairo
let board: Board = world.read_model(board_id);
let mut moves = ArrayTrait::new();

let mut current_move_id = board.last_move_id;
loop {
    match current_move_id {
        Option::Some(move_id) => {
            let move: Move = world.read_model(move_id);
            moves.append(move);
            current_move_id = move.prev_move_id;
        },
        Option::None => break,
    }
}
```

### Check Player's Turn
```cairo
let board: Board = world.read_model(board_id);
let last_move: Move = world.read_model(board.last_move_id.unwrap());

// Next player is opposite of last move's player
let next_player_side = match last_move.player_side {
    PlayerSide::Blue => PlayerSide::Red,
    PlayerSide::Red => PlayerSide::Blue,
};
```