from pyteal import *

def trading_contract():
    # Constants
    buy_price = Int(105)  # Price of the coin in dollars (or equivalent)
    sell_price = Int(110)  # Selling price in dollars (or equivalent)
    coin_id = Int(123456) # Asset ID of the coin

    # Handle different transaction types
    on_buy = And(
        Txn.type_enum() == TxnType.AssetTransfer,
        Txn.xfer_asset() == coin_id,
        Txn.asset_amount() > Int(0),
        Txn.sender() == Txn.asset_receiver(),
        Txn.asset_close_to() == Global.zero_address(),
        Txn.asset_sender() == Global.zero_address(),
        # Check the payment amount in dollars (or equivalent)
        Txn.asset_amount() * buy_price <= Gtxn[1].amount()
    )

    on_sell = And(
        Txn.type_enum() == TxnType.AssetTransfer,
        Txn.xfer_asset() == coin_id,
        Txn.asset_amount() > Int(0),
        Txn.sender() == Txn.asset_sender(),
        Txn.asset_close_to() == Global.zero_address(),
        # Check the payment amount in dollars (or equivalent)
        Txn.asset_amount() * sell_price >= Gtxn[1].amount()
    )

    # Combine the buy and sell logic
    program = Cond(
        [on_buy, Return(Int(1))],
        [on_sell, Return(Int(1))]
    )

    return program

# Compile the contract
if __name__ == "__main__":
    print(compileTeal(trading_contract(), mode=Mode.Signature, version=3))