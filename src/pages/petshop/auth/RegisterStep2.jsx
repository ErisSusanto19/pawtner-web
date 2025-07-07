import { useState } from 'react'
import Input from '../../../components/Input'
import TextArea from '../../../components/TextArea'
import clsx from 'clsx'
import { Building2, MapPin } from 'lucide-react'
import { toast } from 'react-toastify'
import MapPicker from '../../../components/MapPicker'

const businessTypeOptions = [
    {value: "VETERINARY_CLINIC", label: "Veterinary Clinic"},
    {value: "PET_SHOP", label: "Pet Shop"},
    {value: "GROOMING_SALON", label: "Grooming Salon"},
    {value: "BOARDING_DAYCARE", label: "Boarding Daycare"},
    {value: "HYBRID", label: "Hybrid"},
]

const RegisterStep2 = ({register, errors, setValue, watch}) => {
    const [isLocating, setIsLocating] = useState(false)
    const [locationError, setLocationError] = useState('')

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.')
            return
        }

        setIsLocating(true)
        setLocationError('')

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                
                setValue('latitude', latitude, { shouldValidate: true })
                setValue('longitude', longitude, { shouldValidate: true })

                alert(`Location retrieved successfully: Lat: ${latitude}, Long: ${longitude}`)
                
                setIsLocating(false)
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('You denied the request for location access.')
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('Location information is unavailable.')
                        break;
                    case error.TIMEOUT:
                        setLocationError('The request to get your location timed out.')
                        break;
                    default:
                        setLocationError('An unknown error occurred while retrieving your location.')
                        break;
                }
                setIsLocating(false);
            }
        )
    }

    const handleLocationSelect = async (lat, lng) => {
        setIsLocating(true)
        setLocationError('')

        try {
            setValue('latitude', lat, { shouldValidate: true });
            setValue('longitude', lng, { shouldValidate: true });

            const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
            const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lng}&format=json`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch address.')

            const data = await response.json()

            if (data && data.display_name) {
                setValue('businessAddress', data.display_name, { shouldValidate: true })
                toast.success('Address updated from map!')
            } else {
                setValue('businessAddress', 'Address not found for this location.', { shouldValidate: true })
            }
        } catch (error) {
            setLocationError(error.message)
            toast.error(error.message)
        } finally {
            setIsLocating(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex">
                <Building2 size={20} className="text-[#545F71] font-bold"/>
                <p className="text-[#545F71] font-medium ml-2">Business Information</p>
            </div>

            <Input 
                id="nameBusiness" 
                label="Business Name" 
                type="text" 
                register={register} 
                errors={errors}
                rules={{
                    required: {value: true, message: "Business name is required"}, 
                }}
            />

            <div className="w-full">
                <label 
                    htmlFor="businessType" 
                    className="block text-sm text-gray-900 font-medium mb-2"
                >
                    Business Type
                    <span className="text-red-500"> *</span>
                </label>
                <select 
                    id="businessType" 
                    name="businessType"
                    {...register("businessType", {
                        required: {value: true, message: "Business type is required"}
                    })}
                    className={clsx(
                        "block w-full border rounded-md border-[#545F71] focus:outline-none p-1.5 focus:ring focus:ring-[#545F71] focus:border-none shadow-md",
                        errors["businessType"] && "ring-rose-500",
                    )}
                >
                    <option value="" disabled className="text-sm text-gray-500">Select a type</option>

                    {businessTypeOptions.map(el => (
                        <option key={el.value} value={el.value}>{el.label}</option>
                    ))}

                </select>

                {errors["businessType"] && (
                    <p className="text-rose-500 text-sm mt-1">
                        {errors["businessType"].message}
                    </p>
                )}
            </div>

            <TextArea 
                id="descriptionBusiness" 
                label="Business Description" 
                rows={3} 
                register={register} 
                errors={errors}
            />

            <div className="flex space-x-4">
                <Input 
                    id="businessEmail" 
                    label="Business Email" 
                    type="email" 
                    register={register} 
                    errors={errors}
                    rules={{
                        required: {value: true, message: "Business email is required"}, 
                        pattern: {value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Please use a valid email address"}
                    }}
                />

                <Input 
                    id="businessPhone" 
                    label="Business Phone" 
                    type="tel" 
                    register={register} 
                    errors={errors}
                    rules={{
                        required: {value: true, message: "Business email is required"},
                        pattern: {value: /^(\+62|62|0)8[0-9]{8,15}$/, message: "Please use a valid phone number"}
                    }}
                />
            </div>

            <TextArea 
                id="businessAddress"
                label="Business Address" 
                rows={3}
                register={register} 
                errors={errors}
            />

            <input type="hidden" {...register('latitude')} />
            <input type="hidden" {...register('longitude')} />

            {/* <div className="mt-2">
                <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#545F71] rounded-md hover:bg-[#495057] disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <MapPin size={16} className="mr-2" />
                    {isLocating ? 'Searching for location...' : 'Use Current Location'}
                </button>
                {locationError && <p className="mt-1 text-sm text-red-500">{locationError}</p>}
            </div> */}

            <p className="text-sm text-gray-600">Click on the map to select your precise location.</p>
            {isLocating && <p className="text-sm text-blue-600">Updating address...</p>}
            {locationError && <p className="mt-1 text-sm text-red-500">{locationError}</p>}

            <MapPicker onLocationSelect={handleLocationSelect} />

        </div>
    )
}

export default RegisterStep2