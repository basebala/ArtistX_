async function main() {
    // 1. Get the contract to deploy
    const Your_Contract = await ethers.getContractFactory('your_contract');
    console.log('Deploying Your_Contract...');
    
    // 2. Instantiating a new smart contract
    const your_contract = await Your_Contract.deploy();
    
    // 3. Waiting for the deployment to resolve
    await your_contract.deployed();
    
    // 4. Use the contract instance to get the contract address
    console.log('Your_Contract deployed to:', your_contract.address);
    }
    
    main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });