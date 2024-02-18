require('@nomiclabs/hardhat-ethers');
const { privateKey } = require('./secrets.json');

module.exports = {
solidity: "0.8.17",
defaultNetwork: "caldera",
networks: {
    caldera: {
    url: "https://treehacks-devnet.rpc.caldera.xyz/http",  // Insert your RPC URL Here
    chainId: 2162024, //Insert your ChainID Here
    }
},
}