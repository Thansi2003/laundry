import { BedDouble, Shirt, Sparkles, Wind } from 'lucide-react'

const serviceIcons = {
	'Wash & Fold': Wind,
	'Express Wash & Fold': Sparkles,
	'Dry Cleaning': Shirt,
	Ironing: Shirt,
	Bedding: BedDouble,
}

function ServiceCard({ name, description, price, unit, featured = false }) {
	const Icon = serviceIcons[name] ?? Shirt
	const formattedPrice = new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
	}).format(price)

	return (
		<article
			className={`flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm ${
				featured ? 'border-teal-300 ring-1 ring-teal-100' : 'border-slate-200'
			}`}
		>
			<div className="mb-5 flex items-start justify-between gap-3">
				<span className="grid size-11 place-items-center rounded-xl bg-teal-50 text-teal-700">
					<Icon size={21} aria-hidden="true" />
				</span>
				{featured && (
					<span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
						Popular
					</span>
				)}
			</div>

			<h2 className="text-lg font-semibold text-slate-900">{name}</h2>
			<p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{description}</p>

			<div className="mt-5 border-t border-slate-100 pt-4">
				<p className="text-2xl font-bold tracking-tight text-slate-900">
					{formattedPrice}
					<span className="ml-1 text-sm font-medium text-slate-500">/ {unit}</span>
				</p>
			</div>
		</article>
	)
}

export default ServiceCard