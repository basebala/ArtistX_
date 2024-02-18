from algosdk import account

private_key, public_address = account.generate_account()
print("Public address:", public_address)
print("Private key:", private_key)