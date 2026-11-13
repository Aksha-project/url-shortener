import { useState } from 'react'
import UrlForm from './components/UrlForm'
import ResultCard from './components/ResultCard'
import ErrorAlert from './components/ErrorAlert'
import { shortenUrl } from './api/urlApi'
import './App.css'

function App() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleShortenUrl = async (originalUrl) => {
    setIsLoading(true)
    setServerError('')
    setResult(null)

    try {
      // NOTE: Using client-side mock service until backend integration (Phase 7).
      const response = await shortenUrl(originalUrl)
      setResult(response)
    } catch (err) {
      setServerError(
        err.message || 'Unable to shorten URL. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setServerError('')
  }

  return (
    <main className="app-card">
      <header className="app-header">
        <h1 className="app-title">URL Shortener</h1>
        <p className="app-subtitle">
          Enter a long URL to generate a short, shareable link.
        </p>
      </header>

      <UrlForm onSubmit={handleShortenUrl} isLoading={isLoading} />

      <ErrorAlert
        message={serverError}
        onDismiss={() => setServerError('')}
      />

      {result && (
        <ResultCard result={result} onReset={handleReset} />
      )}
    </main>
  )
}

export default App
