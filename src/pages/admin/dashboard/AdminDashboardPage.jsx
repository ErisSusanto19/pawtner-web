import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Building, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, icon, color, linkTo }) => {
    const IconComponent = icon
    return (
        <Link to={linkTo} className={`block p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                </div>
            </div>
        </Link>
    )
}

const ChartPlaceholder = ({ title }) => (
    <div className="bg-white p-6 rounded-lg shadow-md h-80 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
        <div className="flex-grow bg-gray-100 rounded-md flex items-center justify-center">
            <p className="text-gray-400">Chart</p>
        </div>
    </div>
)

const QuickActionList = ({ title, items, linkToAll }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <Link to={linkToAll} className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                View All <ArrowRight size={14}/>
            </Link>
        </div>
        <ul className="divide-y divide-gray-200">
            {items.map(item => (
                <li key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.subtext}</p>
                    </div>
                    <Link to={item.link} className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md">
                        Review
                    </Link>
                </li>
            ))}
        </ul>
    </div>
)


const AdminDashboardPage = () => {
    const stats = {
        totalUsers: 142,
        totalBusinesses: 35,
        pendingVerification: 4,
    };

    const pendingBusinesses = [
        { id: 2, name: 'Grooming Kingdom', subtext: 'Joined 2 days ago', link: '/admin/businesses/2'},
        { id: 5, name: 'Happy Paws Clinic', subtext: 'Joined 5 days ago', link: '/admin/businesses/5'},
        { id: 8, name: 'The Pet Hotel', subtext: 'Joined 1 week ago', link: '/admin/businesses/8'},
        { id: 9, name: 'Catopia Cafe', subtext: 'Joined 1 week ago', link: '/admin/businesses/9'},
    ];

    return (
      <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-gray-600">Overview of the Pawtner platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500" linkTo="/admin/users"/>
            <StatCard title="Total Businesses" value={stats.totalBusinesses} icon={Building} color="bg-green-500" linkTo="/admin/businesses"/>
            <StatCard title="Pending Verification" value={stats.pendingVerification} icon={ShieldAlert} color="bg-yellow-500" linkTo="/admin/businesses"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="New User Sign-ups (Last 30 Days)" />
            <ChartPlaceholder title="Business Type Distribution" />
        </div>

        <div>
            <QuickActionList 
                title="Businesses Awaiting Verification"
                items={pendingBusinesses}
                linkToAll="/admin/businesses"
            />
        </div>

      </div>
    )
}
  
export default AdminDashboardPage