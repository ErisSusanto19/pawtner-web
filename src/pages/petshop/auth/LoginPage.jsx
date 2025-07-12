import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import logoPawtner from '@/assets/pawtner2.png'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, requestPasswordReset } from '../../../store/slices/authSlice';
import { useEffect, useState } from 'react';
import ForgotPasswordModal from './ForgotPasswordModal';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading: isLoginLoading, error, isAuthenticated } = useSelector((state) => state.auth)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isResetLoading, setIsResetLoading] = useState(false)

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data))
      toast.success("Signed in successfully")
    } catch (error) {
      if (error.message?.includes("User is disabled")) {
        toast.error("Your account has been banned. Please contact support for more information.")
      } else if(error.message?.includes("User account is locked")){
        toast.error("Your account is currently suspended. Please try again later or contact support.")
      } else if(error.message?.includes("Bad credentials")){
        toast.error("Invalid email or password")
      } else {
        toast.error(error.message || "An unknown error occurred.")
      }
    }
  }

  const handleRequestReset = async (data) => {
    setIsResetLoading(true)
    try {
      const message = await dispatch(requestPasswordReset(data.resetEmail))
      toast.success(message || "Password reset link sent! Please check your email.")
      setIsModalOpen(false)
    } catch (err) {
      toast.error(err.message || "Failed to send reset link. Please try again.")
    } finally {
      setIsResetLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <>
      <div className="bg-[#BAC0CA] min-h-screen w-full flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-2xl space-y-8">

          <div className="text-center">
            <img 
              src={logoPawtner} 
              alt="Logo Pawtner" 
              className="w-40 h-auto object-contain mx-auto mb-6" 
            />
            <h2 className="text-2xl font-bold text-[#495057]">Welcome Back!</h2>
            <p className="text-gray-500">Sign in to your business account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              id="email"
              label="Email"
              type="email"
              register={register}
              errors={errors}
              rules={{
                required: 'Email is required.',
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: 'Please enter a valid email address.',
                },
              }}
            />

            {/* <div> */}
              <Input
                id="password"
                label="Password"
                type="password"
                register={register}
                errors={errors}
                rules={{
                  required: 'Password is required.',
                }}
              />
            {/* </div> */}

            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-medium text-[#545F71] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* {error && <p className="text-red-500 text-sm text-center">{error}</p>} */}

            <Button buttonType="submit" fullWidth disabled={!isValid || isLoginLoading}>
              {isLoginLoading ? 'Signing In...' : 'Sign In'}
            </Button>
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

          <div className="flex flex-col justify-center items-center mt-12">
              <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-[#545F71] hover:underline">
                  Sign up
              </Link>
              </p>
              <p className="text-center text-sm text-gray-600">
                  By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRequestReset}
        isLoading={isResetLoading}
      />
    </>
  )
}

export default LoginPage