import { useRouter } from "next/router"
import Button from "./Button"

export default function ItemCard({name, description, url}){
    const router = useRouter()
    const disabled = !url
    return(
        <div className="relative w-full h-64 p-6 mt-8 rounded-md shadow-md">
            <h3 className="text-3xl text-gray-700">{name}</h3>
            <div className="w-full h-5">{disabled&&"(Coming soon!)"}</div>
            <div className="mt-8 text-gray-600">{description}</div>
            <div className="absolute bottom-0 left-0 flex flex-wrap justify-between w-full px-6 py-4">
                 <Button onClick={() => {} } disabled={disabled} text="Demo" className="bg-gray-200 hover:bg-gray-300"/>
                 <Button onClick={() => router.push(url, url)}  disabled={disabled} text="Create" className="text-white bg-gray-600 hover:bg-gray-700"/>
            </div>
        </div>
    )
}
