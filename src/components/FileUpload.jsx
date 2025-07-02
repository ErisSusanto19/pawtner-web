import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

const FileUpload = ({ name, label, register, setValue, watch, accept, errors, rules = {} }) => {
  const currentFile = watch(name);
  const [preview, setPreview] = useState(null)

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      setValue(name, file, { shouldValidate: true });
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)
      } else {
        setPreview(null)
      }
    }
  }, [name, setValue])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  })
  
  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setValue(name, null, { shouldValidate: true })
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    }
  }, [preview])

  const errorMessage = errors[name]?.message

  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">{label}</label>
      <div
        {...getRootProps()}
        className={`flex justify-center items-center w-full h-48 px-6 py-4 border-2 border-dashed rounded-md cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-[#545F71] bg-[#E9ECEF]'
            : 'border-[#ADB5BD] hover:border-[#545F71]'}
          ${errorMessage 
            ? 'border-red-500 bg-red-50'
            : ''}`}
      >
        <input {...getInputProps()} {...register(name, rules)} />
        
        {currentFile ? (
          <div className="relative text-center">
            {preview ? (
              <img src={preview} alt="Preview" className="h-32 w-auto object-contain rounded-md" />
            ) : (
              <div className="flex flex-col items-center">
                <FileIcon className="w-12 h-12 text-[#545F71]" />
                <p className="mt-2 text-sm text-[#495057] font-semibold break-all">{currentFile.name}</p>
              </div>
            )}
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-[#ADB5BD]" />
            <p className="mt-2 text-sm text-[#495057]">
              <span className="font-semibold text-[#545F71]">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-[#ADB5BD]">
              PNG, JPG, PDF, etc. up to 2MB
            </p>
          </div>
        )}
      </div>
      {errorMessage && <p className="mt-1 text-xs text-red-600">{errorMessage}</p>}
    </div>
  )
}

export default FileUpload