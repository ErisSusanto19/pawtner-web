import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const getTitleFromPath = (path) => {
  if (path === '/') return 'Dashboard'
  const title = path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)
  return title
}

const PetshopLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = getTitleFromPath(location.pathname)

  return (

    <div className="flex h-screen bg-gray-100">

      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 w-0">
        <Header title={title} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}

export default PetshopLayout