import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import logoPawtner from '@/assets/pawtner2.png';
import Button from '../../../components/Button';
import RegisterStep1 from './RegisterStep1';
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../../store/slices/authSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify'

const RegisterAccountPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isLoading, error, message } = useSelector(state => state.auth)

    const { register, handleSubmit, formState: { errors, isValid }, getValues, watch, setValue } = useForm({
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            image_url: null,
            address: "",
            password: "",
            confirmPassword: "",
            latitude: null,
            longitude: null,
        }
    })

    const onSubmit = async (data) => {
        const { confirmPassword, ...userData } = data
        dispatch(registerUser(userData))
    }

    useEffect(() => {
        if (message && !error) {
            const email = getValues('email')
            navigate('/verify-email', { state: { email: email } })
        }

        if(error){
            toast.error(error)
        }
    }, [message, error, navigate, getValues])

    return (
        <div className="bg-[#BAC0CA] min-h-screen w-full flex items-center justify-center p-8">
            <div className="bg-white w-11/12 md:max-w-2xl p-6 md:p-8 rounded-xl shadow-lg">
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

                    <div className="mt-4 text-center">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {message && <p className="text-green-600 text-sm">{message}</p>}
                    </div>

                    <div className="mt-4">
                        <Button buttonType="submit" fullWidth disabled={!isValid || isLoading}>
                            {isLoading ? 'Signing up...' : 'Sign up'}
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-8 text-sm">
                    <p>Already have an account? <Link to="/signin" className="text-[#545F71] font-bold hover:underline">Sign in</Link></p>
                </div>
            </div>
        </div>
    )
}

export default RegisterAccountPage