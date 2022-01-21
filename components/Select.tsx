export default function Select({options, id, value, onChange, disabled}){
    return (
        <select disabled={disabled} onChange={onChange} name={id} id={id} value={disabled ? "select": value} className={`w-full h-10 pl-2 bg-white border rounded-md ${'text-gray-600'}`}>
            <option disabled value="select">{`Select ${id}`}</option>
            {options.map(opt => <option key={opt.name} value={opt.value}>{opt.name}</option>)}
        </select>
    )
}
