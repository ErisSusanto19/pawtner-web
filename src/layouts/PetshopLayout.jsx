import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import WelcomePage from '../pages/petshop/dashboard/WelcomePage';
import { useSelector, useDispatch } from 'react-redux';

const getTitleFromPath = (path) => {
  if (path === '/') return 'Dashboard'
  const title = path
    .replace('/', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') 
  return title
}

const PetshopLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isAuthenticated, status } = useSelector((state) => state.auth)

  const title = getTitleFromPath(location.pathname)

  useEffect(() => {
    if (!isAuthenticated && status !== 'loading') {
      navigate('/signin')
    }
    
    // if (isAuthenticated && !user && status === 'idle') {
    //   dispatch(fetchUserProfile()); 
    // }

  }, [isAuthenticated, status, user, navigate, dispatch])

  const isBusinessOwnerWithoutBusiness = user && user.role === 'business_owner' && !user.hasBusiness
  const isOnCreateBusinessPage = location.pathname === '/register-business'

  const showWelcomePage = isBusinessOwnerWithoutBusiness && !isOnCreateBusinessPage
  const menuDisabled = isBusinessOwnerWithoutBusiness

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p>Loading application...</p>
      </div>
    )
  }

  return (

    <div className="flex h-screen bg-gray-100">

      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar menuDisabled={menuDisabled}/>
      </div>

      <div className="flex flex-col flex-1 w-0">
        <Header title={title} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto focus:outline-none">
          {showWelcomePage ? (
            <WelcomePage userName={user.name} />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}

export default PetshopLayout