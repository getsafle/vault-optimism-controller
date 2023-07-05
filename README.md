# Vault-optimism-controller <code><a href="https://www.docker.com/" target="_blank"><img height="50" src="https://assets.coingecko.com/coins/images/25244/small/Optimism.png?1660904599"></a></code>

[![npm version](https://badge.fury.io/js/@getsafle%2Fvault-optimism-controller.svg)](https://badge.fury.io/js/@getsafle%2Fvault-optimism-controller)    <img alt="Static Badge" src="https://img.shields.io/badge/License-MIT-green">   [![Discussions][discussions-badge]][discussions-link]
 <img alt="Static Badge" src="https://img.shields.io/badge/Optimism_controller-documentation-purple">   

A Module written in javascript for managing various keyrings of Optimism accounts, encrypting them, and using them.

- [Installation](#installation)
- [Initialize the Optimism Controller class](#initialize-the-optimism-controller-class)
- [Methods](#methods)
  - [Generate Keyring with 1 account and encrypt](#generate-keyring-with-1-account-and-encrypt)
  - [Restore a keyring with the first account using a mnemonic](#restore-a-keyring-with-the-first-account-using-a-mnemonic)
  - [Add a new account to the keyring object](#add-a-new-account-to-the-keyring-object)
  - [Export the private key of an address present in the keyring](#export-the-private-key-of-an-address-present-in-the-keyring)
  - [Sign a transaction](#sign-a-transaction)
  - [Sign a message](#sign-a-message)
  - [Get balance](#get-balance)


## Installation
```
npm install --save @getsafle/vault-optimism-controller
```
## Initialize the Optimism Controller class

```
const { KeyringController, getBalance } = require('@getsafle/vault-optimism-controller');

const optimismController = new KeyringController({
  encryptor: {
    // An optional object for defining encryption schemes:
    // Defaults to Browser-native SubtleCrypto.
    encrypt(password, object) {
      return new Promise('encrypted!');
    },
    decrypt(password, encryptedString) {
      return new Promise({ foo: 'bar' });
    },
  },
});
```

## Methods

### Generate Keyring with 1 account and encrypt

```
const keyringState = await optimismController.createNewVaultAndKeychain(password);
```

### Restore a keyring with the first account using a mnemonic

```
const keyringState = await optimismController.createNewVaultAndRestore(password, mnemonic);
```

### Add a new account to the keyring object

```
const keyringState = await optimismController.addNewAccount(keyringObject);
```

### Export the private key of an address present in the keyring

```
const privateKey = await optimismController.exportAccount(address);
```

### Sign a transaction

```
const signedTx = await optimismController.signTransaction(optimismTx, _fromAddress);
```

### Sign a message

```
const signedMsg = await optimismController.signMessage(msgParams);
```

### Sign a message

```
const signedObj = await optimismController.sign(msgParams, pvtKey, web3Obj);
```

### Sign Typed Data (EIP-712)

```
const signedData = await optimismController.signTypedMessage(msgParams);
```

### Get balance

```
const balance = await getBalance(address, web3);
```
[discussions-badge]: https://img.shields.io/badge/Code_Quality-passing-rgba
[discussions-link]: https://github.com/getsafle/vault-optimism-controller/actions
