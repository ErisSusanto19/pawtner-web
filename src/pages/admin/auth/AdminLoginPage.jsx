// src/pages/admin/AdminLoginPage.jsx

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/Input'; // Asumsi path komponen sama
import Button from '../../../components/Button'; // Asumsi path komponen sama
import logoPawtner from '@/assets/pawtner2.png'; // Asumsi path aset sama
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

// PERBEDAAN UTAMA:
// Sebaiknya buat action terpisah untuk login admin di Redux slice Anda.
// Ini untuk memisahkan logika, dan mungkin akan memanggil endpoint API yang berbeda 
// (misal: /api/auth/admin/login) atau endpoint yang sama tapi dengan penanganan khusus.
// import { loginAdmin } from '../../../store/slices/authSlice'; // Ganti dengan action login admin

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Anda mungkin ingin state terpisah di Redux untuk admin, atau gunakan yang sama
  const { isLoading, error, isAdminAuthenticated } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data) => {
    // Dispatch action khusus untuk admin
    // dispatch(loginAdmin(data)); 
  };

  useEffect(() => {
    // Jika otentikasi admin berhasil, arahkan ke dasbor admin
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard'); // Arahkan ke halaman utama admin
    }
  }, [isAdminAuthenticated, navigate]);

  return (
    <div className="bg-gray-800 min-h-screen w-full flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-2xl space-y-8">

        <div className="text-center">
          <img 
            src={logoPawtner} 
            alt="Logo Pawtner" 
            className="w-32 h-auto object-contain mx-auto mb-6" 
          />
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-gray-500">Enter your credentials to access the dashboard</p>
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
          
          {/* Menampilkan pesan error jika login gagal */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button buttonType="submit" fullWidth disabled={!isValid || isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {/* BAGIAN INI DIHILANGKAN */}
        {/* Tidak ada link "Sign up" atau "Terms of Service" untuk panel admin */}
        <div className="text-center mt-12">
            <p className="text-xs text-gray-400">
                Pawtner Marketplace © {new Date().getFullYear()}
            </p>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;