export default function FormField({labelText, htmlFor, children, order=""}){
    return (
        <div className="flex flex-wrap w-full mt-4">
            <label htmlFor={htmlFor} className={`inline-block text-sm mb-2 text-gray-600 ${order}`}>{labelText}</label>
            {children}
        </div>
    )
}
