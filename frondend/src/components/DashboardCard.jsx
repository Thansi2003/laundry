function DashboardCard({ title, value, description, icon: Icon, tone = 'teal' }) {
	const toneClasses = {
		teal: 'bg-teal-50 text-teal-700',
		blue: 'bg-blue-50 text-blue-700',
		amber: 'bg-amber-50 text-amber-700',
		violet: 'bg-violet-50 text-violet-700',
	}

	return (
		<article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-sm font-medium text-slate-500">{title}</p>
					<p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
						{value}
					</p>
				</div>
				{Icon && (
					<span
						className={`grid size-11 shrink-0 place-items-center rounded-xl ${
							toneClasses[tone] ?? toneClasses.teal
						}`}
					>
						<Icon size={21} aria-hidden="true" />
					</span>
				)}
			</div>
			<p className="mt-4 text-sm text-slate-500">{description}</p>
		</article>
	)
}

export default DashboardCard