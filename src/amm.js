// In browsers, use a <script> tag. In Node.js, uncomment the following line:
const xrpl = require('xrpl')

const WS_URL = 'wss://s.devnet.rippletest.net:51233/'
const EXPLORER = 'devnet.xrpl.org' // Optional, for linking

async function main() {
  // Define the network client
  const client = new xrpl.Client(WS_URL)
  await client.connect()

  // Get credentials from the Faucet -------------------------------------------
  console.log("Requesting address from the faucet...")
  const wallet = (await client.fundWallet()).wallet
  // To use an existing account, use code such as the following:
  // const wallet = xrpl.Wallet.fromSeed(process.env['USE_SEED'])

  console.log(wallet.address)

  async function get_new_token(client, wallet, currency_code, issue_quantity) {
    // Get credentials from the Testnet Faucet -----------------------------------
    console.log("Funding an issuer address with the faucet...")
    const issuer = (await client.fundWallet()).wallet 
    console.log(`Got issuer address ${issuer.address}.`)
  
    // Enable issuer DefaultRipple ----------------------------------------------
    const issuer_setup_result = await client.submitAndWait({
      "TransactionType": "AccountSet",
      "Account": issuer.address,
      "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple
    }, {autofill: true, wallet: issuer} )
    if (issuer_setup_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Issuer DefaultRipple enabled: ${EXPLORER}/transactions/${issuer_setup_result.result.hash}`)
    } else {
      throw `Error sending transaction: ${issuer_setup_result}`
    }
  
    // Create trust line to issuer ----------------------------------------------
    const trust_result = await client.submitAndWait({
      "TransactionType": "TrustSet",
      "Account": wallet.address,
      "LimitAmount": {
        "currency": currency_code,
        "issuer": issuer.address,
        "value": "10000000000" // Large limit, arbitrarily chosen
      }
    }, {autofill: true, wallet: wallet})
    if (trust_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Trust line created: ${EXPLORER}/transactions/${trust_result.result.hash}`)
    } else {
      throw `Error sending transaction: ${trust_result}`
    }
    // Issue tokens -------------------------------------------------------------
    const issue_result = await client.submitAndWait({
      "TransactionType": "Payment",
      "Account": issuer.address,
      "Amount": {
        "currency": currency_code,
        "value": issue_quantity,
        "issuer": issuer.address
      },
      "Destination": wallet.address
    }, {autofill: true, wallet: issuer})
    if (issue_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Tokens issued: ${EXPLORER}/transactions/${issue_result.result.hash}`)
    } else {
      throw `Error sending transaction: ${issue_result}`
    }
  
    return {
      "currency": currency_code,
      "value": issue_quantity,
      "issuer": issuer
    }
  }
  const TST = await get_new_token(client, wallet, "TST", "100000")
  console.log("all done")
  // Acquire tokens ------------------------------------------------------------

  const foo_amount = await get_new_token(client, wallet, "FOO", "100000")

  async function generateAndFund(senderWallet, amount) {
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
    console.log(wallet.balances)
    return wallet
  }

  async function trust_and_issue(client, curWallet, currency_code, issue_quantity, issuer) {
    const trust_result = await client.submitAndWait({
      "TransactionType": "TrustSet",
      "Account": curWallet.address,
      "LimitAmount": {
        "currency": currency_code,
        "issuer": issuer.address,
        "value": "10000000000" // Large limit, arbitrarily chosen
      }
    }, {autofill: true, wallet: curWallet})
    if (trust_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Trust line created: ${EXPLORER}/transactions/${trust_result.result.hash}`)
    } else {
      throw `Error sending transaction: ${trust_result}`
    }
    // Issue tokens -------------------------------------------------------------
    const issue_result = await client.submitAndWait({
      "TransactionType": "Payment",
      "Account": issuer.address,
      "Amount": {
        "currency": currency_code,
        "value": issue_quantity,
        "issuer": issuer.address
      },
      "Destination": curWallet.address
    }, {autofill: true, wallet: issuer})
    if (issue_result.result.meta.TransactionResult == "tesSUCCESS") {
      console.log(`Tokens issued: ${EXPLORER}/transactions/${issue_result.result.hash}`)
    } else {
      throw `Error sending transaction: ${issue_result}`
    }
  }

  const wallet2 = await generateAndFund(wallet, "1000")
  console.log(wallet2.address)
  console.log("created another wallet")

  await trust_and_issue(client, wallet2, "TST", "100000", TST.issuer)
  await trust_and_issue(client, wallet2, "FOO", "100000", foo_amount.issuer)

  const ss = await client.request({"command": "server_state"})
  const amm_fee_drops = ss.result.state.validated_ledger.reserve_inc.toString()
  console.log(`Current AMMCreate transaction cost:
               ${xrpl.dropsToXrp(amm_fee_drops)} XRP`)

  const ammcreate_result = await client.submitAndWait({
    "TransactionType": "AMMCreate",
    "Account": wallet.address,
    "Amount": {
      currency: TST.currency,
      issuer: TST.issuer.address,
      value: "10000"
    },
    "Amount2": {
      "currency": foo_amount.currency,
      "issuer": foo_amount.issuer.address,
      "value": "10000"
    },
    "TradingFee": 0, // 0.5%
    "Fee": amm_fee_drops
  }, {autofill: true, wallet: wallet, fail_hard: true})
  // Use fail_hard so you don't waste the tx cost if you mess up
  if (ammcreate_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`AMM created: ${EXPLORER}/transactions/${ammcreate_result.result.hash}`)
  } else {
    throw `Error sending transaction: ${ammcreate_result}`
  }


  const amm_info_request = {
    "command": "amm_info",
    "asset": {
      "currency": TST.currency,
      "issuer": TST.issuer.address,
    },
    "asset2": {
      "currency": foo_amount.currency,
      "issuer": foo_amount.issuer.address
    },
    "ledger_index": "validated"
  }


  const offer_result_2 = await client.submitAndWait({
    "TransactionType": "OfferCreate",
    "Account": wallet2.address,
    "TakerPays": {
      currency: foo_amount.currency,
      issuer: foo_amount.issuer.address,
      value: "1000"
    },
    "TakerGets": {
      currency: TST.currency,
      issuer: TST.issuer.address,
      value: "2000"
    }
  }, {autofill: true, wallet: wallet2})
  if (offer_result_2.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`TST offer placed: ${EXPLORER}/transactions/${offer_result_2.result.hash}`)
    const balance_changes = xrpl.getBalanceChanges(offer_result_2.result.meta)
    for (const bc of balance_changes) {
      if (bc.account != wallet2.address) {continue}
      for (const bal of bc.balances) {
        if (bal.currency == "TST") {
          console.log(`Got ${bal.value} ${bal.currency}.${bal.issuer}.`)
          break
        }
      }
      break
    }

  } else {
    throw `Error sending transaction: ${offer_result_2}`
  }

  const amm_info_result2 = await client.request(amm_info_request)
  console.log(amm_info_result2)
  const lp_token = amm_info_result2.result.amm.lp_token
  console.log(lp_token)
  const amount = amm_info_result2.result.amm.amount
  const amount2 = amm_info_result2.result.amm.amount2
  console.log(`The AMM account ${lp_token.issuer} has ${lp_token.value} total
               LP tokens outstanding, and uses the currency code ${lp_token.currency}.`)
  console.log(`In its pool, the AMM holds ${amount.value} ${amount.currency}.${amount.issuer}
               and ${amount2.value} ${amount2.currency}.${amount2.issuer}`)
  


  const account_lines_result = await client.request({
    "command": "account_lines",
    "account": wallet2.address,
    // Tip: To look up only the new AMM's LP Tokens, uncomment:
    // "peer": lp_token.issuer,
    "ledger_index": "validated"
  })
  console.log(account_lines_result)
  await client.disconnect()
}
main()