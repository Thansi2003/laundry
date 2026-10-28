import { Search, X } from 'lucide-react'

function SearchBar({ value, onChange, placeholder = 'Search…', label = 'Search' }) {
	return (
		<div className="relative w-full sm:max-w-sm">
			<label className="sr-only" htmlFor="list-search">
				{label}
			</label>
			<Search
				className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
				size={18}
				aria-hidden="true"
			/>
			<input
				className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
				id="list-search"
				type="search"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
			/>
			{value && (
				<button
					className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
					type="button"
					onClick={() => onChange('')}
					aria-label="Clear search"
				>
					<X size={16} aria-hidden="true" />
				</button>
			)}
		</div>
	)
}

export default SearchBar