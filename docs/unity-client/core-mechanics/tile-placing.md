---
sidebar_position: 1
---

# Game Components 

## Tile

Головна суть гри це ставлення тайлів гравцями, об'єднання в структури і отримання очок за це. 
Тайл має 4 сторони і кожна має певний тип:

- Field
- City
- Road

Тайл можна поставити лише в ту позицію, де є принаймі один сусідній тайл і всі грані що з'єднуються одного типу.

Загальна кількість комбінацій **24**:

```csharp title="Assets/TerritoryWars/DataModels/GameConfiguration.cs"
public static string[] TileTypes =
{
    "CCCC", "FFFF", "RRRR", "CCCF", "CCCR", "CCRR", "CFFF", "FFFR", "CRRR", "FRRR",
    "CCFF", "CFCF", "CRCR", "FFRR", "FRFR", "CCFR", "CCRF", "CFCR", "CFFR", "CFRF",
    "CRFF", "CRRF", "CRFR", "CFRR"
};
```

Для кожного типу є заготовлений префаб за шляхом `Assets/Prefabs/TilePrefabs/FullTilePrefab`

Клас, який зберігає і оперує тайлом це **TileData** 


```csharp title="Assets/TerritoryWars/Tile/TileData.cs"
public class TileData
{
    public string RotatedConfig; 
    public string Type; // example: "CCRF"
    public Vector2Int Position; // from [0, 0] to [9,9]
    public int Rotation; // from 0 to 4
    public int PlayerSide; // session player side
    
    // інший код
}
```

## Board

Дефолтна дошка має загальний розмір **10x10**, це **8x8** активної області, де гравці можуть ставити тайли, а також передгенерований контур з стратовими структурами, до яких ставляться тайли на початку гри.

![board_logic](./img/board_logic.png)

Поставлені тайли зберігаються в **BoardManager**:

```csharp title="Assets/TerritoryWars/General/BoardManager.cs"
public class BoardManager : MonoBehaviour
{
    // інший код

    private GameObject[,] tileObjects;
    private TileData[,] tileData;

    // інший код
}
```
Де **x** - це вісь яка починається **знизу** і напрямлена **вгору-вправо**, **y** - це вісь яка починається **знизу** і напрямлена **вгору-вліво**.