export function LoadingIndicator() {
  return <div className="loading-indicator">
    <div className="loading-indicator-msg">
      <div className="loading-indicator-msg-text">
        <span className="fa fa-circle-notch fa-spin me-1" />
        Loading...
      </div>
    </div>
  </div>
}