import ServiceCard from '../components/ServiceCard'
import services from '../lib/serviceCatalog'

function Services({ searchTerm = '' }) {
	const searchQuery = searchTerm.trim().toLowerCase()
	const filteredServices = services.filter((service) =>
		`${service.name} ${service.description}`.toLowerCase().includes(searchQuery),
	)

	return (
		<main className="min-w-0 flex-1 bg-slate-50 p-6 sm:p-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-7">
					<p className="text-sm font-medium text-teal-700">Laundry management</p>
					<h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
						Services &amp; prices
					</h1>
					<p className="mt-2 text-sm text-slate-500">
						{searchQuery
							? `Services matching “${searchTerm.trim()}”.`
							: 'Explore laundry services and their starting prices.'}
					</p>
				</div>

				<section
					className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
					aria-label="Laundry services and prices"
				>
					{filteredServices.map((service) => (
						<ServiceCard key={service.name} {...service} />
					))}
				</section>
				{filteredServices.length === 0 && (
					<p className="mt-4 rounded-xl border border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-500">
						No services match your search.
					</p>
				)}

				<p className="mt-5 text-xs leading-5 text-slate-500">
					Prices shown are starter rates in INR. Final prices may vary by garment,
					fabric, and service requirements.
				</p>
			</div>
		</main>
	)
}

export default Services