import StatCard from '../../../components/StatCard';
import { PlusCircle } from 'lucide-react';

const DashboardPage = () => {

    const businessName = "Pawtner Pet Shop"
    const recentOrders = [
        { id: '#ORD123', item: 'Royal Canin Mini Adult - 8kg', status: 'Pending' },
        { id: '#ORD122', item: 'Cat Tree Condo', status: 'Shipped' },
        { id: '#ORD121', item: 'Flea & Tick Shampoo', status: 'Delivered' },
    ];
    const upcomingBookings = [
        { id: '#BK456', service: 'Full Grooming Session', time: 'Today, 2:00 PM', status: 'Confirmed' },
        { id: '#BK455', service: 'Vet Consultation', time: 'Tomorrow, 10:00 AM', status: 'Confirmed' },
        { id: '#BK454', service: 'Pet Daycare', time: '25 Dec 2023, 9:00 AM', status: 'Confirmed' },
    ]

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return "bg-yellow-100 text-yellow-800"
            case 'shipped': return "bg-blue-100 text-blue-800"
            case 'delivered': return "bg-green-100 text-green-800"
            case 'confirmed': return "bg-[#C3D3E0] text-[#495057]"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#495057]">Welcome back, {businessName}!</h1>
                    <p className="text-[#ADB5BD]">Here's a summary of your business activity.</p>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#545F71] rounded-md hover:bg-[#495057] transition-colors">
                        <PlusCircle size={16} /> New Product
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#545F71] bg-[#E9ECEF] rounded-md hover:bg-[#C3D3E0] transition-colors">
                        <PlusCircle size={16} /> New Service
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Monthly Revenue" value="$4,250" iconName="revenue" />
                <StatCard title="Today's Revenue" value="$189" iconName="revenue" />
                <StatCard title="Pending Orders" value={recentOrders.filter(o => o.status === 'Pending').length} iconName="orders" />
                <StatCard title="Upcoming Bookings" value={upcomingBookings.length} iconName="bookings" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                    <h3 className="text-lg font-semibold text-[#495057] mb-4">Recent Product Orders</h3>
                    <div className="space-y-4">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between py-2 border-b border-[#E9ECEF] last:border-b-0">
                                <div>
                                    <p className="font-medium text-[#545F71]">{order.id}</p>
                                    <p className="text-sm text-[#ADB5BD]">{order.item}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                    <h3 className="text-lg font-semibold text-[#495057] mb-4">Upcoming Service Bookings</h3>
                    <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between py-2 border-b border-[#E9ECEF] last:border-b-0">
                                <div>
                                    <p className="font-medium text-[#545F71]">{booking.service}</p>
                                    <p className="text-sm text-[#ADB5BD]">{booking.time}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage