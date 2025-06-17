---
sidebar_position: 4
---

# Events

## Event Types

The system uses three main types of events:
1. Dojo Event
2. Converted Dojo Event
3. Client Event

## Dojo Event

Dojo Events are used to transmit data between the server and clients through Torii. These events are similar to models but, unfortunately, they are not automatically generated and need to be written manually. Events are located together with models at `Assets/TerritoryWars/Models`.

Similar to models, the original event format is not convenient for client-side usage, so they are converted on the client side.

The script `Assets/TerritoryWars/General/EventsHandler.cs` listens for these events, checks if the received event is relevant to the client or its session, and if so, converts the event and publishes it through `Assets/TerritoryWars/General/EventBus.cs`.

Here's an example of how the **BoardUpdated** event is processed:

```csharp title="Assets/TerritoryWars/General/EventsHandler.cs"
public class EventsHandler
{
    ...

    private void OnEventMessage(ModelInstance modelInstance)
    {
        ...

        case ApplicationStates.Session:
            SessionEventHandler(modelInstance);
            break;

        ...
        
    }

    private void SessionEventHandler(ModelInstance modelInstance)
    {
        switch (modelInstance)
        {
            case evolute_duel_BoardUpdated boardUpdated:
                // Filtering
                if (!_globalContext.SessionContext.IsSessionBoard(boardUpdated.board_id.Hex()))
                {
                    return;
                }
                // Conversion
                BoardUpdated boardUpdate = new BoardUpdated().SetData(boardUpdated);
                CustomLogger.LogEventsLocal($"[EventHandler] | {boardUpdated.Model.Name} ");
                // Publishing converted event on the client
                EventBus.Publish(boardUpdate);
                break;
             
            ...
        }
    }

    ...
}
```

## Converted Dojo Events

These are essentially the same Dojo events but with more convenient data types and representations. These events are located at `Assets/TerritoryWars/DataModels/Events`.

They are published through **EventBus** and listened to by various scripts throughout the client. For example, here's how the **GameLoopManager** module subscribes to a set of events:

```csharp title="Assets/TerritoryWars/Managers/SessionComponents/GameLoopManager.cs"
public class GameLoopManager : ISessionComponent
{
    ...

    public void Initialize(SessionManagerContext managerContext)
    {
        _managerContext = managerContext;
        EventBus.Subscribe<BoardUpdated>(OnBoardUpdate);
        EventBus.Subscribe<Moved>(OnMoved);
        EventBus.Subscribe<Skipped>(OnSkipped);
        EventBus.Subscribe<ClientInput>(OnLocalFinishTurn);
        EventBus.Subscribe<TimerEvent>(OnTimerEvent);
        EventBus.Subscribe<UnionFind>(OnUnionFind);
        EventBus.Subscribe<GameFinished>(OnEndGame);
        EventBus.Subscribe<ErrorOccured>(OnError);
        EventBus.Subscribe<GameCanceled>(OnGameCanceled);
        EventBus.Subscribe<TurnEndData>(OnTurnEnd);
    }

    ...
}
```

## Client Events

Simple events that are also published through **EventBus** and are used exclusively on the client side for information exchange between game components. They are located at `Assets/TerritoryWars/DataModels/ClientEvents`.