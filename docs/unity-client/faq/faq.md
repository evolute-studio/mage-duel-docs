---
sidebar_position: 1
---

# FAQ

## Errors

- **ContractNotFound**
    - check contract addresses (scene **StartScene** -> game object **EntryPoint** -> component **EntryPoint** -> field **DojoConfig**)
    - you might have created a new katana and your burner account or bot account is not deployed to it. Clear **PlayerPrefs** (you can use this [plugin](https://assetstore.unity.com/packages/tools/utilities/playerprefs-editor-167903?srsltid=AfmBOorhJGJNGstB7nJ0NzSUsb_N45ICEEBPBY2wFsrQOH9qLLyGxYPP))
- **TransactionExecutionError**
    - the error is mainly related to a server error. This can be caused by either incorrect call data or incorrect server logic. To find out error details - check katana logs.
- **InvalideTransactionNonce**
    - the error occurs when the nonce doesn't match the expected one. For example, when a **Controller** player clicks to create a match with a bot, sometimes they need to confirm the transaction through the Controller window, but the bot is already trying to connect to the game and it turns out that the nonce differs by one.

If using **Cartridge Slot**:
- **JSON RPC error** 
    - code 13, 14 - mainly a temporary issue with Cartridge servers. Usually resolves in one or two minutes
    - code -32000 deployment not found - you might have made a mistake with the katana rpc address or torii. Check the addresses and project names
    - code -32000 can't reach deployment - your deployment exists, but there's an issue with it. Contact Cartridge support.