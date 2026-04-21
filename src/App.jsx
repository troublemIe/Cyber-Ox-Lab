import { AnimatePresence, motion } from 'framer-motion'
import {
  AlarmClock,
  BatteryMedium,
  BellRing,
  Brain,
  Droplets,
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
  Trash2,
  Wallet,
  X,
} from 'lucide-react'
import { createElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'

const MODULES = [
  { id: 'recovery', title: '能量回收计划', subtitle: 'Poop-Time Tracker', icon: Wallet, emoji: '☕' },
  { id: 'void', title: '虚空遁地兽', subtitle: 'Void Walker', icon: Ghost, emoji: '🧘' },
  { id: 'jargon', title: '语义重塑模组', subtitle: 'Jargon Refactor', icon: MessagesSquare, emoji: '🪄' },
  { id: 'board', title: '全域感知终端', subtitle: 'Cyber-Ox Board', icon: Monitor, emoji: '📡' },
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
  '老板离法拉利更近一步，你离下班也更近一步。',
  '检测到灵魂飘逸，建议深呼吸、喝水、轻量摸鱼。',
  '不是偷懒，是在给大脑做热修复。',
]

const MAGIC_PANEL =
  'rounded-[2rem] border border-white/70 bg-white/65 backdrop-blur-2xl shadow-[0_22px_65px_rgba(107,139,125,0.22)]'
const REFACTOR_ENDPOINT = import.meta.env.VITE_REFACTOR_ENDPOINT || '/api/refactor'
const MotionButton = motion.button
const MotionDiv = motion.div
const MotionSection = motion.section
const MotionSpan = motion.span

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

function MagicBubble({ className = '', children, active = false, ...props }) {
  return (
    <MotionButton
      type="button"
      whileHover={{ y: -3, scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center justify-center rounded-full border px-4 py-3 text-sm text-slate-700 transition ${
        active
          ? 'border-violet-300 bg-violet-100/85 shadow-[0_0_25px_rgba(168,85,247,0.25)]'
          : 'border-white/80 bg-white/70 shadow-[0_12px_30px_rgba(127,151,138,0.22)]'
      } ${className}`}
      {...props}
    >
      {children}
    </MotionButton>
  )
}

function MagicDust() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {Array.from({ length: 18 }).map((_, index) => (
        <MotionSpan
          key={index}
          className="absolute rounded-full bg-white/55"
          style={{
            width: `${8 + (index % 5) * 6}px`,
            height: `${8 + (index % 5) * 6}px`,
            left: `${5 + (index * 13) % 90}%`,
            top: `${6 + (index * 17) % 82}%`,
          }}
          animate={{
            y: [0, -20 - (index % 6) * 8, 0],
            opacity: [0.2, 0.55, 0.2],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 4.2 + (index % 7) * 0.7,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.16,
          }}
        />
      ))}
    </div>
  )
}

function OrbField({ activeModuleId, onSelect }) {
  return (
    <div className="relative mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {MODULES.map((moduleItem, index) => {
        const active = activeModuleId === moduleItem.id
        const sizeClass = index % 3 === 0 ? 'h-28 w-28' : index % 3 === 1 ? 'h-24 w-24' : 'h-20 w-20'
        return (
          <MotionButton
            key={moduleItem.id}
            type="button"
            onClick={() => onSelect(moduleItem.id)}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -6, 0] }}
            transition={{
              y: { duration: 3.2 + (index % 5) * 0.4, repeat: Infinity, ease: 'easeInOut' },
              type: 'spring',
              stiffness: 220,
              damping: 18,
            }}
            className={`relative rounded-full border backdrop-blur-xl ${sizeClass} ${
              active
                ? 'border-fuchsia-300/70 bg-fuchsia-100/80 shadow-[0_0_30px_rgba(217,70,239,0.35)]'
                : 'border-white/80 bg-white/65 shadow-[0_18px_36px_rgba(123,152,139,0.22)]'
            }`}
          >
            <div className="flex h-full w-full flex-col items-center justify-center gap-1">
              <span className="text-xl">{moduleItem.emoji}</span>
              <span className="text-[11px] font-semibold text-slate-700">{moduleItem.title}</span>
            </div>
          </MotionButton>
        )
      })}
    </div>
  )
}

function ModuleShell({ title, subtitle, icon: Icon, onClose, onRecycle, children }) {
  return (
    <MotionSection
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (typeof window !== 'undefined') {
          const nearTrash = info.point.x > window.innerWidth - 180 && info.point.y > window.innerHeight - 180
          if (nearTrash) onRecycle()
        }
      }}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.97 }}
      transition={{ duration: 0.24 }}
      className={`relative p-5 sm:p-6 ${MAGIC_PANEL}`}
    >
      <header className="mb-5 flex items-center justify-between border-b border-white/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-violet-600">
            {createElement(Icon, { className: 'h-5 w-5' })}
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800 sm:text-lg">{title}</h2>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <MagicBubble className="h-10 w-10 border-rose-200 bg-rose-50/70 text-rose-700" onClick={onClose}>
          <X className="h-4 w-4" />
        </MagicBubble>
      </header>
      {children}
    </MotionSection>
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
    const timer = window.setInterval(tick, 120)
    return () => window.clearInterval(timer)
  }, [running])

  const ratePerSecond = useMemo(() => {
    const denominator = settings.workDays * settings.workHours * 3600
    return denominator ? settings.salary / denominator : 0
  }, [settings])

  const earned = (elapsedMs / 1000) * ratePerSecond
  const cupCoverage = earned / 16
  const tissueUsage = (elapsedMs / 1000) * 0.0004

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

  const updateSetting = (field, value) => {
    const parsed = Number(value)
    setSettings((prev) => ({ ...prev, [field]: Number.isNaN(parsed) ? 0 : parsed }))
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">拖动参数球、点气泡开关。少点按钮，多点魔法。</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { key: 'salary', label: '月薪', step: '1' },
          { key: 'workDays', label: '月工作日', step: '0.01' },
          { key: 'workHours', label: '日工时', step: '0.1' },
        ].map((field) => (
          <label key={field.key} className="text-xs text-slate-500">
            {field.label}
            <input
              className="mt-1.5 w-full rounded-2xl border border-white/80 bg-white/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-fuchsia-300"
              type="number"
              min="0"
              step={field.step}
              value={settings[field.key]}
              onChange={(event) => updateSetting(field.key, event.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/75 bg-gradient-to-br from-white/85 via-fuchsia-50/60 to-cyan-50/70 p-5">
        <MotionDiv
          className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-200/40 blur-xl"
          animate={{ scale: [1, 1.24, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 3.8, repeat: Infinity }}
        />
        <p className="text-xs tracking-[0.2em] text-slate-400">MONEY ALCHEMY</p>
        <p className="mt-3 font-mono text-5xl text-slate-800">{formatDuration(elapsedMs)}</p>
        <p className="mt-2 text-3xl font-semibold text-violet-700">{formatCurrency(earned)}</p>
        <p className="mt-3 text-sm text-slate-600">
          覆盖 {cupCoverage.toFixed(2)} 杯咖啡 · 抽纸约 {tissueUsage.toFixed(3)}g
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <MagicBubble onClick={toggleRun} active={running} className="h-14 w-14">
          {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </MagicBubble>
        <MagicBubble onClick={() => setFocusMode((v) => !v)} className="h-14 w-14">
          <Sparkles className="h-5 w-5" />
        </MagicBubble>
        <MagicBubble onClick={reset} className="h-14 w-14 border-amber-200 bg-amber-50/80 text-amber-700">
          <RotateCcw className="h-5 w-5" />
        </MagicBubble>
      </div>

      <AnimatePresence>
        {focusMode ? (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.82),rgba(216,235,255,0.9))] p-5 backdrop-blur-md"
          >
            <MotionDiv
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`w-full max-w-2xl p-7 ${MAGIC_PANEL}`}
            >
              <p className="text-xs tracking-[0.24em] text-slate-400">FOCUS SPELL</p>
              <p className="mt-4 font-mono text-6xl text-slate-800">{formatDuration(elapsedMs)}</p>
              <p className="mt-3 text-3xl font-semibold text-violet-700">{formatCurrency(earned)}</p>
              <div className="mt-6 flex gap-3">
                <MagicBubble onClick={toggleRun} active={running} className="h-14 w-14">
                  {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </MagicBubble>
                <MagicBubble onClick={() => setFocusMode(false)} className="h-14 w-14">
                  <X className="h-5 w-5" />
                </MagicBubble>
              </div>
            </MotionDiv>
          </MotionDiv>
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
    gradient.addColorStop(0, '#fdf8ff')
    gradient.addColorStop(1, '#dff2ff')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = '#4c3a74'
    ctx.font = '700 48px "Inter", sans-serif'
    ctx.fillText('今日职场隐身度：98%', 48, 120)
    ctx.font = '500 26px "Inter", sans-serif'
    ctx.fillText(`总摸鱼时长：${formatDuration(totalMs)}`, 48, 210)
    ctx.fillText(`Status_A 带薪排泄：${formatDuration(durations.statusA)}`, 48, 280)
    ctx.fillText(`Status_B 会议折磨：${formatDuration(durations.statusB)}`, 48, 340)
    ctx.fillText(`Status_C 构建等待：${formatDuration(durations.statusC)}`, 48, 400)
    ctx.strokeStyle = '#b2b5ff'
    ctx.lineWidth = 2
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60)
    setPosterUrl(canvas.toDataURL('image/png'))
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">状态做成漂浮气泡，控制只保留主开关。</p>
      <div className="flex flex-wrap gap-3">
        {VOID_STATUS.map((item) => (
          <MagicBubble
            key={item.id}
            active={item.id === selectedStatus}
            className="h-14 min-w-14 px-5"
            onClick={() => setSelectedStatus(item.id)}
          >
            {item.label}
          </MagicBubble>
        ))}
      </div>

      <div className="rounded-[1.8rem] border border-white/75 bg-gradient-to-br from-white/90 to-cyan-50/65 p-4">
        <p className="text-xs text-slate-500">当前魔法态：{VOID_STATUS.find((item) => item.id === selectedStatus)?.desc}</p>
        <p className="mt-2 font-mono text-4xl text-slate-800">{formatDuration(durations[selectedStatus])}</p>
        <div className="mt-4 flex gap-3">
          <MagicBubble onClick={() => setRunning((v) => !v)} active={running} className="h-14 w-14">
            {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </MagicBubble>
          <MagicBubble onClick={generatePoster} className="h-14 w-14">
            <Sparkles className="h-5 w-5" />
          </MagicBubble>
          <MagicBubble
            onClick={() => setDurations({ statusA: 0, statusB: 0, statusC: 0 })}
            className="h-14 w-14 border-rose-200 bg-rose-50/70 text-rose-700"
          >
            <Trash2 className="h-5 w-5" />
          </MagicBubble>
        </div>
      </div>

      <div className="grid gap-2">
        {VOID_STATUS.map((item) => {
          const ratio = totalMs ? (durations[item.id] / totalMs) * 100 : 0
          return (
            <div key={item.id} className="rounded-xl border border-white/80 bg-white/70 p-3">
              <div className="mb-2 flex justify-between text-sm text-slate-600">
                <span>{item.label}</span>
                <span className="font-mono">{formatDuration(durations[item.id])}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <MotionDiv
                  animate={{ width: `${ratio}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-300 to-cyan-300"
                />
              </div>
            </div>
          )
        })}
      </div>

      {posterUrl ? (
        <div className="rounded-2xl border border-white/80 bg-white/75 p-3">
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
      <p className="text-sm text-slate-600">黑话炼金接口：{REFACTOR_ENDPOINT}</p>
      <div className="flex flex-wrap gap-3">
        {['向上管理', '平级对齐', '向下兼容'].map((targetMode) => (
          <MagicBubble
            key={targetMode}
            active={mode === targetMode}
            className="h-14 min-w-14 px-4"
            onClick={() => setMode(targetMode)}
          >
            {targetMode}
          </MagicBubble>
        ))}
      </div>
      <textarea
        className="h-28 w-full resize-none rounded-3xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-300"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="输入你真实想说的话..."
      />
      <MagicBubble onClick={refactor} className="h-14 w-14">
        {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      </MagicBubble>
      <div className="rounded-3xl border border-white/80 bg-white/75 p-4">
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
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/80 bg-white/70 p-4">
          <p className="text-xs text-slate-500">Bug 存量</p>
          <p className="mt-2 text-3xl font-semibold text-slate-800">{bugCount}</p>
        </div>
        <div className="rounded-3xl border border-white/80 bg-white/70 p-4">
          <p className="text-xs text-slate-500">咖啡因</p>
          <div className="mt-2 h-2.5 rounded-full bg-slate-100">
            <MotionDiv animate={{ width: `${caffeine}%` }} className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300" />
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-700">
            <BatteryMedium className="h-4 w-4" />
            {caffeine}%
          </p>
        </div>
        <div className="rounded-3xl border border-white/80 bg-white/70 p-4">
          <p className="text-xs text-slate-500">离职倒计时</p>
          <p className="mt-2 font-mono text-xl text-slate-800">{`${days}天 ${hours}:${minutes}:${seconds}`}</p>
        </div>
        <div className="rounded-3xl border border-white/80 bg-white/70 p-4">
          <p className="text-xs text-slate-500">老板雷达</p>
          <div className="relative mx-auto mt-2 h-24 w-24">
            <Radar className="absolute inset-0 m-auto h-7 w-7 text-violet-500" />
            {[0, 1, 2].map((ring) => (
              <MotionSpan
                key={ring}
                className="absolute inset-0 rounded-full border border-violet-200"
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
    setReport(
      `本周累计“战略思考时长”约 ${fishHours} 小时。围绕 ${selectedText} 等关键抓手，已完成跨模块语义对齐与风险预判。由于本周深挖底层架构逻辑，导致表面产出呈现滞后性，实则在为下周爆发式增长做势能储备。`,
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {keywords.map((keyword) => (
          <MagicBubble
            key={keyword}
            active={selectedKeywords.includes(keyword)}
            className="h-14 min-w-14 px-4"
            onClick={() => toggleKeyword(keyword)}
          >
            {keyword}
          </MagicBubble>
        ))}
      </div>
      <MagicBubble onClick={generateReport} className="h-14 w-14">
        <Sparkles className="h-5 w-5" />
      </MagicBubble>
      <div className="rounded-3xl border border-white/80 bg-white/75 p-4">
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
      <div className="flex flex-wrap gap-3">
        <MagicBubble onClick={triggerConsoler} className="h-14 w-14">
          <Brain className="h-5 w-5" />
        </MagicBubble>
        <MagicBubble onClick={playChant} className="h-14 w-14">
          <Play className="h-5 w-5" />
        </MagicBubble>
        <MagicBubble onClick={playWhiteNoise} className="h-14 w-14">
          <Droplets className="h-5 w-5" />
        </MagicBubble>
        <MagicBubble onClick={stopAudio} className="h-14 w-14 border-rose-200 bg-rose-50/80 text-rose-700">
          <Pause className="h-5 w-5" />
        </MagicBubble>
      </div>
      <p className="text-xs text-slate-500">
        当前音频：{audioMode === 'idle' ? '静默' : audioMode === 'chant' ? '8-bit 咒文中' : '白噪音循环中'}
      </p>
      <AnimatePresence>
        {toastMessage ? (
          <MotionDiv
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-3xl border border-white/80 bg-white/75 px-4 py-3 text-sm text-slate-700"
          >
            {toastMessage}
          </MotionDiv>
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
      <label className="block text-xs text-slate-500">
        提醒间隔（分钟）
        <input
          className="mt-1.5 w-full rounded-3xl border border-white/80 bg-white/80 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-violet-300"
          type="number"
          min="1"
          value={intervalMinutes}
          onChange={(event) => setIntervalMinutes(Number(event.target.value) || 1)}
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <MagicBubble onClick={requestPermission} className="h-14 w-14">
          <BellRing className="h-5 w-5" />
        </MagicBubble>
        <MagicBubble onClick={() => setActive((v) => !v)} active={active} className="h-14 w-14">
          <AlarmClock className="h-5 w-5" />
        </MagicBubble>
        <MagicBubble onClick={fireReminder} className="h-14 w-14 border-amber-200 bg-amber-50/80 text-amber-700">
          <ShieldAlert className="h-5 w-5" />
        </MagicBubble>
      </div>
      <div className="rounded-3xl border border-white/80 bg-white/75 p-4 text-sm text-slate-700">
        权限：{permission} · 最近触发：{lastTrigger}
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

  const activeModuleInfo = MODULES.find((item) => item.id === activeModuleId)

  return (
    <main className="relative min-h-screen overflow-hidden p-4 text-slate-700 sm:p-6">
      <MagicDust />
      <section className={`relative p-6 sm:p-8 ${MAGIC_PANEL}`}>
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-cyan-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
            Cyber-Ox Magic Playground
          </h1>
          <p className="mt-2 text-sm text-slate-500">少按钮 · 多魔法 · 可拖拽回收</p>
          <p className="mt-1 text-xs text-slate-400">
            总隐身时长：<span className="font-mono text-slate-700">{formatDuration(fishMs)}</span>
          </p>
        </div>
        <OrbField activeModuleId={activeModuleId} onSelect={openModule} />
      </section>

      <section className={`relative mt-5 p-4 sm:p-5 ${MAGIC_PANEL}`}>
        <div className="mb-4 flex flex-wrap gap-2">
          {mergedOpenModules.map((id) => {
            const moduleItem = MODULES.find((item) => item.id === id)
            if (!moduleItem) return null
            return (
              <MagicBubble
                key={id}
                active={activeModuleId === id}
                className="h-12 min-w-12 px-4"
                onClick={() => navigate(`/module/${id}`)}
              >
                {moduleItem.emoji}
              </MagicBubble>
            )
          })}
        </div>
        <AnimatePresence mode="wait">
          {activeModuleId && activeModuleInfo ? (
            <ModuleShell
              key={activeModuleId}
              title={activeModuleInfo.title}
              subtitle={activeModuleInfo.subtitle}
              icon={activeModuleInfo.icon}
              onClose={() => closeModule(activeModuleId)}
              onRecycle={() => closeModule(activeModuleId)}
            >
              {renderModule(activeModuleId)}
            </ModuleShell>
          ) : (
            <MotionDiv key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center text-sm text-slate-500">
              点上面的气泡开始施法，模块可拖到右下角回收站关闭。
            </MotionDiv>
          )}
        </AnimatePresence>
      </section>

      <AnimatePresence>
        {activeModuleId ? (
          <MotionDiv initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="fixed bottom-6 right-6 z-30">
            <MagicBubble
              onClick={() => closeModule(activeModuleId)}
              className="h-20 w-20 border-rose-200 bg-rose-50/75 text-rose-700 shadow-[0_0_35px_rgba(244,114,182,0.3)]"
            >
              <div className="flex flex-col items-center gap-1">
                <Trash2 className="h-6 w-6" />
                <span className="text-[11px]">回收</span>
              </div>
            </MagicBubble>
          </MotionDiv>
        ) : null}
      </AnimatePresence>

      <footer className="mt-5 text-center text-xs text-slate-500">
        <Timer className="mr-1 inline h-3.5 w-3.5" />
        输入数据仅存 localStorage；黑话请求走 Cloudflare 接口。
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
