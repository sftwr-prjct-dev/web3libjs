import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { getSwapConfig } from "../../utils/constants"
import EvWeb3api from "../../web3api/evWeb3api"
import { routerABI, tokenABI } from '../../utils/constants'

interface W3lData {
    logo: string
    network: string
    exchange: string
    token:string
    token2:string
    ads: boolean
    symbol: string
    decimals: number
}

const initialW3lData = {logo: "", network:"select", symbol: "", exchange:"select", token:"", token2:"", decimals:0, ads:true}

export default function Swap() {
    const [swapConfig,] = useState(getSwapConfig(""))
    const [connection, setConnected] = useState({ connected: false, chainID: 0, address: '' })
    const [{ parentURL, w3ldata: {logo, ads} }, setQuery] = useState({ parentURL: "", w3ldata:initialW3lData })
    const [swapDetails, setSwapDetails] = useState({spend: {address:'', decimals:18, value: '', symbol: 'ETH', isBase: true, balance: ''}, receive: {address:'', decimals:0, value: '', symbol: '', isBase: false, balance: ''}})
    const [configs, setConfigs] = useState({networkSwapConfig: null, exchangeSwapConfig: null})
    const router = useRouter()
    const { query } = router;

    const [web3API, setWeb3API] = useState(null as EvWeb3api)

    useEffect(() => {
        if(parentURL){
            const web3API = new EvWeb3api(parentURL)
            setWeb3API(web3API)
        }
    }, [parentURL])

    const connectWallet = async () => {
        const details = await web3API.connect(swapDetails.receive.address)
        setConnected(details)
        setSwapDetails(prev => ({spend: {...prev.spend, balance: details.nativeBal}, receive: {...prev.receive, balance: details.tokenBal }}))
    }

    const correctNetwork = parseInt(String(connection.chainID).substring(2), 16) === configs?.networkSwapConfig?.chainID

    useEffect(() => {
        if(Object.keys(query).length > 0){
            const {w3ldata, parentURL} = query as {w3ldata:"", parentURL:""}
            let data = initialW3lData
            try {
                data = JSON.parse(window.atob(w3ldata)) as W3lData
                console.log({data, parentURL})
                setQuery({parentURL, w3ldata: data})
                const networkSwapConfig = swapConfig[data.network]
                const exchangeSwapConfig = networkSwapConfig.exchanges[data.exchange]
                setConfigs({networkSwapConfig, exchangeSwapConfig})
                setSwapDetails({
                    spend: {
                        address: exchangeSwapConfig.weth,
                        value: '',
                        symbol: networkSwapConfig.symbol,
                        decimals: 18,
                        isBase: true,
                        balance: '0',
                    },
                    receive: {
                        address: data.token,
                        value: '',
                        symbol: data.symbol,
                        decimals: data.decimals,
                        isBase: false,
                        balance: '0',
                    },
                })
                parentURL && window.parent.postMessage({"loaded": true}, parentURL)
            } catch (error) {
                console.log(error)
            }
        }

    }, [query])

    const onChange = async(e) => {
        const { value, name } = e.target
        const updated = swapDetails[name]
        updated.value = value
        const other = name === "spend" ? "receive" : "spend"
        const otherDetails = swapDetails[other]
        setSwapDetails(prev => ({ ...prev, [name]: { ...updated } }))
        const amountOut = correctNetwork && Number(value) && await web3API.getAmountsOut(
            configs.exchangeSwapConfig.routerAddress,
            value,
            updated.decimals,
            updated.address,
            otherDetails.address, 
            routerABI
        )
        otherDetails.value = (amountOut/10**otherDetails.decimals).toFixed(8)
        setSwapDetails(prev => ({...prev, [other]: {...otherDetails}}))
    }
    

    const swap = async(e) => {
        e.preventDefault();
        try {
            const { nativeBal, tokenBal } = await web3API.swapTokens(
                configs.exchangeSwapConfig.routerAddress,
                swapDetails.spend.isBase,
                swapDetails.spend.value,
                swapDetails.spend.decimals,
                swapDetails.receive.value,
                swapDetails.receive.decimals,
                swapDetails.spend.address,
                swapDetails.receive.address,
                connection.address, 
                tokenABI, 
                routerABI
            )

            setSwapDetails(prev => ({spend: {...prev.spend, balance: nativeBal}, receive: {...prev.receive, balance: tokenBal }}))
        } catch(e) {
            console.log(e)
        }
    }

    const switchTokens = () => {
        const {spend, receive} = swapDetails
        setSwapDetails({spend: {...receive}, receive: {...spend}})
    }

    return (
        <div className="flex justify-center w-full h-screen bg-transparent-bg">
            <div className="relative flex flex-col flex-wrap items-center p-6 mt-10 md:mt-32 w-400 h-550">
                <img className="inline-block w-20 h-20 rounded-full " src={logo || "/logo.png"} alt="logo" />
                {ads&&<div className="flex items-center justify-center w-full h-10 mt-4 text-center bg-gray-200 rounded cursor-pointer">ads.</div>}
                <div className="flex items-center justify-center w-full p-4 pb-8 mt-8 bg-white rounded-lg h-320">
                    {
                        !connection.connected
                            ? <button onClick={connectWallet} className="w-full mt-8 text-white bg-gray-500 rounded-md hover:bg-gray-600 h-14">Connect wallet</button>
                            : (
                                <form className="relative w-full" onSubmit={swap}>
                                    {
                                        fields.map(field =>(
                                            field.name === "arrow"
                                                ? <div key={field.id} className="w-full mt-2 -mb-5 text-center">
                                                        <span onClick={switchTokens} className="inline-block text-3xl transform rotate-90 cursor-pointer">⇋</span>
                                                    </div>
                                                :<InputField
                                                    key={field.id}
                                                    data={swapDetails[field.value]}
                                                    id={field.id}
                                                    name={field.name}
                                                    placeholder="0.0"
                                                    label={field.label}
                                                    onChange={onChange}
                                            />)  
                                        )
                                    
                                    }                                    
                                    <button disabled={!correctNetwork} type="submit" className="w-full mt-8 text-2xl text-white bg-gray-500 rounded-md h-14 hover:bg-gray-600">{correctNetwork ? 'Swap' : 'Wrong Network!'}</button> 
                                </form>
                            )
                    }
                </div>
                <div className="absolute bottom-0 left-0 w-full text-xs text-center text-gray-500">Widget by <a className="text-blue-500" target="_blank" href="https://web3widget.on.fleek.co" referrerPolicy="no-referrer">Web3widgets</a> </div>
            </div>
        </div>
    )
}

const fields = [
    {
        name: 'spend',
        id: 'input-amount',
        label: 'Spend',
        value: 'spend',
    },
    {
        name: 'arrow',
        id: 'arrow',
        label: 'arrow',
        value: '⇋',
    },
    {
        name: 'receive',
        id:'output-amount',
        value: 'receive',
        label: 'Receive',
    }
]

function InputField({id, name, className="", placeholder, label, onChange, data }){
    return (
        <div className="mt-4">
            <label className="text-sm text-gray-500" htmlFor={id}>{label} <span className="cursor-pointer" onClick={() => { onChange({ target: { name, value: data.balance }}) }}>{data.balance}</span></label>
            <div className="relative w-full mt-1 overflow-hidden border border-gray-300 rounded-md h-14">
                <div className="absolute top-0 left-0 flex items-center justify-center h-full font-semibold bg-gray-300 border-r w-14">{data.symbol}</div>
                <input
                    disabled={name === 'outputToken'}
                    value={data.value}
                    onChange={onChange}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    className={`w-full pr-4 pl-16 text-2xl text-right bg-white placeholder-gray-600 outline-none h-full  ${className}`} type="number"
                />
            </div>
            
        </div>
    )
}
