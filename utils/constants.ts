const items = [
    {
        name: "Swap",
        description: "Allows your users to easily swap your token on your website",
        url: "/create/swap"
    },
    {
        name: "Add to metamask",
        description: "Allows your users to easily add your tokens to your website",
        url: ""
    },
    {
        name: "Donations",
        description: "Allows you to easily receive crypto donations on your website",
        url: ""
    },
    {
        name: "Presale",
        description: "Allows your users to easily buy your presale on your website",
        url: ""
    },
    {
        name: "NFT",
        description: "Allows your users to view and mint NFTs on your website",
        url: ""
    },
    {
        name: "Agnostico",
        description: "Allows your users to use agnostico codes on your website",
        url: ""
    },

]

const w3lScript = (data, tokenSymbol) =>
    `
<script
    id="w3l_swap_script"
    type="module"
    data-w3ldata='${data}'
    data-w3ltokensymbol='${tokenSymbol}'
    src="https://${process.env.NEXT_PUBLIC_DOMAIN}/widgets/swap.js"
></script>
`

const w3lButton = (symbol) =>
    `
<button
    id="w3l_swap_button"
>Buy ${symbol}</button>
`

const getSwapConfig = (nodeURL) => ({
    ethereum: {
        name: 'ethereum',
        value: 'ethereum',
        url: `${nodeURL}/eth/mainnet`,
        symbol: 'ETH',
        chainID: 1,
        exchanges: {
            uniswap: {
                name: 'uniswap',
                value: 'uniswap',
                routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
                factoryAddress: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
                initCodeHash: "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
                weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
            },
            // sushiswap: {
            //     name: 'sushiswap',
            //     value: 'sushiswap',
            // }
        }
    },
    goerli: {
        name: 'goerli',
        value: 'goerli',
        url: `${nodeURL}/eth/goerli`,
        symbol: 'ETH',
        chainID: 5,
        exchanges: {
            uniswap: {
                name: 'uniswap',
                value: 'uniswap',
                routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
                factoryAddress: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
                initCodeHash: "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
                weth: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"
            },
        }
    },
    binance: {
        name: 'binance',
        value: 'binance',
        url: `${nodeURL}/bsc/mainnet`,
        symbol: 'BNB',
        chainID: 56,
        exchanges: {
            pancakeswap: {
                name: 'pancakeswap',
                value: 'pancakeswap',
                routerAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
                factoryAddress: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
                initCodeHash: "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
                weth: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
            },
            bakeryswap: {
                name: 'bakeryswap',
                value: 'bakeryswap',
                routerAddress: '0xCDe540d7eAFE93aC5fE6233Bee57E1270D3E330F',
                factoryAddress: "0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7",
                // initCodeHash: "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
                weth: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
            }
        }
    },
    binance_testnet: {
        name: 'binance testnet',
        value: 'binance_testnet',
        url: `${nodeURL}/bsc/testnet`,
        symbol: 'tBNB',
        chainID: 97,
        exchanges: {
            pancakeswap: {
                name: 'pancakeswap',
                value: 'pancakeswap',
                routerAddress: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
                factoryAddress: "0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc",
                initCodeHash: "0xecba335299a6693cb2ebc4782e74669b84290b6378ea3a3873c7231a8d7d1074",
                weth: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd"
            },
            // bakeryswap: {
            //     name: 'bakeryswap',
            //     value: 'bakeryswap',
            // }
        }
    },
    polygon: {
        name: 'polygon',
        value: 'polygon',
        url: `${nodeURL}/polygon/mainnet`,
        exchanges: {}
    },
    arbitrum: {
        name: 'arbitrum',
        value: 'select',
        url: `${nodeURL}/arbitrum/mainnet`,
        exchanges: {}
    },
    avalanche: {
        name: 'avalanche',
        value: 'avalanche',
        url: `${nodeURL}/avalanche/mainnet`,
        symbol: 'AVAX',
        chainID: 43114,
        exchanges: {
            traderjoe: {
                name: 'traderjoe',
                value: 'traderjoe',
                routerAddress: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
                factoryAddress: "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10",
                initCodeHash: "0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f",
                wavax: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7"
            },
        }
    },
    fantom: {
        name: 'fantom',
        value: 'select',
        url: `${nodeURL}/fantom/mainnet`,
        exchanges: {}
    },
})


const tokenABI = [
    {
        "name":"approve",
        "inputs":[
            {"internalType":"address","name":"spender","type":"address"},
            {"internalType":"uint256","name":"amount","type":"uint256"}],
        "outputs":[
            {"internalType":"bool","name":"","type":"bool"}
        ],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "name":"allowance",
        "inputs":[
            {"internalType":"address","name":"owner","type":"address"},
            {"internalType":"address","name":"spender","type":"address"}
        ],
        "outputs":[
            {"internalType":"uint256","name":"","type":"uint256"}
        ],
        "stateMutability":"view",
        "type":"function"
    }
]


const routerABI = [
    {
        "name":"getAmountsOut",
        "inputs":
        [
            {"internalType":"uint256","name":"amountIn","type":"uint256"},
            {"internalType":"address[]","name":"path","type":"address[]"}
        ],
        "outputs":[
            {"internalType":"uint256[]","name":"amounts","type":"uint256[]"}
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "name":"swapETHForExactTokens",
        "inputs":
        [
            {"internalType":"uint256","name":"amountOut","type":"uint256"},
            {"internalType":"address[]","name":"path","type":"address[]"},
            {"internalType":"address","name":"to","type":"address"},
            {"internalType":"uint256","name":"deadline","type":"uint256"}
        ],
        "outputs":[
            {"internalType":"uint256[]","name":"amounts","type":"uint256[]"}
        ],
        "stateMutability":"payable",
        "type":"function"
    },
    {
        "name":"getAmountsIn",
        "inputs":[
            {"internalType":"uint256","name":"amountOut","type":"uint256"},
            {"internalType":"address[]","name":"path","type":"address[]"}
        ],
        "outputs":[
            {"internalType":"uint256[]","name":"amounts","type":"uint256[]"}
        ],
        "stateMutability":"view",
        "type":"function"
    },
    {
        "name":"swapTokensForExactETH",
        "inputs":[
            {"internalType":"uint256","name":"amountOut","type":"uint256"},
            {"internalType":"uint256","name":"amountInMax","type":"uint256"},
            {"internalType":"address[]","name":"path","type":"address[]"},
            {"internalType":"address","name":"to","type":"address"},
            {"internalType":"uint256","name":"deadline","type":"uint256"}
        ],
        "outputs":[
            {"internalType":"uint256[]","name":"amounts","type":"uint256[]"}
        ],
        "stateMutability":"nonpayable",
        "type":"function"
    },
    {
        "name":"WETH",
        "inputs":[],
        "outputs":[
            {"internalType":"address","name":"","type":"address"}
        ],
        "stateMutability":"view",
        "type":"function"
    }
]

export { items, getSwapConfig, w3lScript, w3lButton, tokenABI, routerABI }
