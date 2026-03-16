import { useState } from 'react'

// SAT R&W score conversion table (raw score 0-54 → scaled 200-800)
const SCORE_TABLE = {
  0: 200, 1: 200, 2: 210, 3: 220, 4: 230, 5: 240, 6: 250, 7: 260, 8: 270,
  9: 280, 10: 290, 11: 300, 12: 310, 13: 320, 14: 330, 15: 340, 16: 350,
  17: 360, 18: 370, 19: 380, 20: 390, 21: 400, 22: 410, 23: 420, 24: 430,
  25: 440, 26: 450, 27: 460, 28: 470, 29: 480, 30: 490, 31: 500, 32: 510,
  33: 520, 34: 530, 35: 540, 36: 550, 37: 560, 38: 570, 39: 580, 40: 590,
  41: 600, 42: 620, 43: 630, 44: 640, 45: 650, 46: 670, 47: 690, 48: 710,
  49: 730, 50: 750, 51: 770, 52: 780, 53: 790, 54: 800,
}

const TYPE_LABELS = {
  WORDS_IN_CONTEXT: 'Words in Context',
  TEXT_PURPOSE: 'Text Purpose',
  TEXT_STRUCTURE: 'Text Structure',
  MAIN_IDEA: 'Central Ideas',
  DETAIL: 'Details',
  COMMAND_OF_EVIDENCE: 'Command of Evidence',
  INFERENCES: 'Inferences',
  RHETORICAL_SYNTHESIS: 'Rhetorical Synthesis',
  TRANSITIONS: 'Transitions',
  BOUNDARIES: 'Boundaries',
  FORM_STRUCTURE_SENSE: 'Form & Structure',
  QUOTATION_EVIDENCE: 'Command of Evidence',
  CROSS_TEXT_CONNECTIONS: 'Cross-Text Connections',
  // legacy
  WORD_CHOICE: 'Words in Context',
  TRANSITION: 'Transitions',
  STANDARD_ENGLISH: 'Standard English',
}

function getScoreColor(score) {
  if (score >= 700) return 'text-green-600'
  if (score >= 550) return 'text-blue-600'
  if (score >= 400) return 'text-yellow-600'
  return 'text-red-500'
}

function getScoreBg(score) {
  if (score >= 700) return 'bg-green-50 border-green-200'
  if (score >= 550) return 'bg-blue-50 border-blue-100'
  if (score >= 400) return 'bg-yellow-50 border-yellow-200'
  return 'bg-red-50 border-red-200'
}

function getScoreLabel(score) {
  if (score >= 750) return 'Exceptional'
  if (score >= 650) return 'Strong'
  if (score >= 550) return 'Solid'
  if (score >= 450) return 'Developing'
  return 'Needs Work'
}

