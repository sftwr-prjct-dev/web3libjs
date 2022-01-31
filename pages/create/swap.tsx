import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import Input from "../../components/Input";
import Layout from "../../components/Layout";
import Select from "../../components/Select";
import { getSwapConfig, w3lScript, } from "../../utils/constants";
import { IoMdCopy } from "react-icons/io";

const tokenABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function transfer(address to, uint amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint amount)"
]
export default function () {
    const [swapConfig] = useState(getSwapConfig(process.env.NEXT_PUBLIC_NODE_KEY))
    const [data, setData] = useState({logo: "", network:"select", exchange:"select", symbol:"", decimals:0, token:""})

    const {token, network} = data

    const [tokens, setTokens] = useState({tokenSymbol:""})

    const [w3lData, setw3lData] = useState("")

    useEffect(() => {
        if(network === 'select'){return};
        (async() => {
            const provider = new ethers.providers.JsonRpcProvider(swapConfig[network].url)
            try {
                if(token){
                    const contract = new ethers.Contract(token, tokenABI, provider)
                    const symbol = await contract.symbol()
                    const decimals = await contract.decimals()
                    setTokens(prev => ({...prev, tokenSymbol: symbol}))
                    setData(prev => ({...prev, symbol, decimals}))
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [token, network])



    const onChange = (e) => {
        const {name, value} = e.target
        console.log({name, value})
        setData(prevData => ({...prevData, [name]: value}))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const w3lData = window.btoa(JSON.stringify(data))
        console.log({w3lData, data})
        setw3lData(w3lData)
    }

    const copy = async(item: any) => {
        await navigator.clipboard.writeText(item)
    }
    return (
        <Layout>
            <div className="flex flex-wrap justify-center w-full">
                <form className="p-4 rounded-md shadow-md w-450" onSubmit={handleSubmit}>
                    <div className="my-6 text-2xl">Create your swap widget</div>
                    <FormField labelText="Logo URL" htmlFor="logo">
                        <Input id="logo" value={data.logo} onChange={onChange} disabled={false} />
                    </FormField>
                    <FormField labelText="Select network" htmlFor="network">
                        <Select value={data.network} onChange={onChange} disabled={!data.logo}  id="network" options={Object.values(swapConfig)} />
                    </FormField>
                    <FormField labelText="Select exchange" htmlFor="exchange">
                        <Select value={data.exchange} onChange={onChange} disabled={data.network === "select"} id="exchange" options={swapConfig[data.network] ? Object.values(swapConfig[data.network].exchanges) : []} />
                    </FormField>
                    <FormField labelText="Your token address" htmlFor="token">
                        <Input value={data.token} onChange={onChange} disabled={data.exchange === "select"} id="token" />
                    </FormField>
                    <Button disabled={!tokens.tokenSymbol} text={`Create ${tokens.tokenSymbol&&tokens.tokenSymbol} swap widget`} className="w-full h-12 mt-6 text-white bg-gray-600 hover:bg-gray-700" onClick={() => {}} />
                </form>
                <div className="flex flex-wrap justify-center w-full mt-8">
                    <div className="w-full text-center">Copy and add the html script below to your website</div>
                    <pre className="inline-block p-4 overflow-x-scroll border w-96">  
                        {w3lScript(w3lData, data.symbol)}
                    </pre>
                    <IoMdCopy className="ml-1 transition ease-in-out transform cursor-pointer hover:-translate-y-1 hover:scale-125" onClick={() => copy(w3lScript(w3lData, data.symbol))}/>
                </div>
            </div>
        </Layout>
    )
}
