export default function Start({ onStart }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* 1. TOP BAR: Exact copy of Quiz.jsx height and padding */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-[#1a3557] font-bold text-sm">SAT Practice</span>
          <span className="text-gray-300 hidden md:inline">|</span>
          <span className="text-gray-500 text-sm hidden md:inline">Reading & Writing</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-blue-50 text-[#1a3557] text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-blue-100">
            Wayzata Inventors Club
          </span>
        </div>
      </div>

      {/* 2. PROGRESS BAR: Using the same height (h-1) and background as the Quiz */}
      <div className="h-1 bg-gray-200">
        <div className="h-1 bg-[#1a3557] transition-all duration-500 w-1/12" />
      </div>

      {/* 3. MAIN CONTENT: Centered container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-2xl">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <div className="inline-block bg-[#1a3557] text-white px-3 py-1 rounded text-[10px] font-bold tracking-[0.2em] uppercase mb-5">
              Digital SAT Prep
            </div>
            {/* Serif font used here to match the Quiz passages */}
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a3557] tracking-tight mb-4">
              Reading & Writing
            </h1>
            <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
              AI-generated questions modeled on the Digital SAT, using real public domain passages.
            </p>
          </div>

          {/* 4. MODE CARDS: Using the Quiz-style card logic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            
            {/* Quick Practice Card */}
            <button
              onClick={() => onStart('practice')}
              className="group bg-white border-2 border-gray-200 hover:border-[#1a3557] rounded-xl p-6 text-left transition-all duration-200 shadow-sm hover:shadow-md flex flex-col"
            >
              <div className="text-2xl mb-4">⚡</div>
              <h2 className="text-[#1a3557] font-bold text-lg mb-1">Quick Practice</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                5 questions with instant AI feedback and explanations after each one.
              </p>
              <div className="bg-blue-50 text-[#1a3557] group-hover:bg-[#1a3557] group-hover:text-white font-bold text-xs py-3 rounded-lg text-center uppercase tracking-widest transition-all">
                Start Practice →
              </div>
            </button>

            {/* Full Test Card */}
            <button
              onClick={() => onStart('fulltest')}
              className="group bg-white border-2 border-gray-200 hover:border-[#1a3557] rounded-xl p-6 text-left transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 bg-[#f0b429] text-[#0f1f3d] text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase">
                New
              </div>
              <div className="text-2xl mb-4">📋</div>
              <h2 className="text-[#1a3557] font-bold text-lg mb-1">Full Length Test</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                54 questions across 2 timed modules. Scored out of 800 just like the real SAT.
              </p>
              <div className="bg-gray-100 text-gray-400 font-bold text-xs py-3 rounded-lg text-center uppercase tracking-widest group-hover:bg-[#1a3557] group-hover:text-white transition-all">
                Start Full Test →
              </div>
            </button>
          </div>

          {/* 5. QUESTION TYPES: Styled like the badges in the Quiz */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">
              Covers All Official SAT Question Domains
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'Words in Context', 'Text Structure', 'Transitions',
                'Inferences', 'Command of Evidence', 'Boundaries'
              ].map((type) => (
                <span key={type} className="bg-gray-50 text-gray-600 text-[11px] px-3 py-1 rounded-full border border-gray-200 font-medium">
                  {type}
                </span>
              ))}
              <span className="text-gray-300 text-[11px] px-3 py-1">+ 5 more</span>
            </div>
          </div>

        </div>
      </div>

      {/* 6. FOOTER: Simplified to keep the focus on the UI */}
      <footer className="bg-white border-t border-gray-200 py-6 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <img src="/wayzata.png" alt="Wayzata" className="h-8 w-8 object-contain opacity-50" />
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter text-center">
            Wayzata Inventors Club <span className="mx-2 text-gray-200">|</span> 2026
          </p>
          <img src="/inventors.png" alt="Inventors Club" className="h-8 w-8 object-contain opacity-50" />
        </div>
      </footer>
    </div>
  );
}