
import React,{useId} from 'react'

function Select({
    options,
    label,
    className="",
    ...props
},ref) {
    const id = useId()
  return (
    <div className='w-full'>
      {label && <label className='mb-1.5 inline-block pl-1 text-sm font-semibold text-slate-700' htmlFor={id}>{label}</label>}
      <select
        className={`w-full rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2.5 text-slate-900 outline-none transition duration-200 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 ${className}`}
        {...props}
        id={id}
        ref={ref}
      >
       {options?.map((option)=>(
            <option key={option} value={option}>
                {option}
            </option>
       ))}
      </select>
    </div>
  )
}

export default React.forwardRef(Select)
