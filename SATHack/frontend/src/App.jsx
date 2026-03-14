import { useState } from 'react'
import Quiz from './components/Quiz'
import Results from './components/Results'
import Start from './components/Start'

export default function App() {
  const [screen, setScreen] = useState('start') // start | quiz | results
  const [results, setResults] = useState([])
  const [totalQuestions] = useState(5)

  function handleFinish(resultData) {
    setResults(resultData)
    setScreen('results')
  }

  function handleRestart() {
    setResults([])
    setScreen('start')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-sans">
      {screen === 'start' && (
        <Start onStart={() => setScreen('quiz')} total={totalQuestions} />
      )}
      {screen === 'quiz' && (
        <Quiz total={totalQuestions} onFinish={handleFinish} />
      )}
      {screen === 'results' && (
        <Results results={results} onRestart={handleRestart} />
      )}
    </div>
  )
}