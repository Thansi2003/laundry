import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import services from '../lib/serviceCatalog'
import { Search, X } from 'lucide-react'

function SearchBar({ value, onChange, placeholder = 'Search…', label = 'Search' }) {
	const navigate = useNavigate()
	const [isOpen, setIsOpen] = useState(false)
	const [customers, setCustomers] = useState([])
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const query = value.trim().toLowerCase()

	useEffect(() => {
		if (!isOpen || query.length < 2) return undefined

		let active = true
		const timeoutId = window.setTimeout(async () => {
			setLoading(true)
			setError('')

			const [customerResult, orderResult] = await Promise.allSettled([
				api.get('/api/customers'),
				api.get('/api/orders'),
			])

			if (!active) return

			if (customerResult.status === 'fulfilled') {
				setCustomers(Array.isArray(customerResult.value.data) ? customerResult.value.data : [])
			} else {
				setCustomers([])
			}

			if (orderResult.status === 'fulfilled') {
				setOrders(Array.isArray(orderResult.value.data) ? orderResult.value.data : [])
			} else {
				setOrders([])
			}

			setError(
				customerResult.status === 'rejected' || orderResult.status === 'rejected'
					? 'Some search results could not be loaded.'
					: '',
			)
			setLoading(false)
		}, 250)

		return () => {
			active = false
			window.clearTimeout(timeoutId)
		}
	}, [isOpen, query])

	const results = useMemo(() => {
		if (query.length < 2) return { customers: [], orders: [], services: [] }

		return {
			customers: customers
				.filter((customer) =>
					`${customer.name ?? ''} ${customer.fullName ?? ''} ${customer.email ?? ''} ${customer.phone ?? ''}`
						.toLowerCase()
						.includes(query),
				)
				.slice(0, 4),
			orders: orders
				.filter((order) =>
					`${order.customerName ?? ''} ${order.service ?? ''}`
						.toLowerCase()
						.includes(query),
				)
				.slice(0, 4),
			services: services
				.filter((service) =>
					`${service.name} ${service.description}`.toLowerCase().includes(query),
				)
				.slice(0, 4),
		}
	}, [customers, orders, query])

	const hasResults =
		results.customers.length > 0 ||
		results.orders.length > 0 ||
		results.services.length > 0

	function openResults(path) {
		setIsOpen(false)
		navigate(path)
	}

	return (
		<div className="relative w-full">
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
				onChange={(event) => {
					const nextValue = event.target.value
					onChange(nextValue)
					if (nextValue.trim().length < 2) {
						setLoading(false)
						setError('')
					}
					setIsOpen(true)
				}}
				onFocus={() => setIsOpen(true)}
				onBlur={() => window.setTimeout(() => setIsOpen(false), 150)}
				onKeyDown={(event) => {
					if (event.key === 'Escape') setIsOpen(false)
				}}
				placeholder={placeholder}
				aria-expanded={isOpen && query.length >= 2}
				aria-controls="global-search-results"
			/>
			{value && (
				<button
					className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
					type="button"
					onClick={() => {
						onChange('')
						setLoading(false)
						setError('')
						setIsOpen(true)
					}}
					aria-label="Clear search"
				>
					<X size={16} aria-hidden="true" />
				</button>
			)}
			{isOpen && query.length >= 2 && (
				<div
					className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
					id="global-search-results"
					role="region"
					aria-label="Search results"
				>
					{loading && (
						<p className="px-2 py-3 text-sm text-slate-500" role="status">
							Searching customers and orders…
						</p>
					)}
					{error && (
						<p className="px-2 py-3 text-sm text-rose-700" role="alert">
							{error}
						</p>
					)}
					{!loading && !error && !hasResults && (
						<p className="px-2 py-3 text-sm text-slate-500">
							No customers, orders, or services match “{value.trim()}”.
						</p>
					)}
					{!loading && results.customers.length > 0 && (
						<ResultGroup title="Customers">
							{results.customers.map((customer, index) => (
								<ResultCard
									key={customer._id ?? customer.id ?? `customer-${index}`}
									title={customer.name ?? customer.fullName ?? 'Customer'}
									details={[customer.phone, customer.email].filter(Boolean).join(' · ')}
									onClick={() => openResults('/customers')}
								/>
							))}
						</ResultGroup>
					)}
					{!loading && results.orders.length > 0 && (
						<ResultGroup title="Orders">
							{results.orders.map((order, index) => (
								<ResultCard
									key={order._id ?? order.id ?? `order-${index}`}
									title={order.customerName ?? 'Order'}
									details={`${order.service ?? 'Laundry service'} · ${order.status ?? 'Pending'}`}
									onClick={() => openResults('/orders')}
								/>
							))}
						</ResultGroup>
					)}
					{results.services.length > 0 && (
						<ResultGroup title="Services">
							{results.services.map((service) => (
								<ResultCard
									key={service.name}
									title={service.name}
									details={service.description}
									onClick={() => openResults('/services')}
								/>
							))}
						</ResultGroup>
					)}
				</div>
			)}
		</div>
	)
}

function ResultGroup({ title, children }) {
	return (
		<section className="mb-2 last:mb-0">
			<h2 className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
				{title}
			</h2>
			<div className="grid gap-1">{children}</div>
		</section>
	)
}

function ResultCard({ title, details, onClick }) {
	return (
		<button
			className="w-full rounded-lg border border-transparent px-3 py-2 text-left transition hover:border-teal-100 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
			type="button"
			onMouseDown={(event) => event.preventDefault()}
			onClick={onClick}
		>
			<span className="block truncate text-sm font-semibold text-slate-800">{title}</span>
			{details && (
				<span className="mt-0.5 block truncate text-xs text-slate-500">{details}</span>
			)}
		</button>
	)
}

export default SearchBar