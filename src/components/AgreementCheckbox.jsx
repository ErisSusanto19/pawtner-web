const AgreementCheckbox = ({ id, label, linkText, onLinkClick, register, rules, errors }) => {
    const errorMessage = errors[id]?.message;

    return (
        <div>
            <div className="flex items-start">
                <input
                    id={id}
                    type="checkbox"
                    {...register(id, rules)}
                    className={`h-4 w-4 mt-0.5 rounded-md border-[#545F71] focus:ring-offset-2 focus:ring-[#545F71] shadow-md
                        ${errorMessage ? 'ring-rose-500' : ''}`}
                />
                <div className="ml-3 text-sm">
                    <label htmlFor={id} className="text-sm text-gray-900 font-medium">
                        {label}{' '}
                        <button
                            type="button"
                            onClick={onLinkClick}
                            className="font-medium text-[#545F71] hover:underline bg-transparent border-none p-0 cursor-pointer"
                        >
                            {linkText}
                        </button>
                    </label>
                </div>
            </div>
            {errorMessage && <p className="mt-1 ml-7 text-xs text-red-600">{errorMessage}</p>}
        </div>
    )
}

export default AgreementCheckbox