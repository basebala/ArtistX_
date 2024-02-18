const xrpl = require('xrpl')
const BigNumber = require('bignumber.js')

// Wrap code in an async function so we can use await
async function main() {

    // Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    // Get credentials from the Testnet Faucet -----------------------------------
    console.log("Requesting address from the Testnet faucet...")
    const wallet = (await client.fundWallet()).wallet
    console.log(`Got address ${wallet.address}.`)
    // To use existing credentials, you can load them from a seed value, for
    // example using an environment variable as follows:
    // const wallet = xrpl.Wallet.fromSeed(process.env['MY_SEED'])

    // Disconnect when done (If you omit this, Node.js won't end the process)
    await client.disconnect()
}

main()