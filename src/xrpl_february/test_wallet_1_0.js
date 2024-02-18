const xrpl = require('xrpl')


async function generateAndFund(senderWallet, amount) {
    // Connect to the XRPL network
    const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233')
    await client.connect()

    // Generate a new wallet
    const wallet = xrpl.Wallet.generate();

    console.log("Wallet Address:", wallet.address)
    console.log("Wallet Secret:", wallet.seed) // This is the private key

    // Don't forget to disconnect the client
      const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": senderWallet.address,
        "Amount": xrpl.xrpToDrops(amount), // Convert XRP to drops
        "Destination": wallet.address
      })
      const signed = senderWallet.sign(prepared)
      const tx = await client.submitAndWait(signed.tx_blob)

      console.log("Transaction result:", tx.result.meta.TransactionResult)
      console.log("Explorers:", `https://testnet.xrpl.org/transactions/${signed.hash}`)

      await client.disconnect()

// Replace with your sender wallet details and receiver address
}



async function connectToTestnet() {
    // Testnet server URL
    const server = "wss://s.altnet.rippletest.net:51233";
  
    // Create a client connected to the Testnet
    const client = new xrpl.Client(server);
    await client.connect();
  
    console.log("Connected to the XRPL Testnet");
  
    // Your code to interact with the Testnet goes here
  
    // Disconnect when done


    const myAddress = "rpQ7m94mSTEziqz44VnDBLKvY6NPZjPoTb";
    const mySecret = "sEdT57FXo1VHcnui59nAmMcRE2drQJY";

    // Create a wallet instance
    const myWallet = xrpl.Wallet.fromSecret(mySecret);

    console.log("Wallet Address:", myWallet.address);


    await client.disconnect();
    console.log("Disconnected");
  }

  async function checkBalance(walletAddress) {
  // Connect to the Testnet server
  const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();

  // Fetch the account info
  const account_info = await client.request({
    command: 'account_info',
    account: walletAddress,
    ledger_index: 'validated'
  });

  // Print the account balance
  console.log(`Balance for ${walletAddress}:`, xrpl.dropsToXrp(account_info.result.account_data.Balance), 'XRP');

  // Disconnect the client
  await client.disconnect();
}

async function setTrustLine(account, currencyCode, issuerAddress) {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
  await client.connect()

  const prepared = await client.autofill({
    "TransactionType": "TrustSet",
    "Account": account.address,
    "LimitAmount": {
      "currency": currencyCode,
      "issuer": issuerAddress,
      "value": "1000000" // Trust limit value in issued currency
    }
  })
  const signed = account.sign(prepared)
  const result = await client.submitAndWait(signed.tx_blob)

  console.log("TrustSet result:", result.result.meta.TransactionResult)
  await client.disconnect()
}

async function issueCustomToken(issuerWallet, currencyCode, amount, receiverAddress) {
      const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
      await client.connect()
    
      const prepared = await client.autofill({
        "TransactionType": "Payment",
        "Account": issuerWallet.address,
        "Amount": {
          "currency": currencyCode,
          "value": amount.toString(),
          "issuer": issuerWallet.address
        },
        "Destination": receiverAddress
      })
      const signed = issuerWallet.sign(prepared)
      const result = await client.submitAndWait(signed.tx_blob)
    
      console.log("Custom Token Issue result:", result.result.meta.TransactionResult)
      await client.disconnect()
}

async function placeOrderOnDEX(wallet, takerGetsCurrency, takerPaysCurrency, takerGetsValue, takerPaysValue) {
      const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
      await client.connect()
    
      // Determine the TakerGets object (what the taker will receive)
      let takerGets = {}
      if (takerGetsCurrency === "XRP") {
        takerGets = xrpl.xrpToDrops(takerGetsValue) // Convert XRP to drops
      } else {
        takerGets = {
          "currency": takerGetsCurrency.currencyCode,
          "issuer": takerGetsCurrency.issuer,
          "value": takerGetsValue.toString()
        }
      }
    
      // Determine the TakerPays object (what the taker will pay)
      let takerPays = {}
      if (takerPaysCurrency === "XRP") {
        takerPays = xrpl.xrpToDrops(takerPaysValue) // Convert XRP to drops
      } else {
        takerPays = {
          "currency": takerPaysCurrency.currencyCode,
          "issuer": takerPaysCurrency.issuer,
          "value": takerPaysValue.toString()
        }
      }
    
      // Prepare the transaction
      const preparedTx = await client.autofill({
        "TransactionType": "OfferCreate",
        "Account": wallet.address,
        "TakerGets": takerGets,
        "TakerPays": takerPays
      })
    
      // Sign the transaction
      const signedTx = wallet.sign(preparedTx)
    
      // Submit the transaction
      const result = await client.submitAndWait(signedTx.tx_blob)
      console.log("OfferCreate result:", result)
      console.log("Transaction hash:", signedTx.hash)
      console.log("View transaction on Testnet explorer: https://testnet.xrpl.org/transactions/" + signedTx.hash)
    
      await client.disconnect()
}