export default function ScoreReport({ results, onRestart }) {
  const rawScore = results.filter(r => r.isCorrect).length
  const total = results.length
  const scaledScore = SCORE_TABLE[Math.min(rawScore, 54)] || 200
  const pct = Math.round((rawScore / total) * 100)

  // Module breakdown
  const mod1 = results.filter(r => r.module === 1)
  const mod2 = results.filter(r => r.module === 2)
  const mod1Score = mod1.filter(r => r.isCorrect).length
  const mod2Score = mod2.filter(r => r.isCorrect).length

  // By question type
  const byType = {}
  results.forEach(r => {
    const type = r.question?.type || 'Unknown'
    const label = TYPE_LABELS[type] || type
    if (!byType[label]) byType[label] = { correct: 0, total: 0 }
    byType[label].total++
    if (r.isCorrect) byType[label].correct++
  })

  const typeEntries = Object.entries(byType)
    .map(([label, data]) => ({ label, ...data, pct: Math.round((data.correct / data.total) * 100) }))
    .sort((a, b) => b.pct - a.pct)

  const strengths = typeEntries.filter(t => t.pct >= 70 && t.total >= 2)
  const weaknesses = typeEntries.filter(t => t.pct < 60 && t.total >= 2)

  const [showAllQ, setShowAllQ] = useState(false)
  const displayResults = showAllQ ? results : results.filter(r => !r.isCorrect)

  return (
    <div className="min-h-screen bg-[#0f1f3d]">

      {/* Header */}
      <div className="bg-[#0f1f3d] px-4 py-8 text-center border-b border-white/10">
        <span className="bg-[#f0b429] text-[#0f1f3d] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
          Score Report
        </span>
        <h1 className="text-white font-black text-3xl md:text-4xl mt-4 mb-1">SAT Reading & Writing</h1>
        <p className="text-[#93a8c8] text-sm">Full Length Practice Test</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Score card */}
        <div className={`rounded-2xl border p-8 text-center ${getScoreBg(scaledScore)} bg-white`}>
          <p className="text-gray-500 text-sm font-medium mb-2">Estimated SAT Score</p>
          <div className={`text-7xl font-black mb-2 ${getScoreColor(scaledScore)}`}>{scaledScore}</div>
          <p className="text-gray-500 text-sm mb-1">out of 800</p>
          <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
            scaledScore >= 700 ? 'bg-green-100 text-green-700' :
            scaledScore >= 550 ? 'bg-blue-100 text-blue-700' :
            scaledScore >= 450 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-600'
          }`}>
            {getScoreLabel(scaledScore)}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Raw Score', value: `${rawScore}/${total}`, color: 'text-white' },
            { label: 'Accuracy', value: `${pct}%`, color: pct >= 70 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400' },
            { label: 'Module 1', value: `${mod1Score}/27`, color: 'text-blue-400' },
            { label: 'Module 2', value: `${mod2Score}/27`, color: 'text-blue-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-[#93a8c8] text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strengths.length > 0 && (
            <div className="bg-green-900/20 border border-green-500/20 rounded-2xl p-5">
              <h3 className="text-green-400 font-bold text-sm uppercase tracking-wide mb-3">💪 Strengths</h3>
              <div className="space-y-2">
                {strengths.slice(0, 4).map(t => (
                  <div key={t.label} className="flex items-center justify-between">
                    <span className="text-white text-sm">{t.label}</span>
                    <span className="text-green-400 font-bold text-sm">{t.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {weaknesses.length > 0 && (
            <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-5">
              <h3 className="text-red-400 font-bold text-sm uppercase tracking-wide mb-3">📈 Focus Areas</h3>
              <div className="space-y-2">
                {weaknesses.slice(0, 4).map(t => (
                  <div key={t.label} className="flex items-center justify-between">
                    <span className="text-white text-sm">{t.label}</span>
                    <span className="text-red-400 font-bold text-sm">{t.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* By question type */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-white font-bold mb-4">Performance by Question Type</h3>
          <div className="space-y-3">
            {typeEntries.map(t => (
              <div key={t.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">{t.label}</span>
                  <span className="text-[#93a8c8]">{t.correct}/{t.total}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      t.pct >= 70 ? 'bg-green-400' :
                      t.pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question review */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-white font-bold">Question Review</h3>
            <button
              onClick={() => setShowAllQ(v => !v)}
              className="text-[#93a8c8] text-xs hover:text-white transition-colors"
            >
              {showAllQ ? 'Show incorrect only' : 'Show all questions'}
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {displayResults.map((r, idx) => (
              <div key={idx} className={`px-5 py-4 ${r.isCorrect ? '' : 'bg-red-900/10'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    r.isCorrect ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
                  }`}>
                    {r.isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[#93a8c8] text-xs">Q{r.globalIndex + 1}</span>
                      <span className="text-[#93a8c8] text-xs">·</span>
                      <span className="text-[#93a8c8] text-xs">{TYPE_LABELS[r.question?.type] || r.question?.type}</span>
                      {!r.isCorrect && (
                        <>
                          <span className="text-[#93a8c8] text-xs">·</span>
                          <span className="text-red-400 text-xs">You: {r.userAnswer || '—'} → Correct: {r.question?.correct}</span>
                        </>
                      )}
                    </div>
                    <p className="text-white text-sm leading-relaxed line-clamp-2">{r.question?.question}</p>
                    {!r.isCorrect && r.question?.explanation && (
                      <p className="text-[#93a8c8] text-xs mt-2 leading-relaxed">{r.question.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pb-8">
          <button
            onClick={onRestart}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-sm transition-colors border border-white/10"
          >
            ← Back to Home
          </button>
          <button
            onClick={onRestart}
            className="bg-[#f0b429] hover:bg-[#f5c842] text-[#0f1f3d] font-bold py-3 rounded-xl text-sm transition-colors"
          >
            Take Another Test →
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 py-5">
          <div className="flex items-center justify-between">
            <img src="/wayzata.png" alt="Wayzata" className="h-10 w-10 object-contain opacity-60" />
            <p className="text-[#93a8c8] text-xs text-center">
              Made by <span className="text-white font-semibold">Wayzata Inventors Club</span>
            </p>
            <img src="/inventors.png" alt="Inventors Club" className="h-10 w-10 object-contain opacity-60" />
          </div>
        </div>

      </div>
    </div>
  )
}