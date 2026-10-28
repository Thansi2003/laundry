import ServiceCard from '../components/ServiceCard'

const services = [
	{
		name: 'Wash & Fold',
		description: 'Everyday laundry washed, dried, and neatly folded.',
		price: 1.75,
		unit: 'lb',
		featured: true,
	},
	{
		name: 'Express Wash & Fold',
		description: 'Priority wash-and-fold service for a faster turnaround.',
		price: 2.5,
		unit: 'lb',
	},
	{
		name: 'Dry Cleaning',
		description: 'Professional garment cleaning with careful finishing.',
		price: 5,
		unit: 'item',
	},
	{
		name: 'Ironing',
		description: 'Pressed and ready-to-wear garments, finished by the item.',
		price: 2,
		unit: 'item',
	},
	{
		name: 'Bedding',
		description: 'Fresh cleaning for bedding, comforters, and linens.',
		price: 18,
		unit: 'set',
	},
]

function Services() {
	return (
		<main className="min-w-0 flex-1 bg-slate-50 p-6 sm:p-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-7">
					<p className="text-sm font-medium text-teal-700">Laundry management</p>
					<h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
						Services &amp; prices
					</h1>
					<p className="mt-2 text-sm text-slate-500">
						Explore laundry services and their starting prices.
					</p>
				</div>

				<section
					className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
					aria-label="Laundry services and prices"
				>
					{services.map((service) => (
						<ServiceCard key={service.name} {...service} />
					))}
				</section>

				<p className="mt-5 text-xs leading-5 text-slate-500">
					Prices shown are starter rates in INR. Final prices may vary by garment,
					fabric, and service requirements.
				</p>
			</div>
		</main>
	)
}

export default Services