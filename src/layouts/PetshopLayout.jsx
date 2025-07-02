import { useContext, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import WelcomePage from '../pages/petshop/dashboard/WelcomePage';

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
  const title = getTitleFromPath(location.pathname)

  const { user } = { user: { name: 'Budi', role: 'business_owner', hasBusiness: false } }
  
  const isBusinessOwnerWithoutBusiness = user && user.role === 'business_owner' && !user.hasBusiness
  const isOnCreateBusinessPage = location.pathname === '/create-business'

  const showWelcomePage = isBusinessOwnerWithoutBusiness && !isOnCreateBusinessPage
  const menuDisabled = isBusinessOwnerWithoutBusiness

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