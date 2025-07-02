import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import logoPawtner from '@/assets/pawtner2.png'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, registerUser } from '../../../store/slices/authSlice';
import { useEffect } from 'react';

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth)

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data) => {
    dispatch(loginUser(data))
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="bg-[#BAC0CA] min-h-screen w-full flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg space-y-8">

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

          <div>
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
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button buttonType="submit" fullWidth>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="flex flex-col justify-center items-center mt-12">
            <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-[#545F71] hover:underline">
                Sign up
            </Link>
            </p>
            <p className="text-center text-sm text-gray-600">
                By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage