import { useRef, type ChangeEvent } from 'react'
import type { PersistedState, StudySession, Task } from '../types'
import {
  downloadJsonBackup,
  downloadStudySessionsCsv,
  downloadTasksCsv,
} from '../utils/export'
import { parseBackupJson } from '../utils/import'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface DataManagementProps {
  state: PersistedState
  tasks: Task[]
  studySessions: StudySession[]
  onImport: (state: PersistedState) => void
  onSuccess: (message: string) => void
  onError: (message: string) => void
}

export function DataManagement({
  state,
  tasks,
  studySessions,
  onImport,
  onSuccess,
  onError,
}: DataManagementProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const text = await file.text()
      const result = parseBackupJson(text)
      if (!result.ok) {
        onError(result.error)
        return
      }

      const confirmed = window.confirm('导入备份会覆盖当前本地数据，确定继续吗？')
      if (!confirmed) return

      onImport(result.state)
      onSuccess('JSON 备份导入成功')
    } catch {
      onError('读取备份文件失败，请重新选择 JSON 文件。')
    }
  }

  const handleExportJson = () => {
    downloadJsonBackup(state)
    onSuccess('完整 JSON 备份已导出')
  }

  const handleExportTasksCsv = () => {
    downloadTasksCsv(tasks)
    onSuccess('tasks.csv 已导出')
  }

  const handleExportStudySessionsCsv = () => {
    downloadStudySessionsCsv(studySessions)
    onSuccess('study-sessions.csv 已导出')
  }

  return (
    <Card className="text-left">
      <h2 className="mb-1 text-lg font-semibold text-white">数据备份</h2>
      <p className="mb-4 text-sm text-slate-400">导出备份或从 JSON 备份恢复本地数据</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button type="button" onClick={handleExportJson} aria-label="导出完整 JSON 备份">
          导出 JSON 备份
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          aria-label="导入 JSON 备份"
        >
          导入 JSON 备份
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleExportTasksCsv}
          aria-label="导出任务 CSV"
        >
          导出 tasks.csv
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleExportStudySessionsCsv}
          aria-label="导出学习记录 CSV"
        >
          导出 study-sessions.csv
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImportFile}
        className="hidden"
        aria-label="选择 JSON 备份文件"
      />
    </Card>
  )
}

