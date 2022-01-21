import getAsset from "../assets"
import { web3api } from "../web3api"
import axios from "axios"

export const handleConnect = ({setConnection, router}) => async (e?: React.MouseEvent<HTMLElement>) => {
    await web3api.connect(setConnection, router)
}

export const formatAddress = (address: string) => `${address.substring(0, 3)}...${address.substring(address.length-3, address.length)}`

