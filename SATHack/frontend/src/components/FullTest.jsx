import { useState, useEffect, useRef } from 'react'

const QUESTIONS_PER_MODULE = 27
const MODULE_TIME = 32 * 60
const BREAK_TIME = 5 * 60

function PassageContent({ passage, question }) {
  const isRhetorical = passage.genre === 'rhetorical_synthesis'
  const isPaired = passage.text?.includes('Text 1\n')

  if (isRhetorical) {
    const lines = passage.text.split('\n').filter(l => l.trim())
    return (
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          While researching a topic, a student has taken the following notes:
        </p>
        <ul className="space-y-2">
          {lines.map((line, i) => (
            <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-gray-800 font-serif">
              <span className="text-gray-400 mt-1 shrink-0">•</span>
              <span>{line.replace(/^[•\-]\s*/, '')}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (isPaired) {
    const t1Match = passage.text.match(/Text 1\n([\s\S]*?)(?=Text 2\n|$)/)
    const t2Match = passage.text.match(/Text 2\n([\s\S]*)/)
    return (
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Text 1</p>
          <p className="text-[15px] leading-[1.8] font-serif text-gray-800">{t1Match?.[1]?.trim()}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Text 2</p>
          <p className="text-[15px] leading-[1.8] font-serif text-gray-800">{t2Match?.[1]?.trim()}</p>
        </div>
      </div>
    )
  }

  if (question.passage_excerpt) {
    const parts = question.passage_excerpt.split('[BLANK]')
    return (
      <p className="text-[15px] leading-[1.8] font-serif text-gray-800">
        {parts[0]}
        <span className="inline-block border-b-2 border-[#1a3557] px-2 mx-1 font-bold text-[#1a3557] min-w-[50px] text-center">______</span>
        {parts[1] || ''}
      </p>
    )
  }

  return <p className="text-[15px] leading-[1.8] font-serif text-gray-800">{passage.text}</p>
}

export default function FullTest({ onFinish }) {
  const [module, setModule] = useState(1)
  const [screen, setScreen] = useState('test')
  const [questions, setQuestions] = useState({})
  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState({})
  const [currentQ, setCurrentQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(MODULE_TIME)
  const [breakTime, setBreakTime] = useState(BREAK_TIME)
  const [loadingQ, setLoadingQ] = useState(false)
  const [showNav, setShowNav] = useState(false)
  const [showPassage, setShowPassage] = useState(true)
  const loadingIndexes = useRef(new Set())

  const globalIndex = (module - 1) * QUESTIONS_PER_MODULE + currentQ

  // Fetch a single question for a given global index
  async function fetchQuestion(idx) {
    if (questions[idx] || loadingIndexes.current.has(idx)) return
    loadingIndexes.current.add(idx)
    try {
      const res = await fetch('/api/question')
      const data = await res.json()
      if (!data.error && data.question) {
        setQuestions(prev => ({ ...prev, [idx]: data }))
      }
    } catch (e) {
      console.error('Failed to load question', idx, e)
    } finally {
      loadingIndexes.current.delete(idx)
    }
  }

  // Load current + prefetch next when question index changes
  useEffect(() => {
    const load = async () => {
      if (!questions[globalIndex]) {
        setLoadingQ(true)
        await fetchQuestion(globalIndex)
        setLoadingQ(false)
      }
      // Prefetch next 2
      fetchQuestion(globalIndex + 1)
      fetchQuestion(globalIndex + 2)
    }
    load()
  }, [globalIndex])

  // Module timer
  useEffect(() => {
    if (screen !== 'test') return
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); handleModuleEnd(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [screen, module])

  // Break timer
  useEffect(() => {
    if (screen !== 'break') return
    const t = setInterval(() => {
      setBreakTime(prev => {
        if (prev <= 1) { clearInterval(t); startModule2(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [screen])

  function handleModuleEnd() {
    if (module === 1) {
      setScreen('break')
      setBreakTime(BREAK_TIME)
    } else {
      finishTest()
    }
  }

  function startModule2() {
    setModule(2)
    setCurrentQ(0)
    setTimeLeft(MODULE_TIME)
    setScreen('test')
    setShowPassage(true)
  }

  function finishTest() {
    const resultData = Array.from({ length: QUESTIONS_PER_MODULE * 2 }, (_, i) => {
      const q = questions[i]
      if (!q) return null
      return {
        ...q,
        userAnswer: answers[i] || null,
        isCorrect: answers[i] === q?.question?.correct,
        globalIndex: i,
        module: i < QUESTIONS_PER_MODULE ? 1 : 2,
      }
    }).filter(Boolean)
    onFinish(resultData)
  }

  function handleAnswer(letter) {
    setAnswers(prev => ({ ...prev, [globalIndex]: letter }))
  }

  function toggleFlag() {
    setFlagged(prev => ({ ...prev, [globalIndex]: !prev[globalIndex] }))
  }

  function handleNext() {
    if (currentQ < QUESTIONS_PER_MODULE - 1) {
      setCurrentQ(q => q + 1)
      setShowPassage(true)
    } else {
      handleModuleEnd()
    }
  }

  function handlePrev() {
    if (currentQ > 0) {
      setCurrentQ(q => q - 1)
      setShowPassage(true)
    }
  }

  function goToQuestion(idx) {
    setCurrentQ(idx)
    setShowNav(false)
    setShowPassage(true)
  }

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const answeredInModule = Object.keys(answers).filter(k => {
    const n = parseInt(k)
    return n >= (module - 1) * QUESTIONS_PER_MODULE && n < module * QUESTIONS_PER_MODULE
  }).length

  const currentData = questions[globalIndex]
  const selectedAnswer = answers[globalIndex]
  const isFlagged = flagged[globalIndex]
  const timeWarning = timeLeft < 5 * 60

  // ── BREAK SCREEN ──────────────────────────────────────────────────────────
  if (screen === 'break') return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center max-w-md w-full">
        <div className="text-5xl mb-5">☕</div>
        <h2 className="text-[#1a3557] font-bold text-2xl mb-2">Module 1 Complete</h2>
        <p className="text-gray-500 text-sm mb-8">Take a short break. Module 2 starts automatically.</p>
        <div className="bg-[#eef3f9] rounded-xl p-6 mb-6">
          <div className="text-5xl font-black text-[#1a3557] font-mono mb-1">{formatTime(breakTime)}</div>
          <p className="text-gray-500 text-xs">remaining</p>
        </div>
        <button onClick={startModule2} className="bg-[#1a3557] hover:bg-[#142a45] text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors w-full">
          Start Module 2 Now →
        </button>
      </div>
    </div>
  )

  // ── LOADING CURRENT QUESTION ──────────────────────────────────────────────
  if (loadingQ || !currentData) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#1a3557] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading question {currentQ + 1} of {QUESTIONS_PER_MODULE}...</p>
        <p className="text-gray-400 text-xs mt-1">Module {module}</p>
      </div>
    </div>
  )

  const { passage, question } = currentData

  // ── NAV OVERLAY ───────────────────────────────────────────────────────────
  const NavOverlay = () => (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4" onClick={() => setShowNav(false)}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1a3557]">Module {module} — Navigate</h3>
          <button onClick={() => setShowNav(false)} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="flex gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#1a3557] rounded-sm inline-block" /> Answered</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-white border border-gray-300 rounded-sm inline-block" /> Unanswered</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#f0b429] rounded-sm inline-block" /> Flagged</span>
        </div>
        <div className="grid grid-cols-9 gap-1.5">
          {Array.from({ length: QUESTIONS_PER_MODULE }, (_, idx) => {
            const gIdx = (module - 1) * QUESTIONS_PER_MODULE + idx
            const isAnswered = !!answers[gIdx]
            const isFlaggedQ = !!flagged[gIdx]
            const isCurrent = idx === currentQ
            return (
              <button
                key={idx}
                onClick={() => goToQuestion(idx)}
                className={`aspect-square rounded text-xs font-bold transition-all ${isCurrent ? 'ring-2 ring-[#1a3557] ring-offset-1' : ''} ${
                  isFlaggedQ ? 'bg-[#f0b429] text-[#0f1f3d]' :
                  isAnswered ? 'bg-[#1a3557] text-white' :
                  'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
          {answeredInModule}/{QUESTIONS_PER_MODULE} answered
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showNav && <NavOverlay />}

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[#1a3557] font-bold text-sm hidden md:inline">SAT Reading & Writing</span>
          <span className="bg-[#eef3f9] text-[#1a3557] text-xs font-bold px-2.5 py-1 rounded-full">Module {module}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-mono font-bold text-sm px-3 py-1 rounded-lg ${timeWarning ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
            {timeWarning && '⚠️ '}{formatTime(timeLeft)}
          </span>
          <span className="text-gray-500 text-sm">{currentQ + 1}/{QUESTIONS_PER_MODULE}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div className="h-1 bg-[#1a3557] transition-all duration-300" style={{ width: `${(currentQ / QUESTIONS_PER_MODULE) * 100}%` }} />
      </div>

      {/* Mobile tabs */}
      <div className="md:hidden flex border-b border-gray-200 bg-white">
        <button onClick={() => setShowPassage(true)} className={`flex-1 py-2.5 text-sm font-semibold ${showPassage ? 'text-[#1a3557] border-b-2 border-[#1a3557]' : 'text-gray-400'}`}>Passage</button>
        <button onClick={() => setShowPassage(false)} className={`flex-1 py-2.5 text-sm font-semibold ${!showPassage ? 'text-[#1a3557] border-b-2 border-[#1a3557]' : 'text-gray-400'}`}>Question</button>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Passage */}
        <div className={`w-full md:w-1/2 md:border-r border-gray-200 overflow-y-auto p-5 md:p-8 bg-white ${showPassage ? 'block' : 'hidden md:block'}`}>
          <div className="max-w-prose mx-auto">
            {passage.genre !== 'rhetorical_synthesis' && (
              <div className="mb-5">
                <h2 className="font-bold text-[#1a3557] text-sm md:text-base">{passage.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{passage.author}{passage.year ? ` · ${passage.year}` : ''}</p>
              </div>
            )}
            <PassageContent passage={passage} question={question} />
          </div>
        </div>

        {/* RIGHT — Question */}
        <div className={`w-full md:w-1/2 overflow-y-auto p-5 md:p-8 bg-gray-50 ${!showPassage ? 'block' : 'hidden md:block'}`}>
          <div className="max-w-prose mx-auto">
            <p className="text-gray-900 text-sm md:text-base font-semibold leading-relaxed mb-5">
              {question.question}
            </p>
            <div className="space-y-2.5 mb-6">
              {['A', 'B', 'C', 'D'].map(letter => {
                const text = question.choices?.[letter]
                if (!text) return null
                return (
                  <button
                    key={letter}
                    onClick={() => handleAnswer(letter)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-sm leading-relaxed flex gap-3 items-start ${
                      selectedAnswer === letter
                        ? 'border-[#1a3557] bg-[#eef3f9] text-[#1a3557]'
                        : 'border-gray-200 bg-white hover:border-[#1a3557] hover:bg-blue-50 text-gray-800'
                    }`}
                  >
                    <span className="font-bold shrink-0 w-4 mt-0.5">{letter}.</span>
                    <span className="flex-1">{text}</span>
                    {selectedAnswer === letter && <span className="shrink-0 text-[#1a3557] ml-auto">●</span>}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleFlag}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                  isFlagged ? 'bg-[#f0b429] border-[#f0b429] text-[#0f1f3d]' : 'bg-white border-gray-200 text-gray-600 hover:border-[#f0b429]'
                }`}
              >
                🚩 {isFlagged ? 'Flagged' : 'Flag'}
              </button>
              <button
                onClick={() => setShowNav(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 border-gray-200 bg-white text-gray-600 hover:border-[#1a3557] transition-all"
              >
                ☰ {answeredInModule}/{QUESTIONS_PER_MODULE}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="bg-white border-t border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQ === 0}
          className="px-5 py-2 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-600 hover:border-[#1a3557] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Back
        </button>
        {currentQ < QUESTIONS_PER_MODULE - 1 ? (
          <button onClick={handleNext} className="px-5 py-2 rounded-xl text-sm font-bold bg-[#1a3557] hover:bg-[#142a45] text-white transition-all">
            Next →
          </button>
        ) : (
          <button onClick={handleModuleEnd} className="px-5 py-2 rounded-xl text-sm font-bold bg-[#f0b429] hover:bg-[#f5c842] text-[#0f1f3d] transition-all">
            {module === 1 ? 'End Module 1 →' : 'Submit Test →'}
          </button>
        )}
      </div>
    </div>
  )
}