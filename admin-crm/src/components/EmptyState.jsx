export function EmptyState ({ title, message, action }) {
  return (
    <div className="empty-state">
      <h4>{title}</h4>
      <p>{message}</p>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
