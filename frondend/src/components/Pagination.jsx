import { ChevronLeft, ChevronRight } from 'lucide-react'

function getVisiblePages(currentPage, totalPages) {
	if (totalPages <= 5) {
		return Array.from({ length: totalPages }, (_, index) => index + 1)
	}

	if (currentPage <= 3) return [1, 2, 3, 4, 'ellipsis', totalPages]
	if (currentPage >= totalPages - 2) {
		return [1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
	}

	return [1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages]
}

function Pagination({ currentPage, pageSize, totalItems, onPageChange }) {
	const totalPages = Math.ceil(totalItems / pageSize)

	if (totalPages <= 1) return null

	const startItem = (currentPage - 1) * pageSize + 1
	const endItem = Math.min(currentPage * pageSize, totalItems)
	const pages = getVisiblePages(currentPage, totalPages)

	return (
		<nav
			className="mt-4 flex flex-wrap items-center justify-between gap-3"
			aria-label="Pagination"
		>
			<p className="text-sm text-slate-500" aria-live="polite">
				Showing <span className="font-medium text-slate-700">{startItem}–{endItem}</span> of{' '}
				<span className="font-medium text-slate-700">{totalItems}</span>
			</p>
			<div className="flex items-center gap-1">
				<button
					className="grid size-9 place-items-center rounded-lg border border-slate-300 text-slate-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
					type="button"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					aria-label="Previous page"
				>
					<ChevronLeft size={18} aria-hidden="true" />
				</button>
				{pages.map((page, index) =>
					page === 'ellipsis' ? (
						<span className="px-1 text-slate-400" key={`ellipsis-${index}`} aria-hidden="true">
							…
						</span>
					) : (
						<button
							className={`grid size-9 place-items-center rounded-lg text-sm font-medium ${
								page === currentPage
									? 'bg-teal-700 text-white'
									: 'border border-slate-300 text-slate-600 hover:bg-white'
							}`}
							type="button"
							key={page}
							onClick={() => onPageChange(page)}
							aria-label={`Page ${page}`}
							aria-current={page === currentPage ? 'page' : undefined}
						>
							{page}
						</button>
					),
				)}
				<button
					className="grid size-9 place-items-center rounded-lg border border-slate-300 text-slate-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
					type="button"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					aria-label="Next page"
				>
					<ChevronRight size={18} aria-hidden="true" />
				</button>
			</div>
		</nav>
	)
}

export default Pagination