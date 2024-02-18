from flask import Flask, jsonify, request
from flask_cors import CORS
from utils import get_accounts, get_algod_client
from algosdk import account, mnemonic
from algosdk import transaction
from algosdk.v2client import algod
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
hi = 10
balance = 10000
portfolio = 0

accts = get_accounts()
acct3 = accts.pop()
acct2 = accts.pop()
acct1 = accts.pop()
print(acct3.address)
# Create a new algod client, configured to connect to our local sandbox
algod_address = "http://localhost:4001"
algod_token = "a" * 64
algod_client = algod.AlgodClient(algod_token, algod_address)

# Or, if necessary, pass alternate headers

# Create a new client with an alternate api key header
special_algod_client = algod.AlgodClient(
    "", algod_address, headers={"X-API-Key": algod_token}
)
account_info = algod_client.account_info(acct1.address)
#print(f"Account balance: {account_info.get('assets')} microAlgos")

artistData = {
    'Drake': {
        'image': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLKUMfmMV0fyTzTfPziofp2H5IK5xK59gghxbywSLu&s',
        'marketCap': 10000000000,
        'timeOnPlatform': 100,
        'growth': 1,
        'buys': 50,
        'sells': 30,
    },
    'Adele': {
        'image': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Adele_for_Vogue_in_2021.png',
        'marketCap': 8000000000,
        'timeOnPlatform': 365,
        'growth': 1.3,
        'buys': 30,
        'sells': 40,
    },
    'Ed Sheeran': {
        'image': 'https://cdn.britannica.com/17/249617-050-4575AB4C/Ed-Sheeran-performs-Rockefeller-Plaza-Today-Show-New-York-2023.jpg',
        'marketCap': 9500000000,
        'timeOnPlatform': 485,
        'growth': 0.67,
        'buys': 45,
        'sells': 25,
    },
    'Kanye West': {
        'image': 'https://imageio.forbes.com/specials-images/imageserve/5ed00f17d4a99d0006d2e738/0x0.jpg?format=jpg&crop=4666,4663,x154,y651,safe&height=416&width=416&fit=bounds',
        'marketCap': 120000000000,
        'timeOnPlatform': 128,
        'growth': 1.2,
        'buys': 70,
        'sells': 25,
    },
    'Ariana Grande': {
        'image': 'https://hips.hearstapps.com/hmg-prod/images/ariana_grande_photo_jon_kopaloff_getty_images_465687098.jpg',
        'marketCap': 11000000000,
        'timeOnPlatform': 236,
        'growth': 1.11,
        'buys': 60,
        'sells': 35,
    },
    'Taylor Swift': {
        'image': 'https://www.bu.edu/files/2023/11/Taylor-Swift-Mania-feat-1200x1200.jpg',
        'marketCap': 10500000000,
        'timeOnPlatform': 1934,
        'growth': 1.05,
        'buys': 80,
        'sells': 15,
    },
    'Beyonce': {
        'image': 'https://cdn.britannica.com/51/188751-050-D4E1CFBC/Beyonce-2010.jpg',
        'marketCap': 8500000000,
        'timeOnPlatform': 1023,
        'growth': 1.06,
        'buys': 75,
        'sells': 30,
    },
    'Justin Bieber': {
        'image': 'https://hips.hearstapps.com/hmg-prod/images/justin-bieber-gettyimages-1202421980.jpg?crop=1xw:1.0xh;center,top&resize=640:*',
        'marketCap': 9000000000,
        'timeOnPlatform': 24,
        'growth': 0.98,
        'buys': 40,
        'sells': 45,
    },
    'Rihanna': {
        'image': 'https://cdn.britannica.com/83/211883-050-46933F1A/Rihanna-Barbadian-singer-Robyn-Fenty.jpg',
        'marketCap': 9500000000,
        'timeOnPlatform': 1,
        'growth': 0.96,
        'buys': 70,
        'sells': 20,
    },
    'Eminem': {
        'image': 'https://hips.hearstapps.com/hmg-prod/images/eminem-a-k-a-marshall-bruce-mathers-iii-attends-a-ceremony-news-photo-1698936282.jpg?crop=1.00xw:0.667xh;0,0.0380xh&resize=640:*',
        'marketCap': 10500000000,
        'timeOnPlatform': 10500000000,
        'growth': 0.94,
        'buys': 95,
        'sells': 40,
    },
    'Lady Gaga': {
        'image': 'https://m.media-amazon.com/images/M/MV5BMTg1NjQwMzU4MF5BMl5BanBnXkFtZTgwNTk5NjQ4NjE@._V1_.jpg',
        'marketCap': 100000000000,
        'timeOnPlatform': 782,
        'growth': 0.99,
        'buys': 85,
        'sells': 55,
    },
    'The Weeknd': {
        'image': 'https://imageio.forbes.com/specials-images/imageserve/63b5b6b978458c2d14126109/-Avatar--The-Way-of-Water--Premiere---ArrivalsThe-Weeknd-at-the-premiere-of--Avatar-/0x0.jpg?crop=1591,894,x0,y2,safe&height=399&width=711&fit=bounds',
        'marketCap': 110000000000,
        'timeOnPlatform': 237,
        'growth': 0.995,
        'buys': 65,
        'sells': 35,
    },
}


