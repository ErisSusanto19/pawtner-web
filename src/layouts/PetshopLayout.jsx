import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import CompleteProfileBanner from '../components/CompleteProfileBanner';

const getTitleFromPath = (path) => {
  if (path === '/' || path === '') return 'Dashboard'
  const mainSegment = path.split('/')[1] || ''
  const title = mainSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return title
}

const PetshopLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user } = useSelector((state) => state.auth)
  const { details } = useSelector((state) => state.business);
  // console.log(details, 'cek businnes from petshop layout');
  

  const title = getTitleFromPath(location.pathname)

  const isBusinessApproved = details && details.statusApproved == 'Approved';
  const menuDisabled = !user.hasBusiness || !isBusinessApproved;
  /**const menuDisabled = user && !user.hasBusiness*/

  const shouldShowBanner = user && !user.hasBusiness && location.pathname !== '/' && location.pathname !== '/register-business'

  if (!user) {
    return null
  }

  return (

    <div className="flex h-screen bg-gray-100">

      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar menuDisabled={menuDisabled}/>
      </div>

      <div className="flex flex-col flex-1 w-0">
        <Header title={title} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto focus:outline-none p-4 sm:p-6">

          {shouldShowBanner && <CompleteProfileBanner />}

          <Outlet />

        </main>
      </div>
    </div>
  )
}

export default PetshopLayout