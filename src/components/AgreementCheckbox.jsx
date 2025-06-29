const AgreementCheckbox = ({ id, label, linkText, linkHref, register, rules, errors }) => {
    const errorMessage = errors[id]?.message
    
    return (
      <div>
        <div className="flex items-start">
          <input
            id={id}
            type="checkbox"
            {...register(id, rules)}
            className={`h-4 w-4 mt-0.5 rounded-md border-[#545F71] focus:ring-[#545F71] focus:border-none shadow-md
              ${errorMessage ? 'border-red-500' : ''}`}
          />
          <div className="ml-3 text-sm">
            <label htmlFor={id} className="text-sm text-gray-900 font-medium">
              {label}{' '}
              <a href={linkHref} target="_blank" rel="noopener noreferrer" className="font-medium text-[#545F71] hover:underline">
                {linkText}
              </a>
            </label>
          </div>
        </div>
        {errorMessage && <p className="mt-1 ml-7 text-xs text-red-600">{errorMessage}</p>}
      </div>
    )
}

export default AgreementCheckbox