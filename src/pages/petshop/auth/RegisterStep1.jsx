import Input from '../../../components/Input'
import TextArea from '../../../components/TextArea'
import { UserRound, MapPin } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

const RegisterStep1 = ({register, errors, getValues, watch, setValue}) => {

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

                toast.success(`Location retrieved successfully: Lat: ${latitude}, Long: ${longitude}`)
                
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
                setValue('address', data.display_name, { shouldValidate: true })
                toast.success('Address updated from map!')
            } else {
                setValue('address', 'Address not found for this location.', { shouldValidate: true })
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
                <UserRound size={20} className="text-[#545F71] font-bold"/>
                <p className="text-[#545F71] font-medium ml-2">Personal Information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-6">
                {/* <div className="md:col-span-1">
                    <FileUpload
                        name="imageUrl"
                        label="Profile Picture"
                        accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
                        register={register}
                        setValue={setValue}
                        watch={watch}
                        errors={errors}
                        // rules={{ required: 'Profile picture is required.' }}
                    />
                </div> */}
                <div className="md:col-span-2 space-y-6">
                    <Input 
                        id="name" 
                        label="Full Name" 
                        type="text" 
                        register={register} 
                        errors={errors}
                        rules={{
                            required: {value: true, message: "Name is required"}, 
                        }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input 
                            id="email" 
                            label="Email" 
                            type="email" 
                            register={register} 
                            errors={errors}
                            rules={{
                                required: {value: true, message: "Email is required"}, 
                                pattern: {value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Please use a valid email address"}
                            }}
                        />

                        <Input 
                            id="phoneNumber" 
                            label="Phone" 
                            type="tel" 
                            register={register} 
                            errors={errors}
                            rules={{
                                pattern: {value: /^((\+62|62|0)(8[1-9][0-9]{6,13}|2[1-9][0-9]{6,10}))$/, message: "Please use a valid phone number"}
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* <input type="hidden" {...register('latitude')} />
            <input type="hidden" {...register('longitude')} /> */}

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

            {/* <p className="text-sm text-gray-600">Click on the map to select your precise location.</p>
            {isLocating && <p className="text-sm text-blue-600">Updating address...</p>}
            {locationError && <p className="mt-1 text-sm text-red-500">{locationError}</p>} */}

            {/* <MapPicker onLocationSelect={handleLocationSelect} /> */}

            <TextArea 
                id="address" 
                label="Address" 
                rows={3} 
                register={register} 
                errors={errors}
            />
            {/* <p className="text-xs text-gray-500 -mt-5 mb-4 ml-1">
                This address is automatically filled from the map. You can edit it for more detail (e.g., add floor number or block).
            </p> */}

            <div className='flex space-x-4'>
                <Input 
                    id="password" 
                    label="Password" 
                    type="password" 
                    register={register} 
                    errors={errors}
                    rules={{
                        required: {value: true, message: "Password is required"}, 
                        minLength: {value: 6, message: "Password must be at least 6 characters long"}
                    }}
                />

                <Input 
                    id="confirmPassword" 
                    label="Confirm Password" 
                    type="password" 
                    register={register} 
                    errors={errors}
                    rules={{
                        required: {value: true, massage: "Please confirm your password"},
                        validate: (value) => value === getValues("password") || "Passwords don't match"
                    }}
                />
            </div>
        </div>
    )
}

export default RegisterStep1