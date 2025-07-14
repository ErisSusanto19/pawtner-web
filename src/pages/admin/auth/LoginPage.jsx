import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import logoPawtner from '@/assets/pawtner2.png'; 
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { loginAdmin, clearAdminError } from '../../../store/slices/adminAuthSlice';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { isLoading, error, isAdminAuthenticated } = useSelector((state) => state.adminAuth)

  const { 
    register, 
    handleSubmit, 
    setError,
    formState: { errors, isValid } 
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    dispatch(clearAdminError())
    
    return () => {
      dispatch(clearAdminError())
    };
  }, [dispatch])

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAdminAuthenticated, navigate])

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(loginAdmin(data))
      toast.success(response.message)
    } catch (rejectedValueOrSerializedError) {
      const errorMessage = rejectedValueOrSerializedError.message || 'An unknown error occurred.'
      toast.error(errorMessage)
      setError('root.serverError', { 
        type: 'manual', 
        message: errorMessage 
      })
    }
  }

  return (
    <div className="flex h-screen">
      <div className="hidden w-1/2 items-center justify-center bg-gray-800 lg:flex">
        <div className="text-center">
          <div className="bg-white p-4 rounded-full w-40 h-40 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <img 
                  src={logoPawtner} 
                  alt="Logo Pawtner" 
                  className="w-full h-auto object-contain" 
              />
          </div>
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-white lg:w-1/2">
        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="mt-2 text-gray-600">Enter your credentials to access the dashboard.</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              id="email"
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
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              id="password"
              register={register}
              errors={errors}
              rules={{
                required: 'Password is required.',
                minLength: {value: 6, message: "Password must be at least 6 characters long"}
              }}
            />

            <Button buttonType="submit" fullWidth disabled={!isValid || isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage