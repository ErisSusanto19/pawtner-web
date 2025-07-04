import logoPawtner from '../assets/pawtner2.png';

const AdminSidebarHead = () => {
  return (
    <div className="flex items-center p-4 space-x-3 bg-gray-800 border-r border-b border-gray-700 h-16">
      <div className="bg-white p-1 rounded-md">
        <img src={logoPawtner} alt="Pawtner Logo" className="h-8 w-auto" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">Pawtner</h2>
        <p className="text-xs text-gray-400">Admin Panel</p>
      </div>
    </div>
  )
}

export default AdminSidebarHead