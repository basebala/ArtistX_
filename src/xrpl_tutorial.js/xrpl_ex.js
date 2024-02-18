const xrpl = require("xrpl");

// Example credentials
const wallet = xrpl.Wallet.fromSeed("sEdVVCAA1A6YVGvvaaJpf97TPHgHkwa")
console.log(wallet.address) // this is the derived public key 


// Wrap code in an async function so we can use await
async function main() {

  // Define the network client
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
  await client.connect()

  // Prepare transaction -------------------------------------------------------
  const prepared = await client.autofill({
    "TransactionType": "Payment",
    "Account": "rwUovZSYAD6DtgAmMR3VxC8TtZAcHrJPLm",
    "Amount": xrpl.xrpToDrops("10"),
    "Destination": "rQDQytvKuTQ4MrvCBmo5f1WnZkV1dQuwox"
  })

  const max_ledger = prepared.LastLedgerSequence
  console.log("Prepared transaction instructions:", prepared)
  console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP")
  console.log("Transaction expires after ledger:", max_ledger)

  // Sign prepared instructions ------------------------------------------------
  // Sign prepared instructions ------------------------------------------------
  const signed = wallet.sign(prepared)
  console.log("Identifying hash:", signed.hash)
  console.log("Signed blob:", signed.tx_blob)
  // Submit signed blob --------------------------------------------------------

  try {
    const submit_result = await client.submitAndWait(signed.tx_blob)
    // submitAndWait() doesn't return until the transaction has a final result.
    // Raises XrplError if the transaction doesn't get confirmed by the network.
    // Does not handle disaster recovery.
    console.log("Transaction result:", submit_result)
  } catch(err) {
    console.log("Error submitting transaction:", err)
  }

  // Disconnect when done (If you omit this, Node.js won't end the process)
  client.disconnect()
}
  
  

main()