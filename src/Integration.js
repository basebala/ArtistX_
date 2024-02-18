const Web3 = require('web3');

// Replace 'YOUR_ETHEREUM_PROVIDER_URL' with the actual URL
const providerUrl = 'https://mainnet.infura.io/v3/50660b37cdde4210bedda5da5f14ce31';

const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

// Connect to MetaMask (if available)
web3.setProvider(window.ethereum);

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "trade",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const myContract = new web3.eth.Contract(contractABI, contractAddress);

// Call a read-only function
myContract.methods.getBalance().call()
  .then(result => {
    console.log('Contract balance:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Send a transaction to a contract function
const account = 'YOUR_ETHEREUM_ACCOUNT_ADDRESS';
const privateKey = 'YOUR_ETHEREUM_ACCOUNT_PRIVATE_KEY';

myContract.methods.buyTokens(100).send({
  from: account,
  gas: 200000, // Adjust the gas limit as needed
  gasPrice: '20000000000', // Adjust the gas price as needed
})
.then(receipt => {
  console.log('Transaction receipt:', receipt);
})
.catch(error => {
  console.error('Transaction error:', error);
});

myContract.events.TokenPurchased()
  .on('data', event => {
    console.log('Token purchased event:', event.returnValues);
  })
  .on('error', error => {
    console.error('Event error:', error);
  });
