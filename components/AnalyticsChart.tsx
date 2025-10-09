'use client'

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface AnalyticsChartProps {
  data: Array<{
    createdAt: Date
    _count: {
      id: number
    }
  }>
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  // Transform data for the chart
  const chartData = data.map(item => ({
    date: new Date(item.createdAt).toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric'
    }),
    clicks: item._count.id,
    fullDate: new Date(item.createdAt).toLocaleDateString('pt-BR')
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Nenhum dado disponível
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            labelFormatter={(value, payload) => {
              const data = payload?.[0]?.payload
              return data?.fullDate || value
            }}
            formatter={(value: number) => [value, 'Cliques']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="clicks" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
