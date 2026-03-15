import { useState, useEffect, useCallback } from 'react'

const TYPE_LABELS = {
  // New official CB names
  WORDS_IN_CONTEXT: 'Words in Context',
  TEXT_PURPOSE: 'Text Structure & Purpose',
  TEXT_STRUCTURE: 'Text Structure & Purpose',
  MAIN_IDEA: 'Central Ideas & Details',
  DETAIL: 'Central Ideas & Details',
  COMMAND_OF_EVIDENCE: 'Command of Evidence',
  INFERENCES: 'Inferences',
  RHETORICAL_SYNTHESIS: 'Rhetorical Synthesis',
  TRANSITIONS: 'Transitions',
  BOUNDARIES: 'Boundaries',
  FORM_STRUCTURE_SENSE: 'Form, Structure & Sense',
  CROSS_TEXT_CONNECTIONS: 'Cross-Text Connections',
  // Legacy names (fallback)
  WORD_CHOICE: 'Words in Context',
  TRANSITION: 'Transitions',
  LOGICAL_COMPLETION: 'Inferences',
  STANDARD_ENGLISH: 'Standard English',
  CROSS_TEXT: 'Cross-Text Connections',
}

const TYPE_COLORS = {
  WORDS_IN_CONTEXT: 'bg-blue-100 text-blue-700',
  WORD_CHOICE: 'bg-blue-100 text-blue-700',
  TEXT_PURPOSE: 'bg-pink-100 text-pink-700',
  TEXT_STRUCTURE: 'bg-pink-100 text-pink-700',
  MAIN_IDEA: 'bg-green-100 text-green-700',
  DETAIL: 'bg-green-100 text-green-700',
  COMMAND_OF_EVIDENCE: 'bg-yellow-100 text-yellow-800',
  INFERENCES: 'bg-orange-100 text-orange-700',
  LOGICAL_COMPLETION: 'bg-orange-100 text-orange-700',
  RHETORICAL_SYNTHESIS: 'bg-indigo-100 text-indigo-700',
  TRANSITIONS: 'bg-purple-100 text-purple-700',
  TRANSITION: 'bg-purple-100 text-purple-700',
  BOUNDARIES: 'bg-teal-100 text-teal-700',
  FORM_STRUCTURE_SENSE: 'bg-teal-100 text-teal-700',
  STANDARD_ENGLISH: 'bg-teal-100 text-teal-700',
  CROSS_TEXT_CONNECTIONS: 'bg-rose-100 text-rose-700',
  CROSS_TEXT: 'bg-rose-100 text-rose-700',
}

// Format passage text — handles [BLANK], Text 1/2 headers, bullet points
function PassageContent({ passage, question }) {
  const isRhetoricalSynthesis = passage.genre === 'rhetorical_synthesis'
  const isPaired = passage.text_a !== undefined || passage.text?.includes('Text 1\n')

  // For rhetorical synthesis — render as clean bullet list
  if (isRhetoricalSynthesis) {
    const lines = passage.text.split('\n').filter(l => l.trim())
    return (
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">While researching a topic, a student has taken the following notes:</p>
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

  // For paired passages — render Text 1 and Text 2 with clean headers
  if (isPaired) {
    const raw = passage.text || ''
    const t1Match = raw.match(/Text 1\n([\s\S]*?)(?=Text 2\n|$)/)
    const t2Match = raw.match(/Text 2\n([\s\S]*)/)
    const text1 = t1Match ? t1Match[1].trim() : ''
    const text2 = t2Match ? t2Match[1].trim() : ''
    return (
      <div className="space-y-5">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Text 1</p>
          <p className="text-[15px] leading-[1.8] font-serif text-gray-800">{text1}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Text 2</p>
          <p className="text-[15px] leading-[1.8] font-serif text-gray-800">{text2}</p>
        </div>
      </div>
    )
  }

  // For fill-in-blank types — show excerpt with styled blank
  if (question.passage_excerpt) {
    const parts = question.passage_excerpt.split('[BLANK]')
    return (
      <p className="text-[15px] leading-[1.8] font-serif text-gray-800">
        {parts[0]}
        <span className="inline-block border-b-2 border-[#1a3557] px-2 mx-1 font-bold text-[#1a3557] min-w-[50px] text-center">______</span>
        {parts[1]}
      </p>
    )
  }

  // Default — full passage
  return (
    <p className="text-[15px] leading-[1.8] font-serif text-gray-800">
      {passage.text}
    </p>
  )
}

export default function Quiz({ total, onFinish }) {
  const [questionNum, setQuestionNum] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [results, setResults] = useState([])
  const [timer, setTimer] = useState(0)
  const [timerVisible, setTimerVisible] = useState(true)
  const [showPassage, setShowPassage] = useState(true) // mobile toggle

  useEffect(() => {
    if (submitted) return
    const t = setInterval(() => setTimer(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [submitted, questionNum])

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const fetchQuestion = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSelected(null)
    setSubmitted(false)
    setFeedback(null)
    setTimer(0)
    setShowPassage(true)
    try {
      const res = await fetch('/api/question')
      if (!res.ok) throw new Error('Server error')
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setData(json)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchQuestion() }, [fetchQuestion])

  async function handleSubmit() {
    if (!selected || submitted) return
    setSubmitted(true)
    const isCorrect = selected === data.question.correct
    setResults(prev => [...prev, {
      questionNum,
      passage: data.passage,
      question: data.question,
      userAnswer: selected,
      isCorrect,
      timeSpent: timer,
    }])
    setFeedbackLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: data.question, userAnswer: selected, isCorrect })
      })
      const json = await res.json()
      setFeedback(json.feedback)
    } catch { setFeedback(null) }
    finally { setFeedbackLoading(false) }
  }

  function handleNext() {
    if (questionNum >= total) {
      onFinish([...results])
    } else {
      setQuestionNum(n => n + 1)
      fetchQuestion()
    }
  }

  function choiceStyle(letter) {
    if (!submitted) {
      return selected === letter
        ? 'border-[#1a3557] bg-[#eef3f9] text-[#1a3557] shadow-sm'
        : 'border-gray-200 bg-white hover:border-[#1a3557] hover:bg-blue-50 text-gray-800'
    }
    if (letter === data.question.correct) return 'border-green-500 bg-green-50 text-green-800'
    if (letter === selected) return 'border-red-400 bg-red-50 text-red-800'
    return 'border-gray-200 bg-white text-gray-400'
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="w-8 h-8 border-2 border-[#1a3557] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Generating question...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-sm">
        <p className="text-red-500 mb-4 text-sm">Error: {error}</p>
        <button onClick={fetchQuestion} className="bg-[#1a3557] text-white px-6 py-2 rounded-lg text-sm">Try Again</button>
      </div>
    </div>
  )

  const { passage, question } = data
  const typeLabel = TYPE_LABELS[question.type] || question.type
  const typeColor = TYPE_COLORS[question.type] || 'bg-gray-100 text-gray-600'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[#1a3557] font-bold text-sm">SAT Practice</span>
          <span className="text-gray-300 hidden md:inline">|</span>
          <span className="text-gray-500 text-sm hidden md:inline">Reading & Writing</span>
        </div>
        <div className="flex items-center gap-3">
          {timerVisible
            ? <button onClick={() => setTimerVisible(false)} className="text-gray-500 text-sm font-mono hover:text-gray-700">⏱ {formatTime(timer)}</button>
            : <button onClick={() => setTimerVisible(true)} className="text-gray-400 text-xs hover:text-gray-600">Show Timer</button>
          }
          <span className="text-gray-500 text-sm font-medium">{questionNum}/{total}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div className="h-1 bg-[#1a3557] transition-all duration-500" style={{ width: `${((questionNum - 1) / total) * 100}%` }} />
      </div>

      {/* Mobile passage/question toggle */}
      <div className="md:hidden flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setShowPassage(true)}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${showPassage ? 'text-[#1a3557] border-b-2 border-[#1a3557]' : 'text-gray-400'}`}
        >
          Passage
        </button>
        <button
          onClick={() => setShowPassage(false)}
          className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${!showPassage ? 'text-[#1a3557] border-b-2 border-[#1a3557]' : 'text-gray-400'}`}
        >
          Question
        </button>
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Passage (hidden on mobile when question tab active) */}
        <div className={`w-full md:w-1/2 md:border-r border-gray-200 overflow-y-auto p-5 md:p-8 bg-white ${showPassage ? 'block' : 'hidden md:block'}`}>
          <div className="max-w-prose mx-auto">
            {/* Type badge */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColor}`}>{typeLabel}</span>
              <span className="text-xs text-gray-400 capitalize">{passage.genre?.replace('_', ' ')}</span>
            </div>

            {/* Source info — don't show for notes */}
            {passage.genre !== 'rhetorical_synthesis' && (
              <div className="mb-4">
                <h2 className="font-bold text-[#1a3557] text-sm md:text-base leading-tight">{passage.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{passage.author}{passage.year ? ` · ${passage.year}` : ''}</p>
              </div>
            )}

            <PassageContent passage={passage} question={question} />
          </div>
        </div>

        {/* RIGHT — Question (hidden on mobile when passage tab active) */}
        <div className={`w-full md:w-1/2 overflow-y-auto p-5 md:p-8 bg-gray-50 ${!showPassage ? 'block' : 'hidden md:block'}`}>
          <div className="max-w-prose mx-auto">

            {/* Question stem */}
            <p className="text-gray-900 text-sm md:text-base font-semibold leading-relaxed mb-5">
              {question.question}
            </p>

            {/* Answer choices */}
            <div className="space-y-2.5 mb-5">
              {Object.entries(question.choices).map(([letter, text]) => (
                <button
                  key={letter}
                  onClick={() => !submitted && setSelected(letter)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-100 text-sm leading-relaxed flex gap-3 items-start ${choiceStyle(letter)}`}
                >
                  <span className="font-bold shrink-0 w-4 mt-0.5">{letter}.</span>
                  <span className="flex-1">{text}</span>
                  {submitted && letter === data.question.correct && <span className="shrink-0 text-green-600 font-bold ml-auto">✓</span>}
                  {submitted && letter === selected && letter !== data.question.correct && <span className="shrink-0 text-red-500 font-bold ml-auto">✗</span>}
                </button>
              ))}
            </div>

            {/* Submit */}
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${selected ? 'bg-[#1a3557] hover:bg-[#142a45] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                Submit Answer
              </button>
            ) : (
              <div className="space-y-3">

                {/* Result */}
                <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${selected === question.correct ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {selected === question.correct ? '✓ Correct!' : `✗ Correct answer: ${question.correct}.`}
                </div>

                {/* Explanation */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Explanation</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
                </div>

                {/* Why trap is tempting */}
                {selected !== question.correct && question.trap_explanations?.[selected] && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1.5">Why {selected} is tempting</p>
                    <p className="text-sm text-amber-800 leading-relaxed">{question.trap_explanations[selected]}</p>
                  </div>
                )}

                {/* Tutor tip */}
                {feedbackLoading && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 py-1">
                    <div className="w-4 h-4 border-2 border-[#1a3557] border-t-transparent rounded-full animate-spin" />
                    Getting tutor tip...
                  </div>
                )}
                {feedback && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="text-xs font-bold text-[#1a3557] uppercase tracking-wide mb-1.5">💡 Tutor Tip</p>
                    <p className="text-sm text-[#1a3557] leading-relaxed">{feedback}</p>
                  </div>
                )}

                {/* Next */}
                <button
                  onClick={handleNext}
                  className="w-full bg-[#1a3557] hover:bg-[#142a45] text-white py-3 rounded-xl font-bold text-sm transition-colors"
                >
                  {questionNum >= total ? 'See Results →' : 'Next Question →'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom nav dots */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-center gap-2">
        {Array.from({ length: total }).map((_, idx) => (
          <div
            key={idx}
            className={`rounded-full transition-all ${
              idx + 1 < questionNum ? 'w-2.5 h-2.5 bg-[#1a3557]' :
              idx + 1 === questionNum ? 'w-3 h-3 bg-[#1a3557] ring-2 ring-[#1a3557] ring-offset-2' :
              'w-2.5 h-2.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}