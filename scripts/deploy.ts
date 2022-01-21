import { ethers } from 'hardhat'
import writeAddress from './writeAddress';

async function deploy() {
    const chainID = (await ethers.provider.getNetwork()).chainId;
    // const signers = await ethers.getSigners();
    console.log('Deploying to...', chainID);
    await wait(7)

    const Web3lib = await ethers.getContractFactory("Web3lib")

    const web3lib = await Web3lib.deploy()

    await web3lib.deployed();

    const addresses = JSON.stringify({web3lib: web3lib.address})

    writeAddress(chainID, addresses)
    
}

const wait = (secs: number) => new Promise((res) => {
    setTimeout(res,secs*1000)
})

deploy().catch(console.error)
