import { ethers } from 'ethers';
import { NextRouter } from 'next/router';


const routerABI = [
  'function WETH() view returns(address)',
  'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',

  'function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)',

  'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  'function getAmountsIn(uint amountOut, address[] calldata path) view returns (uint[] memory amounts)',
]

// 'function getAmountsOut(uint amountOut, address[] calldata path) view returns (uint[] memory amounts)'



const tokenABI = [
  'function name() view returns(string memory)',  
  'function symbol() view returns(string memory)',  
  'function decimals() view returns(uint)',  
  'function approve(address spender, uint256 amount)',
  'function allowance(address owner, address spender) external view returns (uint)',
]
declare global {
  interface Window {
    ethereum: any;
  }
}

const chainSymbol = {
    1337: "Local",
    1: 'ETH Mainnet',
    5: 'ETH Goerli',
    56: 'BSC'
}

const routers = {
  eth: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', //uniswap
  bsc: '0x10ED43C718714eb63d5aA57B78B54704E256024E', //pancake-swap
}

class ETHAPI {
  provider;
  connected = false;
  signer;
  chainID = 0;
  address = "";
  

  async connect(callback, router: NextRouter) {
    const { ethereum } = window;
    if (!ethereum) return;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    this.provider = new ethers.providers.Web3Provider(ethereum);
    this.address = ethers.utils.getAddress(accounts[0]);
    this.signer = this.provider.getSigner(accounts[0]);
    const { chainId } = await this.provider.getNetwork();
    this.chainID = chainId;
    this.connected = true
    callback({
      connected: true,
      chainID: this.chainID,
      symbol: chainSymbol[chainId],
      address: this.address,
    });

    ethereum.on('accountsChanged', async (accounts: string[]) => {
      if (accounts.length > 0) {
        const addr = ethers.utils.getAddress(accounts[0]);
        this.address = ethers.utils.getAddress(addr);
        this.signer = this.provider.getSigner(addr);
        const { chainId } = await this.provider.getNetwork();
        callback({
          connected: true,
          chainID: this.chainID,
          symbol: chainSymbol[chainId],
          address: this.address,
        });
      } else {
        this.address = '';
        this.signer = null;
        router.push('/');
        return;
      }
    });
    ethereum.on('chainChanged', async (_chainId: number) => {
      window.location.reload();
    });
    return true;
  }

  getRouter(network: string) {
    const _network = network.toLocaleLowerCase().includes('eth') ? 'eth' : network.toLowerCase();
    const router = new ethers.Contract(routers[_network], routerABI, this.signer);
    return router;
  }

  async getToken(address: string) {
    const token = new ethers.Contract(address, tokenABI, this.signer);
    const tokenName = await token.name();
    const tokenSymbol = await token.symbol();
    const tokenDecimals = await token.decimals();

    return { tokenName, tokenSymbol, tokenDecimals, token }
  }


  async calculateOutput(outputCurrency: string, network: string, amount: string, buying: boolean, loading: any) {
    const router = this.getRouter(network);
    const { tokenDecimals } = await this.getToken(outputCurrency);
    const path = [await router.WETH(), outputCurrency];

    const unitETH = Number(ethers.utils.parseEther('1'))
    const unitToken = Number(ethers.utils.parseUnits('1', tokenDecimals))

    let amounts: any;
    
    if(Number(amount) < 1) return
    if(buying) {
      
      loading(true)
      amounts = await router.getAmountsIn(ethers.utils.parseUnits(amount, tokenDecimals), path);
      console.log(Number(amounts[0]), Number(amounts[1]))
      loading(false)
      return { swapType: 'BUYING', eth: (Number(amounts[0]) / unitETH).toFixed(18), token: (Number(amounts[1]) / unitToken).toFixed(8) };
    } else {
      loading(true)
      amounts = await router.getAmountsOut(ethers.utils.parseUnits(amount, tokenDecimals), [path[1], path[0]]);
      console.log({ tradeType: 'SELLING', token: (Number(amounts[0] / unitToken)).toFixed(8), eth: (Number(amounts[1])/ unitETH).toFixed(18) })
      loading(false)
      // return { tradeType: 'SELLING', token: (Number(amounts[0]) / unitToken).toFixed(8), eth: (Number(amounts[1])/ unitETH).toFixed(18) };
      return { tradeType: 'SELLING', token: (Number(amounts[0] / unitToken)).toFixed(8), eth: (Number(amounts[1])/ unitETH).toFixed(18) };
    }
    
  }

  async getAmountsOut(routerAddress, amountInValue, amountInDecimals, tokenIn, tokenOut) {
    const amountIn = ethers.utils.parseUnits(amountInValue, amountInDecimals)
    const dexRouter = new ethers.Contract(routerAddress, routerABI, this.signer);
    const [,amountOut] = await dexRouter.getAmountsOut(amountIn, [tokenIn, tokenOut])
    return Number(amountOut)
  }

  async swap(networkSymbol: string, buying: boolean, ethAmount: string, tokenAmount: string, outputCurrency: string) {
    const network = networkSymbol.toLocaleLowerCase().includes('eth') ? 'eth' : networkSymbol.toLowerCase();
    const router = new ethers.Contract(routers[network], routerABI, this.signer);
    const { tokenDecimals, token } = await this.getToken(outputCurrency);
    const weth = await router.WETH();
    const path = [weth, outputCurrency];
    const now = new Date();
    const twentyMinutes = new Date(now.setMinutes(now.getMinutes() + 20)).getTime()

    const unitETH = Number(ethers.utils.parseEther('1'))
    const unitToken = Number(ethers.utils.parseUnits('1', tokenDecimals))
    
    if(buying) {
      await router.swapETHForExactTokens(ethers.utils.parseUnits(tokenAmount, tokenDecimals), path, this.address, Math.floor(twentyMinutes/1000), { value: ethers.utils.parseEther(ethAmount) })
    } else {
      await token.approve(router.address, ethers.utils.parseUnits(tokenAmount, tokenDecimals))
      await router.swapTokensForExactETH(ethers.utils.parseEther(ethAmount), ethers.utils.parseUnits(tokenAmount, tokenDecimals), [path[1], path[0]], this.address, Math.floor(twentyMinutes/1000))
    }


  }

  async swapTokens(routerAddress, fromBase, amountInValue, amountInDecimals, amountOutValue, amountOutDecimals, fromToken, toToken, toAddress ){
    const dexRouter = new ethers.Contract(routerAddress, routerABI, this.signer);
    const deadline = Math.ceil(Date.now()/1000) + 20*60
    const amountOut = ethers.utils.parseUnits(amountOutValue, amountOutDecimals)
    const amountInMax = ethers.utils.parseUnits((Number(amountInValue)*1.05).toFixed(8), amountInDecimals)
    const path = [fromToken, toToken]
    if(fromBase){
      dexRouter.swapETHForExactTokens(amountOut, path, toAddress, deadline, {value: amountInMax})
    }else {
      const tokenContract = new ethers.Contract(fromToken, tokenABI, this.signer)
      const allowance = await tokenContract.allowance(toAddress, routerAddress)
      console.log({allowance})
      if(amountInMax.gt(allowance)){
        const tx = await tokenContract.approve(routerAddress, amountInMax)
        await tx.wait()
      }
      dexRouter.swapTokensForExactETH(amountOut, amountInMax, path, toAddress, deadline)
    }
  }
}
export const web3api = new ETHAPI();

