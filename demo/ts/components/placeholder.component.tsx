export function Placeholder({ icon, title, description }: Readonly<{ icon: string, title: string, description: string }>) {
  return <div className="rosie-empty-state demo-placeholder">
    <div className="rosie-empty-state-icon"><i className={`rosie-icon rosie-icon-${icon}`} /></div>
    <div className="rosie-empty-state-title">{title}</div>
    <div className="rosie-empty-state-description">{description}</div>
  </div>
}
