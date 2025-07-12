import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { startOfWeek, endOfWeek, isWithinInterval, isToday, parseISO } from 'date-fns';
import { formatCurrencyIDR } from '../../../utils/formatter';
import * as bookingApi from '../../../api/bookingApi';
import { BarChart2 } from 'lucide-react';
import { toast } from 'react-toastify';

const BookingStats = () => {
    const [stats, setStats] = useState({ today: 0, awaiting: 0, weeklyRevenue: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const businessId = useSelector((state) => state.business.details?.businessId);

    useEffect(() => {
        if (!businessId) {
            setIsLoading(false);
            return;
        }

        const fetchAndCalculateStats = async () => {
            setIsLoading(true);

            try {
                const params = {
                    page: 0,
                    size: 200,
                    sortBy: 'startTime',
                    direction: 'desc'
                };
                const response = await bookingApi.getBusinessBookings(businessId, params)
                const recentBookings = response.data.content

                if (!recentBookings) {
                    setIsLoading(false);
                    return;
                }

                const today = new Date();
                const weekStart = startOfWeek(today, { weekStartsOn: 1 });
                const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

                let todayCount = 0;
                let awaitingCount = 0;
                let revenueThisWeek = 0;

                recentBookings.forEach(b => {
                    const bookingDate = parseISO(b.startTime)

                    if (isToday(bookingDate)) {
                        todayCount++;
                    }

                    if (b.status === 'REQUESTED' || b.status === 'PENDING_APPROVAL') {
                        awaitingCount++;
                    }

                    const isRevenueGenerating = b.status == 'COMPLETED' /**|| b.status === 'CONFIRMED'*/
                    if (isRevenueGenerating && isWithinInterval(bookingDate, { start: weekStart, end: weekEnd })) {
                        revenueThisWeek += b.totalPrice || 0;
                    }
                });

                setStats({
                    today: todayCount,
                    awaiting: awaitingCount,
                    weeklyRevenue: revenueThisWeek,
                });

            } catch (error) {
                toast.error("Fail to load stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAndCalculateStats();

    }, [businessId]);

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6 flex items-center justify-center text-gray-500">
                <BarChart2 size={20} className="animate-pulse mr-2" />
                <span>Loading stats...</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">
            <h3 className="text-lg font-semibold text-[#495057] mb-4">
                Quick Stats
            </h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-[#5D6D7E]">Today's booking</span>
                    <span className="font-bold text-[#495057]">{stats.today}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[#5D6D7E]">Awaiting Approval</span>
                    <span className="font-bold text-yellow-600">{stats.awaiting}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[#5D6D7E]">This week's revenue</span>
                    <span className="font-bold text-green-600">{formatCurrencyIDR(stats.weeklyRevenue)}</span>
                </div>
            </div>
        </div>
    );
};

export default BookingStats