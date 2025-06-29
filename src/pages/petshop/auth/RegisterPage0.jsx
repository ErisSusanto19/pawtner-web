import logoPawtner from '@/assets/pawtner2.png'
import Button from '../../../components/Button'
import { useForm } from 'react-hook-form'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import RegisterStep1 from './RegisterStep1'
import RegisterStep2 from './RegisterStep2'
import { useState } from 'react'
import { z } from 'zod'
import RegisterStep3 from './RegisterStep3'
import { zodResolver } from '@hookform/resolvers/zod'

const BUSSINESSTYPE = ["VETERINARY_CLINIC", "PET_SHOP", "GROOMING_SALON", "BOARDING_DAYCARE", "HYBRID"]
const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
const phoneRegex = /^(\+62|62|0)8[0-9]{8,15}$/

const operationDaySchema = z.object(
    {
        isOpen: z.boolean(),
        open: z.string().optional(),
        close: z.string().optional()
    }
)
.refine(data => {
    if(data.isOpen){
        return data.open && timeRegex.test(data.open) && data.close && timeRegex.test(data.close)
    }

    return true
}, {message: "Open and close times are required", path: ["open"]})

const baseSchema = z.object(
    {
        //Step 1
        fullName: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required").email("Please use a valid email address"),
        password: z.string().nonempty("Password is required").min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        //Step 2
        bussinessName: z.string().nonempty("Bussiness name is required"),
        bussinessType: z.enum(BUSSINESSTYPE, {
            required_error: "Bussiness type is required",
            invalid_type_error: "Please select a valid bussiness type"
        }),
        bussinessEmail: z.string().nonempty("Bussiness email is required").email("Please use a valid bussiness email address"),
        bussinessPhone: z.string().nonempty("Bussiness phone is required").regex(phoneRegex, "Please use a valid bussiness phone"),
        //Step 3
        operationHours: z.object({
            monday: operationDaySchema,
            tuesday: operationDaySchema,
            wednesday: operationDaySchema,
            thursday: operationDaySchema,
            friday: operationDaySchema,
            saturday: operationDaySchema,
            sunday: operationDaySchema
        }),
        hasEmergencyServices: z.boolean().default(false),
        emergencyPhone: z.string().transform(e => e === "" ? undefined : e).optional().refine(val => {
            // Jika nilainya ada (bukan undefined), maka harus lolos regex
            if (val !== undefined) {
                return phoneRegex.test(val);
            }
            return true
        }, "Please use a valid phone number"),
    }
)
// .refine(data => data.password === data.confirmPassword, {message: "Passwords don't match", path: ["confirmPassword"]})
// .refine(data => {
//     if(data.hasEmergencyServices){
//         return !!data.emergencyPhone
//     }

//     return true
// }, {message: "Emergency phone is required for emergency services", path: ["emergencyPhone"]})

const step1Schema = baseSchema.pick({ 
    fullName: true, 
    email: true, 
    password: true, 
    confirmPassword: true 
})
.refine(data => data.password === data.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"]})

const step2Schema = baseSchema.pick({ 
    bussinessName: true, 
    bussinessType: true, 
    bussinessEmail: true, 
    bussinessPhone: true 
})

// Skema lengkap yang digunakan untuk resolver form, mencakup semua validasi lintas-field
const registrationSchema = baseSchema.superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Passwords don't match", path: ["confirmPassword"] });
    }
    if (data.hasEmergencyServices && (!data.emergencyPhone || !phoneRegex.test(data.emergencyPhone))) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "A valid emergency phone is required", path: ["emergencyPhone"] })
    }
    if (data.hasEmergencyServices && data.emergencyPhone === undefined) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Emergency phone is required for this service",
            path: ["emergencyPhone"]
        });
    }
});

const TOTAL_STEPS = 3

