---
sidebar_position: 1
---

# Game Components 

## Tile

The main essence of the game is players placing tiles, combining them into structures, and earning points for it.
A tile has 4 sides, and each has a specific type:

- Field
- City
- Road

A tile can only be placed in a position where there is at least one adjacent tile and all connecting edges are of the same type.

Total number of combinations is **24**:

```csharp title="Assets/TerritoryWars/DataModels/GameConfiguration.cs"
public static string[] TileTypes =
{
    "CCCC", "FFFF", "RRRR", "CCCF", "CCCR", "CCRR", "CFFF", "FFFR", "CRRR", "FRRR",
    "CCFF", "CFCF", "CRCR", "FFRR", "FRFR", "CCFR", "CCRF", "CFCR", "CFFR", "CFRF",
    "CRFF", "CRRF", "CRFR", "CFRR"
};
```

For each type, there is a prepared prefab at the path `Assets/Prefabs/TilePrefabs/FullTilePrefab`

The class that stores and operates the tile is **TileData** 

```csharp title="Assets/TerritoryWars/Tile/TileData.cs"
public class TileData
{
    public string RotatedConfig; 
    public string Type; // example: "CCRF"
    public Vector2Int Position; // from [0, 0] to [9,9]
    public int Rotation; // from 0 to 4
    public int PlayerSide; // session player side
    
    // other code
}
```

## Board

The default board has a total size of **10x10**, which is **8x8** active area where players can place tiles, plus a pre-generated outline with starting structures to which tiles are placed at the beginning of the game.

![board_logic](./img/board_logic.png)

Placed tiles are stored in **BoardManager**:

```csharp title="Assets/TerritoryWars/General/BoardManager.cs"
public class BoardManager : MonoBehaviour
{
    // other code

    private GameObject[,] tileObjects;
    private TileData[,] tileData;

    // other code
}
```
Where **x** is the axis that starts from the **bottom** and is directed **up-right**, **y** is the axis that starts from the **bottom** and is directed **up-left**.

