import { OverviewCards } from './components/OverviewCards'
import { SubjectProgress } from './components/SubjectProgress'
import { TaskList } from './components/TaskList'
import { WeeklyChart } from './components/WeeklyChart'
import { useStudyProgress } from './hooks/useStudyProgress'
import { getEncouragement } from './utils/stats'

function App() {
  const { tasks, dailyStudy, stats, subjectProgress, toggleTask } = useStudyProgress()
  const encouragement = getEncouragement(stats.completedTasks, stats.totalTasks)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center sm:text-left">
          <p className="mb-2 text-sm font-medium tracking-widest text-sky-400 uppercase">
            2026 考研冲刺
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            考研数学复习进度
          </h1>
          <p className="mt-3 text-base text-slate-400 transition-all duration-500">
            {encouragement}
          </p>
        </header>

        <section className="mb-8">
          <OverviewCards stats={stats} />
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">科目进度</h2>
          <SubjectProgress subjects={subjectProgress} />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WeeklyChart dailyStudy={dailyStudy} />
          <TaskList tasks={tasks} onToggle={toggleTask} />
        </section>

        <footer className="mt-10 text-center text-sm text-slate-500">
          坚持每一天，离梦想更近一步 ✨
        </footer>
      </div>
    </div>
  )
}

export default App
