---
sidebar_position: 3
---

# Моделі


## Серверна модель

Це модель згенерована через `sozo build --unity` і знаходиться за шляхом `Assets/TerritoryWars/Models`.
Ось як наприклад виглядає модель Board:
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

Такі типи як **FieldElement**, **Option&lt;A&gt;**, **(object, object, object)[]** і тд не зручно на пряму використовувати на клієнті, тому на коли на клієнті потрібна модель конвертується в **DojoLayer**.

## Клієнтська модель
Клієнтська модель пишеться вручну і знаходиться за шляхом `Assets/TerritoryWars/DataModels`.
Ось як виглядає та сама модель Board:
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

Наприклад тут замінено стан дошки з `(byte, byte, byte)[] state` на `Dictionary<Vector2Int, TileModel> Tiles`. Позиція тепер це не індекс масива, а **Vector2Int** і всі значення тапллів перенесені в структуру **TileModel**.