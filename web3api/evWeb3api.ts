import crypto from "crypto"

export default class EvWeb3api {
    parentURL=""
    requests = {}
    constructor(originURL){
        this.parentURL = originURL
        window.addEventListener("message", (event) => {
            if(event.data.func){
                const {requestID, func, ...rest } = event.data || {requestID: "notExist", func: "func", others:{}}
                const reqID = `${func}_${requestID}`
                const callback = this.requests[reqID]
                if(callback){
                    callback(rest)
                    delete this.requests[reqID]
                }
            }            
        }, false)
    }

    async connect(tokenAddress: string){
        return await this.request("connect", { tokenAddress })
    }

    async getAmountsOut(routerAddress, amountInValue, amountInDecimals, tokenIn, tokenOut, routerABI) {
        return await this.request("getAmountsOut", {routerAddress, amountInValue, amountInDecimals, tokenIn, tokenOut, routerABI })
    }

    async swapTokens(routerAddress, fromBase, amountInValue, amountInDecimals, amountOutValue, amountOutDecimals, fromToken, toToken, toAddress, tokenABI, routerABI){
        return await this.request("swapTokens", { routerAddress, fromBase, amountInValue, amountInDecimals, amountOutValue, amountOutDecimals, fromToken, toToken, toAddress, tokenABI, routerABI })
      }

    async request(func, args={}){
        const requestID = crypto.randomBytes(20).toString('hex')
        this.parentURL && window.parent.postMessage({func, args, isWeb3APICall:true, requestID}, this.parentURL)
        return new Promise<any>((res, rej) => {
            const cancel = setTimeout(() => {
                rej("request timeout")
                delete this.requests[`${func}_${requestID}`]
            },20*60*1000) // 20 minutes
            this.requests[`${func}_${requestID}`] = (result: {func: string, data: any, success: boolean}) => {
                clearTimeout(cancel)
                if(!result.success){
                    rej(result.data.errMsg)
                }
                res(result.data)
            }
        })
    }
}
