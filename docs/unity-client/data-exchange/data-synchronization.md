---
sidebar_position: 1
---

# Синхронізація данних

## Загальна інформація

Інформація на сервері зберігаєтья в [моделях](models.md). Щоб їх використати на клієнті, треба згенерувати c# скрипти при білді серверу, це робиться ось так:

```bash
sozo build --unity
```

Далі отримані згенеровані моделі і контракти будеть знаходитись в папці dojo проекту: `territory-wars-dojo/bindings/unity`.
Отримані скрипти треба перенести на клієнт за шляхом:

- `Assets/TerritoryWars/Models`
- `Assets/TerritoryWars/Contracts`.

:::note
Кастомні івенти не генеруються! Ці скрипти найпростіше зробити по прикладу.
:::

Основна синхронізація відбувається завдяки двом скриптам з **Dojo unity SDK**:

- `WorldManager` - зберігає моделі на клієнті і має логіку їх локально отримання
- `SynchronizationManager` - синхронізує моделі, івенти, має логіку отримання моделей по query

## Отримання моделі

Для отримання потрібної моделі, треба використати статичний скрипт `DojoLayer`, де є набір методів для отримання **dojo моделі** і конвертація у **клієнську модель**.

Про моделі детальніше можна дізнатись [тут](models.md).

Використовуйте готові методи, або додавайте додаткові на прикладі готових.

Наприклад як отриматии клієнську модель гравця:

```csharp
public async Task<PlayerProfile> GetPlayerProfile(string playerId)
{
    evolute_duel_Player player = WorldManager.EntityModel<evolute_duel_Player>("player_id", new FieldElement(playerId));
    if (player == null)
    {
        await SynchronizationMaster.SyncPlayer(new FieldElement(playerId));
        player = WorldManager.EntityModel<evolute_duel_Player>("player_id", new FieldElement(playerId));
    }
    if (player == null)
    {
        return default;
    }
    PlayerProfile profile = new PlayerProfile().SetData(player);
    return profile;
}
```

Спочатку буде перевірено чи уже є потрібна модель на клієнті через **WorldManager**, якщо ні - виконується синхронізації.

Більш детальніше як отримати модель, яка відсутня в проекті:

- Спочатку треба зробити відповідний **Query** в класі **DojoQueries**.
- Далі в скрипті **CustomSynchronizationManager** треба додати метод по прикладу.
- Бажано зробити відповідну **клієнтську модель,** так як деякі типи полів, або представлення данних з серверу незручно використовувати на клієнті напряму. Клієнтські моделі знаходяться в папці: `Assets/TerritoryWars/DataModels`
- Треба зробити відповідний метод конвертації в **DojoLayer**.
- Викликати метод `await DojoLayer.NewMethod()`.

Готово!

:::warning
Якщо ви не бачете своєї моделі, можливо вона відфільтрована [IncomingModelsFilter](data-filtering.md)
:::