async function queryOrderBook(base, counter) {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    const request = {
      "command": "book_offers",
      "taker_gets": {
        "currency": base.currency,
        "issuer": base.issuer
      },
      "taker_pays": {
        "currency": counter.currency,
        "issuer": counter.issuer
      }
    }
  
    const orderBook = await client.request(request)
    console.log("Order book:", orderBook)
    await client.disconnect()
  }

  async function subscribeToOrderBook(base, counter) {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()
    const request = {
      "command": "subscribe",
      "books": [{
        "taker_gets": {
          "currency": base.currency,
          "issuer": base.issuer
        },
        "taker_pays": {
          "currency": counter.currency,
          "issuer": counter.issuer
        },
        "snapshot": true,
        "both": true
      }]
    }
  
    const orderBook = await client.request(request)
    console.log("Order book:", orderBook)
    await client.disconnect()
  }


  async function fetchTransactions(account) {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()
    const request = {
        command: "account_tx",
        account: account,
        limit: 10, // Adjust based on how many transactions you want to fetch
        ledger_index_min: -1,
        ledger_index_max: -1,
        binary: false // Set to true for binary format, false for JSON
    }

    const response = await client.request(request)
    console.log(JSON.stringify(response.result.transactions, null, 2))

    await client.disconnect()
}

async function queryFulfilledOrders(account) {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    const response = await client.request({
        command: "account_tx",
        account: account,
        limit: 10, // Adjust as needed
    })

    const transactions = response.result.transactions.filter(tx => tx.tx.TransactionType === "OfferCreate" && tx.meta.TransactionResult === "tesSUCCESS")
    console.log("Fulfilled Orders:", JSON.stringify(transactions, null, 2))

    await client.disconnect()
}

  
  // Example usage  
  
  // Example usage









//Wallet address: rUbWfKFSMe2BdWzUvo8K5eiKzyk2tJ51Nr
//Wallet Secret: sEdStZvho8KrhpvBX8yfSuThYgXWSkp


//Wallet Address: rBKzSqGzAjZh4UVt7tjrg57BbDSG5QhdqS
//Wallet Secret: sEdVwAUtwz2Au57ZZwybdo1dktFxCot

// Example: Setting a trust line for a custom token


//generateWallet().catch(console.error)

//connectToTestnet().catch(console.error);


// Replace 'YOUR_TESTNET_WALLET_ADDRESS' with your actual Testnet wallet address
//checkBalance('rUbWfKFSMe2BdWzUvo8K5eiKzyk2tJ51Nr').catch(console.error);



//const senderWallet = xrpl.Wallet.fromSecret("sEdT57FXo1VHcnui59nAmMcRE2drQJY")
//generateAndFund(senderWallet, "1000").catch(console.error)
  
/*
const issuerWallet = xrpl.Wallet.fromSecret("sEdT57FXo1VHcnui59nAmMcRE2drQJY")
const currencyCode = "USD"
const receiverAddress = "rBKzSqGzAjZh4UVt7tjrg57BbDSG5QhdqS"
issueCustomToken(issuerWallet, currencyCode, "1000", receiverAddress).catch(console.error)
*/

/*
const account = xrpl.Wallet.fromSecret("sEdVwAUtwz2Au57ZZwybdo1dktFxCot") // Your account secret
const currencyCode = "USD" // Custom token code
const issuerAddress = "rpQ7m94mSTEziqz44VnDBLKvY6NPZjPoTb" // Issuer account address
setTrustLine(account, currencyCode, issuerAddress).catch(console.error)
*/


/*
const wallet = xrpl.Wallet.fromSecret("sEdVwAUtwz2Au57ZZwybdo1dktFxCot")
const takerGetsCurrency = "XRP" // Replace with your currency details
const takerPaysCurrency = { currencyCode: "USD", issuer: "rpQ7m94mSTEziqz44VnDBLKvY6NPZjPoTb"} // Or another issued currency
placeOrderOnDEX(wallet, takerGetsCurrency, takerPaysCurrency, "100", "100").catch(console.error)
*/

//queryOrderBook({ "currency": "USD", "issuer": "rpQ7m94mSTEziqz44VnDBLKvY6NPZjPoTb" }, { "currency": "XRP" }).catch(console.error)

//subscribeToOrderBook({ "currency": "USD", "issuer": "rpQ7m94mSTEziqz44VnDBLKvY6NPZjPoTb" }, { "currency": "XRP" }).catch(console.error)

/*
const accountAddress = "rBKzSqGzAjZh4UVt7tjrg57BbDSG5QhdqS" // Replace with the account address you're interested in
fetchTransactions(accountAddress).catch(console.error)
*/


const accountAddress = "rBKzSqGzAjZh4UVt7tjrg57BbDSG5QhdqS" // Replace with the account address
queryFulfilledOrders(accountAddress).catch(console.error)


//1. whenever a user registers create a new wallet - save that wallet info tie it to user id
//2. buy/sell functionality create order from frontend (frontend integration)
//3. 