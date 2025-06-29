import clsx from "clsx"

const Button = ({children, buttonType, disabled, onClick, fullWidth, secondary, danger}) => {
    
    return (
        <button
            type={buttonType || "button"}
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "flex justify-center items-center py-2 px-3 text-sm text-white font-semibold rounded-md",
                disabled && "opacity-50 cursor-default",
                fullWidth && "w-full",
                secondary && "bg-[#BAC0CA] hover:bg-[#888d96]",
                danger && "bg-rose-500 hover:bg-rose-600 focus:outline-rose-600",
                !secondary && !danger && "bg-[#545F71] hover:bg-[#353f52] focus:outline-[#353f52]"
            )}
        >
            {children}
        </button>
    )
}

export default Button