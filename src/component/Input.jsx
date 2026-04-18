import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref){
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label 
            className='mb-1.5 inline-block pl-1 text-sm font-semibold text-slate-700' 
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            className={`w-full rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2.5 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100 ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input