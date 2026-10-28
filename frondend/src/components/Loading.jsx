function Loading({ message = 'Loading page…' }) {
	return (
		<div
			className="flex min-h-64 flex-1 items-center justify-center bg-slate-50 p-8"
			role="status"
			aria-live="polite"
			aria-busy="true"
		>
			<div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
				<span
					className="size-5 animate-spin rounded-full border-2 border-slate-200 border-t-teal-700 motion-reduce:animate-none"
					aria-hidden="true"
				/>
				<span>{message}</span>
			</div>
		</div>
	)
}

export default Loading