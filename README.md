# 考研数学复习管理工具

一个面向个人长期使用的单页复习管理工具，用来管理复习任务、记录学习时长、设置学习目标并备份本地数据。

项目没有后端，数据保存在浏览器 `localStorage` 中。刷新页面不会丢失数据，但换设备或清理浏览器数据前建议先导出 JSON 备份。

## 当前功能

| 模块 | 说明 |
|------|------|
| 任务管理 | 添加、编辑、删除任务，切换完成状态，按状态和科目筛选 |
| 学习记录 | 添加、编辑、删除学习记录，最近 10 条记录列表 |
| 目标设置 | 每日目标、每周目标、可选考试日期 |
| 数据可视化 | 顶部统计卡片、科目加权进度、最近 7 天学习时长柱状图 |
| 本地持久化 | 任务、学习记录和目标自动保存到 `localStorage` |
| JSON 备份 | 导出完整备份，导入前校验结构并二次确认覆盖 |
| CSV 导出 | 分别导出 `tasks.csv` 和 `study-sessions.csv` |
| 错误提示 | 表单校验、导入失败、本地存储异常会在界面提示 |
| 测试 | 使用 Vitest 覆盖核心纯函数和导入校验 |

## 数据模型

### Task

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识 |
| `name` | string | 任务名称 |
| `subject` | `math-analysis` / `linear-algebra` / `english` | 科目 |
| `difficulty` | `easy` / `medium` / `hard` | 难度 |
| `estimatedMinutes` | number | 预计耗时，必须是 1-720 的正整数 |
| `completed` | boolean | 是否完成 |
| `priority` | `low` / `medium` / `high` | 优先级 |
| `dueDate` | string? | 截止日期，格式为本地 `YYYY-MM-DD` |
| `createdAt` | string | 创建时间 ISO 字符串 |
| `completedAt` | string \| null | 完成时间；未完成时为 null |

### StudySession

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识 |
| `subject` | `math-analysis` / `linear-algebra` / `english` | 科目 |
| `minutes` | number | 学习时长，必须是 1-720 的正整数 |
| `date` | string | 本地日期 `YYYY-MM-DD` |
| `note` | string? | 可选备注 |

### StudyGoal

| 字段 | 类型 | 说明 |
|------|------|------|
| `dailyMinutesTarget` | number | 每日目标学习分钟数，默认 180 |
| `weeklyMinutesTarget` | number | 每周目标学习分钟数，默认 1260 |
| `examDate` | string? | 可选考试日期，本地 `YYYY-MM-DD` |

### PersistedState

```ts
interface PersistedState {
  tasks: Task[]
  studySessions: StudySession[]
  goal: StudyGoal
  version: number
}
```

## 统计规则

| 指标 | 规则 |
|------|------|
| 今日学习 | 今天所有 `StudySession.minutes` 之和 |
| 本周学习 | 最近 7 天所有 `StudySession.minutes` 之和 |
| 连续学习天数 | 如果今天有学习记录，从今天往前数；如果今天没有但昨天有记录，从昨天往前数，避免早上尚未学习时断 streak |
| 目标完成率 | 今日/本周学习时长 ÷ 对应目标分钟数，允许超过 100% |
| 科目进度 | 优先按已完成任务预计耗时 / 该科任务预计耗时计算；无预计耗时时退化为任务数量比 |
| 7 天柱状图 | 最近 7 个本地日期按 `StudySession.date` 聚合 |

任务完成状态和学习时长完全解耦：勾选完成任务只影响任务统计和科目进度，不会增加学习分钟数。

## 本地存储与备份

- Storage key：`mathematics-review-v2`
- 当前数据结构版本：`3`
- 持久化内容：`tasks`、`studySessions`、`goal`、`version`
- 读取失败或结构异常时会回退到初始数据，并在界面提示
- JSON 导出包含：`tasks`、`studySessions`、`goal`、`version`、`exportedAt`
- JSON 导入会先校验结构，再通过 `window.confirm` 提示会覆盖当前本地数据
- CSV 导出会处理中文、逗号、换行和引号转义，并带 UTF-8 BOM，便于表格软件打开

## 快速开始

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run build
npm run lint
npm test
npm run preview
```

## 技术栈

| 技术 | 作用 |
|------|------|
| React 19 | 构建用户界面 |
| TypeScript | 类型安全 |
| Vite | 开发服务器与生产构建 |
| Tailwind CSS v4 | 深色玻璃拟态界面 |
| Recharts | 最近 7 天学习时长图表 |
| Vitest | 核心逻辑测试 |

## 项目结构

```text
src/
  App.tsx
  types.ts
  data/
    mockData.ts
  hooks/
    useStudyProgress.ts
  utils/
    date.ts
    defaults.ts
    export.ts
    import.ts
    stats.ts
    storage.ts
    validation.ts
  components/
    DataManagement.tsx
    GoalSettings.tsx
    StudySessionForm.tsx
    StudySessionList.tsx
    TaskForm.tsx
    TaskList.tsx
    WeeklyChart.tsx
    ui/
```

## 后续扩展方向

- 日历热力图
- 周计划
- 番茄钟
- 多设备同步
- PWA 离线应用
- 后端账户系统
