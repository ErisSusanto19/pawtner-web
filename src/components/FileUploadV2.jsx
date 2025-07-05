import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X, Image as ImageIcon } from 'lucide-react';

const FileUpload = ({ name, label, register, setValue, watch, accept, errors, rules = {} }) => {
  const currentValue = watch(name)
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    if (currentValue instanceof File) {
      setFileName(currentValue.name)
      if (currentValue.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(currentValue))
      } else {
        setPreview(null)
      }
    } else if (typeof currentValue === 'string' && currentValue) {
      setFileName(currentValue.split('/').pop())
      if (/\.(jpeg|jpg|gif|png|webp)$/i.test(currentValue)) {
        setPreview(currentValue)
      } else {
        setPreview(null)
      }
    } else {
      setPreview(null)
      setFileName('')
    }
  }, [currentValue])

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]
    if (file) {
      setValue(name, file, { shouldValidate: true })
    }
  }, [name, setValue])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  })
  
  const handleRemoveFile = (e) => {
    e.stopPropagation()
    setValue(name, null, { shouldValidate: true })
  }

  const errorMessage = errors[name]?.message

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
      <div
        {...getRootProps()}
        //  onClick={() => alert('Dropzone diklik!')}
        className={`relative flex justify-center items-center w-full h-48 px-6 py-4 border-2 border-dashed rounded-md cursor-pointer transition-colors
          ${isDragActive ? 'border-[#545F71] bg-[#E9ECEF]' : 'border-gray-300 hover:border-[#545F71]'}
          ${errorMessage ? 'border-red-500 bg-red-50' : ''}
          ${currentValue ? 'border-solid' : ''}
        `}
      >
        {/* <input {...getInputProps()} {...register(name, rules)} /> */}
        <input {...getInputProps()}/>
        
        {currentValue ? (
          <div className="text-center">
            {/* MODIFIKASI: Logika tampilan berdasarkan state `preview` */}
            {preview ? (
              <img src={preview} alt="File preview" className="max-h-36 w-auto object-contain rounded-md" />
            ) : (
              <div className="flex flex-col items-center text-[#495057]">
                <FileIcon className="w-12 h-12" />
                <p className="mt-2 text-sm font-semibold break-all px-4">{fileName}</p>
              </div>
            )}
             <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-1.5 shadow-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Remove file"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <UploadCloud className="mx-auto h-12 w-12" />
            <p className="mt-2 text-sm text-[#495057]">
              <span className="font-semibold text-[#545F71]">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs">
              {Object.values(accept).flat().join(', ').toUpperCase() || 'File'}
            </p>
          </div>
        )}
      </div>
      {errorMessage && <p className="mt-1 text-xs text-red-600">{errorMessage}</p>}
    </div>
  )
}

export default FileUpload