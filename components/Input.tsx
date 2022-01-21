export default function Input({id, value, onChange, disabled}){
    return <input value={disabled ? "" : value} onChange={onChange} disabled={disabled} required className="w-full h-10 pl-3 border rounded-md" type="text" name={id} id={id} />
}
