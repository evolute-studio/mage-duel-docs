# UnionFind

This document provides comprehensive reference for the UnionFind model and its associated functionality for efficient scoring calculations in the Mage Duel game.

## Overview

The UnionFind model implements a sophisticated Disjoint-Set data structure specifically designed for tracking connected components (cities and roads) on the game board. It enables efficient scoring calculations by maintaining information about merged tile groups, their ownership, and completion status.

This model is crucial for the game's scoring system as it tracks:
- Connected city regions and their scores
- Connected road networks and their scores  
- Contested areas where both players have influence
- Open edges that can still be expanded

---

## UnionFind Model

### Structure Definition

```cairo
#[derive(Drop, Serde, Introspect, Debug)]
#[dojo::model]
pub struct UnionFind {
    #[key]
    pub board_id: felt252,

    pub nodes_parents: Span<u8>,
    pub nodes_ranks: Span<u8>,
    pub nodes_blue_points: Span<u16>,
    pub nodes_red_points: Span<u16>,
    pub nodes_open_edges: Span<u8>,
    pub nodes_contested: Span<bool>,
    pub nodes_types: Span<u8>, // 0 - City, 1 - Road, 2 - None

    pub potential_city_contests: Array<u8>,
    pub potential_road_contests: Array<u8>,
}
```

### Field Documentation

#### Primary Key
- **`board_id: felt252`**
  - Unique identifier linking this UnionFind structure to a specific game board
  - Primary key for database queries and lookups
  - Each board has exactly one UnionFind instance

#### Core Union-Find Structure
The model maintains parallel arrays where each index represents a node (tile position) on the board:

- **`nodes_parents: Span<u8>`**
  - Parent node for each position in the union-find tree
  - Root nodes point to themselves (parent[i] == i)
  - Used for path compression and finding connected components
  - Array size: 256 elements (supporting up to 16x16 board)

- **`nodes_ranks: Span<u8>`**
  - Rank (approximate depth) of each node's tree
  - Used for union by rank optimization
  - Helps keep trees balanced for efficient operations
  - Higher rank nodes become parents during union operations

#### Scoring Information
- **`nodes_blue_points: Span<u16>`**
  - Points contributed by blue player tiles in each connected component
  - Updated when blue player places tiles that join components
  - Used for final score calculation when components are completed

- **`nodes_red_points: Span<u16>`**
  - Points contributed by red player tiles in each connected component
  - Updated when red player places tiles that join components  
  - Used for final score calculation when components are completed

#### Component State
- **`nodes_open_edges: Span<u8>`**
  - Number of open (unconnected) edges for each component
  - Decreases as tiles are placed and components merge
  - Component is "completed" when open_edges reaches 0
  - Critical for determining when to award final scores

- **`nodes_contested: Span<bool>`**
  - Whether each component has tiles from both players
  - `true` if both blue and red have contributed to the component
  - Affects scoring rules (may split points or award to majority)
  - Updated during component merging operations

#### Component Types
- **`nodes_types: Span<u8>`**
  - Type of each connected component:
    - `0`: City component (high-value, compact scoring)
    - `1`: Road component (linear, length-based scoring)
    - `2`: None/Empty (unused or uninitialized node)

#### Contest Tracking
- **`potential_city_contests: Array<u8>`**
  - List of city component IDs that may become contested
  - Tracks components where control might change
  - Used for efficient contest detection and resolution

- **`potential_road_contests: Array<u8>`**
  - List of road component IDs that may become contested
  - Tracks road networks where control might change
  - Used for efficient contest detection and resolution

---

## UnionFind Trait Implementation

### Core Functions

#### `new(board_id: felt252) -> UnionFind`

**Purpose**: Creates a new UnionFind structure for a board with all nodes initialized

**Parameters**:
- `board_id`: Board identifier to associate with this structure

**Returns**: Initialized UnionFind instance

**Behavior**:
- Initializes 256 nodes (supporting 8x8 board)
- Each node starts as its own parent (isolated component)
- All ranks, points, and open edges start at 0
- All nodes marked as non-contested and type "None" (2)
- Contest arrays start empty

**Usage Example**:
```cairo
let union_find = UnionFindImpl::new(board_id);
// Now ready to track tile placement and scoring
```

#### `write_empty(board_id: felt252, mut world: WorldStorage)`

**Purpose**: Writes an empty UnionFind structure to storage

**Parameters**:
- `board_id`: Board identifier
- `world`: Mutable world storage reference

**Behavior**:
- Creates UnionFind with empty spans/arrays
- Useful for clearing or resetting board state
- All arrays are empty, ready for fresh initialization

**Usage Example**:
```cairo
// Clear existing union-find data
UnionFindImpl::write_empty(board_id, world);
```

#### `write(ref self: UnionFind, mut world: WorldStorage)`

**Purpose**: Efficiently writes the UnionFind structure to storage using member-level updates

**Parameters**:
- `self`: Mutable reference to UnionFind instance
- `world`: Mutable world storage reference

**Behavior**:
- Uses Dojo's `write_member` for granular updates
- Updates each field individually to minimize gas costs
- Maintains data consistency across storage operations

**Key Features**:
- Optimized for partial updates
- Reduces gas costs by only writing changed data
- Uses model member selectors for precise field updates

**Usage Example**:
```cairo
let mut union_find = world.read_model(board_id);
// Modify union_find data...
union_find.write(world); // Efficiently persist changes
```

#### `from_union_nodes(...) -> UnionFind`

**Purpose**: Constructs UnionFind from separate road and city node arrays

**Parameters**:
- `road_nodes_arr`: Array of road component nodes
- `city_nodes_arr`: Array of city component nodes  
- `potential_city_contests`: Array of potentially contested city IDs
- `potential_road_contests`: Array of potentially contested road IDs

**Returns**: UnionFind instance populated from the provided node data

**Behavior**:
- Iterates through provided node arrays
- Populates UnionFind fields based on node types
- Prioritizes road nodes over city nodes for each position
- Falls back to empty/default values for unspecified positions

**Logic Flow**:
1. For each array position:
   - If road node has type 1 (Road): use road node data
   - Else if city node has type 0 (City): use city node data  
   - Else: initialize as empty node (type 2)

**Usage Example**:
```cairo
let union_find = UnionFindImpl::from_union_nodes(
    road_nodes_arr,
    city_nodes_arr, 
    potential_city_contests,
    potential_road_contests
);
```

The UnionFind model is only optimized for Storage. In project it transforms to more efficient structures for implementing Union Find logic.