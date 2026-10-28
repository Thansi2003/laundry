const statusStyles = {
	pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
	'in progress': 'bg-blue-50 text-blue-700 ring-blue-600/20',
	ready: 'bg-teal-50 text-teal-700 ring-teal-600/20',
	completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
	cancelled: 'bg-rose-50 text-rose-700 ring-rose-600/20',
}

function formatStatus(status) {
	const normalized = String(status || 'Pending')
		.trim()
		.replace(/[_-]+/g, ' ')
		.replace(/\s+/g, ' ')

	return normalized.replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function StatuseBadge({ status = 'Pending' }) {
	const label = formatStatus(status)
	const style = statusStyles[label.toLowerCase()] ?? 'bg-slate-100 text-slate-700 ring-slate-600/20'

	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${style}`}
		>
			{label}
		</span>
	)
}

export default StatuseBadge