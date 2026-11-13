import { useState } from 'react'

/**
 * UrlForm Component
 * Renders the long-URL input field, "Shorten URL" submit button,
 * and performs frontend validation.
 */
function UrlForm({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('')
  const [validationError, setValidationError] = useState('')

  const validateUrl = (value) => {
    const trimmed = value.trim()
    if (!trimmed) {
      return 'Please enter a URL to shorten.'
    }

    const urlStarts = trimmed.match(/https?:\/\//gi) || []
    if (urlStarts.length > 1) {
      return "Please enter only one URL per submission."
    }

    try {
      const parsed = new URL(trimmed)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return 'Please enter a valid URL starting with http:// or https://'
      }
      if (!parsed.hostname || !parsed.hostname.includes('.')) {
        return 'Please enter a valid URL with a valid domain name.'
      }
    } catch {
      return 'Please enter a valid URL starting with http:// or https://'
    }

    return ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setValidationError('')

    const error = validateUrl(url)
    if (error) {
      setValidationError(error)
      return
    }

    onSubmit(url.trim())
  }

  const handleChange = (e) => {
    setUrl(e.target.value)
    if (validationError) {
      setValidationError('')
    }
  }

  return (
    <form className="url-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label htmlFor="long-url-input" className="visually-hidden">
          Long URL to shorten
        </label>
        <input
          id="long-url-input"
          type="url"
          className={`url-input ${validationError ? 'input-error' : ''}`}
          placeholder="https://example.com/long-page-address"
          value={url}
          onChange={handleChange}
          disabled={isLoading}
          aria-invalid={!!validationError}
          aria-describedby={validationError ? 'url-validation-error' : undefined}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </div>

      {validationError && (
        <div id="url-validation-error" className="field-error" role="alert">
          {validationError}
        </div>
      )}
    </form>
  )
}

export default UrlForm
