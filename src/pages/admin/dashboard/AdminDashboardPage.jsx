// src/pages/admin/dashboard/AdminDashboardPage.jsx

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Users, Building, ShieldAlert, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchAllUsers } from '../../../store/slices/userManagementSlice';
import { fetchAllBusinesses } from '../../../store/slices/businessManagementSlice';

const StatCard = ({ title, value, icon, color, linkTo }) => {
    const IconComponent = icon;
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
    );
};

// #1
const BusinessTypeChart = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];
    if (!data || data.length === 0) {
        return <div className="text-center text-gray-400">No business data for chart.</div>;
    }
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

//CHART #2
const NewUserChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center text-gray-400">No user data for chart.</div>;
    }
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="signups" fill="#8884d8" name="New Sign-ups" />
            </BarChart>
        </ResponsiveContainer>
    );
};

const QuickActionList = ({ title, items, linkToAll }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {items.length > 0 && (
                <Link to={linkToAll} className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                    View All <ArrowRight size={14}/>
                </Link>
            )}
        </div>
        {items.length > 0 ? (
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
        ) : (
            <p className="text-center text-gray-500 py-4">No pending businesses to review. Great job!</p>
        )}
    </div>
);

const AdminDashboardPage = () => {
    const dispatch = useDispatch();

    const { items: allUsers, isLoading: usersLoading } = useSelector((state) => state.userManagement);
    const { items: allBusinesses, isLoading: businessesLoading } = useSelector((state) => state.businessManagement);

    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchAllBusinesses());
    }, [dispatch]);

    const stats = useMemo(() => {
        const pendingBusinesses = allBusinesses.filter(b => b.statusApproved === 'Pending');
        return {
            totalUsers: allUsers.length,
            totalBusinesses: allBusinesses.length,
            pendingVerification: pendingBusinesses.length,
            pendingBusinessesList: pendingBusinesses.slice(0, 5).map(b => ({
                id: b.businessId,
                name: b.businessName,
                subtext: `Registered on ${new Date(b.createdAt || Date.now()).toLocaleDateString()}`,
                link: `/admin/businesses/${b.businessId}`,
            }))
        };
    }, [allUsers, allBusinesses]);

    const chartData = useMemo(() => {
        const businessTypeCounts = allBusinesses.reduce((acc, biz) => {
            const type = biz.businessType || 'Unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        const businessTypeDistribution = Object.keys(businessTypeCounts).map(type => ({
            name: type.replace(/_/g, ' '),
            value: businessTypeCounts[type],
        }));

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentUsers = allUsers.filter(user => new Date(user.createdAt) > sevenDaysAgo);
        const userSignupsByDay = recentUsers.reduce((acc, user) => {
            const date = new Date(user.createdAt).toLocaleDateString('en-CA');
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        const newUserSignups = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = d.toLocaleDateString('en-CA');
            return {
                date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                signups: userSignupsByDay[dateKey] || 0,
            };
        }).reverse();

        return { businessTypeDistribution, newUserSignups };
    }, [allUsers, allBusinesses]);
    
    if (usersLoading || businessesLoading) {
        return <div className="text-center p-8">Loading dashboard data...</div>
    }

    return (
      <div className="space-y-8 p-4 md:p-6">
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
            <div className="bg-white p-6 rounded-lg shadow-md h-80 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-4">New User Sign-ups (Last 7 Days)</h3>
                <NewUserChart data={chartData.newUserSignups} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md h-80 flex flex-col">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Business Type Distribution</h3>
                <BusinessTypeChart data={chartData.businessTypeDistribution} />
            </div>
        </div>

        <div>
            <QuickActionList 
                title="Businesses Awaiting Verification"
                items={stats.pendingBusinessesList}
                linkToAll="/admin/businesses"
            />
        </div>
      </div>
    );
};
  
export default AdminDashboardPage