for a1 in account_info.get('assets'):
    sp = algod_client.suggested_params()
    # Create opt-in transaction
    # asset transfer from me to me for asset id we want to opt-in to with amt==0
    optin_txn = transaction.AssetOptInTxn(
        sender=acct2.address, sp=sp, index=a1['asset-id']
    )
    signed_optin_txn = optin_txn.sign(acct2.private_key)
    txid = algod_client.send_transaction(signed_optin_txn)
    print(f"Sent opt in transaction with txid: {txid}")

    # Wait for the transaction to be confirmed
    results = transaction.wait_for_confirmation(algod_client, txid, 4)
    print(f"Result confirmed in round: {results['confirmed-round']}")
    asset_info = algod_client.asset_info(a1['asset-id'])
    asset_params = asset_info["params"]
    if asset_params['name'] in artistData:
        print(asset_params['name'], a1['amount'])
        artistData[asset_params['name']]['coins'] = a1['amount'] 
        artistData[asset_params['name']]['coinID'] = a1['asset-id']

for artist in artistData:
    artistData[artist]['price'] = random.randint(30, 60)
    artistData[artist]['name'] = artist
    artistData[artist]['held'] = 0
    artistData[artist]['divFactor'] = random.randint(10, 20)
    artistData[artist]['div'] = 0

artistDataListed = [artistData[i] for i in artistData if artistData[i]['held']]

@app.route('/api/message', methods=['GET'])
def get_message():
    # Logic to generate a message
    global hi
    message = f"Hello from the backend! {hi}"
    hi = hi + 1
    return jsonify({'message': message})

@app.route('/api/account', methods=['GET'])
def get_account():
    # Create a new algod client, configured to connect to our local sandbox
    accts = get_accounts()
    acct3 = accts.pop()
    print(acct3.address)
    # Create a new algod client, configured to connect to our local sandbox
    algod_address = "http://localhost:4001"
    algod_token = "a" * 64
    algod_client = algod.AlgodClient(algod_token, algod_address)

    # Or, if necessary, pass alternate headers

    # Create a new client with an alternate api key header
    special_algod_client = algod.AlgodClient(
        "", algod_address, headers={"X-API-Key": algod_token}
    )
    account_info = algod_client.account_info(acct3.address)
    print(f"Account balance: {account_info.get('amount')} microAlgos")
    return jsonify({'message': account_info.get('amount')})

@app.route('/api/getData', methods=['GET'])
def get_data():
    global artistData
    # Logic to generate a message
    return jsonify({'artistData': artistData, 'balance': balance, 'artistList': artistDataListed, 'portfolio': portfolio})

@app.route('/api/getBalance', methods=['GET'])
def get_balance():
    global balance
    return jsonify(balance)

