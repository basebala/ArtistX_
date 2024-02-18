
import xrpl_february.pyripple as pyripple
from xrpl.wallet import generate_faucet_wallet
    

async def customer_transaction_sell(wallet, currency, amount, cost):
    print("test_debug")
    testnet_url = "https://s.altnet.rippletest.net:51234"
    client = pyripple.clients.JsonRpcClient(testnet_url)
    cold_wallet = generate_faucet_wallet(client, debug=True)
    hot_wallet = generate_faucet_wallet(client, debug=True)
    seq = [0]
    def submit_transaction(tx, wallet):
        response = pyripple.transaction.submit_and_wait(tx, client, wallet)
        seq[0]= response.result['LastLedgerSequence']
        if 'validated' in response.result and response.result['validated']:
            print(f"Transaction successful")
            return True
        else:
            print(f"Transaction failed")
            return False

    cold_settings_tx = pyripple.models.transactions.AccountSet(
        account=cold_wallet.address,
        transfer_rate=0,
        tick_size=5,
        domain=bytes.hex("example.com".encode("ASCII")),
        set_flag=pyripple.models.transactions.AccountSetAsfFlag.ASF_DEFAULT_RIPPLE,
    )

    if not submit_transaction(cold_settings_tx, cold_wallet): 
        return False

    hot_settings_tx = pyripple.models.transactions.AccountSet(
        account=hot_wallet.address,
        set_flag=pyripple.models.transactions.AccountSetAsfFlag.ASF_REQUIRE_AUTH,
    )

    if not submit_transaction(cold_settings_tx, cold_wallet): 
        return False

    currency_code = "FOO"
    trust_set_tx = pyripple.models.transactions.TrustSet(
        account=hot_wallet.address,
        limit_amount=pyripple.models.IssuedCurrencyAmount(
            currency=currency_code,
            issuer=cold_wallet.address,
            value="10000000000", # Large limit, arbitrarily chosen
        )
    )

    if not submit_transaction(trust_set_tx, hot_wallet): 
        return False

    issue_quantity = "20000"
    send_token_tx = pyripple.models.transactions.Payment(
        account=cold_wallet.address,
        destination=hot_wallet.address,
        amount=pyripple.models.IssuedCurrencyAmount(
            currency = currency_code,
            issuer = cold_wallet.address,
            value = issue_quantity
        )
    )

    if not submit_transaction(send_token_tx, cold_wallet): 
        return False

    currency_code = currency
    trust_set_tx = pyripple.models.transactions.TrustSet(
        account=hot_wallet.address,
        limit_amount=pyripple.models.IssuedCurrencyAmount(
            currency=currency_code,
            issuer=wallet.address,
            value="10000000000", # Large limit, arbitrarily chosen
        )
    )

    if not submit_transaction(trust_set_tx, hot_wallet): 
        return False
    return True
    issue_quantity = amount
    send_token_tx = pyripple.models.transactions.Payment(
        last_ledger_sequence=seq[0] + 1000,
        account=wallet.address,
        destination=hot_wallet.address,
        amount=pyripple.models.IssuedCurrencyAmount(
            currency = currency_code,
            issuer = wallet.address,
            value = issue_quantity
        )
    )
    if not submit_transaction(send_token_tx, cold_wallet): 
        return False

    """

    currency_code = "XRP"
    trust_set_tx = xrpl.models.transactions.TrustSet(
        account=hot_wallet.address,
        limit_amount=xrpl.models.IssuedCurrencyAmount(
            currency=currency_code,
            issuer=wallet.address,
            value="10000000000", # Large limit, arbitrarily chosen
        )
    )
    

    print("Creating trust line from hot address to issuer...")
    response =  xrpl.transaction.submit_and_wait(trust_set_tx, client, wallet)
    print(response)
    """
    """
    issue_quantity = cost
    payment = xrpl.models.transactions.Payment(
        last_ledger_sequence=seq[0] + 1000,
        account=cold_wallet.address,
        destination=wallet.address,
        amount=xrpl.utils.xrp_to_drops(int(cost))
    )
    if not submit_transaction(payment, cold_wallet): 
        return False
    """
    
    return True


async def customer_transaction_buy(wallet, currency, amount, cost):
    # print("test_debug")
    testnet_url = "https://s.altnet.rippletest.net:51234"
    client = pyripple.clients.JsonRpcClient(testnet_url)
    cold_wallet = generate_faucet_wallet(client, debug=True)
    hot_wallet = generate_faucet_wallet(client, debug=True)
    seq = [0]
    def submit_transaction(tx, wallet):
        response = pyripple.transaction.submit_and_wait(tx, client, wallet)
        seq[0] = response.result['LastLedgerSequence']
        if 'validated' in response.result and response.result['validated']:
            print(f"Transaction successful")
            return True
        else:
            print(f"Transaction failed")
            return False

    # Set up and submit transactions
    cold_settings_tx = pyripple.models.transactions.AccountSet(
        account=cold_wallet.address,
        transfer_rate=0,
        tick_size=5,
        domain=bytes.hex("example.com".encode("ASCII")),
        set_flag=pyripple.models.transactions.AccountSetAsfFlag.ASF_DEFAULT_RIPPLE,
    )

    if not submit_transaction(cold_settings_tx, cold_wallet):
        return False

    hot_settings_tx = pyripple.models.transactions.AccountSet(
        account=hot_wallet.address,
        set_flag=pyripple.models.transactions.AccountSetAsfFlag.ASF_REQUIRE_AUTH,
    )

    if not submit_transaction(hot_settings_tx, hot_wallet):
        return False

    currency_code = "FOO"
    trust_set_tx = pyripple.models.transactions.TrustSet(
        account=hot_wallet.address,
        limit_amount=pyripple.models.IssuedCurrencyAmount(
            currency=currency_code,
            issuer=cold_wallet.address,
            value="10000000000",
        )
    )

    if not submit_transaction(trust_set_tx, hot_wallet):
        return False

    issue_quantity = "20000"
    send_token_tx = pyripple.models.transactions.Payment(
        account=cold_wallet.address,
        destination=hot_wallet.address,
        amount=pyripple.models.IssuedCurrencyAmount(
            currency=currency_code,
            issuer=cold_wallet.address,
            value=issue_quantity
        )
    )

    if not submit_transaction(send_token_tx, cold_wallet):
        return False

    currency_code = currency
    trust_set_tx = pyripple.models.transactions.TrustSet(
        account=wallet.address,
        limit_amount=pyripple.models.IssuedCurrencyAmount(
            currency=currency_code,
            issuer=cold_wallet.address,
            value="10000000000",
        )
    )
    return True

    if not submit_transaction(trust_set_tx, wallet):
        return False

    issue_quantity = amount
    send_token_tx = pyripple.models.transactions.Payment(
        last_ledger_sequence=seq[0] + 1000,
        account=cold_wallet.address,
        destination=wallet.address,
        amount=pyripple.models.IssuedCurrencyAmount(
            currency=currency_code,
            issuer=cold_wallet.address,
            value=issue_quantity
        )
    )

    if not submit_transaction(send_token_tx, cold_wallet):
        return False
    """
    issue_quantity = cost
    payment = xrpl.models.transactions.Payment(
        last_ledger_sequence=seq[0]+1000,
        account=wallet.address,
        destination=hot_wallet.address,
        amount=xrpl.utils.xrp_to_drops(int(cost))
    )

    if not submit_transaction(payment, wallet):
        return False
    """

    return True