const RegisterPage = () => {
    const [currStep, setCurrStep] = useState(1)

    const { register, handleSubmit, formState: { errors }, trigger, getValues, watch, setError, clearErrors } = useForm({
        resolver: zodResolver(registrationSchema),
        mode: "onChange",
        defaultValues: {
            //Step 1
            fullName: "",
            email: "",
            phone: "",
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
            emergencyPhone: ""
        }
    })

    // const handleNext = async () => {
    //     console.log(`--- CLICKED NEXT ON STEP ${currStep} ---`);
    //     // Guard clause: jangan lakukan apa-apa jika sudah di step terakhir
    //     if (currStep >= TOTAL_STEPS) return;

    //     let schemaToValidate;
    //     if (currStep === 1) {
    //         schemaToValidate = step1Schema;
    //     } else if (currStep === 2) {
    //         schemaToValidate = step2Schema;
    //     } else {
    //         return; // Tidak ada validasi untuk step lain
    //     }
        
    //     // Membersihkan error lama dari UI sebelum validasi baru
    //     clearErrors();

    //     const currentValues = getValues();
    //     const validationResult = schemaToValidate.safeParse(currentValues);

    //     if (validationResult.success) {
    //         // Jika valid, lanjut ke step berikutnya
    //         setCurrStep(prev => prev + 1);
    //     } else {
    //         // Jika tidak valid, tampilkan error yang ditemukan ke UI
    //         validationResult.error.issues.forEach((issue) => {
    //             const fieldName = issue.path[0];
    //             if (fieldName) {
    //                 setError(fieldName, {
    //                     type: 'manual',
    //                     message: issue.message,
    //                 });
    //             }
    //         });
    //     }
    // };

    const handleNext = async () => {
        console.log(`STEP: ${currStep} — Checking validation`);
      
        let valid = false;
      
        if (currStep === 1) {
          valid = await trigger([
            "fullName", "email", "password", "confirmPassword"
          ]);
        } else if (currStep === 2) {
          valid = await trigger([
            "bussinessName", "bussinessType", "bussinessEmail", "bussinessPhone"
          ]);
        }
      
        if (valid) {
          setCurrStep((prev) => prev + 1);
        } else {
          console.log("Still has errors");
        }
    };
      

    const handlePrevious = () => {
        if (currStep > 1) {
            clearErrors()
            setCurrStep(prev => prev - 1)
        }
    }

    const onSubmit = (data) => {
        console.log("SUBMIT TRIGGERED! Data considered valid:", data);
        console.log("ALL CURRENT VALUES in form:", getValues());
        console.log("Form submitted successfully:", data)
        // if (currStep < TOTAL_STEPS) {
        //     // Jangan submit dulu
        //     handleNext(); // jalankan validasi lokal
        //     return;
        // }
        alert("Registration complete!")
    };

    return (
        <div className="bg-[#BAC0CA] min-h-screen w-full flex items-center justify-center p-8">
            <div className="bg-white w-11/12 md:max-w-3xl p-6 md:p-8 rounded-xl shadow-lg">
                <div className="flex flex-col justify-center items-center mb-8">
                    <img src={logoPawtner} alt="Logo Pawtner" className="w-48 h-auto object-contain object-top mx-auto mb-4" />
                    <p className="text-[#545F71] text-lg font-bold">Join Us</p>
                    <p className="text-gray-900 font-medium">Register your pet business and start reaching more customers</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {currStep === 1 && <RegisterStep1 register={register} errors={errors} getValues={getValues} />}
                    {currStep === 2 && <RegisterStep2 register={register} errors={errors} />}
                    {currStep === 3 && <RegisterStep3 register={register} errors={errors} watch={watch} />}

                    <div className="flex justify-between mt-6">
                        <Button
                            type="button"
                            onClick={handlePrevious}
                            secondary={true}
                            disabled={currStep === 1}
                        >
                            <ChevronLeft size={18}/>
                            Previous
                        </Button>

                        {currStep < TOTAL_STEPS ?
                            (<Button
                                type="button"
                                // type="submit"
                                onClick={handleNext}
                            >
                                Next
                                <ChevronRight size={18}/>
                            </Button>) : 
                            (<Button type="submit">
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