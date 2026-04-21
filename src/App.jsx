import { AnimatePresence } from 'framer-motion'
import {
  AlarmClock,
  BatteryMedium,
  BellRing,
  Brain,
  FileText,
  Ghost,
  LoaderCircle,
  MessagesSquare,
  Monitor,
  Pause,
  Play,
  Radar,
  RotateCcw,
  Send,
  ShieldAlert,
  Sparkles,
  Timer,
  Wallet,
  X,
} from 'lucide-react'
import { createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'

const MODULES = [
  { id: 'recovery', title: '能量回收计划', subtitle: 'Poop-Time Tracker', icon: Wallet, emoji: '☕' },
  { id: 'void', title: '虚空遁地兽', subtitle: 'Void Walker', icon: Ghost, emoji: '🧘' },
  { id: 'jargon', title: '语义重塑模组', subtitle: 'Jargon Refactor', icon: MessagesSquare, emoji: '🗣️' },
  { id: 'board', title: '全域感知终端', subtitle: 'Cyber-Ox Board', icon: Monitor, emoji: '📊' },
  { id: 'weekly', title: '存量文档加速器', subtitle: 'Weekly Catalyst', icon: FileText, emoji: '📝' },
  { id: 'consoler', title: '精神熵增稳定器', subtitle: 'CPU Consoler', icon: Brain, emoji: '💆' },
  { id: 'levator', title: '律动核心工程', subtitle: 'Project Levator Ani', icon: BellRing, emoji: '🍑' },
]

const VOID_STATUS = [
  { id: 'statusA', label: '带薪排泄中', desc: 'Status_A' },
  { id: 'statusB', label: '无效会议中', desc: 'Status_B' },
  { id: 'statusC', label: '编译等待中', desc: 'Status_C' },
]

const JARGON_EXAMPLES = {
  '这需求我做不了。':
    '在当前资源排期下，该方案的投入产出比（ROI）尚未达到临界点。',
  '你行你上。':
    '希望能基于您对业务的深刻洞察，为技术落地提供更具前瞻性的指导建议。',
}

const CONSOLER_MESSAGES = [
  '老板离他的法拉利又近了一步，但你离下班也近了一点。',
  '检测到灵魂负载过高，建议喝水、伸展、然后轻量摸鱼。',
  '你没有摸鱼，你在做心理缓冲与生产力保养。',
]

const REFACTOR_ENDPOINT = import.meta.env.VITE_REFACTOR_ENDPOINT || '/api/refactor'
const SOFT_PANEL =
  'rounded-3xl border border-emerald-100/70 bg-white/75 backdrop-blur-xl shadow-[0_20px_45px_rgba(114,150,126,0.16)]'

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue
    const cached = window.localStorage.getItem(key)
    if (!cached) return initialValue
    try {
      return JSON.parse(cached)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

function formatCurrency(value) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 2,
  }).format(value)
}

