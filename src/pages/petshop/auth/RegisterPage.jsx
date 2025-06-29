import logoPawtner from '@/assets/pawtner2.png'
import Button from '../../../components/Button'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import RegisterStep1 from './RegisterStep1'
import RegisterStep2 from './RegisterStep2'
import RegisterStep3 from './RegisterStep3'
import Stepper from '../../../components/Stepper'

const TOTAL_STEPS = 3

const RegisterPage = () => {
    const [currStep, setCurrStep] = useState(1)

    const { register, handleSubmit, formState: { errors }, trigger, getValues, watch, setValue } = useForm({
        mode: "onChange",
        defaultValues: {
            //Step 1
            fullName: "",
            email: "",
            phone: "",
            imageUrl: null,
            address: "",
            password: "",
            confirmPassword: "",
            //Step 2
            bussinessName: "",
            bussinessType: "",
            bussinessDescription: "",
            bussinessEmail: "",
            bussinessPhone: "",
            bussinessAddress: "",
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
            termsAccepted: false,
            privacyAccepted: false,
        }
    })

    const stepFields = {
        1: ["fullName", "email", "phone", "password", "confirmPassword"],
        2: ["bussinessName", "bussinessType", "bussinessEmail", "bussinessPhone", "bussinessAddress"],
        3: ["hasEmergencyServices", "emergencyPhone"]
    }

    const handleNext = async () => {
        const fieldsToValidate = stepFields[currStep]
        const isValid = await trigger(fieldsToValidate)

        if (isValid) {
            setCurrStep((prev) => prev + 1)
        } else {
            console.log("Validation failed on step", currStep);
        }
    }
      

    const handlePrevious = () => {
        if (currStep > 1) {
            setCurrStep(prev => prev - 1)
        }
    }

    const onSubmit = (data) => {
        console.log("Form submitted successfully! All steps are valid.")
        console.log("Final data:", data)
        alert("Registration complete!")
    }

    return (
        <div className="bg-[#BAC0CA] min-h-screen w-full flex items-center justify-center p-8">
            <div className="bg-white w-11/12 md:max-w-3xl p-6 md:p-8 rounded-xl shadow-lg">
                <div className="flex flex-col justify-center items-center mb-10">
                    <img src={logoPawtner} alt="Logo Pawtner" className="w-48 h-auto object-contain object-top mx-auto mb-4" />
                    <p className="text-[#545F71] text-lg font-bold">Join Us</p>
                    <p className="text-gray-900 font-medium">Register your pet business and start reaching more customers</p>
                </div>

                <Stepper currentStep={currStep} totalSteps={TOTAL_STEPS}/>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {currStep === 1 && <RegisterStep1 register={register} errors={errors} getValues={getValues} watch={watch} setValue={setValue}/>}
                    {currStep === 2 && <RegisterStep2 register={register} errors={errors} />}
                    {currStep === 3 && <RegisterStep3 register={register} errors={errors} watch={watch} getValues={getValues} setValue={setValue} />}

                    <div className="flex justify-between mt-6">
                        <Button
                            buttonType="button"
                            onClick={handlePrevious}
                            secondary={true}
                            disabled={currStep === 1}
                        >
                            <ChevronLeft size={18}/>
                            Previous
                        </Button>

                        {currStep < TOTAL_STEPS ?
                            (<button
                                type="button"
                                onClick={handleNext}
                                className="flex justify-center items-center py-2 px-3 text-sm text-white font-semibold rounded-md bg-[#545F71] hover:bg-[#353f52] focus:outline-[#353f52]"
                            >
                                Next
                                <ChevronRight size={18}/>
                            </button>) : 
                            (<Button buttonType="submit">
                                Create Account
                            </Button>)
                        }
                    </div>
                </form>

                <div className="flex flex-col justify-center items-center mt-12">
                    <p>Already have an account?  <a href="#" className="text-[#545F71] font-bold">Sign up</a></p>
                    <p>Need help? contact our support team at  <a href="#">support@pawtner.com</a></p>
                </div>
                
            </div>
        </div>
    )
}

export default RegisterPage