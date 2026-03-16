import { useState } from 'react'
import Quiz from './components/Quiz'
import Results from './components/Results'
import Start from './components/Start'
import FullTest from './components/FullTest'
import ScoreReport from './components/ScoreReport'

export default function App() {
  const [screen, setScreen] = useState('start')
  const [results, setResults] = useState([])

  function handleFinishPractice(resultData) {
    setResults(resultData)
    setScreen('results')
  }

  function handleFinishFullTest(resultData) {
    setResults(resultData)
    setScreen('scorereport')
  }

  function handleRestart() {
    setResults([])
    setScreen('start')
  }

  function handleStart(mode) {
    setScreen(mode === 'fulltest' ? 'fulltest' : 'quiz')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-sans">
      {screen === 'start'      && <Start onStart={handleStart} />}
      {screen === 'quiz'       && <Quiz total={5} onFinish={handleFinishPractice} />}
      {screen === 'results'    && <Results results={results} onRestart={handleRestart} />}
      {screen === 'fulltest'   && <FullTest onFinish={handleFinishFullTest} />}
      {screen === 'scorereport'&& <ScoreReport results={results} onRestart={handleRestart} />}
    </div>
  )
}