export default function Start({ onStart, total }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
      <div className="max-w-lg w-full mx-4">

        {/* Logo / Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-[#1a3557] text-white px-4 py-1 rounded text-xs font-bold tracking-widest uppercase mb-4">
            SAT Prep
          </div>
          <h1 className="text-4xl font-bold text-[#1a3557] mb-3 tracking-tight">
            Reading & Writing
          </h1>
          <p className="text-[#555] text-base leading-relaxed">
            Practice with real questions modeled on the Digital SAT,
            powered by public domain literature.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Questions', value: total },
            { label: 'Question Types', value: '7' },
            { label: 'AI Feedback', value: '✓' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-[#e8e8e0]">
              <div className="text-2xl font-bold text-[#1a3557]">{value}</div>
              <div className="text-xs text-[#888] mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Question types */}
        <div className="bg-white rounded-xl p-5 mb-8 shadow-sm border border-[#e8e8e0]">
          <p className="text-xs font-bold text-[#888] uppercase tracking-widest mb-3">Question Types</p>
          <div className="flex flex-wrap gap-2">
            {['Word Choice', 'Transitions', 'Central Idea', 'Inference', 'Vocab in Context', 'Text Structure', 'Grammar'].map(t => (
              <span key={t} className="bg-[#eef3f9] text-[#1a3557] text-xs px-3 py-1 rounded-full font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="w-full bg-[#1a3557] hover:bg-[#142a45] text-white font-bold py-4 rounded-xl text-base transition-colors duration-150 shadow-sm"
        >
          Start Practice Test →
        </button>

        <p className="text-center text-xs text-[#aaa] mt-4">
          Passages sourced from public domain literature
        </p>
      </div>
    </div>
  )
}