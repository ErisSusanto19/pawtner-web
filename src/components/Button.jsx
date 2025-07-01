import clsx from "clsx"

const Button = ({children, buttonType, disabled, onClick, fullWidth, secondary, danger, dangerv2, tertiary, padding = true}) => {
    
    return (
        <button
            type={buttonType || "button"}
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "flex justify-center items-center text-sm text-white font-semibold rounded-md",
                padding && "py-2 px-3",
                disabled && "opacity-50 cursor-default",
                fullWidth && "w-full",
                secondary && "bg-[#BAC0CA] hover:bg-[#888d96]",
                danger && "bg-rose-500 hover:bg-rose-600 focus:outline-rose-600",
                tertiary && "text-[#323f56] hover:text-sky-500",
                dangerv2 && "text-[#323f56] hover:text-rose-500",
                !secondary && !danger && !tertiary && !dangerv2 && "bg-[#545F71] hover:bg-[#323f56] focus:outline-[#353f52]"
            )}
        >
            {children}
        </button>
    )
}

export default Button