/**
 * ErrorAlert Component
 * Accessible inline error alert banner for server and operational failures.
 */
function ErrorAlert({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="error-alert" role="alert" aria-live="assertive">
      <span className="error-message">{message}</span>
      {onDismiss && (
        <button
          type="button"
          className="error-dismiss-btn"
          onClick={onDismiss}
          aria-label="Dismiss error message"
        >
          &times;
        </button>
      )}
    </div>
  )
}

export default ErrorAlert
