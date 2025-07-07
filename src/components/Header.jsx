import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, ChevronDown, Menu as MenuIcon } from 'lucide-react';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { clearBusinessData } from '../store/slices/businessSlice'
import ConfirmationModal from './ConfirmationModal';

const Header = ({ title, setSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false)
  const dropdownRef = useRef(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.auth.user);

  const currentUser = user || {
    name: 'Shop Owner',
    email: 'owner@pawtner.com',
    imageUrl: '',
  };

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleConfirmLogout = () => {
    dispatch(logout())
    dispatch(clearBusinessData())
    setLogoutModalOpen(false)
    navigate('/signin')
  }

  const handleLogoutClick = () => {
    setIsDropdownOpen(false)
    setLogoutModalOpen(true)
  }

  return (
    <>
      <header className="bg-white px-4 sm:px-6 py-4 border-b border-[#E9ECEF] shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">

          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden mr-4 text-[#545F71]"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="text-xl font-bold text-[#495057]">{title}</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* <button className="p-2 text-[#ADB5BD] hover:text-[#545F71] transition-colors rounded-full hover:bg-[#E9ECEF]">
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" />
            </button> */}

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-left p-1 rounded-md hover:bg-[#E9ECEF] transition-colors w-full"
              >
                <div className="w-8 h-8 bg-[#C3D3E0] rounded-full flex items-center justify-center overflow-hidden">
                  {currentUser.imageUrl ? (
                    <img src={currentUser.imageUrl} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-[#545F71]" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-[#495057]">{currentUser.name}</p>
                  <p className="text-xs text-[#ADB5BD]">{currentUser.email}</p>
                </div>
                <ChevronDown
                  className={clsx(
                    'h-4 w-4 text-[#ADB5BD] hidden sm:block transition-transform duration-200',
                    isDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-1">
                  <Link
                    to="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <ConfirmationModal
          isOpen={isLogoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleConfirmLogout}
          title="Confirm Sign Out"
          message="Are you sure you want to sign out from your account?"
      />
    </>
  )
}

export default Header