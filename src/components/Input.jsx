import clsx from "clsx"

const Input = ({label, id, type, disabled, register, rules = {}, errors}) => {
    
    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm text-gray-900 font-medium mb-2">{label}</label>
            <input
                id={id}
                name={id}
                type={type}
                disabled={disabled}
                {...register(id, rules)}
                className={clsx(
                    "block w-full border rounded-md border-[#545F71] focus:outline-none p-1.5 focus:ring focus:ring-[#545F71] focus:border-none shadow-md",
                    errors[id] && "ring-rose-500",
                    disabled && "opacity-50 cursor-default"
                )}
            />
            {errors?.[id] && (
                <p className="text-rose-500 text-sm mt-1">
                    {errors[id].message}
                </p>
            )}
        </div>
    )
}

export default Input