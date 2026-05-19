import { useMemo, useState } from 'react'
import { Filters } from './components/Filters'
import { OverviewCards } from './components/OverviewCards'
import { StudySessionForm } from './components/StudySessionForm'
import { SubjectProgress } from './components/SubjectProgress'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { WeeklyChart } from './components/WeeklyChart'
import { Button } from './components/ui/Button'
import { useStudyProgress } from './hooks/useStudyProgress'
import type { Subject, TaskFilterStatus } from './types'
import { filterTasks, getEncouragement } from './utils/stats'

function App() {
  const {
    tasks,
    stats,
    subjectProgress,
    dailyStudy,
    toggleTask,
    addStudySession,
    addTask,
    resetToInitial,
  } = useStudyProgress()

  const [filterStatus, setFilterStatus] = useState<TaskFilterStatus>('all')
  const [filterSubject, setFilterSubject] = useState<Subject | 'all'>('all')

  const filteredTasks = useMemo(
    () => filterTasks(tasks, filterStatus, filterSubject),
    [tasks, filterStatus, filterSubject],
  )

  const encouragement = getEncouragement(stats, stats.todayMinutes)

  const handleReset = () => {
    const confirmed = window.confirm(
      '确定要清空本地数据并恢复初始数据吗？此操作不可撤销。',
    )
    if (confirmed) resetToInitial()
  }

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

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <StudySessionForm onSubmit={addStudySession} />
          <TaskForm onSubmit={addTask} />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WeeklyChart dailyStudy={dailyStudy} />
          <div>
            <Filters
              status={filterStatus}
              subject={filterSubject}
              onStatusChange={setFilterStatus}
              onSubjectChange={setFilterSubject}
            />
            <TaskList tasks={filteredTasks} onToggle={toggleTask} />
          </div>
        </section>

        <footer className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-slate-500">坚持每一天，离梦想更近一步</p>
          <Button variant="danger" onClick={handleReset}>
            清空本地数据并恢复初始数据
          </Button>
        </footer>
      </div>
    </div>
  )
}

export default App
