import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Wrench, Calendar, Settings, LogOut, Banknote } from 'lucide-react';
import logoPawtner from '../assets/pawtner2.png'

const getLinkClass = ({ isActive }, isDisabled) => {
  let baseClass = 'flex items-center px-6 py-3 text-sm font-medium transition-colors'
  if (isDisabled) {
      return `${baseClass} text-gray-400 cursor-not-allowed`
  }
  if (isActive) {
      return `${baseClass} bg-gray-200 text-[#495057]`
  }
  return `${baseClass} text-[#495057] hover:bg-gray-100`
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: "/" },
  { name: 'Products', icon: Package, path: "/products" },
  { name: 'Orders', icon: ShoppingCart, path: "/orders" },
  { name: 'Services', icon: Wrench, path: "/services" },
  { name: 'Bookings', icon: Calendar, path: "/bookings" },
  { name: 'Payments', icon: Banknote, path: "/payments" }
]

const settingsMenuItem = { name: 'Settings', icon: Settings, path: "/settings" }

const DisabledAwareNavLink = ({ to, children, isDisabled }) => {
  if (isDisabled) {
    return <div className={getLinkClass({ isActive: false }, true)}>{children}</div>
  }
  return <NavLink to={to} end className={({ isActive }) => getLinkClass({ isActive }, false)}>{children}</NavLink>
}

const Sidebar = ({ menuDisabled }) => {
  return (
    <aside className="w-64 bg-white border-r border-[#E9ECEF] flex flex-col h-screen shadow-md">
      
      <div className="flex items-center p-4 space-x-3 border-b shadow-sm border-[#E9ECEF]">
        <img src={logoPawtner} alt="Pawtner Logo" className="h-10 w-auto" />
        <div>
          <h2 className="text-xl font-bold text-[#545F71]">Pawtner</h2>
          <p className="text-xs text-[#ADB5BD]">Business Panel</p>
        </div>
      </div>

      <nav className="flex-grow pt-6">
        {menuItems.map((item) => (
          <DisabledAwareNavLink
            key={item.name}
            to={item.path}
            isDisabled={menuDisabled}
          >
            <item.icon className="h-5 w-5 mr-4" />
            <span>{item.name}</span>
          </DisabledAwareNavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#E9ECEF]">
        <NavLink
          to={settingsMenuItem.path}
          className={({ isActive }) => getLinkClass({ isActive }, false)}
        >
          <settingsMenuItem.icon className="h-5 w-5 mr-4" />
          <span>{settingsMenuItem.name}</span>
        </NavLink>
        
        <button
          onClick={() => { console.log('Sign out clicked') }}
          className={`${getLinkClass({ isActive: false}, false)} w-full mt-1 hover:text-red-600`}
        >
          <LogOut className="h-5 w-5 mr-4" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar