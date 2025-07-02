import clsx from "clsx"
import { Eye, EyeOff } from 'lucide-react'
import { useState } from "react"

const Input = ({label, id, type, disabled, register, rules = {}, errors}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const isPasswordField = type === 'password'

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState);
    }
    
    return (
        <div className="w-full">
       
            {label && (
                <label htmlFor={id} className="block text-sm text-gray-900 font-medium mb-2">
                    {label}
                    {rules?.required && (
                        <span className="text-red-500"> *</span>
                    )}
                </label>
            )}

            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={isPasswordField ? (isPasswordVisible ? 'text' : 'password') : type}
                    disabled={disabled}
                    {...register(id, rules)}
                    className={clsx(
                        "block w-full border rounded-md border-[#545F71] focus:outline-none p-1.5 focus:ring focus:ring-[#545F71] focus:border-none shadow-md",
                        isPasswordField && "pr-10",
                        errors[id] && "ring-rose-500",
                        disabled && "opacity-50 cursor-default"
                    )}
                />
                
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                        disabled={disabled}
                        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                    >
                        {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            
            {errors?.[id] && (
                <p className="text-rose-500 text-sm mt-1">
                    {errors[id].message}
                </p>
            )}
        </div>
    )
}

export default Input