import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrencyIDR } from '../utils/formatter'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-md shadow-lg">
        <p className="label text-sm text-gray-600">{`${label}`}</p>
        <p className="intro font-semibold text-blue-600">{formatCurrencyIDR(payload[0].value)}</p>
      </div>
    );
  }
  return null
}

const RevenueChart = ({ data }) => {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis 
                        tick={{ fontSize: 12 }} 
                        tickFormatter={(value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default RevenueChart