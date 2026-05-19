import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DailyStudy } from '../types'
import { formatDuration } from '../utils/stats'
import { Card } from './ui/Card'

interface WeeklyChartProps {
  dailyStudy: DailyStudy[]
}

export function WeeklyChart({ dailyStudy }: WeeklyChartProps) {
  const data = dailyStudy.map((d) => ({
    name: d.label,
    minutes: d.minutes,
    hours: +(d.minutes / 60).toFixed(1),
  }))

  return (
    <Card className="h-full text-left">
      <h2 className="mb-1 text-lg font-semibold text-white">近 7 天学习时长</h2>
      <p className="mb-4 text-sm text-slate-400">点击任务完成状态会同步更新今日柱高</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              unit="分"
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.06)' }}
              contentStyle={{
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#f8fafc',
              }}
              formatter={(value) => [
                formatDuration(typeof value === 'number' ? value : 0),
                '学习时长',
              ]}
            />
            <Bar
              dataKey="minutes"
              fill="url(#barGradient)"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
