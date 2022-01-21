export default function Button({text, className="", disabled=false, onClick=null}){
    return <button onClick={onClick} disabled={disabled} className={`h-10 ${disabled ? "cursor-not-allowed" : ""} border rounded-md w-28 ${className}`}>{text}</button>
}
