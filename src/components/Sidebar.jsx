import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, Package, ShoppingCart, Wrench, Calendar, Settings, LogOut } from 'lucide-react';
import logoPawtner from '../assets/pawtner2.png'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: "/" },
  { name: 'Products', icon: Package, path: "/products" },
  { name: 'Orders', icon: ShoppingCart, path: "/orders" },
  { name: 'Services', icon: Wrench, path: "/services" },
  { name: 'Bookings', icon: Calendar, path: "/bookings" }
]

const settingsMenuItem = { name: 'Settings', icon: Settings, path: "/settings" };

const Sidebar = () => {
  
  return (
    <aside className="w-64 bg-white border-r border-[#E9ECEF] flex flex-col h-screen shadow-md">
      
      <div className="flex items-center p-4 space-x-3 border-b shadow-sm border-[#E9ECEF]">
        <img src={logoPawtner} alt="Pawtner Logo" className="h-10 w-auto" />
        <div>
          <h1 className="text-xl font-bold text-[#545F71]">Pawtner</h1>
          <p className="text-xs text-[#ADB5BD]">Business Panel</p>
        </div>
      </div>

      <nav className="flex-grow pt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end
            className={({ isActive }) =>
              clsx(
                'flex items-center px-6 py-3 text-sm transition-colors',
                isActive
                  ? 'bg-[#E9ECEF] border-r-4 border-[#545F71] text-[#545F71] font-bold'
                  : 'text-[#495057] hover:bg-[#E9ECEF] hover:text-[#545F71]'
              )
            }
          >
            <item.icon className="h-5 w-5 mr-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pb-4">
        <NavLink
          to={settingsMenuItem.path}
          className={({ isActive }) =>
            clsx(
              'flex items-center px-6 py-3 text-sm transition-colors',
              isActive
                ? 'bg-[#E9ECEF] border-r-4 border-[#545F71] text-[#545F71] font-bold'
                : 'text-[#495057] hover:bg-[#E9ECEF] hover:text-[#545F71]'
            )
          }
        >
          <settingsMenuItem.icon className="h-5 w-5 mr-4" />
          <span>{settingsMenuItem.name}</span>
        </NavLink>
        
        <button
          onClick={() => { console.log('Sign out clicked')}}
          className="flex items-center w-full px-6 py-3 text-sm text-[#495057] hover:bg-[#E9ECEF] hover:text-rose-600 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar