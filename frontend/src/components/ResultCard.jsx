import { useState } from 'react'

/**
 * ResultCard Component
 * Displays the mock short URL and short code, with explicit labeling
 * indicating that redirect functionality will activate once the backend is integrated.
 */
function ResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)

  if (!result) return null

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(result.shortUrl)
      } else {
        // Fallback for environments where clipboard API is restricted
        const tempTextArea = document.createElement('textarea')
        tempTextArea.value = result.shortUrl
        tempTextArea.style.position = 'fixed'
        tempTextArea.style.opacity = '0'
        document.body.appendChild(tempTextArea)
        tempTextArea.select()
        document.execCommand('copy')
        document.body.removeChild(tempTextArea)
      }
      setCopied(true)
      setCopyError(false)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError(true)
      setTimeout(() => setCopyError(false), 3000)
    }
  }

  return (
    <section className="result-card" aria-live="polite">
      {/* Explicit disclaimer that redirect depends on backend integration */}
      <div className="demo-notice" role="note">
        <strong>Short link</strong> — redirect functionality will work after backend integration.
      </div>

      <div className="result-header">
        <div className="short-code-tag">
          <span className="code-label">Short Code:</span>
          <code className="code-value">{result.shortCode}</code>
        </div>
        <button
          type="button"
          className="btn-text-reset"
          onClick={onReset}
        >
          Shorten another URL
        </button>
      </div>

      <div className="result-row">
        <div className="result-url-wrapper">
          <span className="result-label">Short URL:</span>
          <code className="result-display-url" title={result.shortUrl}>
            {result.shortUrl}
          </code>
        </div>
        <button
          type="button"
          className={`btn-secondary ${copied ? 'btn-copied' : ''}`}
          onClick={handleCopy}
          aria-label={copied ? 'Demo short URL copied to clipboard' : 'Copy demo short URL to clipboard'}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {result.originalUrl && (
        <div className="original-url-row">
          <span className="original-label">Original:</span>
          <span className="original-url-text" title={result.originalUrl}>
            {result.originalUrl}
          </span>
        </div>
      )}

      {copyError && (
        <p className="copy-error-hint" role="alert">
          Could not copy automatically. Please copy the link manually.
        </p>
      )}
    </section>
  )
}

export default ResultCard
