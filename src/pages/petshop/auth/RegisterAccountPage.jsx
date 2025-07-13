import { useForm } from 'react-hook-form';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import logoPawtner from '@/assets/pawtner2.png';
import Button from '../../../components/Button';
import RegisterStep1 from './RegisterStep1';
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from '../../../store/slices/authSlice';
import { useEffect, useState } from 'react';
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
            phoneNumber: "",
            imageUrl: null,
            address: "",
            password: "",
            confirmPassword: "",
            latitude: null,
            longitude: null,
        }
    })

    const onSubmit = async (data) => {
        try {
            const { confirmPassword, ...userData } = data
            await dispatch(registerUser(userData))
            toast.success("Signed up successfully")

            const email = getValues('email')
            navigate('/verify-email', { state: { email: email } })
        } catch (error) {
            if(error.message?.toLowerCase().includes("similar record")){
                toast.error("Phone number is already in use. Please use a different one.")
            } else{
                toast.error(error.message || "An unknown error occurred.")
            }
        }
    }

    // useEffect(() => {
    //     if (message && !error) {
    //         const email = getValues('email')
    //         navigate('/verify-email', { state: { email: email } })
    //     }

    //     // if(error){
    //     //     toast.error(error)
    //     // }
    // }, [message, error, navigate, getValues])

    return (
        <div className="bg-[#BAC0CA] min-h-screen w-full flex items-center justify-center p-8">
            <div className="bg-white w-11/12 md:max-w-lg p-6 md:p-8 rounded-xl shadow-lg">
                <div className="flex flex-col justify-center items-center mb-10">
                    <NavLink to={'/'}>
                        <img src={logoPawtner} alt="Logo Pawtner" className="w-48 h-auto" />
                    </NavLink>
                    <p className="text-[#545F71] text-lg font-bold">Create Your Account</p>
                    <p className="text-gray-900 font-medium text-sm">Start your journey with us</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <RegisterStep1 
                        register={register} 
                        errors={errors} 
                        getValues={getValues} 
                        watch={watch} 
                        setValue={setValue}
                    />

                    {/* <div className="mt-4 text-center">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {message && <p className="text-green-600 text-sm">{message}</p>}
                    </div> */}

                    <div className="mt-4">
                        <Button buttonType="submit" fullWidth disabled={!isValid || isLoading} isLoading={isLoading}>
                            {/* {isLoading ? 'Signing up...' : 'Sign up'} */}
                            Sign up
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <p className="text-center text-gray-500 text-sm mb-2">Or sign up with</p>
                    <button
                        type="button"
                        onClick={() => window.location.href = `${import.meta.env.VITE_BASE_URL_API_OAUTH}/oauth2/authorization/google`}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-100 transition"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>
                </div>

                <div className="text-center mt-8 text-sm">
                    <p>Already have an account? <Link to="/signin" className="text-[#545F71] font-bold hover:underline">Sign in</Link></p>
                </div>
            </div>
        </div>
    )
}

export default RegisterAccountPage