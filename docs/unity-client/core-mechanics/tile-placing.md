---
sidebar_position: 1
---

# Tile placing

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