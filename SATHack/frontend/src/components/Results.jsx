export default function Results({ results, onRestart }) {
  const score = results.filter(r => r.isCorrect).length
  const total = results.length
  const pct = Math.round((score / total) * 100)
  const avgTime = Math.round(results.reduce((a, r) => a + (r.timeSpent || 0), 0) / total)

  const scoreColor =
    pct >= 80 ? 'text-green-600' :
    pct >= 60 ? 'text-yellow-600' :
    'text-red-500'

  const scoreBg =
    pct >= 80 ? 'bg-green-50 border-green-200' :
    pct >= 60 ? 'bg-yellow-50 border-yellow-200' :
    'bg-red-50 border-red-200'

  const scoreMsg =
    pct >= 80 ? 'Excellent work! You\'re ready for test day.' :
    pct >= 60 ? 'Good effort — keep practicing!' :
    'Review the explanations and try again.'

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="min-h-screen bg-[#f5f5f0] py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-[#1a3557] text-white px-4 py-1 rounded text-xs font-bold tracking-widest uppercase mb-4">
            Results
          </div>
          <h1 className="text-3xl font-bold text-[#1a3557] mb-2">Practice Complete</h1>
          <p className="text-[#888]">Here's how you did</p>
        </div>

        {/* Score card */}
        <div className={`rounded-2xl border p-8 mb-6 text-center ${scoreBg}`}>
          <div className={`text-6xl font-bold mb-2 ${scoreColor}`}>{pct}%</div>
          <div className="text-[#555] text-lg mb-1">{score} out of {total} correct</div>
          <div className="text-[#888] text-sm">{scoreMsg}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Correct', value: score, color: 'text-green-600' },
            { label: 'Incorrect', value: total - score, color: 'text-red-500' },
            { label: 'Avg Time', value: formatTime(avgTime), color: 'text-[#1a3557]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-[#e8e8e0]">
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-[#888] mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Question breakdown */}
        <div className="bg-white rounded-2xl border border-[#e8e8e0] overflow-hidden mb-6 shadow-sm">
          <div className="px-5 py-4 border-b border-[#e8e8e0]">
            <h2 className="font-bold text-[#1a3557] text-sm uppercase tracking-wide">Question Breakdown</h2>
          </div>
          {results.map((r, idx) => (
            <div key={idx} className={`px-5 py-4 border-b border-[#f0f0e8] last:border-0 ${r.isCorrect ? '' : 'bg-red-50/40'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    r.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {r.isCorrect ? '✓' : '✗'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">Q{idx + 1}: {r.question.type.replace('_', ' ')}</p>
                    <p className="text-xs text-[#888] mt-0.5 line-clamp-1">{r.question.question}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xs font-bold ${r.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {r.isCorrect ? `You: ${r.userAnswer}` : `You: ${r.userAnswer} → ${r.question.correct}`}
                  </div>
                  <div className="text-xs text-[#aaa] mt-0.5">{formatTime(r.timeSpent || 0)}</div>
                </div>
              </div>

              {/* Show explanation for wrong answers */}
              {!r.isCorrect && (
                <div className="mt-3 ml-10 text-xs text-[#666] leading-relaxed bg-white rounded-lg p-3 border border-[#eee]">
                  <span className="font-semibold text-[#1a3557]">Correct ({r.question.correct}):</span>{' '}
                  {r.question.choices[r.question.correct]}
                  <br />
                  <span className="text-[#888] mt-1 block">{r.question.explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Restart */}
        <button
          onClick={onRestart}
          className="w-full bg-[#1a3557] hover:bg-[#142a45] text-white font-bold py-4 rounded-xl text-base transition-colors"
        >
          Practice Again →
        </button>
      </div>
    </div>
  )
}