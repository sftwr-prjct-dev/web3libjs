import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import { HardhatUserConfig } from 'hardhat/types';

const privateKey =
  process.env.PRIVATE_KEY ||
  '0x78326f3586d05c20d2c8e7d75dc54c2e18c9137c38162a8960d0edb674f23406';

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 1337,
      // forking: {
      //   url: `https://speedy-nodes-nyc.moralis.io/${process.env.NODE_KEY}/eth/mainnet/archive`,
      //   ...(process.env.BLOCKNUMBER && {
      //     blockNumber: parseInt(process.env.BLOCKNUMBER),
      //   }),
      // },
      mining: {
        auto: true,
      },
    },
    bsctest: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.NODE_KEY}/bsc/testnet`,
      accounts: [privateKey],
    },
    rinkeby: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.NODE_KEY}/eth/rinkeby/archive`,
      accounts: [privateKey],
    },
    goerli: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.NODE_KEY}/eth/goerli/archive`,
      accounts: [privateKey],
    },
    local: {
      chainId: 1337,
      url: 'http://127.0.0.1:8545',
    },
  },
  defaultNetwork: 'local',
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000000000,
          },
        },
      },
    ],
  },
};

export default config;
