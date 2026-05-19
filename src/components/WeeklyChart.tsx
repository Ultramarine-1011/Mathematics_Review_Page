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
    date: d.date,
  }))

  const hasData = data.some((d) => d.minutes > 0)

  return (
    <Card className="h-full text-left">
      <h2 className="mb-1 text-lg font-semibold text-white">近 7 天学习时长</h2>
      <p className="mb-4 text-sm text-slate-400">数据来自学习记录，与任务完成状态无关</p>
      {!hasData ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5">
          <p className="text-sm text-slate-500">暂无学习记录，先记录一段学习时长吧</p>
        </div>
      ) : (
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
                labelFormatter={(_, payload) => {
                  const item = payload?.[0]?.payload as { date?: string; name?: string } | undefined
                  return item?.date ? `${item.date} ${item.name ?? ''}` : ''
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
      )}
    </Card>
  )
}
