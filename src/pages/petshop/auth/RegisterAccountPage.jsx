import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import logoPawtner from '@/assets/pawtner2.png';
import Button from '../../../components/Button';
import RegisterStep1 from './RegisterStep1';

const apiRegisterUser = async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    const response = "Success create account"
    return response
}

const RegisterAccountPage = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, getValues, watch, setValue } = useForm({
        mode: "onBlur",
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            imageUrl: null,
            address: "",
            password: "",
            confirmPassword: "",
            latitude: null,
            longitude: null,
        }
    })

    const onSubmit = async (data) => {
        console.log("Submitting user data:", data);
        try {
            const response = await apiRegisterUser(data)
            
            alert("Registration successful! Please check your email to verify your account.")
            navigate('/signin')
        } catch (error) {
            console.error("Registration failed:", error)
            alert("Registration failed. Please try again.")
        }
    };

    return (
        <div className="bg-[#BAC0CA] min-h-screen w-full flex items-center justify-center p-8">
            <div className="bg-white w-11/12 md:max-w-3xl p-6 md:p-8 rounded-xl shadow-lg">
                <div className="flex flex-col justify-center items-center mb-10">
                    <img src={logoPawtner} alt="Logo Pawtner" className="w-48 h-auto" />
                    <p className="text-[#545F71] text-lg font-bold">Create Your Account</p>
                    <p className="text-gray-900 font-medium">Start your journey with us</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <RegisterStep1 
                        register={register} 
                        errors={errors} 
                        getValues={getValues} 
                        watch={watch} 
                        setValue={setValue}
                    />

                    <div className="mt-8">
                        <Button buttonType="submit" fullWidth>
                            Create Account
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-8 text-sm">
                    <p>Already have an account? <a href="/signin" className="text-[#545F71] font-bold hover:underline">Sign in</a></p>
                </div>
            </div>
        </div>
    )
}

export default RegisterAccountPage