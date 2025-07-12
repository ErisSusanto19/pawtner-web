import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Stepper from '../../../components/Stepper';
import Button from '../../../components/Button';
import RegisterStep2 from './RegisterStep2'
import RegisterStep3 from './RegisterStep3'
import { ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createBusiness } from '../../../store/slices/businessSlice'
import { toast } from 'react-toastify';

const TOTAL_STEPS = 2

const stepFields = {
    1: ["nameBusiness", "businessType", "businessEmail", "businessPhone", "businessAddress", "latitude", "longitude"],
    2: ["termsAccepted", "privacyAccepted"]
}

const requiredFieldsByStep = {
    1: ["nameBusiness", "businessType", "businessEmail", "businessPhone", "latitude", "longitude"],
    2: ["termsAccepted", "privacyAccepted"]
}

const RegisterBusinessPage = () => {
    const [currStep, setCurrStep] = useState(1)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // const [isStepValid, setIsStepValid] = useState(false)

    const { isLoading, status: businessStatus, error } = useSelector((state) => state.business)
    const user = useSelector((state) => state.auth.user)


    const { register, handleSubmit, formState: { errors, isValid, dirtyFields }, trigger, watch, setValue, getValues } = useForm({
        mode: "onChange",
        defaultValues: {
            //Step 2
            nameBusiness: "",
            businessType: "",
            descriptionBusiness: "",
            businessEmail: "",
            businessPhone: "",
            businessAddress: "",
            latitude: null,
            longitude: null,
            //Step 3
            operationHours: { 
                monday:    { isOpen: true, open: '09:00', close: '17:00' },
                tuesday:   { isOpen: true, open: '09:00', close: '17:00' },
                wednesday: { isOpen: true, open: '09:00', close: '17:00' },
                thursday:  { isOpen: true, open: '09:00', close: '17:00' },
                friday:    { isOpen: true, open: '09:00', close: '17:00' },
                saturday:  { isOpen: false, open: '', close: '' },
                sunday:    { isOpen: false, open: '', close: '' },
            },
            hasEmergencyServices: false,
            emergencyPhone: "",
            businessImageUrl: null,
            certificateImageUrl: null,
            termsAccepted: false,
            privacyAccepted: false,
        }
    })

    const fieldsForCurrentStep = stepFields[currStep] || []
    const requiredFields = requiredFieldsByStep[currStep] || []
    const allRequiredFieldsDirty = requiredFields.every(field => dirtyFields[field])
    const hasErrorsInStep = fieldsForCurrentStep.some(field => errors[field])
    const canProceed = allRequiredFieldsDirty && !hasErrorsInStep

    // const isStepValid = () => {
    //     const hasErrors = fieldsForCurrentStep.some(field => errors[field])
    //     if (hasErrors) {
    //         return false
    //     }

    //     const areAllFieldsFilled = fieldsForCurrentStep.every(field => {
    //         const value = getValues(field)
    //         return value !== '' && value !== null && value !== undefined && value !== false
    //     })

    //     return areAllFieldsFilled
    // }

    useEffect(() => {
        if (businessStatus === 'succeeded' && user?.hasBusiness) {
            toast.success("Your business profile has been created successfully!")
            navigate('/dashboard')
        }

        if (businessStatus === 'failed' && error) {
            toast.error(error)
        }
    }, [businessStatus, user, error, navigate])

    const handleNext = async () => {
        const fieldsToValidate = stepFields[currStep]
        const isValid = await trigger(fieldsToValidate)
        
        if (isValid && currStep < TOTAL_STEPS) {
            setCurrStep(prev => prev + 1)
        }
    }

    const handlePrevious = () => {
        if (currStep > 1) setCurrStep(prev => prev - 1)
    }

    const onSubmit = async (data) => {
        dispatch(createBusiness(data))
    }

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="bg-white w-full max-w-3xl mx-auto p-8 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#495057]">Complete Your Business Profile</h1>
                    <p className="text-gray-600">Provide your business details to get started.</p>
                </div>

                <Stepper currentStep={currStep} totalSteps={TOTAL_STEPS} />

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
                    {currStep === 1 && <RegisterStep2 register={register} errors={errors} setValue={setValue} watch={watch} />}
                    {currStep === 2 && <RegisterStep3 register={register} errors={errors} watch={watch} getValues={getValues} setValue={setValue} />}
                    
                    {/* {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>} */}

                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <Button
                            buttonType="button"
                            onClick={handlePrevious}
                            disabled={currStep === 1}
                        >
                            <ChevronLeft size={18} /> Previous
                        </Button>

                        {currStep < TOTAL_STEPS ? (
                            <Button
                                buttonType="button"
                                onClick={handleNext}
                                disabled={!canProceed || isLoading}
                            >
                                Next Step
                            </Button>
                        ) : (
                            <Button buttonType="submit" disabled={!canProceed || isLoading} isLoading={isLoading}>
                                Finish & Create Business
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterBusinessPage