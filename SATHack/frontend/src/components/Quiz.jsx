import { useState, useEffect, useCallback } from 'react'

const TYPE_LABELS = {
  WORD_CHOICE: 'Word Choice',
  TRANSITION: 'Transition',
  CENTRAL_IDEA: 'Central Idea',
  INFERENCE: 'Inference',
  VOCAB_IN_CONTEXT: 'Vocab in Context',
  TEXT_STRUCTURE: 'Text Structure',
  GRAMMAR: 'Grammar',
}

const TYPE_COLORS = {
  WORD_CHOICE: 'bg-blue-100 text-blue-700',
  TRANSITION: 'bg-purple-100 text-purple-700',
  CENTRAL_IDEA: 'bg-green-100 text-green-700',
  INFERENCE: 'bg-yellow-100 text-yellow-700',
  VOCAB_IN_CONTEXT: 'bg-orange-100 text-orange-700',
  TEXT_STRUCTURE: 'bg-pink-100 text-pink-700',
  GRAMMAR: 'bg-teal-100 text-teal-700',
}

function formatPassageText(text) {
  if (!text) return null
  const parts = text.split('[BLANK]')
  if (parts.length === 1) return <span>{text}</span>
  return (
    <>
      {parts[0]}
      <span className="inline-block border-b-2 border-[#1a3557] px-3 mx-1 font-bold text-[#1a3557] min-w-[60px] text-center">
        ______
      </span>
      {parts[1]}
    </>
  )
}

export default function Quiz({ total, onFinish }) {
  const [questionNum, setQuestionNum] = useState(1)
  const [data, setData] = useState(null)       // { passage, question }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [results, setResults] = useState([])
  const [timer, setTimer] = useState(0)
  const [timerVisible, setTimerVisible] = useState(true)

  // Timer
  useEffect(() => {
    if (submitted) return
    const t = setInterval(() => setTimer(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [submitted, questionNum])

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  const fetchQuestion = useCallback(async () => {
    setLoading(true)
    setError(null)
    setSelected(null)
    setSubmitted(false)
    setFeedback(null)
    setTimer(0)
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${API}/api/question`)
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
    const newResult = {
      questionNum,
      passage: data.passage,
      question: data.question,
      userAnswer: selected,
      isCorrect,
      timeSpent: timer,
    }
    setResults(prev => [...prev, newResult])

    // Get AI feedback
    setFeedbackLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: data.question,
          userAnswer: selected,
          isCorrect,
        })
      })
      const json = await res.json()
      setFeedback(json.feedback)
    } catch {
      setFeedback(null)
    } finally {
      setFeedbackLoading(false)
    }
  }

  function handleNext() {
    if (questionNum >= total) {
      onFinish([...results])
    } else {
      setQuestionNum(n => n + 1)
      fetchQuestion()
    }
  }

  // Choice button styles
  function choiceStyle(letter) {
    if (!submitted) {
      return selected === letter
        ? 'border-[#1a3557] bg-[#eef3f9] text-[#1a3557]'
        : 'border-[#ddd] bg-white hover:border-[#1a3557] hover:bg-[#f8fafc] text-[#333]'
    }
    if (letter === data.question.correct) return 'border-green-500 bg-green-50 text-green-800'
    if (letter === selected && letter !== data.question.correct) return 'border-red-400 bg-red-50 text-red-800'
    return 'border-[#ddd] bg-white text-[#aaa]'
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#1a3557] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[#888] text-sm">Generating question...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
      <div className="text-center max-w-sm">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button onClick={fetchQuestion} className="bg-[#1a3557] text-white px-6 py-2 rounded-lg text-sm">
          Try Again
        </button>
      </div>
    </div>
  )

  const { passage, question } = data

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">

      {/* Top bar */}
      <div className="bg-white border-b border-[#e0e0d8] px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-[#1a3557] font-bold text-sm">SAT Practice</span>
          <span className="text-[#ccc]">|</span>
          <span className="text-[#888] text-sm">Reading & Writing</span>
        </div>
        <div className="flex items-center gap-4">
          {timerVisible && (
            <button
              onClick={() => setTimerVisible(false)}
              className="text-[#888] text-sm font-mono hover:text-[#555]"
            >
              ⏱ {formatTime(timer)}
            </button>
          )}
          {!timerVisible && (
            <button onClick={() => setTimerVisible(true)} className="text-[#aaa] text-xs hover:text-[#555]">
              Show Timer
            </button>
          )}
          <span className="text-[#888] text-sm">{questionNum} / {total}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#e8e8e0]">
        <div
          className="h-1 bg-[#1a3557] transition-all duration-500"
          style={{ width: `${((questionNum - 1) / total) * 100}%` }}
        />
      </div>

      {/* Main content — split screen */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT — Passage */}
        <div className="w-1/2 border-r border-[#e0e0d8] overflow-y-auto p-8 bg-white">
          <div className="max-w-prose">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[question.type] || 'bg-gray-100 text-gray-600'}`}>
                {TYPE_LABELS[question.type] || question.type}
              </span>
              <span className="text-xs text-[#aaa]">{passage.genre?.replace('_', ' ')}</span>
            </div>

            <h2 className="font-bold text-[#1a3557] text-base mb-1">{passage.title}</h2>
            <p className="text-xs text-[#888] mb-5">{passage.author} · {passage.year}</p>

            <div className="text-[#2a2a2a] text-[15px] leading-[1.8] font-serif">
              {question.passage_excerpt
                ? formatPassageText(question.passage_excerpt)
                : passage.text
              }
            </div>
          </div>
        </div>

        {/* RIGHT — Question */}
        <div className="w-1/2 overflow-y-auto p-8 bg-[#f9f9f5]">
          <div className="max-w-prose">

            {/* Question stem */}
            <p className="text-[#1a1a1a] text-base font-semibold leading-relaxed mb-6">
              {question.question}
            </p>

            {/* Choices */}
            <div className="space-y-3 mb-6">
              {Object.entries(question.choices).map(([letter, text]) => (
                <button
                  key={letter}
                  onClick={() => !submitted && setSelected(letter)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-100 text-sm leading-relaxed flex gap-3 items-start ${choiceStyle(letter)}`}
                >
                  <span className="font-bold shrink-0 w-5">{letter}.</span>
                  <span>{text}</span>
                  {submitted && letter === data.question.correct && (
                    <span className="ml-auto shrink-0 text-green-600 font-bold">✓</span>
                  )}
                  {submitted && letter === selected && letter !== data.question.correct && (
                    <span className="ml-auto shrink-0 text-red-500 font-bold">✗</span>
                  )}
                </button>
              ))}
            </div>

            {/* Submit / Next */}
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${
                  selected
                    ? 'bg-[#1a3557] hover:bg-[#142a45] text-white'
                    : 'bg-[#e0e0d8] text-[#aaa] cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            ) : (
              <div className="space-y-4">

                {/* Result banner */}
                <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                  selected === question.correct
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {selected === question.correct ? '✓ Correct!' : `✗ The correct answer is ${question.correct}.`}
                </div>

                {/* Explanation */}
                <div className="bg-white rounded-xl p-4 border border-[#e8e8e0]">
                  <p className="text-xs font-bold text-[#888] uppercase tracking-wide mb-2">Explanation</p>
                  <p className="text-sm text-[#444] leading-relaxed">{question.explanation}</p>
                </div>

                {/* Trap explanation */}
                {selected !== question.correct && question.trap_explanations?.[selected] && (
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Why {selected} is tempting</p>
                    <p className="text-sm text-amber-800 leading-relaxed">{question.trap_explanations[selected]}</p>
                  </div>
                )}

                {/* AI Feedback */}
                {feedbackLoading && (
                  <div className="flex items-center gap-2 text-sm text-[#888]">
                    <div className="w-4 h-4 border-2 border-[#1a3557] border-t-transparent rounded-full animate-spin" />
                    Getting tutor tip...
                  </div>
                )}
                {feedback && (
                  <div className="bg-[#eef3f9] rounded-xl p-4 border border-[#d0dff0]">
                    <p className="text-xs font-bold text-[#1a3557] uppercase tracking-wide mb-2">💡 Tutor Tip</p>
                    <p className="text-sm text-[#1a3557] leading-relaxed">{feedback}</p>
                  </div>
                )}

                {/* Next button */}
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

      {/* Question nav dots */}
      <div className="bg-white border-t border-[#e0e0d8] px-6 py-3 flex items-center justify-center gap-2">
        {Array.from({ length: total }).map((_, idx) => (
          <div
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              idx + 1 < questionNum ? 'bg-[#1a3557]' :
              idx + 1 === questionNum ? 'bg-[#1a3557] ring-2 ring-[#1a3557] ring-offset-2' :
              'bg-[#ddd]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}