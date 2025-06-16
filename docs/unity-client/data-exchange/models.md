---
sidebar_position: 3
---

# Models

## Server Model

This is a model generated through `sozo build --unity` and is located at `Assets/TerritoryWars/Models`.
Here's how the Board model looks, for example:
```csharp title="Assets/TerritoryWars/Models/evolute_duel-Board.gen.cs"
public class evolute_duel_Board : ModelInstance {
    [ModelField("id")]
    public FieldElement id;
    [ModelField("initial_edge_state")]
    public byte[] initial_edge_state;
    [ModelField("available_tiles_in_deck")]
    public byte[] available_tiles_in_deck;
    [ModelField("top_tile")]
    public Option<byte> top_tile;
    [ModelField("state")]
    public (byte, byte, byte)[] state;
    [ModelField("player1")]
    public (FieldElement, PlayerSide, byte) player1;
    [ModelField("player2")]
    public (FieldElement, PlayerSide, byte) player2;
    [ModelField("blue_score")]
    public (ushort, ushort) blue_score;
    [ModelField("red_score")]
    public (ushort, ushort) red_score;
    [ModelField("last_move_id")]
    public Option<FieldElement> last_move_id;
    [ModelField("game_state")]
    public GameState game_state;
    [ModelField("moves_done")]
    public byte moves_done;
    [ModelField("last_update_timestamp")]
    public ulong last_update_timestamp;
}
```

Types like **FieldElement**, **Option&lt;A&gt;**, **(object, object, object)[]** etc. are not convenient to use directly on the client, so when a model is needed on the client, it is converted in **DojoLayer**.

## Client Model
The client model is written manually and is located at `Assets/TerritoryWars/DataModels`.
Here's how the same Board model looks:
```csharp title="Assets/TerritoryWars/DataModels/Board.cs"
public struct Board
{
    public string Id;
    public char[] InitialEdgeState;
    public string[] AvailableTilesInDeck;
    public string TopTile;
    public Dictionary<Vector2Int, TileModel> Tiles;
    public SessionPlayer Player1;
    public SessionPlayer Player2;
    public string LastMoveId;
    public BoardState GameState;
    public byte MovesDone;
    public int MovesCount => GetOnlyMovesCount();
    public ulong LastUpdateTimestamp;

    // some methods
}
```

For example, here the board state has been changed from `(byte, byte, byte)[] state` to `Dictionary<Vector2Int, TileModel> Tiles`. The position is now a **Vector2Int** instead of an array index, and all tile values have been moved to the **TileModel** structure.