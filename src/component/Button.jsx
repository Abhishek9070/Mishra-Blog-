import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = 'bg-gradient-to-r from-teal-600 to-sky-700',
    textColor = 'text-white',
    className = '',
    ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
        {children}
    </button>
  )
}

export default Button
