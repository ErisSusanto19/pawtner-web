import clsx from "clsx"

const TextArea = ({label, id, rows = 2, disabled, register, rules = {}, errors}) => {
    
    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm text-gray-900 font-medium mb-2">{label}</label>
            <textarea
                id={id}
                name={id}
                rows={rows}
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

export default TextArea