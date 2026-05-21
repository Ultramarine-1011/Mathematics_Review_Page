import { useMemo, useState } from 'react'
import { DataManagement } from './components/DataManagement'
import { Filters } from './components/Filters'
import { GoalSettings } from './components/GoalSettings'
import { OverviewCards } from './components/OverviewCards'
import { StudySessionForm } from './components/StudySessionForm'
import { StudySessionList } from './components/StudySessionList'
import { SubjectProgress } from './components/SubjectProgress'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { WeeklyChart } from './components/WeeklyChart'
import { Button } from './components/ui/Button'
import { Toast, type ToastMessage } from './components/ui/Toast'
import { useStudyProgress } from './hooks/useStudyProgress'
import type { Subject, TaskFilterStatus } from './types'
import { filterTasks, getEncouragement } from './utils/stats'

function App() {
  const {
    tasks,
    studySessions,
    goal,
    persistedState,
    stats,
    subjectProgress,
    dailyStudy,
    goalProgress,
    examDays,
    storageError,
    toggleTask,
    addStudySession,
    updateStudySession,
    deleteStudySession,
    addTask,
    updateTask,
    deleteTask,
    updateGoal,
    importState,
    resetToInitial,
  } = useStudyProgress()

  const [filterStatus, setFilterStatus] = useState<TaskFilterStatus>('all')
  const [filterSubject, setFilterSubject] = useState<Subject | 'all'>('all')
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const filteredTasks = useMemo(
    () => filterTasks(tasks, filterStatus, filterSubject),
    [tasks, filterStatus, filterSubject],
  )

  const encouragement = getEncouragement(stats, goalProgress, examDays)

  const showToast = (text: string, type: ToastMessage['type'] = 'success') => {
    setToast({ id: Date.now(), type, text })
  }

  const handleReset = () => {
    const confirmed = window.confirm(
      '确定要清空本地数据并恢复初始数据吗？此操作不可撤销。',
    )
    if (confirmed) {
      resetToInitial()
      showToast('已恢复初始数据')
    }
  }

  const handleDeleteTask = (id: string) => {
    const confirmed = window.confirm('确定要删除这个任务吗？此操作不可撤销。')
    if (!confirmed) return
    deleteTask(id)
    showToast('任务已删除')
  }

  const handleDeleteStudySession = (id: string) => {
    const confirmed = window.confirm('确定要删除这条学习记录吗？此操作不可撤销。')
    if (!confirmed) return
    deleteStudySession(id)
    showToast('学习记录已删除')
  }

  const emptyTaskTitle = tasks.length === 0 ? '添加第一个复习任务' : '没有符合条件的任务'
  const emptyTaskDescription =
    tasks.length === 0 ? '创建任务后可以按科目和状态追踪进度' : '试试调整筛选条件'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-8 sm:px-6 lg:px-8">
      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
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
          {storageError && (
            <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {storageError}
            </p>
          )}
        </header>

        <section className="mb-8">
          <OverviewCards stats={stats} />
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-white">科目进度</h2>
          <SubjectProgress subjects={subjectProgress} />
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <StudySessionForm
            onSubmit={(input) => {
              addStudySession(input)
              showToast('学习记录已保存')
            }}
          />
          <TaskForm
            onSubmit={(input) => {
              addTask(input)
              showToast('任务已添加')
            }}
          />
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GoalSettings
            key={`${goal.dailyMinutesTarget}-${goal.weeklyMinutesTarget}-${goal.examDate ?? 'none'}`}
            goal={goal}
            progress={goalProgress}
            examDays={examDays}
            onSave={(nextGoal) => {
              updateGoal(nextGoal)
              showToast('学习目标已保存')
            }}
          />
          <DataManagement
            state={persistedState}
            tasks={tasks}
            studySessions={studySessions}
            onImport={importState}
            onSuccess={(message) => showToast(message)}
            onError={(message) => showToast(message, 'error')}
          />
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WeeklyChart dailyStudy={dailyStudy} />
          <StudySessionList
            studySessions={studySessions}
            onUpdate={updateStudySession}
            onDelete={handleDeleteStudySession}
            onUpdated={() => showToast('学习记录已更新')}
          />
        </section>

        <section>
          <Filters
            status={filterStatus}
            subject={filterSubject}
            onStatusChange={setFilterStatus}
            onSubjectChange={setFilterSubject}
          />
          <TaskList
            tasks={filteredTasks}
            onToggle={toggleTask}
            onUpdate={updateTask}
            onDelete={handleDeleteTask}
            onUpdated={() => showToast('任务已更新')}
            emptyTitle={emptyTaskTitle}
            emptyDescription={emptyTaskDescription}
          />
        </section>

        <footer className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-slate-500">坚持每一天，离梦想更近一步</p>
          <Button variant="danger" onClick={handleReset} aria-label="清空本地数据并恢复初始数据">
            清空本地数据并恢复初始数据
          </Button>
        </footer>
      </div>
    </div>
  )
}

export default App
