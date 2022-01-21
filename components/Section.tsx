import ItemCard from "./ItemCard";

export default function Section({name, items}){
    return (
        <div>
            <h2 className="text-4xl text-gray-900 underline">{name}</h2>
            <div className="grid-cols-2 mt-4 sm:grid gap-x-4 md:gap-x-10 lg:grid-cols-3 lg:gap-x-4 xl:grid-cols-4">
                {items.map(item => <ItemCard key={item.name} {...item} />)}
            </div>
        </div>
    )
}
