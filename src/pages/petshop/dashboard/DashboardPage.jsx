import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isToday, isThisMonth, isAfter, startOfToday, parseISO, format, subDays } from 'date-fns';
import RevenueChart from '../../../components/RevenueChart';

import StatCard from '../../../components/StatCard';
import WelcomePage from './WelcomePage';
import { fetchBusinessBookings } from '../../../store/slices/bookingSlice';
import { fetchBusinessOrders } from '../../../store/slices/orderSlice';
import { formatCurrencyIDR } from '../../../utils/formatter';

const DashboardPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const business = useSelector((state) => state.business.details);
    const { items: bookings, status: bookingStatus } = useSelector((state) => state.bookings);
    const { items: orders, status: orderStatus } = useSelector((state) => state.orders);

    useEffect(() => {
        if (user && user.hasBusiness) {
            dispatch(fetchBusinessBookings({ page: 0, size: 50 }));
            dispatch(fetchBusinessOrders({ page: 0, size: 50 }));
        }
    }, [dispatch, user?.hasBusiness]);

    const chartData = useMemo(() => {
        if (bookingStatus !== 'succeeded' || orderStatus !== 'succeeded') return [];
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i));
        const dataMap = new Map();
        last7Days.forEach(day => {
            dataMap.set(format(day, 'yyyy-MM-dd'), { date: format(day, 'MMM d'), revenue: 0 });
        });
        const allCompletedTransactions = [
            ...bookings.filter(b => b.status === 'COMPLETED'),
            ...orders.filter(o => o.status === 'COMPLETED')
        ];
        allCompletedTransactions.forEach(t => {
            const transactionDateStr = format(parseISO(t.createdAt), 'yyyy-MM-dd');
            if (dataMap.has(transactionDateStr)) {
                const dayData = dataMap.get(transactionDateStr);
                dayData.revenue += (t.totalPrice || t.totalAmount);
            }
        });
        return Array.from(dataMap.values()).reverse();
    }, [bookings, orders, bookingStatus, orderStatus]);

    const dashboardStats = useMemo(() => {
        if (bookingStatus !== 'succeeded' || orderStatus !== 'succeeded') {
            return { monthlyRevenue: 0, todaysRevenue: 0, pendingOrders: 0, upcomingBookings: 0 };
        }
        const successfulBookings = bookings.filter(b => b.status === 'COMPLETED');
        const successfulOrders = orders.filter(o => o.status === 'COMPLETED');
        const allCompletedTransactions = [...successfulBookings, ...successfulOrders];
        const monthlyRevenue = allCompletedTransactions.filter(t => isThisMonth(parseISO(t.createdAt))).reduce((sum, t) => sum + (t.totalPrice || t.totalAmount), 0);
        const todaysRevenue = allCompletedTransactions.filter(t => isToday(parseISO(t.createdAt))).reduce((sum, t) => sum + (t.totalPrice || t.totalAmount), 0);
        const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'AWAITING_PAYMENT').length;
        const upcomingBookings = bookings.filter(b => isAfter(parseISO(b.startTime), startOfToday())).length;
        return { monthlyRevenue, todaysRevenue, pendingOrders, upcomingBookings };
    }, [bookings, orders, bookingStatus, orderStatus]);

    const recentOrders = useMemo(() => { if (orderStatus !== 'succeeded') return []; return [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0,5); }, [orders, orderStatus]);
    const upcomingBookings = useMemo(() => { if (bookingStatus !== 'succeeded') return []; return [...bookings].filter(b => isAfter(parseISO(b.startTime), startOfToday())).sort((a,b) => new Date(a.startTime) - new Date(b.startTime)).slice(0,5); }, [bookings, bookingStatus]);
    
    if (!user || typeof user.hasBusiness === 'undefined') {
        return <div className="p-6 text-center">Loading user data...</div>;
    }

    if (user.hasBusiness === false) {
        return <WelcomePage userName={user?.name || 'there'} />;
    }

    if (bookingStatus === 'loading' || orderStatus === 'loading') {
        return <div className="p-6 text-center">Loading dashboard data...</div>;
    }

    const getStatusBadge = (status) => { const s = status?.toLowerCase(); if (['pending', 'pending_approval', 'awaiting_payment'].includes(s)) return "bg-yellow-100 text-yellow-800"; if (s === 'shipped') return "bg-blue-100 text-blue-800"; if (['completed', 'delivered'].includes(s)) return "bg-green-100 text-green-800"; if (s === 'confirmed') return "bg-cyan-100 text-cyan-800"; if (s === 'cancelled') return "bg-red-100 text-red-800"; return "bg-gray-100 text-gray-800"; };
    const businessName = business?.name || "Your Business";

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#495057]">Welcome back, {businessName}!</h1>
                    <p className="text-[#ADB5BD]">Here's a summary of your business activity.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Monthly Revenue" value={formatCurrencyIDR(dashboardStats.monthlyRevenue)} iconName="revenue" />
                <StatCard title="Today's Revenue" value={formatCurrencyIDR(dashboardStats.todaysRevenue)} iconName="revenue" />
                <StatCard title="Pending Orders" value={dashboardStats.pendingOrders} iconName="orders" />
                <StatCard title="Upcoming Bookings" value={dashboardStats.upcomingBookings} iconName="bookings" />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 mb-8">
                <h3 className="text-lg font-semibold text-[#495057] mb-4">Last 7 Days Revenue</h3>
                <RevenueChart data={chartData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                    <h3 className="text-lg font-semibold text-[#495057] mb-4">Recent Product Orders</h3>
                    <div className="space-y-4">
                        {recentOrders.length > 0 ? recentOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                <div><p className="font-medium text-[#545F71]">{order.orderNumber}</p><p className="text-sm text-[#ADB5BD]">by {order.customerName}</p></div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(order.status)}`}>{order.status.replace('_', ' ')}</span>
                            </div>
                        )) : <p className="text-center text-gray-500 py-4">No recent orders.</p>}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
                    <h3 className="text-lg font-semibold text-[#495057] mb-4">Upcoming Service Bookings</h3>
                    <div className="space-y-4">
                        {upcomingBookings.length > 0 ? upcomingBookings.map((booking) => (
                            <div key={booking.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                <div><p className="font-medium text-[#545F71]">{booking.serviceName}</p><p className="text-sm text-[#ADB5BD]">{format(parseISO(booking.startTime), "MMM d, yyyy 'at' HH:mm")}</p></div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(booking.status)}`}>{booking.status.replace('_', ' ')}</span>
                            </div>
                        )) : <p className="text-center text-gray-500 py-4">No upcoming bookings.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;