import { useForm } from 'react-hook-form'
import { Save } from 'lucide-react';
import Input from '../../../components/Input';
import TextArea from '../../../components/TextArea';
import DayRow from '../../../components/DayRow';
import FileUpload from '../../../components/FileUploadV2';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBusinessDetails } from '../../../store/slices/businessSlice';
import { formatToFrontendHours } from '../../../utils/formatter'
import MapPicker from '../../../components/MapPicker';
import { toast } from 'react-toastify';
import Button from '../../../components/Button';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const businessTypeOptions = [
    {value: "VETERINARY_CLINIC", label: "Veterinary Clinic"},
    {value: "PET_SHOP", label: "Pet Shop"},
    {value: "GROOMING_SALON", label: "Grooming Salon"},
    {value: "BOARDING_DAYCARE", label: "Boarding Daycare"},
    {value: "HYBRID", label: "Hybrid"},
]

const veterinaryStatusOptions = [
    { value: "ACCEPTING_PATIENTS", label: "Accepting New Patients" },
    { value: "AT_CAPACITY", label: "At Capacity" },
    { value: "CLOSED", label: "Closed" },
]

const BusinessProfileForm = ({ initialData }) => {
    const dispatch = useDispatch()
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState('');

    const memoizedData = useMemo(() => {
        if (!initialData) {
            return {
                nameBusiness: '',
                descriptionBusiness: '',
                businessType: '',
                businessEmail: '',
                businessPhone: '',
                businessAddress: '',
                hasEmergencyServices: false,
                emergencyPhone: '',
                operationHours: formatToFrontendHours({}),
                businessImageUrl: null,
                certificateImageUrl: null,
                latitude: null,
                longitude: null,
                statusRealTime: ''
            };
        }
        
        return {
            nameBusiness: initialData.businessName,
            descriptionBusiness: initialData.descriptionBusiness || initialData.description,
            businessType: initialData.businessType,
            businessEmail: initialData.businessEmail,
            businessPhone: initialData.businessPhone,
            businessAddress: initialData.businessAddress,
            hasEmergencyServices: Boolean(initialData.hasEmergencyServices),
            emergencyPhone: initialData.emergencyPhone,
            businessImageUrl: initialData.businessImageUrl,
            certificateImageUrl: initialData.certificateImageUrl,
            operationHours: formatToFrontendHours(initialData.operationHours),
            latitude: initialData.latitude,
            longitude: initialData.longitude,
            statusApproved: initialData.statusApproved,
            statusRealTime: initialData.statusRealTime
        };
    }, [initialData])

    const { register, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting, dirtyFields, isValid, isDirty } } = useForm({
        mode: 'onChange',
        values: memoizedData
    })

    // useEffect(() => {
    //     if (initialData) {

    //         const mappedData = {
    //             nameBusiness: initialData.businessName,
    //             descriptionBusiness: initialData.descriptionBusiness? initialData.descriptionBusiness : initialData.description,
    //             businessType: initialData.businessType,
    //             businessEmail: initialData.businessEmail,
    //             businessPhone: initialData.businessPhone,
    //             businessAddress: initialData.businessAddress,
    //             hasEmergencyServices: Boolean(initialData.hasEmergencyServices),
    //             emergencyPhone: initialData.emergencyPhone,
    //             businessImageUrl: initialData.businessImageUrl,
    //             certificateImageUrl: initialData.certificateImageUrl,
    //             operationHours: formatToFrontendHours(initialData.operationHours),
    //             latitude: initialData.latitude,
    //             longitude: initialData.longitude,
    //             statusApproved: initialData.statusApproved,
    //             statusRealTime: initialData.statusRealTime
    //         }

    //         // console.log(mappedData, '<<< cek mapped data')

    //         reset(mappedData)
    //     }
    // }, [initialData, reset])

    const onSubmit = async (data) => {
        try {
            if (data.businessType !== 'VETERINARY_CLINIC') {
                delete data.statusRealTime
            }
            const response = await dispatch(updateBusinessDetails(data))
            toast.success("Business information has been successfully saved.")
        } catch (error) {
            toast.error(error.message || `Failed to update profile business`)
        }
    }

    const hasEmergency = watch('hasEmergencyServices')
    const watchedOperationHours = watch('operationHours')

    const watchedLat = watch('latitude')
    const watchedLng = watch('longitude')

    const watchedBusinessType = watch('businessType')
    const isVeterinaryClinic = watchedBusinessType === 'VETERINARY_CLINIC'

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
            console.log(data, 'cek hasil geo location')

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

    const MAX_FILE_SIZE_MB = 2
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

    console.log({ 
        isDirty, 
        isValid, 
        isSubmitting,
        errors 
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Approval Status Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <h3 className="text-lg font-semibold text-[#495057] mb-4">Approval Status</h3>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">Your business status:</span>
                    {(() => {
                        const status = watch('statusApproved') || 'Pending';
                        let badgeColor = '';
                        let badgeText = status;

                        switch (status) {
                            case 'Approved':
                                badgeColor = 'bg-green-100 text-green-700';
                                break;
                            case 'Rejected':
                                badgeColor = 'bg-red-100 text-red-700';
                                break;
                            case 'Pending':
                            default:
                                badgeColor = 'bg-yellow-100 text-yellow-700';
                                break;
                        }

                        return (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
                                {badgeText}
                            </span>
                        );
                    })()}
                </div>
            </div>

            {/* General Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <h3 className="text-lg font-semibold text-[#495057] mb-4">General Information</h3>
                <div className="space-y-4">
                    <Input
                        id="nameBusiness"
                        label="Business Name"
                        register={register}
                        errors={errors}
                        rules={{ required: "Business name is required" }}
                    />
                    <TextArea
                        id="descriptionBusiness"
                        label="Business Description"
                        rows={3}
                        register={register}
                        errors={errors}
                    />
                    <div>
                        <label className="block text-sm text-gray-900 font-medium mb-2">Business Type</label>
                        <select {...register('businessType')} className="block w-full border rounded-md border-[#545F71] focus:outline-none p-1.5 focus:ring focus:ring-[#545F71] focus:border-none shadow-md">
                            {businessTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Contact & Location Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <h3 className="text-lg font-semibold text-[#495057] mb-4">Contact & Location</h3>
                <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input id="businessEmail" label="Business Email" type="email" register={register} errors={errors} rules={{ required: "Business email is required" }} />
                        <Input id="businessPhone" label="Business Phone" type="tel" register={register} errors={errors} rules={{ required: "Business phone is required" }} />
                    </div>

                    <input 
                        type="hidden" 
                        {...register('latitude', { required: 'Please select a location on the map.' })}
                    />
                    <input 
                        type="hidden" 
                        {...register('longitude', { required: 'Please select a location on the map.' })}
                    />
                    
                    <div className='-z-50'>
                        <MapPicker 
                            onLocationSelect={handleLocationSelect}
                            initialLat={watchedLat}
                            initialLng={watchedLng}
                        />
                    </div>

                    <TextArea 
                        id="businessAddress" 
                        label="Business Address" 
                        register={register} 
                        errors={errors}
                        rows={3} 
                    />

                    <p className="text-xs text-gray-500 mt-2 mb-4 ml-1">
                        This address is automatically filled from the map. You can edit it for more detail (e.g., add floor number or block).
                    </p>
                    
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <input 
                                type="checkbox" 
                                id="hasEmergencyServices" 
                                {...register('hasEmergencyServices')}
                                className="h-4 w-4 rounded border-gray-300 text-[#545F71] focus:ring-[#545F71]" 
                            />
                            <label htmlFor="hasEmergencyServices" className="text-sm font-medium text-gray-900">Offers Emergency Services</label>
                        </div>
                        <p className="ml-7 text-sm text-gray-500">
                            Customers will be able to contact you outside normal business hours.
                        </p>
                    </div>
                    {hasEmergency && (
                        <Input
                            id="emergencyPhone"
                            label="Emergency Phone"
                            type="tel"
                            register={register}
                            errors={errors}
                            rules={{
                                required: hasEmergency ? "Emergency phone is required" : false,
                                pattern: { value: /^((\+62|62|0)(8[1-9][0-9]{6,13}|2[1-9][0-9]{6,10}))$/, message: "Please use a valid phone number" }
                            }}
                        />
                    )}
                </div>
            </div>
            
            {/* Operating Hours Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <h3 className="text-lg font-semibold text-[#495057] mb-2">Operating Hours</h3>
                
                {isVeterinaryClinic && (
                    <div className="mb-4">
                        <label htmlFor="statusRealTime" className="block text-sm text-gray-900 font-medium mb-2">
                            Current Patient Intake Status
                        </label>
                        <select 
                            id="statusRealTime"
                            {...register('statusRealTime')} 
                            className="block w-full border rounded-md border-[#545F71] focus:outline-none p-1.5 focus:ring focus:ring-[#545F71] focus:border-none shadow-md"
                        >
                            {veterinaryStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <p className="text-xs text-gray-500 mt-1 mb-8">This status is shown to users in real-time.</p>
                    </div>
                )}

                <div className="p-4 border rounded-md border-[#545F71] space-y-3">
                    {watchedOperationHours && typeof watchedOperationHours === 'object' ? (
                        daysOfWeek.map(day => (
                            <DayRow key={day} day={day} register={register} watch={watch} errors={errors} getValues={watch} />
                        ))
                    ) : <p className="text-center text-gray-500">Loading hours...</p>}
                </div>
            </div>
            
            {/* Branding & Verification Card */}
            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                <h3 className="text-lg font-semibold text-[#495057] mb-4">Branding & Verification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FileUpload
                        name="businessImageUrl" 
                        label="Business Profile Photo" 
                        {...{ register, setValue, watch, errors }} 
                        accept={{ 'image/*': [] }}
                        rules={{
                            validate: {
                                fileSize: (value) => {
                                    if (!value || !(value instanceof File)) return true;
                                    return value.size <= MAX_FILE_SIZE_BYTES || `File size must be less than ${MAX_FILE_SIZE_MB}MB`;
                                }
                            }
                        }}
                        />
                    <FileUpload 
                        name="certificateImageUrl" 
                        label="Business Certificate" 
                        {...{ register, setValue, watch, errors }} 
                        accept={{ 'application/pdf': [] }} 
                        rules={{
                            validate: {
                                fileSize: (value) => {
                                    if (!value || !(value instanceof File)) return true;
                                    return value.size <= MAX_FILE_SIZE_BYTES || `File size must be less than ${MAX_FILE_SIZE_MB}MB`;
                                }
                            }
                        }}
                    />
                </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button 
                    buttonType="submit"
                    disabled={ !isDirty || !isValid || isSubmitting }
                    className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057]"
                    isLoading={isSubmitting}
                >
                    <Save size={16} />
                    {/* {isSubmitting ? 'Saving...' : 'Save Business Info'} */}
                    Save Business Info
                </Button>
            </div>
        </form>
    )
}

export default BusinessProfileForm