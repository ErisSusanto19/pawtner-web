import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Stepper from '../../../components/Stepper';
import Button from '../../../components/Button';
import RegisterStep2 from '../auth/RegisterStep2'
import RegisterStep3 from '../auth/RegisterStep3'
import { ChevronLeft } from 'lucide-react';

const apiCreateBusiness = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    const response = "Success create bussiness"
    console.log(data, 'request successs')
    return response
}

const TOTAL_STEPS = 2

const RegisterBusinessPage = () => {
    const [currStep, setCurrStep] = useState(1)
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, trigger, watch, setValue, getValues } = useForm({
        mode: "onBlur",
        defaultValues: {
            //Step 2
            bussinessName: "",
            bussinessType: "",
            bussinessDescription: "",
            bussinessEmail: "",
            bussinessPhone: "",
            bussinessAddress: "",
            bussinessLatitude: null,
            bussinessLongitude: null,
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
    });
    
    const stepFields = {
        1: ["bussinessName", "bussinessType", "bussinessEmail", "bussinessPhone", "bussinessAddress"],
        2: ["termsAccepted", "privacyAccepted"]
    };

    const handleNext = async () => {
        const fieldsToValidate = stepFields[currStep]
        const isValid = await trigger(fieldsToValidate)
        if (isValid) {
            if (currStep < TOTAL_STEPS) setCurrStep(prev => prev + 1)
        }
    }
      
    const handlePrevious = () => {
        if (currStep > 1) setCurrStep(prev => prev - 1)
    }

    const onSubmit = async (data) => {
        console.log("Submitting business data:", data)

        try {
            const response = await apiCreateBusiness(data)
            alert("Your business profile has been created successfully!")
            navigate('/')
        } catch (error) {
            console.error("Failed to create business:", error)
            alert("Failed to create business profile. Please try again.")
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="bg-white w-full max-w-3xl mx-auto p-8 rounded-xl shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#495057]">Complete Your Business Profile</h1>
                    <p className="text-gray-600">Provide your business details to get started.</p>
                </div>

                <Stepper currentStep={currStep} totalSteps={TOTAL_STEPS} />

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
                    {currStep === 1 && <RegisterStep2 register={register} errors={errors} setValue={setValue} />}
                    {currStep === 2 && <RegisterStep3 register={register} errors={errors} watch={watch} getValues={getValues} setValue={setValue} />}
                    
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <Button
                            buttonType="button"
                            onClick={handlePrevious}
                            secondary={true}
                            disabled={currStep === 1}
                        >
                            <ChevronLeft size={18} /> Previous
                        </Button>

                        {currStep < TOTAL_STEPS ? (
                            <button
                                type="button" 
                                onClick={handleNext}
                                className="flex justify-center items-center py-2 px-3 text-sm text-gray-300 font-semibold rounded-md bg-[#545F71] hover:bg-[#353f52] focus:outline-[#353f52]"
                            >
                                Next Step
                            </button>
                        ) : (
                            <Button buttonType="submit">
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