import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import CompleteProfileBanner from '../components/CompleteProfileBanner';
import PageLoader from '../components/PageLoader';
import { logout } from '../store/slices/authSlice'
import { clearBusinessData } from '../store/slices/businessSlice'

const getTitleFromPath = (path) => {
  if (path === '/dashboard' || path === 'dashboard') return 'Dashboard'
  const mainSegment = path.split('/dashboard')[1] || ''
  const title = mainSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return title
}

const PetshopLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, status: authStatus } = useSelector((state) => state.auth)
  const { details, status: businessStatus } = useSelector((state) => state.business);

  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  if (authStatus === 'loading') {
    return <PageLoader message="Preparing your session..." />;
  }
  
  if (!user) {
    return <PageLoader message="Session not found. Redirecting..." />;
  }

  const handleLogout = () => {
    setIsLoggingOut(true)

    setTimeout(() => {
      dispatch(logout())
      dispatch(clearBusinessData())
      navigate('/signin')
    }, 800)
  }
  

  const title = getTitleFromPath(location.pathname)

  const isBusinessApproved = details && details.statusApproved == 'Approved'
  const menuDisabled = !user.hasBusiness || !isBusinessApproved

  const shouldShowBanner = user && !user.hasBusiness && location.pathname !== '/dashboard' && location.pathname !== '/register-business'


  return (
    <>
      {isLoggingOut && <PageLoader/>}

      <div className="flex h-screen bg-gray-100">

        <div className="hidden md:flex md:flex-shrink-0">
          <Sidebar menuDisabled={menuDisabled} onLogout={handleLogout}/>
        </div>

        <div className="flex flex-col flex-1 w-0">
          <Header title={title} setSidebarOpen={setSidebarOpen} onLogout={handleLogout}/>
          <main className="flex-1 overflow-y-auto focus:outline-none p-4 sm:p-6">

            {shouldShowBanner && <CompleteProfileBanner />}

            <Outlet />

          </main>
        </div>
      </div>
    </>
  )
}

export default PetshopLayout