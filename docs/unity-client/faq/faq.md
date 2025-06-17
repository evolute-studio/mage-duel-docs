---
sidebar_position: 1
---

# Frequently Asked Questions

## Common Errors and Solutions

### Contract Not Found Error

**Error**: `ContractNotFound`

**Possible Causes**:
1. Incorrect contract configuration
2. Missing deployment on new Katana instance

**Solutions**:
1. Verify contract addresses in Unity Editor:
   - Open scene `StartScene`
   - Select game object `EntryPoint`
   - In the `EntryPoint` component, check the `DojoConfig` field
2. If using a new Katana instance:
   - Clear PlayerPrefs data
   - You can use the [PlayerPrefs Editor](https://assetstore.unity.com/packages/tools/utilities/playerprefs-editor-167903?srsltid=AfmBOorhJGJNGstB7nJ0NzSUsb_N45ICEEBPBY2wFsrQOH9qLLyGxYPP) plugin

### Transaction Execution Error

**Error**: `TransactionExecutionError`

**Description**: Server-side error that can occur during transaction processing.

**Possible Causes**:
- Invalid call data
- Server logic issues

**Solution**: Check Katana logs for detailed error information.

### Invalid Transaction Nonce

**Error**: `InvalideTransactionNonce`

**Description**: Occurs when transaction nonce doesn't match the expected value.

**Common Scenario**: 
When a Controller player creates a match with a bot:
1. Player initiates match creation
2. Transaction confirmation required in Controller window
3. Bot attempts to connect before confirmation
4. Nonce mismatch occurs

## Cartridge Slot Specific Issues

### JSON RPC Errors

#### Temporary Server Issues
- **Error Codes**: 13, 14
- **Description**: Temporary Cartridge server issues
- **Resolution**: Usually resolves automatically within 1-2 minutes

#### Deployment Not Found
- **Error Code**: -32000
- **Description**: "deployment not found"
- **Possible Causes**:
  - Incorrect Katana RPC address
  - Incorrect Torii address
  - Wrong project name
- **Solution**: Verify all connection addresses and project names

#### Deployment Connection Issues
- **Error Code**: -32000
- **Description**: "can't reach deployment"
- **Description**: Deployment exists but is experiencing issues
- **Solution**: Contact Cartridge support team