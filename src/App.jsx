import { AnimatePresence, motion } from 'framer-motion'
import {
  AlarmClock,
  BatteryMedium,
  BellRing,
  Brain,
  Bug,
  Coffee,
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'

const MODULES = [
  {
    id: 'recovery',
    title: '能量回收计划',
    subtitle: 'The Poop-Time Tracker',
    icon: Wallet,
  },
  {
    id: 'void',
    title: '虚空遁地兽',
    subtitle: 'The Void Walker',
    icon: Ghost,
  },
  {
    id: 'jargon',
    title: '语义重塑模组',
    subtitle: 'Jargon Refactor',
    icon: MessagesSquare,
  },
  {
    id: 'board',
    title: '全域感知终端',
    subtitle: 'Cyber-Ox Board',
    icon: Monitor,
  },
  {
    id: 'weekly',
    title: '存量文档加速器',
    subtitle: 'The Weekly Catalyst',
    icon: FileText,
  },
  {
    id: 'consoler',
    title: '精神熵增稳定器',
    subtitle: 'CPU Consoler',
    icon: Brain,
  },
  {
    id: 'levator',
    title: '律动核心工程',
    subtitle: 'Project Levator Ani',
    icon: BellRing,
  },
]

const VOID_STATUS = [
  { id: 'statusA', label: 'Status_A: 带薪排泄中' },
  { id: 'statusB', label: 'Status_B: 无效会议折磨中' },
  { id: 'statusC', label: 'Status_C: 代码编译/环境构建中' },
]

const JARGON_EXAMPLES = {
  '这需求我做不了。':
    '在当前资源排期下，该方案的投入产出比（ROI）尚未达到临界点。',
  '你行你上。':
    '希望能基于您对业务的深刻洞察，为技术落地提供更具前瞻性的指导建议。',
}

const GLOBAL_GLASS =
  'bg-white/5 border border-emerald-300/20 backdrop-blur-xl drop-shadow-[0_0_15px_rgba(0,255,159,0.3)]'

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    const cached = window.localStorage.getItem(key)
    if (!cached) {
      return initialValue
    }
    try {
      return JSON.parse(cached)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
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

function CyberButton({ className = '', children, ...props }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`rounded-lg border border-emerald-300/35 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100 transition hover:bg-emerald-400/20 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

function ModuleWindow({ title, subtitle, icon: Icon, onClose, onFocus, children, index }) {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`absolute w-full max-w-xl ${GLOBAL_GLASS}`}
      style={{
        left: `${24 + index * 24}px`,
        top: `${72 + index * 22}px`,
        zIndex: 20 + index,
      }}
      onMouseDown={onFocus}
    >
      <header className="flex items-center justify-between border-b border-emerald-300/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 text-emerald-200" />
          <div>
            <h2 className="text-sm font-semibold text-emerald-100">{title}</h2>
            <p className="text-xs text-emerald-300/80">{subtitle}</p>
          </div>
        </div>
        <CyberButton
          className="rounded-full p-2 text-rose-200 hover:bg-rose-500/20"
          onClick={onClose}
          aria-label={`关闭 ${title}`}
        >
          <X className="h-4 w-4" />
        </CyberButton>
      </header>
      <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
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
  const startRef = useRef(0)

  useEffect(() => {
    onElapsedChange(elapsedMs)
  }, [elapsedMs, onElapsedChange])

  useEffect(() => {
    if (!running) {
      return
    }
    const tick = () => {
      setElapsedMs(Date.now() - startRef.current)
    }
    tick()
    const timer = window.setInterval(tick, 120)
    return () => window.clearInterval(timer)
  }, [running])

  const ratePerSecond = useMemo(() => {
    const denominator = settings.workDays * settings.workHours * 3600
    if (!denominator) {
      return 0
    }
    return settings.salary / denominator
  }, [settings])

  const earned = elapsedMs / 1000 * ratePerSecond
  const cupCoverage = earned / 16
  const tissueUsage = elapsedMs / 1000 * 0.0004
  const scanColor =
    Math.floor(elapsedMs / 450) % 2 === 0
      ? 'rgba(0,255,159,0.18)'
      : 'rgba(255,64,84,0.18)'
  const tickerLines = [
    `当前收益已覆盖：${cupCoverage.toFixed(2)} 杯瑞幸咖啡`,
    `已消耗公司 ${tissueUsage.toFixed(3)} g 抽纸`,
    `回收效率：${(ratePerSecond * 60).toFixed(2)} 元/分钟`,
  ]

  const updateSetting = (field, next) => {
    const parsed = Number(next)
    setSettings((prev) => ({
      ...prev,
      [field]: Number.isNaN(parsed) ? 0 : parsed,
    }))
  }

  const startRecovery = () => {
    startRef.current = Date.now() - elapsedMs
    setRunning(true)
  }

  const pauseRecovery = () => {
    setRunning(false)
  }

  const resetRecovery = () => {
    setRunning(false)
    setElapsedMs(0)
    startRef.current = Date.now()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-emerald-200/85">
        本地高精度收益演算中，薪资数据仅存储于 localStorage，绝不上传。
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-xs text-emerald-300">
          月薪 (CNY)
          <input
            className="w-full rounded-md border border-emerald-300/30 bg-black/35 px-3 py-2 text-emerald-100 outline-none transition focus:border-emerald-200"
            type="number"
            min="0"
            value={settings.salary}
            onChange={(event) => updateSetting('salary', event.target.value)}
          />
        </label>
        <label className="space-y-1 text-xs text-emerald-300">
          月工作日
          <input
            className="w-full rounded-md border border-emerald-300/30 bg-black/35 px-3 py-2 text-emerald-100 outline-none transition focus:border-emerald-200"
            type="number"
            min="0"
            step="0.01"
            value={settings.workDays}
            onChange={(event) => updateSetting('workDays', event.target.value)}
          />
        </label>
        <label className="space-y-1 text-xs text-emerald-300">
          日工时
          <input
            className="w-full rounded-md border border-emerald-300/30 bg-black/35 px-3 py-2 text-emerald-100 outline-none transition focus:border-emerald-200"
            type="number"
            min="0"
            step="0.1"
            value={settings.workHours}
            onChange={(event) => updateSetting('workHours', event.target.value)}
          />
        </label>
      </div>
      <div className="rounded-lg border border-emerald-300/20 bg-black/60 p-4 font-mono">
        <div className="relative overflow-hidden rounded-md border border-emerald-300/30 bg-emerald-500/5 p-4">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, ${scanColor} 2px, transparent 4px)`,
            }}
          />
          <p className="relative text-xs tracking-[0.3em] text-emerald-300/70">LCD PAYLOAD</p>
          <p className="relative mt-2 text-3xl tracking-widest text-emerald-100">
            {formatDuration(elapsedMs)}
          </p>
          <p className="relative mt-2 text-xl text-emerald-200">{formatCurrency(earned)}</p>
        </div>
        <motion.p
          key={Math.floor(elapsedMs / 2000)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-xs text-emerald-300/85"
        >
          {tickerLines[Math.floor(elapsedMs / 2000) % tickerLines.length]}
        </motion.p>
      </div>
      <div className="flex flex-wrap gap-2">
        <CyberButton onClick={startRecovery}>
          <Play className="mr-2 inline h-4 w-4" />
          START RECOVERY
        </CyberButton>
        <CyberButton className="border-cyan-300/35 bg-cyan-500/10" onClick={pauseRecovery}>
          <Pause className="mr-2 inline h-4 w-4" />
          PAUSE
        </CyberButton>
        <CyberButton className="border-amber-300/35 bg-amber-500/10" onClick={resetRecovery}>
          <RotateCcw className="mr-2 inline h-4 w-4" />
          RESET
        </CyberButton>
      </div>

      <AnimatePresence>
        {running ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`relative w-full max-w-2xl overflow-hidden rounded-xl p-6 ${GLOBAL_GLASS}`}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, ${scanColor} 2px, transparent 4px)`,
                }}
              />
              <p className="relative text-xs tracking-[0.35em] text-emerald-300/75">
                FULLSCREEN RECOVERY MODE
              </p>
              <p className="relative mt-5 text-5xl font-semibold text-emerald-100 sm:text-6xl">
                {formatDuration(elapsedMs)}
              </p>
              <p className="relative mt-3 text-2xl text-emerald-200">{formatCurrency(earned)}</p>
              <p className="relative mt-3 text-sm text-emerald-300/85">
                当前收益已覆盖：{cupCoverage.toFixed(2)} 杯瑞幸咖啡 ｜ 已消耗公司{' '}
                {tissueUsage.toFixed(3)} g 抽纸
              </p>
              <div className="relative mt-6 flex gap-3">
                <CyberButton className="border-cyan-300/35 bg-cyan-500/10" onClick={pauseRecovery}>
                  <Pause className="mr-2 inline h-4 w-4" />
                  EXIT FULLSCREEN
                </CyberButton>
                <CyberButton className="border-amber-300/35 bg-amber-500/10" onClick={resetRecovery}>
                  <RotateCcw className="mr-2 inline h-4 w-4" />
                  RESET TIMER
                </CyberButton>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function VoidWalkerModule({ durations, setDurations }) {
  const [activeStatus, setActiveStatus] = useState(null)
  const [posterUrl, setPosterUrl] = useState('')
  const lastTickRef = useRef(Date.now())

  useEffect(() => {
    if (!activeStatus) {
      return
    }
    lastTickRef.current = Date.now()
    const timer = window.setInterval(() => {
      const now = Date.now()
      const delta = now - lastTickRef.current
      lastTickRef.current = now
      setDurations((prev) => ({
        ...prev,
        [activeStatus]: prev[activeStatus] + delta,
      }))
    }, 200)
    return () => window.clearInterval(timer)
  }, [activeStatus, setDurations])

  const totalMs = durations.statusA + durations.statusB + durations.statusC

  const generatePoster = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 720
    canvas.height = 1040
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#050505')
    gradient.addColorStop(1, '#00291d')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#00ff9f'
    ctx.lineWidth = 2
    ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48)

    ctx.fillStyle = '#96ffd1'
    ctx.font = 'bold 42px "JetBrains Mono", monospace'
    ctx.fillText('今日职场隐身度：98%', 52, 120)

    ctx.font = '24px "JetBrains Mono", monospace'
    ctx.fillText(`总摸鱼时长：${formatDuration(totalMs)}`, 52, 220)
    ctx.fillText(`带薪排泄中：${formatDuration(durations.statusA)}`, 52, 290)
    ctx.fillText(`会议折磨中：${formatDuration(durations.statusB)}`, 52, 350)
    ctx.fillText(`构建摸鱼中：${formatDuration(durations.statusC)}`, 52, 410)
    ctx.fillStyle = '#5ef5ff'
    ctx.fillText('CYBER-OX LAB // VOID WALKER', 52, 530)

    ctx.strokeStyle = 'rgba(0,255,159,0.35)'
    for (let i = 0; i < 9; i += 1) {
      ctx.beginPath()
      ctx.moveTo(52, 600 + i * 40)
      ctx.lineTo(canvas.width - 52, 600 + i * 40)
      ctx.stroke()
    }

    setPosterUrl(canvas.toDataURL('image/png'))
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-emerald-200/85">
        多维摸鱼时间聚合器：每次只激活一个状态，持续累加并生成 Canvas 海报。
      </p>
      <div className="grid gap-3">
        {VOID_STATUS.map((status) => {
          const active = activeStatus === status.id
          return (
            <motion.div
              key={status.id}
              layout
              className="rounded-lg border border-emerald-300/20 bg-black/45 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-emerald-100">{status.label}</p>
                <p className="font-mono text-sm text-emerald-200">{formatDuration(durations[status.id])}</p>
              </div>
              <div className="mt-3">
                <CyberButton
                  className={active ? 'border-rose-300/40 bg-rose-500/15' : ''}
                  onClick={() => setActiveStatus(active ? null : status.id)}
                >
                  {active ? (
                    <>
                      <Pause className="mr-2 inline h-4 w-4" />
                      STOP
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 inline h-4 w-4" />
                      START
                    </>
                  )}
                </CyberButton>
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="rounded-lg border border-emerald-300/20 bg-black/50 p-3">
        <p className="text-xs text-emerald-300/80">聚合摸鱼总时长</p>
        <p className="mt-2 font-mono text-2xl text-emerald-100">{formatDuration(totalMs)}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <CyberButton onClick={generatePoster}>
          <Sparkles className="mr-2 inline h-4 w-4" />
          生成报告
        </CyberButton>
        <CyberButton
          className="border-amber-300/35 bg-amber-500/10"
          onClick={() =>
            setDurations({
              statusA: 0,
              statusB: 0,
              statusC: 0,
            })
          }
        >
          <RotateCcw className="mr-2 inline h-4 w-4" />
          清零计时
        </CyberButton>
      </div>
      {posterUrl ? (
        <div className="rounded-lg border border-emerald-300/20 bg-black/40 p-3">
          <img alt="今日职场隐身度海报" src={posterUrl} className="w-full rounded-md border border-emerald-300/30" />
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
      if (JARGON_EXAMPLES[trimmed]) {
        return JARGON_EXAMPLES[trimmed]
      }
      if (mode === '向上管理') {
        return `结合当前业务优先级评估，建议将「${trimmed}」纳入下一阶段策略队列，以保障关键路径稳定推进。`
      }
      if (mode === '平级对齐') {
        return `围绕共同目标建议我们同步「${trimmed}」的上下文，并在职责边界内建立可追踪的协同闭环。`
      }
      return `从团队可持续交付角度看，「${trimmed}」需通过分层拆解与节奏控制，降低执行摩擦并提升承接效率。`
    },
    [mode],
  )

  const refactor = async () => {
    if (!inputValue.trim()) {
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          text: inputValue,
        }),
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
    <div className="space-y-4">
      <p className="text-sm text-emerald-200/85">
        AI 职场黑话中转站，接口已预留 <code className="rounded bg-black/45 px-1.5 py-0.5">fetch('/api/refactor')</code>。
      </p>
      <div className="flex flex-wrap gap-2">
        {['向上管理', '平级对齐', '向下兼容'].map((targetMode) => (
          <CyberButton
            key={targetMode}
            className={mode === targetMode ? 'border-cyan-300/60 bg-cyan-500/20 text-cyan-100' : ''}
            onClick={() => setMode(targetMode)}
          >
            {targetMode}
          </CyberButton>
        ))}
      </div>
      <label className="block space-y-2 text-xs text-emerald-300">
        原始发言
        <textarea
          className="h-24 w-full resize-none rounded-md border border-emerald-300/30 bg-black/35 px-3 py-2 text-sm text-emerald-100 outline-none transition focus:border-emerald-200"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="输入你的真实情绪..."
        />
      </label>
      <CyberButton onClick={refactor} className="min-w-36">
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
      </CyberButton>
      <div className="rounded-lg border border-emerald-300/20 bg-black/45 p-3">
        <p className="text-xs text-emerald-300/75">重塑输出</p>
        <p className="mt-2 text-sm leading-7 text-emerald-100">
          {outputValue || '在当前资源排期下，该方案的投入产出比（ROI）尚未达到临界点。'}
        </p>
      </div>
    </div>
  )
}

function CyberOxBoardModule() {
  const [bugCount, setBugCount] = useState(128)
  const [caffeine, setCaffeine] = useState(66)
  const [now, setNow] = useState(Date.now())
  const [bossDistance, setBossDistance] = useState(67.4)
  const resignationDeadline = useMemo(() => Date.now() + 1000 * 60 * 60 * 24 * 180, [])

  useEffect(() => {
    const ticker = window.setInterval(() => setNow(Date.now()), 1000)
    const bugTicker = window.setInterval(
      () => setBugCount((count) => count + Math.floor(Math.random() * 3)),
      2100,
    )
    const caffeineTicker = window.setInterval(
      () => setCaffeine((value) => Math.max(5, Math.min(100, value + (Math.random() > 0.5 ? 4 : -3)))),
      1600,
    )
    const bossTicker = window.setInterval(
      () => setBossDistance((distance) => Math.max(0.8, Math.min(180, distance + (Math.random() - 0.45) * 18))),
      2500,
    )

    return () => {
      window.clearInterval(ticker)
      window.clearInterval(bugTicker)
      window.clearInterval(caffeineTicker)
      window.clearInterval(bossTicker)
    }
  }, [])

  const countdown = Math.max(resignationDeadline - now, 0)
  const days = Math.floor(countdown / (1000 * 60 * 60 * 24))
  const hours = String(Math.floor((countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0')
  const minutes = String(Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0')
  const seconds = String(Math.floor((countdown % (1000 * 60)) / 1000)).padStart(2, '0')

  return (
    <div className="space-y-4">
      <p className="text-sm text-emerald-200/85">
        FUI 体征看板：Bug 存量递增，离职倒计时精确到秒，老板距离雷达实时扫描。
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-emerald-300/20 bg-black/45 p-3">
          <p className="text-xs text-emerald-300/75">Bug 存量</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-100">{bugCount}</p>
        </div>
        <div className="rounded-lg border border-emerald-300/20 bg-black/45 p-3">
          <p className="text-xs text-emerald-300/75">咖啡因水平</p>
          <div className="mt-3 h-4 rounded-full border border-emerald-300/35 bg-black/60 p-0.5">
            <motion.div
              animate={{ width: `${caffeine}%` }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-500"
            />
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-emerald-100">
            <BatteryMedium className="h-4 w-4" />
            {caffeine}%
          </p>
        </div>
        <div className="rounded-lg border border-emerald-300/20 bg-black/45 p-3">
          <p className="text-xs text-emerald-300/75">离职倒计时</p>
          <p className="mt-2 font-mono text-xl text-emerald-100">{`${days}天 ${hours}:${minutes}:${seconds}`}</p>
        </div>
        <div className="rounded-lg border border-emerald-300/20 bg-black/45 p-3">
          <p className="mb-3 text-xs text-emerald-300/75">老板距离（雷达）</p>
          <div className="relative mx-auto h-24 w-24">
            <Radar className="absolute inset-0 m-auto h-8 w-8 text-emerald-200" />
            {[0, 1, 2].map((ring) => (
              <motion.span
                key={ring}
                className="absolute inset-0 rounded-full border border-emerald-300/35"
                animate={{ scale: [0.4, 1.1], opacity: [0.65, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: ring * 0.55 }}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-sm text-emerald-100">{bossDistance.toFixed(1)} m</p>
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
    setSelectedKeywords((prev) => {
      if (prev.includes(keyword)) {
        return prev.filter((item) => item !== keyword)
      }
      return [...prev, keyword]
    })
  }

  const generateReport = () => {
    const fishHours = (fishMs / (1000 * 60 * 60)).toFixed(2)
    const selectedText = selectedKeywords.length ? selectedKeywords.join(' / ') : '结构化推进'
    const generated = `本周累计“战略思考时长”约 ${fishHours} 小时。围绕 ${selectedText} 等关键抓手，已完成跨模块语义对齐与风险预判。由于本周深挖底层架构逻辑，导致表面产出呈现滞后性，实则在为下周爆发式增长做势能储备。`
    setReport(generated)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-emerald-200/85">周报/日报一键灌水工具，会自动引用聚合摸鱼时长。</p>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => {
          const checked = selectedKeywords.includes(keyword)
          return (
            <CyberButton
              key={keyword}
              className={checked ? 'border-cyan-300/55 bg-cyan-500/20 text-cyan-100' : ''}
              onClick={() => toggleKeyword(keyword)}
            >
              {checked ? '☑' : '☐'} {keyword}
            </CyberButton>
          )
        })}
      </div>
      <CyberButton onClick={generateReport}>
        <Sparkles className="mr-2 inline h-4 w-4" />
        一键生成周报语料
      </CyberButton>
      <div className="rounded-lg border border-emerald-300/20 bg-black/45 p-3">
        <p className="text-xs text-emerald-300/75">自动文案输出</p>
        <p className="mt-2 text-sm leading-7 text-emerald-100">
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
  const messages = [
    '老板离他的法拉利又近了一步，加油，奋斗者！',
    '检测到您的灵魂正在脱离肉体，请及时通过摸鱼找回自我。',
    '本日精神阈值低于 22%，建议启动快乐摸鱼协议。',
  ]

  const triggerConsoler = useCallback(() => {
    const message = messages[Math.floor(Math.random() * messages.length)]
    setToastMessage(`[功德 +1] ${message}`)
  }, [messages])

  useEffect(() => {
    const timer = window.setInterval(triggerConsoler, 15 * 60 * 1000)
    return () => window.clearInterval(timer)
  }, [triggerConsoler])

  useEffect(() => {
    if (!toastMessage) {
      return
    }
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
      gain.gain.exponentialRampToValueAtTime(0.045, cursor + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, cursor + 0.28)
      osc.connect(gain)
      gain.connect(context.destination)
      osc.start(cursor)
      osc.stop(cursor + 0.3)
      cursor += 0.32
      activeNodeRef.current = osc
    })
    setAudioMode('chant')
    window.setTimeout(() => setAudioMode('idle'), 3300)
  }

  const playWhiteNoise = async () => {
    stopAudio()
    const context = await getContext()
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < data.length; index += 1) {
      data[index] = Math.random() * 2 - 1
    }
    const source = context.createBufferSource()
    const gain = context.createGain()
    const filter = context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 900
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
    <div className="space-y-4">
      <p className="text-sm text-emerald-200/85">
        反向 PUA 情绪补给站，每 15 分钟自动尝试弹窗一次，可手动触发深度安慰音频。
      </p>
      <div className="flex flex-wrap gap-2">
        <CyberButton onClick={triggerConsoler}>
          <Brain className="mr-2 inline h-4 w-4" />
          立即补给
        </CyberButton>
        <CyberButton className="border-cyan-300/35 bg-cyan-500/10" onClick={playChant}>
          <Play className="mr-2 inline h-4 w-4" />
          深度安慰：8-bit 大悲咒
        </CyberButton>
        <CyberButton className="border-sky-300/35 bg-sky-500/10" onClick={playWhiteNoise}>
          <Play className="mr-2 inline h-4 w-4" />
          深度安慰：赛博白噪音
        </CyberButton>
        <CyberButton className="border-rose-300/35 bg-rose-500/10" onClick={stopAudio}>
          <Pause className="mr-2 inline h-4 w-4" />
          停止音频
        </CyberButton>
      </div>
      <p className="text-xs text-emerald-300/75">
        当前音频状态：{audioMode === 'idle' ? '静默' : audioMode === 'chant' ? '8-bit 咒文播放中' : '白噪音循环中'}
      </p>
      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            className={`rounded-lg px-4 py-3 text-sm text-emerald-100 ${GLOBAL_GLASS}`}
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
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported'
    }
    return Notification.permission
  })
  const [intervalMinutes, setIntervalMinutes] = useLocalStorageState('cyber-ox-levator-interval', 30)
  const [active, setActive] = useState(false)
  const [lastTrigger, setLastTrigger] = useState('--:--:--')
  const titleRef = useRef(typeof document !== 'undefined' ? document.title : '')

  const flashTitle = () => {
    if (typeof document === 'undefined') {
      return
    }
    const baseTitle = titleRef.current || 'Cyber-Ox Lab'
    let ticks = 0
    const timer = window.setInterval(() => {
      document.title = ticks % 2 === 0 ? '🚨 提肛指令已下达' : baseTitle
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
    if (permission === 'granted' && 'Notification' in window) {
      new Notification(message)
    }
  }, [permission])

  useEffect(() => {
    if (!active) {
      return
    }
    const timer = window.setInterval(fireReminder, Math.max(1, intervalMinutes) * 60 * 1000)
    return () => window.clearInterval(timer)
  }, [active, fireReminder, intervalMinutes])

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      return
    }
    const next = await Notification.requestPermission()
    setPermission(next)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-emerald-200/85">
        Web Notification API + 标签栏图标闪烁提醒机制，保护久坐工位下的最后尊严。
      </p>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="space-y-1 text-xs text-emerald-300">
          提醒间隔（分钟）
          <input
            className="w-full rounded-md border border-emerald-300/30 bg-black/35 px-3 py-2 text-emerald-100 outline-none transition focus:border-emerald-200"
            type="number"
            min="1"
            value={intervalMinutes}
            onChange={(event) => setIntervalMinutes(Number(event.target.value) || 1)}
          />
        </label>
        <div className="rounded-md border border-emerald-300/20 bg-black/45 px-3 py-2 text-xs text-emerald-200">
          通知权限：{permission}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <CyberButton onClick={requestPermission}>
          <BellRing className="mr-2 inline h-4 w-4" />
          申请通知权限
        </CyberButton>
        <CyberButton
          className={active ? 'border-rose-300/45 bg-rose-500/15' : 'border-cyan-300/35 bg-cyan-500/12'}
          onClick={() => setActive((value) => !value)}
        >
          <AlarmClock className="mr-2 inline h-4 w-4" />
          {active ? '停止自动提醒' : '启动自动提醒'}
        </CyberButton>
        <CyberButton className="border-amber-300/35 bg-amber-500/10" onClick={fireReminder}>
          <ShieldAlert className="mr-2 inline h-4 w-4" />
          立即提醒一次
        </CyberButton>
      </div>
      <div className="rounded-lg border border-emerald-300/20 bg-black/45 p-3 text-sm text-emerald-100">
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

  useEffect(() => {
    if (!moduleId) {
      return
    }
    const matched = MODULES.some((moduleItem) => moduleItem.id === moduleId)
    if (!matched) {
      navigate('/', { replace: true })
      return
    }
    setOpenModules((prev) => {
      if (prev.includes(moduleId)) {
        return [...prev.filter((item) => item !== moduleId), moduleId]
      }
      return [...prev, moduleId]
    })
  }, [moduleId, navigate])

  const openModule = (id) => {
    setOpenModules((prev) => {
      if (prev.includes(id)) {
        return [...prev.filter((item) => item !== id), id]
      }
      return [...prev, id]
    })
    navigate(`/module/${id}`)
  }

  const closeModule = (id) => {
    const next = openModules.filter((item) => item !== id)
    setOpenModules(next)
    if (moduleId === id) {
      navigate(next.length ? `/module/${next[next.length - 1]}` : '/')
    }
  }

  const focusModule = (id) => {
    setOpenModules((prev) => [...prev.filter((item) => item !== id), id])
  }

  const fishMs = useMemo(
    () => recoveryElapsedMs + voidDurations.statusA + voidDurations.statusB + voidDurations.statusC,
    [recoveryElapsedMs, voidDurations],
  )

  const renderModule = (id) => {
    if (id === 'recovery') {
      return <RecoveryModule onElapsedChange={setRecoveryElapsedMs} />
    }
    if (id === 'void') {
      return <VoidWalkerModule durations={voidDurations} setDurations={setVoidDurations} />
    }
    if (id === 'jargon') {
      return <JargonRefactorModule />
    }
    if (id === 'board') {
      return <CyberOxBoardModule />
    }
    if (id === 'weekly') {
      return <WeeklyCatalystModule fishMs={fishMs} />
    }
    if (id === 'consoler') {
      return <CPUConsolerModule />
    }
    if (id === 'levator') {
      return <LevatorAniModule />
    }
    return null
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] p-4 text-emerald-100 sm:p-6">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,159,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <section className={`relative z-10 rounded-xl p-4 sm:p-5 ${GLOBAL_GLASS}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-emerald-100 sm:text-xl">
              🦾 Cyber-Ox Lab (赛博牛马实验室) v1.0
            </h1>
            <p className="text-xs text-emerald-300/80">代码要硬核，视觉要赛博，情绪要到位。</p>
          </div>
          <div className="rounded-md border border-emerald-300/25 bg-black/35 px-3 py-2 text-xs">
            TOTAL STEALTH TIME: {formatDuration(fishMs)}
          </div>
        </div>
      </section>

      <section className="relative z-10 mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {MODULES.map((moduleItem) => (
          <motion.div key={moduleItem.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <motion.button
              type="button"
              className={`w-full rounded-lg p-3 text-left transition ${GLOBAL_GLASS}`}
              onClick={() => openModule(moduleItem.id)}
            >
              <moduleItem.icon className="h-5 w-5 text-emerald-200" />
              <p className="mt-2 text-sm text-emerald-100">{moduleItem.title}</p>
              <p className="mt-1 text-[11px] text-emerald-300/75">{moduleItem.subtitle}</p>
            </motion.button>
          </motion.div>
        ))}
      </section>

      <AnimatePresence>
        {openModules.map((id, index) => {
          const moduleItem = MODULES.find((item) => item.id === id)
          if (!moduleItem) {
            return null
          }
          return (
            <ModuleWindow
              key={id}
              title={moduleItem.title}
              subtitle={moduleItem.subtitle}
              icon={moduleItem.icon}
              index={index}
              onFocus={() => focusModule(id)}
              onClose={() => closeModule(id)}
            >
              {renderModule(id)}
            </ModuleWindow>
          )
        })}
      </AnimatePresence>

      <footer className="relative z-10 mt-5 flex items-center gap-2 text-xs text-emerald-300/75">
        <Timer className="h-4 w-4" />
        数据全部本地计算与存储，敏感输入仅写入 localStorage。
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
