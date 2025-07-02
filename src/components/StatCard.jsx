import { HandCoins, Package, ShoppingCart, Calendar } from 'lucide-react';

const iconMap = {
    revenue: HandCoins,
    products: Package,
    orders: ShoppingCart,
    bookings: Calendar
};

const StatCard = ({ title, value, iconName }) => {

  const IconComponent = iconMap[iconName] || HandCoins

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 transition-transform transform hover:-translate-y-1">
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-[#495057]">{title}</p>
          <p className="text-3xl font-bold text-[#545F71] mt-1">{value}</p>
        </div>

        <div className="bg-[#E9ECEF] p-3 rounded-full">
          <IconComponent className="h-7 w-7 text-[#545F71]" />
        </div>
      </div>
    </div>
  )
}

export default StatCard