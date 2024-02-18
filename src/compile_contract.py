from pyteal import compileTeal, Mode
from trading_contract import trading_contract  # Import your PyTeal contract

# Compile the PyTeal to TEAL
teal_code = compileTeal(trading_contract(), mode=Mode.Signature, version=3)

# Write the TEAL code to a file
with open("trading_contract.teal", "w") as f:
    f.write(teal_code)