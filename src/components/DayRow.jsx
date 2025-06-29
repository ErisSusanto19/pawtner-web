const ToggleSwitch = ({ id, ...props }) => {
  return (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" id={id} className="sr-only peer" {...props} />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-800"></div>
    </label>
  )
}


const DayRow = ({ day, register, watch, getValues, errors }) => {
 
  const isOpenFieldName = `operationHours.${day}.isOpen`;
  const openTimeFieldName = `operationHours.${day}.open`;
  const closeTimeFieldName = `operationHours.${day}.close`;

  const dayIsOpen = watch(isOpenFieldName);
  const dayErrors = errors.operationHours?.[day];

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4 items-center">
      {/* Kolom Hari dan Toggle */}
      <div className="col-span-1 flex items-center gap-4">
        <ToggleSwitch
          id={isOpenFieldName}
          {...register(isOpenFieldName)}
        />
        <label htmlFor={isOpenFieldName} className="font-medium capitalize text-gray-800">
          {day}
        </label>
      </div>

      {/* Kolom Waktu atau Teks "Closed" */}
      <div className="col-span-2 md:col-span-3">
        {dayIsOpen ? (
          <div className="grid grid-cols-5 items-center gap-2">
            <input
              type="time"
              aria-label={`${day} open time`}
              {...register(openTimeFieldName, {
                // Validasi hanya jika toggle aktif
                required: 'Open time is required.',
              })}
              className="col-span-2 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />

            <span className="text-center text-gray-500">To</span>

            <input
              type="time"
              aria-label={`${day} close time`}
              {...register(closeTimeFieldName, {
                required: 'Close time is required.',
                validate: (closeTime) => {
                    const openTime = getValues(openTimeFieldName);
  
                    if (!openTime || !closeTime) {
                      return true
                    }

                    return closeTime > openTime || 'Close time must be after open time.'
                }
              })}
              className="col-span-2 w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ) : (
          <div className="text-gray-500">
            Closed
          </div>
        )}
      </div>

      {dayErrors && (
         <div className="col-span-3 md:col-start-2 md:col-span-3 text-xs text-red-600 space-y-1 mt-1">
            {dayErrors.open && <p>{dayErrors.open.message}</p>}
            {dayErrors.close && <p>{dayErrors.close.message}</p>}
         </div>
      )}
    </div>
  )
}

export default DayRow