export function ConfirmDialog ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false
}) {
  if (!open) {
    return null
  }

  return (
    <div className="dialog-overlay" role="presentation">
      <div className="dialog-card" role="dialog" aria-modal="true" aria-label={title}>
        <h4>{title}</h4>
        <p>{message}</p>
        <div className="action-row">
          <button type="button" className="btn ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button type="button" className="btn danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