function CozyButton({ className = '', children, ...props }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1.5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-2 text-sm font-medium text-emerald-900 transition hover:bg-emerald-100 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

function ModuleShell({ title, subtitle, icon: Icon, children }) {
  return (
    <motion.section
      key={title}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className={`p-5 sm:p-6 ${SOFT_PANEL}`}
    >
      <header className="mb-5 flex flex-wrap items-center gap-3 border-b border-emerald-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-emerald-700">
          {createElement(Icon, { className: 'h-5 w-5' })}
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800 sm:text-lg">{title}</h2>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </header>
      {children}
    </motion.section>
  )
}

function RecoveryModule({ onElapsedChange }) {
  const [settings, setSettings] = useLocalStorageState('cyber-ox-recovery-settings', {
    salary: 20000,
    workDays: 21.75,
    workHours: 8,
  })
  const [running, setRunning] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [focusMode, setFocusMode] = useState(false)
  const startRef = useRef(0)

  useEffect(() => onElapsedChange(elapsedMs), [elapsedMs, onElapsedChange])

  useEffect(() => {
    if (!running) return
    const tick = () => setElapsedMs(Date.now() - startRef.current)
    tick()
    const timer = window.setInterval(tick, 140)
    return () => window.clearInterval(timer)
  }, [running])

  const ratePerSecond = useMemo(() => {
    const denominator = settings.workDays * settings.workHours * 3600
    return denominator ? settings.salary / denominator : 0
  }, [settings])

  const earned = (elapsedMs / 1000) * ratePerSecond
  const cupCoverage = earned / 16
  const tissueUsage = (elapsedMs / 1000) * 0.0004

  const updateSetting = (field, value) => {
    const parsed = Number(value)
    setSettings((prev) => ({ ...prev, [field]: Number.isNaN(parsed) ? 0 : parsed }))
  }

  const toggleRun = () => {
    if (running) {
      setRunning(false)
      return
    }
    startRef.current = Date.now() - elapsedMs
    setRunning(true)
  }

  const reset = () => {
    setRunning(false)
    setElapsedMs(0)
    startRef.current = Date.now()
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">
        薪资参数完全保留在 localStorage，本地演算，不上传。
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { key: 'salary', label: '月薪（CNY）', step: '1' },
          { key: 'workDays', label: '月工作日', step: '0.01' },
          { key: 'workHours', label: '日工时', step: '0.1' },
        ].map((item) => (
          <label key={item.key} className="text-xs text-slate-500">
            {item.label}
            <input
              className="mt-1.5 w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-300"
              type="number"
              min="0"
              step={item.step}
              value={settings[item.key]}
              onChange={(event) => updateSetting(item.key, event.target.value)}
            />
          </label>
        ))}
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-4">
        <p className="text-xs tracking-[0.18em] text-slate-400">CALM RECOVERY BOARD</p>
        <p className="mt-2 font-mono text-4xl text-slate-800">{formatDuration(elapsedMs)}</p>
        <p className="mt-2 text-2xl font-semibold text-emerald-700">{formatCurrency(earned)}</p>
        <p className="mt-2 text-sm text-slate-500">
          可覆盖 {cupCoverage.toFixed(2)} 杯瑞幸，消耗抽纸约 {tissueUsage.toFixed(3)} g。
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <CozyButton
          onClick={toggleRun}
          className={running ? 'border-rose-200 bg-rose-50 text-rose-700' : ''}
        >
          {running ? <Pause className="mr-2 inline h-4 w-4" /> : <Play className="mr-2 inline h-4 w-4" />}
          {running ? '暂停回收' : '开始回收'}
        </CozyButton>
        <CozyButton onClick={reset} className="border-amber-200 bg-amber-50 text-amber-700">
          <RotateCcw className="mr-2 inline h-4 w-4" />
          重置
        </CozyButton>
        <CozyButton onClick={() => setFocusMode((v) => !v)} className="border-sky-200 bg-sky-50 text-sky-700">
          <Sparkles className="mr-2 inline h-4 w-4" />
          {focusMode ? '退出沉浸' : '进入沉浸'}
        </CozyButton>
      </div>

      <AnimatePresence>
        {focusMode ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-50/90 p-5 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`w-full max-w-2xl p-7 ${SOFT_PANEL}`}
            >
              <p className="text-xs tracking-[0.18em] text-slate-400">RECOVERY FOCUS MODE</p>
              <p className="mt-3 font-mono text-6xl text-slate-800">{formatDuration(elapsedMs)}</p>
              <p className="mt-3 text-3xl font-semibold text-emerald-700">{formatCurrency(earned)}</p>
              <p className="mt-3 text-sm text-slate-500">
                当前收益可覆盖 {cupCoverage.toFixed(2)} 杯咖啡，抽纸消耗 {tissueUsage.toFixed(3)} g。
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <CozyButton onClick={toggleRun}>
                  {running ? (
                    <>
                      <Pause className="mr-2 inline h-4 w-4" />
                      暂停计时
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 inline h-4 w-4" />
                      继续计时
                    </>
                  )}
                </CozyButton>
                <CozyButton onClick={() => setFocusMode(false)} className="border-slate-200 bg-white text-slate-600">
                  关闭沉浸
                </CozyButton>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function VoidWalkerModule({ durations, setDurations }) {
  const [selectedStatus, setSelectedStatus] = useState('statusA')
  const [running, setRunning] = useState(false)
  const [posterUrl, setPosterUrl] = useState('')
  const lastTickRef = useRef(0)

  useEffect(() => {
    if (!running) return
    lastTickRef.current = Date.now()
    const timer = window.setInterval(() => {
      const now = Date.now()
      const delta = now - lastTickRef.current
      lastTickRef.current = now
      setDurations((prev) => ({ ...prev, [selectedStatus]: prev[selectedStatus] + delta }))
    }, 220)
    return () => window.clearInterval(timer)
  }, [running, selectedStatus, setDurations])

  const totalMs = durations.statusA + durations.statusB + durations.statusC

  const generatePoster = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 720
    canvas.height = 980
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#f4fbf6')
    gradient.addColorStop(1, '#d9f3e5')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#2f5c4a'
    ctx.font = '700 48px "Inter", sans-serif'
    ctx.fillText('今日职场隐身度：98%', 48, 120)
    ctx.font = '500 26px "Inter", sans-serif'
    ctx.fillText(`总摸鱼时长：${formatDuration(totalMs)}`, 48, 210)
    ctx.fillText(`Status_A 带薪排泄：${formatDuration(durations.statusA)}`, 48, 280)
    ctx.fillText(`Status_B 会议折磨：${formatDuration(durations.statusB)}`, 48, 340)
    ctx.fillText(`Status_C 构建等待：${formatDuration(durations.statusC)}`, 48, 400)

    ctx.strokeStyle = '#8bcbb1'
    ctx.lineWidth = 2
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60)
    setPosterUrl(canvas.toDataURL('image/png'))
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">
        把“摸鱼状态”做成柔和 tab 切换，一次专注一个状态，不再一屏 START。
      </p>
      <div className="flex flex-wrap gap-2">
        {VOID_STATUS.map((item) => {
          const active = item.id === selectedStatus
          return (
            <CozyButton
              key={item.id}
              className={active ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : ''}
              onClick={() => setSelectedStatus(item.id)}
            >
              {item.label}
            </CozyButton>
          )
        })}
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4">
        <p className="text-xs text-slate-500">
          当前模式：{VOID_STATUS.find((item) => item.id === selectedStatus)?.desc}
        </p>
        <p className="mt-1 font-mono text-3xl text-slate-800">{formatDuration(durations[selectedStatus])}</p>
        <div className="mt-3">
          <CozyButton
            onClick={() => setRunning((v) => !v)}
            className={running ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-sky-200 bg-sky-50 text-sky-700'}
          >
            {running ? <Pause className="mr-2 inline h-4 w-4" /> : <Play className="mr-2 inline h-4 w-4" />}
            {running ? '暂停当前状态' : '开始当前状态'}
          </CozyButton>
        </div>
      </div>
      <div className="grid gap-2">
        {VOID_STATUS.map((item) => {
          const ratio = totalMs ? (durations[item.id] / totalMs) * 100 : 0
          return (
            <div key={item.id} className="rounded-xl border border-emerald-100 bg-white/80 p-3">
              <div className="mb-2 flex justify-between text-sm text-slate-600">
                <span>{item.label}</span>
                <span className="font-mono">{formatDuration(durations[item.id])}</span>
              </div>
              <div className="h-2 rounded-full bg-emerald-50">
                <motion.div
                  animate={{ width: `${ratio}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300"
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-2">
        <CozyButton onClick={generatePoster}>
          <Sparkles className="mr-2 inline h-4 w-4" />
          生成报告
        </CozyButton>
        <CozyButton
          onClick={() => setDurations({ statusA: 0, statusB: 0, statusC: 0 })}
          className="border-amber-200 bg-amber-50 text-amber-700"
        >
          <RotateCcw className="mr-2 inline h-4 w-4" />
          清零计时
        </CozyButton>
      </div>
      {posterUrl ? (
        <div className="rounded-2xl border border-emerald-100 bg-white/85 p-3">
          <img alt="今日职场隐身度海报" src={posterUrl} className="w-full rounded-xl" />
        </div>
      ) : null}
    </div>
  )
}

function JargonRefactorModule() {
  const [mode, setMode] = useLocalStorageState('cyber-ox-jargon-mode', '向上管理')
  const [inputValue, setInputValue] = useLocalStorageState('cyber-ox-jargon-input', '这需求我做不了。')
  const [outputValue, setOutputValue] = useState('')
  const [loading, setLoading] = useState(false)

  const fallbackTransform = useCallback(
    (text) => {
      const trimmed = text.trim()
      if (JARGON_EXAMPLES[trimmed]) return JARGON_EXAMPLES[trimmed]
      if (mode === '向上管理') {
        return `结合当前业务优先级，建议将「${trimmed}」纳入下一阶段策略队列，以保障关键路径稳定推进。`
      }
      if (mode === '平级对齐') {
        return `围绕共同目标，建议我们同步「${trimmed}」上下文，并建立可追踪的协同闭环。`
      }
      return `从团队可持续交付角度，「${trimmed}」可通过分层拆解与节奏控制，提升整体承接效率。`
    },
    [mode],
  )

  const refactor = async () => {
    if (!inputValue.trim()) return
    setLoading(true)
    try {
      const response = await fetch(REFACTOR_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, text: inputValue }),
      })
      if (response.ok) {
        const data = await response.json()
        setOutputValue(data.result ?? fallbackTransform(inputValue))
      } else {
        setOutputValue(fallbackTransform(inputValue))
      }
    } catch {
      setOutputValue(fallbackTransform(inputValue))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">
        已接入可配置接口：<code className="rounded bg-emerald-50 px-1.5 py-0.5">{REFACTOR_ENDPOINT}</code>
      </p>
      <div className="flex flex-wrap gap-2">
        {['向上管理', '平级对齐', '向下兼容'].map((targetMode) => (
          <CozyButton
            key={targetMode}
            onClick={() => setMode(targetMode)}
            className={mode === targetMode ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : ''}
          >
            {targetMode}
          </CozyButton>
        ))}
      </div>
      <label className="block text-xs text-slate-500">
        原始发言
        <textarea
          className="mt-1.5 h-28 w-full resize-none rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-300"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="输入你最真实的一句话..."
        />
      </label>
      <CozyButton onClick={refactor} className="border-sky-200 bg-sky-50 text-sky-700">
        {loading ? (
          <>
            <LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" />
            重塑中...
          </>
        ) : (
          <>
            <Send className="mr-2 inline h-4 w-4" />
            执行语义重塑
          </>
        )}
      </CozyButton>
      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4">
        <p className="text-xs text-slate-500">重塑输出</p>
        <p className="mt-2 leading-7 text-slate-700">
          {outputValue || '在当前资源排期下，该方案的投入产出比（ROI）尚未达到临界点。'}
        </p>
      </div>
    </div>
  )
}

function CyberOxBoardModule() {
  const totalCountdown = 1000 * 60 * 60 * 24 * 180
  const [bugCount, setBugCount] = useState(128)
  const [caffeine, setCaffeine] = useState(66)
  const [countdownMs, setCountdownMs] = useState(totalCountdown)
  const [bossDistance, setBossDistance] = useState(67.4)

  useEffect(() => {
    const ticker = window.setInterval(() => setCountdownMs((v) => Math.max(0, v - 1000)), 1000)
    const bugTicker = window.setInterval(() => setBugCount((v) => v + Math.floor(Math.random() * 3)), 2100)
    const caffeineTicker = window.setInterval(
      () => setCaffeine((v) => Math.max(5, Math.min(100, v + (Math.random() > 0.5 ? 4 : -3)))),
      1600,
    )
    const bossTicker = window.setInterval(
      () => setBossDistance((v) => Math.max(0.8, Math.min(180, v + (Math.random() - 0.45) * 18))),
      2500,
    )
    return () => {
      window.clearInterval(ticker)
      window.clearInterval(bugTicker)
      window.clearInterval(caffeineTicker)
      window.clearInterval(bossTicker)
    }
  }, [])

  const days = Math.floor(countdownMs / (1000 * 60 * 60 * 24))
  const hours = String(Math.floor((countdownMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0')
  const minutes = String(Math.floor((countdownMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')
  const seconds = String(Math.floor((countdownMs % (1000 * 60)) / 1000)).padStart(2, '0')

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">柔和版体征看板：波动有，但看起来不焦虑。</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-white/85 p-4">
          <p className="text-xs text-slate-500">Bug 存量</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">{bugCount}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white/85 p-4">
          <p className="text-xs text-slate-500">咖啡因水平</p>
          <div className="mt-3 h-3 rounded-full bg-emerald-50">
            <motion.div
              animate={{ width: `${caffeine}%` }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300"
            />
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-700">
            <BatteryMedium className="h-4 w-4" />
            {caffeine}%
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white/85 p-4">
          <p className="text-xs text-slate-500">离职倒计时</p>
          <p className="mt-2 font-mono text-xl text-slate-800">{`${days}天 ${hours}:${minutes}:${seconds}`}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white/85 p-4">
          <p className="mb-2 text-xs text-slate-500">老板距离（雷达）</p>
          <div className="relative mx-auto h-24 w-24">
            <Radar className="absolute inset-0 m-auto h-8 w-8 text-emerald-500" />
            {[0, 1, 2].map((ring) => (
              <motion.span
                key={ring}
                className="absolute inset-0 rounded-full border border-emerald-200"
                animate={{ scale: [0.35, 1.08], opacity: [0.45, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: ring * 0.55 }}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-sm text-slate-700">{bossDistance.toFixed(1)} m</p>
        </div>
      </div>
    </div>
  )
}

function WeeklyCatalystModule({ fishMs }) {
  const [selectedKeywords, setSelectedKeywords] = useLocalStorageState('cyber-ox-weekly-keywords', [
    '赋能',
    '闭环',
    '抓手',
  ])
  const [report, setReport] = useState('')
  const keywords = ['赋能', '闭环', '颗粒度', '抓手', '落地']

  const toggleKeyword = (keyword) => {
    setSelectedKeywords((prev) => (prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]))
  }

  const generateReport = () => {
    const fishHours = (fishMs / (1000 * 60 * 60)).toFixed(2)
    const selectedText = selectedKeywords.length ? selectedKeywords.join(' / ') : '结构化推进'
    const generated = `本周累计“战略思考时长”约 ${fishHours} 小时。围绕 ${selectedText} 等关键抓手，已完成跨模块语义对齐与风险预判。由于本周深挖底层架构逻辑，导致表面产出呈现滞后性，实则在为下周爆发式增长做势能储备。`
    setReport(generated)
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">轻松点关键词，再点一下就能出一段“看起来很努力”的文案。</p>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => {
          const checked = selectedKeywords.includes(keyword)
          return (
            <CozyButton
              key={keyword}
              className={checked ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : ''}
              onClick={() => toggleKeyword(keyword)}
            >
              {checked ? '☑' : '☐'} {keyword}
            </CozyButton>
          )
        })}
      </div>
      <CozyButton onClick={generateReport}>
        <Sparkles className="mr-2 inline h-4 w-4" />
        一键生成周报语料
      </CozyButton>
      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4">
        <p className="text-xs text-slate-500">自动文案输出</p>
        <p className="mt-2 leading-7 text-slate-700">
          {report ||
            '由于本周深挖底层架构逻辑，导致表面产出呈现滞后性，实则在为下周爆发式增长做势能储备。'}
        </p>
      </div>
    </div>
  )
}

function CPUConsolerModule() {
  const [toastMessage, setToastMessage] = useState('')
  const [audioMode, setAudioMode] = useState('idle')
  const contextRef = useRef(null)
  const activeNodeRef = useRef(null)

  const triggerConsoler = useCallback(() => {
    const message = CONSOLER_MESSAGES[Math.floor(Math.random() * CONSOLER_MESSAGES.length)]
    setToastMessage(`[功德 +1] ${message}`)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(triggerConsoler, 15 * 60 * 1000)
    return () => window.clearInterval(timer)
  }, [triggerConsoler])

  useEffect(() => {
    if (!toastMessage) return
    const clearTimer = window.setTimeout(() => setToastMessage(''), 4800)
    return () => window.clearTimeout(clearTimer)
  }, [toastMessage])

  const getContext = async () => {
    if (!contextRef.current) {
      const Constructor = window.AudioContext || window.webkitAudioContext
      contextRef.current = new Constructor()
    }
    await contextRef.current.resume()
    return contextRef.current
  }

  const stopAudio = () => {
    if (activeNodeRef.current) {
      activeNodeRef.current.stop?.()
      activeNodeRef.current.disconnect?.()
      activeNodeRef.current = null
    }
    setAudioMode('idle')
  }

  const playChant = async () => {
    stopAudio()
    const context = await getContext()
    const notes = [392, 440, 523, 440, 392, 330, 392, 523]
    let cursor = context.currentTime
    notes.forEach((frequency) => {
      const osc = context.createOscillator()
      const gain = context.createGain()
      osc.type = 'square'
      osc.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, cursor)
      gain.gain.exponentialRampToValueAtTime(0.04, cursor + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, cursor + 0.28)
      osc.connect(gain)
      gain.connect(context.destination)
      osc.start(cursor)
      osc.stop(cursor + 0.3)
      cursor += 0.32
      activeNodeRef.current = osc
    })
    setAudioMode('chant')
    window.setTimeout(() => setAudioMode('idle'), 3200)
  }

  const playWhiteNoise = async () => {
    stopAudio()
    const context = await getContext()
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1
    const source = context.createBufferSource()
    const gain = context.createGain()
    const filter = context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 980
    source.buffer = buffer
    source.loop = true
    gain.gain.value = 0.08
    source.connect(filter)
    filter.connect(gain)
    gain.connect(context.destination)
    source.start()
    activeNodeRef.current = source
    setAudioMode('noise')
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">反向 PUA 补给站，每 15 分钟会弹一次温柔提醒。</p>
      <div className="flex flex-wrap gap-2">
        <CozyButton onClick={triggerConsoler}>
          <Brain className="mr-2 inline h-4 w-4" />
          立即补给
        </CozyButton>
        <CozyButton onClick={playChant} className="border-cyan-200 bg-cyan-50 text-cyan-700">
          <Play className="mr-2 inline h-4 w-4" />
          8-bit 大悲咒
        </CozyButton>
        <CozyButton onClick={playWhiteNoise} className="border-sky-200 bg-sky-50 text-sky-700">
          <Play className="mr-2 inline h-4 w-4" />
          赛博白噪音
        </CozyButton>
        <CozyButton onClick={stopAudio} className="border-rose-200 bg-rose-50 text-rose-700">
          <Pause className="mr-2 inline h-4 w-4" />
          停止音频
        </CozyButton>
      </div>
      <p className="text-xs text-slate-500">
        当前音频：{audioMode === 'idle' ? '静默' : audioMode === 'chant' ? '8-bit 咒文中' : '白噪音循环中'}
      </p>
      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 text-sm text-slate-700"
          >
            {toastMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function LevatorAniModule() {
  const [permission, setPermission] = useState(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
    return Notification.permission
  })
  const [intervalMinutes, setIntervalMinutes] = useLocalStorageState('cyber-ox-levator-interval', 30)
  const [active, setActive] = useState(false)
  const [lastTrigger, setLastTrigger] = useState('--:--:--')
  const titleRef = useRef(typeof document !== 'undefined' ? document.title : '')

  const flashTitle = () => {
    if (typeof document === 'undefined') return
    const baseTitle = titleRef.current || 'Cyber-Ox Lab'
    let ticks = 0
    const timer = window.setInterval(() => {
      document.title = ticks % 2 === 0 ? '🚨 提肛提醒' : baseTitle
      ticks += 1
      if (ticks > 10) {
        window.clearInterval(timer)
        document.title = baseTitle
      }
    }, 360)
  }

  const fireReminder = useCallback(() => {
    const message =
      '[🚨 紧急指令]：检测到臀部受压过大，请立即执行一次 3 秒深层收缩，守护牛马最后的尊严。'
    setLastTrigger(new Date().toLocaleTimeString('zh-CN', { hour12: false }))
    flashTitle()
    if (permission === 'granted' && 'Notification' in window) new Notification(message)
  }, [permission])

  useEffect(() => {
    if (!active) return
    const timer = window.setInterval(fireReminder, Math.max(1, intervalMinutes) * 60 * 1000)
    return () => window.clearInterval(timer)
  }, [active, fireReminder, intervalMinutes])

  const requestPermission = async () => {
    if (!('Notification' in window)) return
    const next = await Notification.requestPermission()
    setPermission(next)
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">通知 + 标题闪烁双保险，提醒你别坐太久。</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="text-xs text-slate-500">
          提醒间隔（分钟）
          <input
            className="mt-1.5 w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-300"
            type="number"
            min="1"
            value={intervalMinutes}
            onChange={(event) => setIntervalMinutes(Number(event.target.value) || 1)}
          />
        </label>
        <div className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs text-slate-600">
          通知权限：{permission}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <CozyButton onClick={requestPermission}>
          <BellRing className="mr-2 inline h-4 w-4" />
          申请通知权限
        </CozyButton>
        <CozyButton
          onClick={() => setActive((v) => !v)}
          className={active ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-sky-200 bg-sky-50 text-sky-700'}
        >
          <AlarmClock className="mr-2 inline h-4 w-4" />
          {active ? '停止自动提醒' : '启动自动提醒'}
        </CozyButton>
        <CozyButton onClick={fireReminder} className="border-amber-200 bg-amber-50 text-amber-700">
          <ShieldAlert className="mr-2 inline h-4 w-4" />
          立即提醒一次
        </CozyButton>
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 text-sm text-slate-700">
        最近触发时间：{lastTrigger}
      </div>
    </div>
  )
}

function DesktopWorkspace() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const [openModules, setOpenModules] = useState([])
  const [recoveryElapsedMs, setRecoveryElapsedMs] = useState(0)
  const [voidDurations, setVoidDurations] = useLocalStorageState('cyber-ox-void-durations', {
    statusA: 0,
    statusB: 0,
    statusC: 0,
  })

  const validModule = moduleId ? MODULES.some((item) => item.id === moduleId) : true
  const mergedOpenModules = useMemo(() => {
    if (moduleId && validModule && !openModules.includes(moduleId)) {
      return [...openModules, moduleId]
    }
    return openModules
  }, [moduleId, openModules, validModule])
  const activeModuleId = moduleId || mergedOpenModules[mergedOpenModules.length - 1] || null

  const fishMs = useMemo(
    () => recoveryElapsedMs + voidDurations.statusA + voidDurations.statusB + voidDurations.statusC,
    [recoveryElapsedMs, voidDurations],
  )

  const openModule = (id) => {
    setOpenModules((prev) => (prev.includes(id) ? prev : [...prev, id]))
    navigate(`/module/${id}`)
  }

  const closeModule = (id) => {
    const next = mergedOpenModules.filter((item) => item !== id)
    setOpenModules(next)
    if (moduleId === id) {
      navigate(next.length ? `/module/${next[next.length - 1]}` : '/')
    }
  }

  const renderModule = (id) => {
    if (id === 'recovery') return <RecoveryModule onElapsedChange={setRecoveryElapsedMs} />
    if (id === 'void') return <VoidWalkerModule durations={voidDurations} setDurations={setVoidDurations} />
    if (id === 'jargon') return <JargonRefactorModule />
    if (id === 'board') return <CyberOxBoardModule />
    if (id === 'weekly') return <WeeklyCatalystModule fishMs={fishMs} />
    if (id === 'consoler') return <CPUConsolerModule />
    if (id === 'levator') return <LevatorAniModule />
    return null
  }

  if (!validModule) return <Navigate to="/" replace />

  return (
    <main className="min-h-screen p-4 text-slate-700 sm:p-6">
      <section className={`p-5 sm:p-6 ${SOFT_PANEL}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800 sm:text-2xl">
              🦾 Cyber-Ox Lab · 轻松版工作台
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              放松一点，再卷一点。页面做柔和，心态别太硬。
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-emerald-600" />
              总摸鱼时长：<span className="font-mono text-slate-800">{formatDuration(fishMs)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={`mt-4 p-3 sm:p-4 ${SOFT_PANEL}`}>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {MODULES.map((item) => {
            const selected = activeModuleId === item.id
            return (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ y: -1.5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openModule(item.id)}
                className={`min-w-[170px] rounded-2xl border p-3 text-left transition ${
                  selected
                    ? 'border-emerald-300 bg-emerald-100/85'
                    : 'border-emerald-100 bg-white/85 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{item.emoji}</span>
                  {createElement(item.icon, {
                    className: selected ? 'h-4 w-4 text-emerald-700' : 'h-4 w-4 text-slate-500',
                  })}
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500">{item.subtitle}</p>
              </motion.button>
            )
          })}
        </div>
      </section>

      {mergedOpenModules.length ? (
        <section className={`mt-4 p-3 sm:p-4 ${SOFT_PANEL}`}>
          <div className="mb-3 flex flex-wrap gap-2">
            {mergedOpenModules.map((id) => {
              const item = MODULES.find((moduleItem) => moduleItem.id === id)
              if (!item) return null
              const active = activeModuleId === id
              return (
                <motion.div key={id} layout className="flex items-center gap-1">
                  <CozyButton
                    className={active ? 'border-emerald-300 bg-emerald-100 text-emerald-800' : 'bg-white'}
                    onClick={() => navigate(`/module/${id}`)}
                  >
                    {item.emoji} {item.title}
                  </CozyButton>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => closeModule(id)}
                    className="rounded-full border border-slate-200 bg-white p-1 text-slate-400 transition hover:bg-slate-50"
                    aria-label={`关闭 ${item.title}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
          <AnimatePresence mode="wait">
            {activeModuleId ? (
              <ModuleShell
                key={activeModuleId}
                title={MODULES.find((item) => item.id === activeModuleId)?.title || ''}
                subtitle={MODULES.find((item) => item.id === activeModuleId)?.subtitle || ''}
                icon={MODULES.find((item) => item.id === activeModuleId)?.icon || Sparkles}
              >
                {renderModule(activeModuleId)}
              </ModuleShell>
            ) : null}
          </AnimatePresence>
        </section>
      ) : (
        <section className={`mt-4 p-8 text-center ${SOFT_PANEL}`}>
          <p className="text-sm text-slate-500">从上方任选一个模块开始，今天先轻松再输出。</p>
        </section>
      )}

      <footer className="mt-4 pb-2 text-center text-xs text-slate-500">
        敏感输入只写 localStorage；黑话生成通过 Cloudflare Worker 代理 DeepSeek。
      </footer>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<DesktopWorkspace />} />
      <Route path="/module/:moduleId" element={<DesktopWorkspace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
