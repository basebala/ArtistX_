
from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet, Wallet
from xrpl.models.transactions import Payment, TrustSet, OfferCreate
#from xrpl.transaction import safe_sign_and_autofill_transaction, send_reliable_submission
from xrpl.utils import xrp_to_drops
#from xrpl.account import get_balance, get_account_info
import asyncio

# Connect to the XRPL network
client = JsonRpcClient("https://s.altnet.rippletest.net:51233")

def generate_and_fund_wallet(client):
    # Generate a new wallet using the Testnet faucet
    test_wallet = generate_faucet_wallet(client, debug=True)
    print(f"Wallet Address: {test_wallet.classic_address}")
    print(f"Wallet Secret: {test_wallet.seed}")

def check_balance(client, address):
    balance = get_balance(address, client)
    print(f"Balance for {address}: {balance} XRP")

def set_trust_line(client, wallet, currency_code, issuer_address):
    trust_set_tx = TrustSet(
        account=wallet.classic_address,
        limit_amount={
            "currency": currency_code,
            "issuer": issuer_address,
            "value": "1000000"
        }
    )
    signed_tx = safe_sign_and_autofill_transaction(trust_set_tx, wallet, client)
    response = send_reliable_submission(signed_tx, client)
    print("TrustSet result:", response.result)

def issue_custom_token(client, issuer_wallet, currency_code, amount, receiver_address):
    payment_tx = Payment(
        account=issuer_wallet.classic_address,
        amount={
            "currency": currency_code,
            "value": str(amount),
            "issuer": issuer_wallet.classic_address
        },
    destination=receiver_address,
    )
    signed_tx = safe_sign_and_autofill_transaction(payment_tx, issuer_wallet, client)
    response = send_reliable_submission(signed_tx, client)
    print("Custom Token Issue result:", response.result)

def place_order_on_dex(client, wallet, taker_gets_currency, taker_pays_currency, taker_gets_value, taker_pays_value):
    # Prepare the transaction
    offer_create_tx = OfferCreate(
        account=wallet.classic_address,
        taker_gets={
            "currency": taker_gets_currency,
            "value": str(taker_gets_value),
            "issuer": wallet.classic_address,# Adjust as needed
        },
        taker_pays={
            "currency": taker_pays_currency,
            "value": str(taker_pays_value),
            "issuer": wallet.classic_address,# Adjust as needed
        }
    )
    # Sign and submit the transaction
    signed_tx = safe_sign_and_autofill_transaction(offer_create_tx, wallet, client)
    result = send_reliable_submission(signed_tx, client)
    print("OfferCreate result:", result)

# Example usage
# You'll need to run these inside an asyncio event loop for async functions
# import asyncio
# asyncio.run(generate_and_fund_wallet(client))


from xrpl.clients import JsonRpcClient
JSON_RPC_URL = "https://s.altnet.rippletest.net:51234/"
client = JsonRpcClient(JSON_RPC_URL)
from xrpl.wallet import generate_faucet_wallet
test_wallet = generate_faucet_wallet(client, debug=True)
print(test_wallet)



from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet, Wallet
from xrpl.models.transactions import Payment, TrustSet, OfferCreate
#from xrpl.transaction import safe_sign_and_autofill_transaction, send_reliable_submission
from xrpl.utils import xrp_to_drops
#from xrpl.account import get_balance, get_account_info
import asyncio
import asyncio
from xrpl.asyncio.clients import AsyncWebsocketClient


async def main():
    # Define the network client
    async with AsyncWebsocketClient("wss://s.altnet.rippletest.net:51233") as client:
        print("Requesting addresses from the Testnet faucet...")
        wallet = await generate_faucet_wallet(client, debug=True)


asyncio.run(main())


from xrpl.clients import JsonRpcClient
from xrpl.wallet import generate_faucet_wallet
from xrpl.models.transactions import OfferCreate
from xrpl.transaction import submit_and_wait
from xrpl.ledger import get_latest_validated_ledger_sequence
from xrpl.utils import xrp_to_drops

# Connect to the XRPL Testnet
client = JsonRpcClient("https://s.altnet.rippletest.net:51234/")

# Generate a new wallet (For demonstration purposes. In a real application, you would use a securely stored wallet)
wallet = generate_faucet_wallet(client, debug=True)

# Get the current ledger index
ledger_index = get_latest_validated_ledger_sequence(client)

# Create a trade order (Example: Buy 100 XRP at a price of 0.5 USD/XRP)
# Note: The actual implementation should use real currency codes and issuer addresses
offer = OfferCreate(
    account=wallet.classic_address,
    taker_gets=xrp_to_drops(100),# Taker gets 100 XRP
    taker_pays={"currency": "USD", "issuer": "rPPzBAkLvG7Jo45RufpSno6uw4Nyh9SkYW", "value": "50"},# Taker pays 50 USD
    last_ledger_sequence=ledger_index + 5,
    fee="10")

# Submit the trade order
response = submit_and_wait(offer, client, wallet)

print("Trade order submitted:", response)




import asyncio
from xrpl.asyncio.clients import AsyncWebsocketClient
from xrpl.wallet import Wallet
from xrpl.models.transactions import Payment, TrustSet, OfferCreate
from xrpl.models.requests import BookOffers
from xrpl.utils import xrp_to_drops
from xrpl.asyncio.transaction import submit_and_wait
from xrpl.asyncio.ledger import get_latest_validated_ledger_sequence
from xrpl.asyncio.account import get_account_info

# This is your async main function where you can call other async functions
async def main():
    async with AsyncWebsocketClient("wss://s.altnet.rippletest.net:51233") as client:
        # Example: Generate a new wallet and fund it
        new_wallet = Wallet.create()
        print(f"New Wallet Address: {new_wallet.classic_address}")
        print(f"New Wallet Secret: {new_wallet.seed}")

# Example: Check balance for a wallet address
        await check_balance(client, "rUbWfKFSMe2BdWzUvo8K5eiKzyk2tJ51Nr")
        # Example: Setting a trust line for a custom token
        issuer_wallet = Wallet(seed="sEdT57FXo1VHcnui59nAmMcRE2drQJY")
        await set_trust_line(client, issuer_wallet, "USD", "rpQ7m94mSTEziqz44VnDBLKvY6NPZjPoTb", "1000000")

        # Add more examples as needed based on the operations above

async def check_balance(client, address):
    account_info = await get_account_info(address, client)
    balance = account_info.result["account_data"]["Balance"]
    print(f"Balance for {address}: {balance} drops")

async def set_trust_line(client, wallet, currency_code, issuer_address, value):
    trust_set_tx = TrustSet(
        account=wallet.classic_address,
        limit_amount={
            "currency": currency_code,
            "issuer": issuer_address,
            "value": value
        }
    )
    signed_tx = await safe_sign_and_autofill_transaction(trust_set_tx, wallet, client)
    response = await submit_transaction(signed_tx, client)
    print(f"TrustSet result: {response.result['engine_result']}")