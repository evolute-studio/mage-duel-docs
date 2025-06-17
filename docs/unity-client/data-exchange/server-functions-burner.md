---
sidebar_position: 5
---

# Calling Server Functions

## General Information 

The client has a **GeneralAccount** class which is a generalized class for storing information for both **Controller** accounts and **burner** accounts for guests and bots. It is used for function calls.

```csharp title="Assets/TerritoryWars/General/GeneralAccount.cs"
public class GeneralAccount
{
    public bool IsController => _controllerAddress != null;
    private FieldElement _controllerAddress;
    public Account Account { get; private set; }

    public FieldElement Address
    {
        get
        {
            if( _controllerAddress != null ) 
            {
                return _controllerAddress;
            }
            if (Account != null)
            {
                return Account.Address;
            }

            return null;
        }
    }

    // initialization as Controller account
    public GeneralAccount(FieldElement controllerAddress)
    {
        _controllerAddress = controllerAddress;
    }
    // initialization as Burner account
    public GeneralAccount(Account account)
    {
        Account = account;
    }
}
```

## Function Calls

To call a function, you need to access the static class **DojoConnector**. Here's an example of how to create a game:

```csharp title="Assets/TerritoryWars/ExternalConnections/DojoConnector.cs"
public static class DojoConnector
{
    ...

    public static async Task CreateGame(GeneralAccount account)
    {
        // Helper class that can be configured for different scenarios
        ExecuteConfig executeConfig = new ExecuteConfig()
            .WithLoading(LoadingScreen.waitAnotherPlayerText, () => CancelGame(account))
            .WithMessage($"DojoCall: [{nameof(CreateGame)}] " +
                            $"\n Account: {account.Address.Hex()}");
        
        // Account check and function call using different methods
        if (account.IsController)
        {
            ExecuteController(ControllerContracts.create_game(), executeConfig);
        }
        else
        {
            await TryExecuteAction(
                account.Account,
                () => GameContract.create_game(account.Account),
                executeConfig
            );
        }

        ...
    }
```

:::tip
To get the **GeneralAccount** of the local player, use `DojoGameManager.Instance.LocalAccount`; to get the bot's account - `DojoGameManager.Instance.LocalBot`
:::

In short, to call any function, it's easiest to use **DojoConnector**. You can create a game with this code regardless of your account type:

```csharp
public async void CreateGame(){
    await DojoConnector.CreateGame(DojoGameManager.Instance.LocalAccount);
    Debug.Log("GameCreated");
}
```

## What's the difference between **Controller** and **burner** accounts?

### Burner Account
This is a simple account created from a **master account** (usually the default **katana** accounts) for guests and bots. They are simple and flexible to use.
These accounts are automatically created on the client when needed. For function calls, they use generated [contracts](#contracts).

### Controller
**[Controller](https://cartridge.gg/controller)** is a wallet from **Cartridge** in the **Starknet** ecosystem. Currently, it's not possible to directly call methods through the controller in our game. For this purpose, a web next.js wrapper is used. If you need to call a function through the controller, you need to create a corresponding method in `Assets/TerritoryWars/Contracts/ControllerContracts.cs`:

```csharp title="Assets/TerritoryWars/Contracts/ControllerContracts.cs"
public static class ControllerContracts
{
    ...

    public struct Transaction
    {
        public string contractAddress;
        public string entrypoint;
        public string[] calldata;
    }


    public static string create_game()
    {
        Transaction tx = new Transaction()
        {
            contractAddress = EVOLUTE_DUEL_GAME_ADDRESS,
            entrypoint = "create_game",
            calldata = new string[] { }
        };
        var json = Newtonsoft.Json.JsonConvert.SerializeObject(tx);
        return json;
    }
```

It generates a transaction JSON that will be passed to the web application through the js bridge, file **Wrapper.jslib**:

```js title="Assets/Plugins/WebGL/Wrapper.jslib"
mergeInto(LibraryManager.library, {
    ...
    execute_controller: function(transaction) {
        console.log("ExecuteController called with transaction:", transaction);
        return window.unityConnector.ExecuteTransaction(UTF8ToString(transaction));
    },
    ...
}); 
```

## Contracts

Generated contracts on the client are located at `Assets/TerritoryWars/Contracts`. Let's look at the **evolute_duel-game** contract as an example:

```csharp title="Assets/TerritoryWars/Contracts/evolute_duel_game.gen.cs"
public class Game : MonoBehaviour {
    public string contractAddress;

    public async Task<FieldElement> create_game(Account account) {
        List<dojo.FieldElement> calldata = new List<dojo.FieldElement>();
        

        return await account.ExecuteRaw(new dojo.Call[] {
            new dojo.Call{
                to = new FieldElement(contractAddress).Inner,
                selector = "create_game",
                calldata = calldata.ToArray()
            }
        });
    }

    ...
}
```

The generated contract contains a set of methods that can be called from a **burner account**. However, they are not called directly on the client; for this purpose, **[DojoConnector](#function-calls)** is used.
