const xrpl = require('xrpl')

// Wrap code in an async function so we can use await
async function main() {

    // Define the network client
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
    await client.connect()

    const cold_wallet = (await client.fundWallet()).wallet
    const hot_wallet = (await client.fundWallet()).wallet


    // Configure issuer (cold address) settings ----------------------------------
    const cold_settings_tx = {
        "TransactionType": "AccountSet",
        "Account": cold_wallet.address,
        "TransferRate": 0.1,
        "TickSize": 5,
        "Domain": "6578616D706C652E636F6D", // "example.com"
        "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple,
        // Using tf flags, we can enable more flags in one transaction
        "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
                xrpl.AccountSetTfFlags.tfRequireDestTag)
    }

    const cst_prepared = await client.autofill(cold_settings_tx)
    const cst_signed = cold_wallet.sign(cst_prepared)
    console.log("Sending cold address AccountSet transaction...")
    const cst_result = await client.submitAndWait(cst_signed.tx_blob)
    if (cst_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${cst_signed.hash}`)
    } else {
        throw `Error sending transaction: ${cst_result}`
    }


    // Configure hot address settings --------------------------------------------
    const hot_settings_tx = {
        "TransactionType": "AccountSet",
        "Account": hot_wallet.address,
        "Domain": "6578616D706C652E636F6D", // "example.com"
        // enable Require Auth so we can't use trust lines that users
        // make to the hot address, even by accident:
        "SetFlag": xrpl.AccountSetAsfFlags.asfRequireAuth,
        "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
                xrpl.AccountSetTfFlags.tfRequireDestTag)
    }

    const hst_prepared = await client.autofill(hot_settings_tx)
    const hst_signed = hot_wallet.sign(hst_prepared)
    console.log("Sending hot address AccountSet transaction...")
    const hst_result = await client.submitAndWait(hst_signed.tx_blob)
    if (hst_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${hst_signed.hash}`)
    } else {
        throw `Error sending transaction: ${hst_result.result.meta.TransactionResult}`
    }


    // Create trust line from hot to cold address --------------------------------
    const currency_code = "FOO"
    const trust_set_tx = {
        "TransactionType": "TrustSet",
        "Account": hot_wallet.address,
        "LimitAmount": {
        "currency": currency_code,
        "issuer": cold_wallet.address,
        "value": "10000000000" // Large limit, arbitrarily chosen
        }
    }

    const ts_prepared = await client.autofill(trust_set_tx)
    const ts_signed = hot_wallet.sign(ts_prepared)
    console.log("Creating trust line from hot address to issuer...")
    const ts_result = await client.submitAndWait(ts_signed.tx_blob)
    if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed.hash}`)
    } else {
        throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`
    }

   // Send token ----------------------------------------------------------------
    let issue_quantity = "3800"

    const send_token_tx = {
        "TransactionType": "Payment",
        "Account": cold_wallet.address,
        "Amount": {
            "currency": currency_code,
            "value": issue_quantity,
            "issuer": cold_wallet.address
        },
        "Destination": hot_wallet.address,
        "DestinationTag": 1 // Needed since we enabled Require Destination Tags
                            // on the hot account earlier.
    }

    const pay_prepared = await client.autofill(send_token_tx)
    const pay_signed = cold_wallet.sign(pay_prepared)
    console.log(`Cold to hot - Sending ${issue_quantity} ${currency_code} to ${hot_wallet.address}...`)
    const pay_result = await client.submitAndWait(pay_signed.tx_blob)
    if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`)
    } else {
        console.log(pay_result)
        throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`
    }




    //second currency!!

    // Create trust line from hot to cold address --------------------------------
    const currency_code_2 = "DRK"
    const trust_set_tx_2 = {
        "TransactionType": "TrustSet",
        "Account": hot_wallet.address,
        "LimitAmount": {
        "currency": currency_code_2,
        "issuer": cold_wallet.address,
        "value": "10000000000" // Large limit, arbitrarily chosen
        }
    }

    const ts_prepared_2 = await client.autofill(trust_set_tx_2)
    const ts_signed_2 = hot_wallet.sign(ts_prepared_2)
    console.log("Creating trust line from hot address to issuer...")
    const ts_result_2 = await client.submitAndWait(ts_signed_2.tx_blob)
    if (ts_result_2.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed_2.hash}`)
    } else {
        throw `Error sending transaction: ${ts_result_2.result.meta.TransactionResult}`
    }

   // Send token ----------------------------------------------------------------
    let issue_quantity_2 = "1400"

    const send_token_tx_2 = {
        "TransactionType": "Payment",
        "Account": cold_wallet.address,
        "Amount": {
            "currency": currency_code_2,
            "value": issue_quantity_2,
            "issuer": cold_wallet.address
        },
        "Destination": hot_wallet.address,
        "DestinationTag": 1 // Needed since we enabled Require Destination Tags
                            // on the hot account earlier.
    }

    const pay_prepared_2 = await client.autofill(send_token_tx_2)
    const pay_signed_2 = cold_wallet.sign(pay_prepared_2)
    console.log(`Cold to hot - Sending ${issue_quantity_2} ${currency_code_2} to ${hot_wallet.address}...`)
    const pay_result_2 = await client.submitAndWait(pay_signed_2.tx_blob)
    if (pay_result_2.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed_2.hash}`)
    } else {
        console.log(pay_result_2)
        throw `Error sending transaction: ${pay_result_2.result.meta.TransactionResult}`
    }

    // Check balances ------------------------------------------------------------
    console.log("Getting hot address balances...")
    const hot_balances_2 = await client.request({
        command: "account_lines",
        account: hot_wallet.address,
        ledger_index: "validated"
    })
    console.log(hot_balances_2.result)

    console.log("Getting cold address balances...")
    const cold_balances_2 = await client.request({
        command: "gateway_balances",
        account: cold_wallet.address,
        ledger_index: "validated",
        hotwallet: [hot_wallet.address]
    })
    console.log(JSON.stringify(cold_balances_2.result, null, 2))








    //customer transaction

    const customer_one_wallet = (await client.fundWallet()).wallet

    const trust_set_tx2 = {
        "TransactionType": "TrustSet",
        "Account": customer_one_wallet.address,
        "LimitAmount": {
          "currency": currency_code,
          "issuer": cold_wallet.address,
          "value": "10000000000" // Large limit, arbitrarily chosen
        }
      }
    
      const ts_prepared2 = await client.autofill(trust_set_tx2)
      const ts_signed2 = customer_one_wallet.sign(ts_prepared2)
      console.log("Creating trust line from customer_one address to issuer...")
      const ts_result2 = await client.submitAndWait(ts_signed2.tx_blob)
      if (ts_result2.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed2.hash}`)
      } else {
        throw `Error sending transaction: ${ts_result2.result.meta.TransactionResult}`
      }

      issue_quantity = "4000"

    const send_token_tx2 = {
        "TransactionType": "Payment",
        "Account": hot_wallet.address,
        "Amount": {
        "currency": currency_code,
        "value": issue_quantity,
        "issuer": cold_wallet.address
        },
        "Destination": customer_one_wallet.address,
        "DestinationTag": 1 // Needed since we enabled Require Destination Tags
                            // on the hot account earlier.
    }

    const pay_prepared2 = await client.autofill(send_token_tx2)
    const pay_signed2 = hot_wallet.sign(pay_prepared2)
    console.log(`Hot to customer_one - Sending ${issue_quantity} ${currency_code} to ${customer_one_wallet.address}...`)
    const pay_result2 = await client.submitAndWait(pay_signed2.tx_blob)
    if (pay_result2.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed2.hash}`)
    } else {
        console.log(pay_result2)
        throw `Error sending transaction: ${pay_result2.result.meta.TransactionResult}`
    }

    console.log("Getting customer one address balances...")
    const customer_one_balances = await client.request({
        command: "account_lines",
        account: customer_one_wallet.address,
        ledger_index: "validated"
    })
    console.log(customer_one_balances.result)


    // Disconnect when done (If you omit this, Node.js won't end the process)
    await client.disconnect()
}
  
main()