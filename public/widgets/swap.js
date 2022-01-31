(async () => {
    await import('https://unpkg.com/moralis/dist/moralis.js');

    document.body.innerHTML = document.body.innerHTML + `
    <div id="w3l_swap_modal" style="display: none; flex-wrap: wrap; justify-content: center; align-items: center; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; background-color: rgba(0, 0, 0, 0.2);" >
        <div id="w3l_swap_loading">
            loading...
        </div>
        <iframe style="display:none;width:0; z-index: 1000;" id="w3l_swap_iframe" loading="lazy"
            src="" frameborder="0" width="99%" height="99%" _sandbox>
        </iframe>
    </div>
    <button style="height: 60px; width: 60px; border-radius: 5px; border-radius: 50% 0 50% 0; position: fixed; right: 40px; bottom: 100px; z-index: 100000; border: none; background-color: gray; color: white;" id="w3l_swap_button"></button>
    `

    window.Moralis.start({ serverUrl: "https://q2mwhjgtznwk.usemoralis.com:2053/server", appId: "8CWG61HAxVNJxFYkHFpM9TMzP2c59nSuGzCIXW4o" })

    const web3libURL = "https://web3widget.on.fleek.co"
    // const web3libURL = "http://localhost:3001"
    // const web3libURL = "http://192.168.100.90:3000"
    const btn = document.getElementById("w3l_swap_button");
    // const close = document.getElementById("w3l_swap_closemodalbutton");
    const modal = document.getElementById("w3l_swap_modal")
    const frame = document.getElementById("w3l_swap_iframe")
    const loading = document.getElementById("w3l_swap_loading")
    const swapScript = document.getElementById("w3l_swap_script")
    const w3ldata = swapScript.getAttribute("w3ldata") || swapScript.getAttribute("data-w3ldata")
    const w3ltokensymbol = swapScript.getAttribute("w3ltokensymbol") || swapScript.getAttribute("data-w3ltokensymbol") || "Token"
    const btnText = `Swap ${w3ltokensymbol}`;
    btn.innerText = btnText
    const location = window.location.href
    console.log({location})

    if (window.addEventListener) {
        window.addEventListener("message", onMessage, false);        
    } 
    else if (window.attachEvent) {
        window.attachEvent("onmessage", onMessage, false);
    }

    function onMessage(event) {
        if (event.origin !== web3libURL) return;
        console.log(event.origin, event.data.loaded)
        if(event.data.loaded){
            loading.style.display="none"
            frame.style.width="100%"
            modal.style.backgroundColor = "rgba(0, 0, 0, 0)"
        }  
    }

    btn.addEventListener("click", () => {
        const currentText = btn.innerText
        if(currentText === 'Close Widget'){
            frame.style.display = "none"
            loading.style.display = "flex"
            modal.style.display = "none"
            modal.style.backgroundColor = "rgba(0, 0, 0, 0.2)"
            btn.innerText = btnText
        }else {
            modal.style.display = "flex"
            frame.style.display = "block"
            frame.style.width="0"
            frame.src = `${web3libURL}/widgets/swap/?w3ldata=${w3ldata}&parentURL=${location}`
            btn.innerText = 'Close Widget'
        }
        
    })

    class Web3API {
        provider;
        connected = false;
        signer;
        chainID = 0;
        address = "";

        listen(){
            window.addEventListener('message', (event) => {
                if (event.origin !== web3libURL || event.data.loaded || !event.data.isWeb3APICall) return;
                this[event.data.func](event.data.requestID, event.data.args)
            }, false )
        }

        async useChain(tokenAddress) {
            console.log(this.address)
            const chainID = await Moralis.chainId
            this.address = await Moralis.account
            const _nativeBal = await Moralis.Web3API.account.getNativeBalance({ chain: chainID, address: this.address });
            const tokensBal = await Moralis.Web3API.account.getTokenBalances({ chain: chainID, address: this.address });
            const _tokenBal = tokensBal.find(bal => bal['token_address'].toLowerCase() === tokenAddress.toLowerCase())

            console.log({ _nativeBal, tokensBal })

            const tokenBal = (_tokenBal.balance / (10 ** _tokenBal.decimals)).toFixed(Number(_tokenBal.decimals))
            const nativeBal = Number(Moralis.Units.FromWei(_nativeBal.balance)).toFixed(4)

            return { chainID, address: this.address, tokenBal, nativeBal  }
        }

        async connect(requestID, { tokenAddress }) {

            const { Moralis } = window;
            try {
                let user = Moralis.User.current();
                
                if (!user) {
                    user = await Moralis.authenticate({ signingMessage: "Web3lib Swap Widget" })
                } else {
                    await Moralis.enableWeb3()
                }

                const { chainID, address, tokenBal, nativeBal } = await this.useChain(tokenAddress)
                
                this.respond("connect", requestID, {
                    connected: true,
                    chainID,
                    address,
                    tokenBal,
                    nativeBal,
                })
            } catch (error) {
                console.error(error)
            }            
        }

        async _getAmountsOut(routerAddress, amountInValue, amountInDecimals, tokenIn, tokenOut, routerABI) {
            
            const amountIn = Moralis.Units.Token(amountInValue, amountInDecimals)

            const getAmountsOutParams = {
                contractAddress: routerAddress,
                functionName: 'getAmountsOut',
                abi: routerABI,
                params: {
                    amountIn,
                    path: [tokenIn, tokenOut]
                }
            };

            const [,amountOut] = await Moralis.executeFunction(getAmountsOutParams)
            return Number(amountOut)
        }

        async getAmountsOut(requestID, {routerAddress, amountInValue, amountInDecimals, tokenIn, tokenOut, otherName, otherDetails, routerABI}) {
            try {
                const amountOut = await this._getAmountsOut(routerAddress, amountInValue, amountInDecimals, tokenIn, tokenOut, routerABI)
                this.respond("getAmountsOut", requestID, amountOut)
            } catch (error) {
                console.log(error)
            }
        }


        async _swapTokens(requestID, routerAddress, fromBase, amountInValue, amountInDecimals, amountOutValue, amountOutDecimals, fromToken, toToken, toAddress, tokenABI, routerABI ){
            // const amountOut = ethers.utils.parseUnits(amountOutValue, amountOutDecimals)
            const amountOut = Moralis.Units.Token(amountOutValue, amountOutDecimals)
            const path = [fromToken, toToken]
            const deadline = Math.ceil(Date.now()/1000) + 20*60
            // const amountInMax = ethers.utils.parseUnits((Number(amountInValue)*1.05).toFixed(8), amountInDecimals)
            const amountInMax = Moralis.Units.Token((Number(amountInValue)*1.05).toFixed(8), amountInDecimals)
            
            const swapFromBaseParams = {
                contractAddress: routerAddress,
                functionName: 'swapETHForExactTokens',
                abi: routerABI,
                params: { amountOut, path, to: toAddress, deadline },
                msgValue: amountInMax
            };
            
            const tokenAllowanceParams = {
                contractAddress: fromToken,
                functionName: 'allowance',
                abi: tokenABI,
                params: { owner: toAddress, spender: routerAddress }
            };
            
            const tokenApproveParams = {
                contractAddress: fromToken,
                functionName: 'approve',
                abi: tokenABI,
                params: { spender: routerAddress, amount: amountInMax }
            };

            const swapFromToken = {
                contractAddress: routerAddress,
                functionName: 'swapTokensForExactETH',
                abi: routerABI,
                params: { 
                    amountOut, amountInMax, path, to: toAddress, deadline 
                }
            };
            
            try {
                if(fromBase){
                    await Moralis.executeFunction(swapFromBaseParams)
                }else {
                    const allowance = await Moralis.executeFunction(tokenAllowanceParams)
                    if(amountInMax > Number(allowance)){
                      await Moralis.executeFunction(tokenApproveParams)
                    }
                    await Moralis.executeFunction(swapFromToken)
                }
                const { tokenBal, nativeBal } = await this.useChain(toAddress)
                this.respond("swapTokens", requestID, {
                    tokenBal, nativeBal
                })
            } catch(e) {
                console.log(e)
            }
        }

        async swapTokens(requestID, {routerAddress, fromBase, amountInValue, amountInDecimals, amountOutValue, amountOutDecimals, fromToken, toToken, toAddress, tokenABI, routerABI }){
            return await this._swapTokens(requestID, routerAddress, fromBase, amountInValue, amountInDecimals, amountOutValue, amountOutDecimals, fromToken, toToken, toAddress, tokenABI, routerABI)
        }

        respond(func, requestID, data={}, success=true){
            if(frame.contentDocument){
                frame.contentWindow.postMessage({func, data, success, requestID}, `${web3libURL}`)
            }else if(frame.contentWindow) {
                frame.contentWindow.postMessage({func, data, success, requestID}, `${web3libURL}`)
            }
        }

        respondErr(func, requestID, message=""){
            this.respond(func, requestID, {message}, false)
        }

        
    }

    const web3API = new Web3API()
    web3API.listen()

})()
