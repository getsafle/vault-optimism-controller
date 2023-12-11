var assert = require('assert');
const Web3 = require('web3')
const CryptoJS = require('crypto-js');
const { KeyringController: OptimismKeyring, getBalance } = require('../src/index')
const {
    HD_WALLET_12_MNEMONIC,
    HD_WALLET_12_MNEMONIC_TEST_OTHER,
    HD_WALLET_24_MNEMONIC,
    TESTING_MESSAGE_1,
    TESTING_MESSAGE_2,
    TESTING_MESSAGE_3,
    EXTERNAL_ACCOUNT_PRIVATE_KEY,
    EXTERNAL_ACCOUNT_ADDRESS,
    EXTERNAL_ACCOUNT_WRONG_PRIVATE_KEY_1,
    EXTERNAL_ACCOUNT_WRONG_PRIVATE_KEY_3,
    OPTIMISM_NETWORK: {
        TESTNET,
        MAINNET
    },
} = require('./constants');
const { sign } = require('crypto');
/*
const CONTRACT_MINT_PARAM = {
    from: OPTIMISM_CONTRACT,
    to: '', // this will be the current account 
    amount: 1,
    nonce: 0,
    signature: [72, 0, 101, 0, 108, 0, 108, 0, 111, 0, 220, 122]
}
*/
const opts = {
    encryptor: {
        encrypt(pass, object) {
            const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(object), pass).toString();

            return ciphertext;
        },
        decrypt(pass, encryptedString) {
            const bytes = CryptoJS.AES.decrypt(encryptedString, pass);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            return decryptedData;
        },
    },
}

const opts_empty = {}

const PASSWORD = "random_password"

/**
 * Transaction object type
 * {    from: from address,
        to: to address,
        value: amount (in wei),
        data: hex string}
 */

describe('Initialize wallet ', () => {
    const optimismKeyring = new OptimismKeyring(opts)

    it("Create new vault and keychain", async () => {
        const res = await optimismKeyring.createNewVaultAndKeychain(PASSWORD)
        console.log("res=", res)
    })

    it("Create new vault and restore", async () => {
        const res = await optimismKeyring.createNewVaultAndRestore(PASSWORD, HD_WALLET_12_MNEMONIC)
        assert(optimismKeyring.keyrings[0].mnemonic === HD_WALLET_12_MNEMONIC, "Wrong mnemonic")
    })

    it("Export account (privateKey)", async () => {
        const res = await optimismKeyring.getAccounts()
        let account = res[0]
        const accRes = await optimismKeyring.exportAccount(account)
        console.log("accRes ", accRes, Buffer.from(accRes, 'hex'))
    })

    it("Get accounts", async () => {
        const acc = await optimismKeyring.getAccounts()
        console.log("acc ", acc)
    })

    it("Should import correct account ", async () => {
        const address = await optimismKeyring.importWallet(EXTERNAL_ACCOUNT_PRIVATE_KEY)
        assert(address.toLowerCase() === EXTERNAL_ACCOUNT_ADDRESS.toLowerCase(), "Wrong address")
        assert(optimismKeyring.importedWallets.length === 1, "Should have 1 imported wallet")
    })

    it("Get address balance", async () => {
        const accounts = await optimismKeyring.getAccounts()
        const web3 = new Web3(TESTNET.URL);
        const balance = await getBalance(accounts[0], web3)
        console.log(" get balance ", balance, accounts)
    })

    it("Get fees for a optimism tx", async () => {
        const accounts = await optimismKeyring.getAccounts()
        const web3 = new Web3(TESTNET.URL);
        const tx = {
            from: accounts[0],
            to: '0x641BB2596D8c0b32471260712566BF933a2f1a8e',
            value: 0,
            data: "0x"
        }
        const getEstimate = await optimismKeyring.getFees(tx, web3)
        console.log(" get gas estimate:  ", getEstimate);

    })

    it("sign Transaction ", async () => {

        const accounts = await optimismKeyring.getAccounts()
        const from = accounts[0]
        const web3 = new Web3(TESTNET.URL);

        const count = await web3.eth.getTransactionCount(from);

        const defaultNonce = await web3.utils.toHex(count);
        const to = '0x641BB2596D8c0b32471260712566BF933a2f1a8e' 

        const getFeeEstimate= await optimismKeyring.getFees({from,to,
            value: web3.utils.numberToHex(web3.utils.toWei('0.00001', 'ether')),data:"0x00"},web3);
            console.log(getFeeEstimate);

            

        const rawTx = {
            to,
            from,
            value: web3.utils.numberToHex(web3.utils.toWei('0.00001', 'ether')),
            gasLimit: getFeeEstimate.gasLimit,
            maxPriorityFeePerGas: getFeeEstimate.fees.slow.maxPriorityFeePerGas,
            maxFeePerGas: getFeeEstimate.fees.slow.maxFeePerGas,
            nonce: defaultNonce,
            data: '0x',
            type: 2,
            chainId: TESTNET.CHAIN_ID,
        };

        const privateKey = await optimismKeyring.exportAccount(accounts[0])
        const signedTX = await optimismKeyring.signTransaction(rawTx, privateKey)
        console.log("signedTX ", signedTX)
        

    })
})