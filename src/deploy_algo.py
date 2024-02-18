from algosdk import account, transaction
from algosdk.v2client import algod
import base64

# Initialize the algod client
algod_address = "http://localhost:4001"
algod_token = "a" * 64
algod_client = algod.AlgodClient(algod_token, algod_address)

# Load your account's mnemonic
mnemonic = ""
private_key = mnemonic.to_private_key(mnemonic)
my_address = account.address_from_private_key(private_key)

# Read the TEAL program
with open("trading_contract.teal", "r") as f:
    teal_program = f.read()

# Compile the TEAL program
response = algod_client.compile(teal_program)
program_id = response['hash']
program_bytes = base64.b64decode(response['result'])

# Create and send the transaction


#params
params = algod_client.suggested_params()
#/params


txn = transaction.ApplicationCreateTxn(my_address, params, 
                                       on_complete=transaction.OnComplete.NoOpOC,
                                       approval_program=program_bytes,
                                       clear_program=program_bytes,
                                       global_schema=transaction.StateSchema(num_uints=1, num_byte_slices=0),
                                       local_schema=transaction.StateSchema(num_uints=1, num_byte_slices=0))

# Sign and send the transaction
signed_txn = txn.sign(private_key)
tx_id = signed_txn.transaction.get_txid()
algod_client.send_transaction(signed_txn)

# Wait for confirmation
transaction.wait_for_confirmation(algod_client, tx_id)