@app.route('/api/vote', methods=['GET'])
def get_vote():
    date = random.randint(1, 31)
    choice = random.randint(1, 4)
    artist = request.args.get('artist')
    if choice == 1:
        message = f"Vote on the location for {artist}'s next concert on 12/{date}!"
    elif choice == 2:
        message = f"Vote on the genre for {artist}'s next track on 12/{date}!"
    elif choice == 3:
        message = f"Vote on the design for {artist}'s new merch on 12/{date}!"
    return jsonify({'message': message})


@app.route('/api/buy', methods=['GET'])
def buy_coin():
    global artistData
    global balance
    global portfolio
    global artistDataListed
    coinIndex = artistData[request.args.get('artist')]['coinID']
    sp = algod_client.suggested_params()
    # Create transfer transaction
    xfer_txn = transaction.AssetTransferTxn(
        sender=acct1.address,
        sp=sp,
        receiver=acct2.address,
        amt= int(request.args.get('buyAmount')),
        index=coinIndex,
    )
    signed_xfer_txn = xfer_txn.sign(acct1.private_key)
    txid = algod_client.send_transaction(signed_xfer_txn)
    print(f"Sent transfer transaction with txid: {txid}")
    results = transaction.wait_for_confirmation(algod_client, txid, 4)
    print(f"Result confirmed in round: {results['confirmed-round']}")
    # Logic to generate a message
    balance = balance - int(artistData[request.args.get('artist')]['price']) * int(request.args.get('buyAmount'))
    portfolio -= artistData[request.args.get('artist')]['held'] * artistData[request.args.get('artist')]['price']
    artistData[request.args.get('artist')]['coins'] -= int(request.args.get('buyAmount'))
    artistData[request.args.get('artist')]['price'] += .1 * int(request.args.get('buyAmount'))
    artistData[request.args.get('artist')]['held'] += int(request.args.get('buyAmount'))
    portfolio += artistData[request.args.get('artist')]['held'] * artistData[request.args.get('artist')]['price']
    artistData[request.args.get('artist')]['div'] = artistData[request.args.get('artist')]['held'] * artistData[request.args.get('artist')]['price'] * artistData[request.args.get('artist')]['divFactor'] * .0001
    artistDataListed = [artistData[i] for i in artistData if artistData[i]['held']]
    return jsonify({'balance': balance, 'artistData': artistData})


@app.route('/api/sell', methods=['GET'])
def sell_coin():
    global artistData
    global balance
    global portfolio
    global artistDataListed
    coinIndex = artistData[request.args.get('artist')]['coinID']
    sp = algod_client.suggested_params()
    # Create transfer transaction
    xfer_txn = transaction.AssetTransferTxn(
        sender=acct2.address,
        sp=sp,
        receiver=acct1.address,
        amt= int(request.args.get('sellAmount')),
        index=coinIndex,
    )
    signed_xfer_txn = xfer_txn.sign(acct2.private_key)
    txid = algod_client.send_transaction(signed_xfer_txn)
    print(f"Sent transfer transaction with txid: {txid}")
    results = transaction.wait_for_confirmation(algod_client, txid, 4)
    print(f"Result confirmed in round: {results['confirmed-round']}")
    # Logic to generate a message
    balance = balance + int(artistData[request.args.get('artist')]['price']) * int(request.args.get('sellAmount'))
    portfolio -= artistData[request.args.get('artist')]['held'] * artistData[request.args.get('artist')]['price']
    artistData[request.args.get('artist')]['coins'] += int(request.args.get('sellAmount'))
    artistData[request.args.get('artist')]['price'] -= .1 * int(request.args.get('sellAmount'))
    artistData[request.args.get('artist')]['held'] -= int(request.args.get('sellAmount'))
    artistData[request.args.get('artist')]['div'] = artistData[request.args.get('artist')]['held'] * artistData[request.args.get('artist')]['price'] * artistData[request.args.get('artist')]['divFactor'] * .0001
    portfolio += artistData[request.args.get('artist')]['held'] * artistData[request.args.get('artist')]['price']
    artistDataListed = [artistData[i] for i in artistData if artistData[i]['held']]
    return jsonify({'balance': balance, 'artistData': artistData})


if __name__ == '__main__':
    app.run(debug=True)