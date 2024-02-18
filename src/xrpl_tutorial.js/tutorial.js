const xrpl = require('xrpl');

async function main() {

    // Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()
  
    // ... custom code goes here
    // Create a wallet and fund it with the Testnet faucet:
    const fund_result = await client.fundWallet()
    const test_wallet = fund_result.wallet
    console.log(fund_result)

    // Get info from the ledger about the address we just funded
    const response = await client.request({
        "command": "account_info",
        "account": test_wallet.address,
        "ledger_index": "validated"
    })
    console.log(response)

    // Listen to ledger close events
    client.request({
        "command": "subscribe",
        "streams": ["ledger"]
    })
    client.on("ledgerClosed", async (ledger) => {
        console.log(`Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions!`)
    })
    
  
    // Disconnect when done (If you omit this, Node.js won't end the process)
    await client.disconnect()
}

main()