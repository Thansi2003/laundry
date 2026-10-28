import { useEffect, useState } from 'react'
import api from '../lib/api'
import {
	ClipboardList,
	IndianRupee,
	UsersRound,
	Shirt,
} from 'lucide-react'
import DashboardCard from '../components/DashboardCard'

function Dashboard() {
	const [orders, setOrders] = useState([])
	const [customerCount, setCustomerCount] = useState(0)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let active = true

		Promise.allSettled([
			api.get('/api/orders'),
			api.get('/api/customers'),
		]).then(([ordersResult, customersResult]) => {
			if (!active) return

			const errors = []
			if (ordersResult.status === 'fulfilled') {
				setOrders(Array.isArray(ordersResult.value.data) ? ordersResult.value.data : [])
			} else {
				errors.push('orders')
			}

			if (customersResult.status === 'fulfilled') {
				const customers = customersResult.value.data
				setCustomerCount(Array.isArray(customers) ? customers.length : 0)
			} else {
				errors.push('customers')
			}

			if (errors.length > 0) {
				setError(`Could not load ${errors.join(' and ')} summary. Check the backend connection.`)
			}
		}).finally(() => {
			if (active) setLoading(false)
		})

		return () => {
			active = false
		}
	}, [])

	const pendingCount = orders.filter((order) =>
		['pending', 'in progress', 'in_progress'].includes(
			String(order.status ?? '').toLowerCase().replaceAll('_', ' '),
		),
	).length
	const revenue = orders.reduce((sum, order) => {
		const amount = Number(order.total ?? order.amount ?? order.price)
		return sum + (Number.isFinite(amount) ? amount : 0)
	}, 0)
	const formattedRevenue = new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
	}).format(revenue)
	const valueOrLoading = (value) => (loading ? '…' : value)
	const metrics = [
		{
			title: 'Total orders',
			value: valueOrLoading(orders.length),
			description: 'Orders recorded',
			icon: ClipboardList,
			tone: 'teal',
		},
		{
			title: 'Revenue',
			value: valueOrLoading(formattedRevenue),
			description: 'Revenue recorded',
			icon: IndianRupee,
			tone: 'blue',
		},
		{
			title: 'Pending orders',
			value: valueOrLoading(pendingCount),
			description: 'Orders in progress',
			icon: Shirt,
			tone: 'amber',
		},
		{
			title: 'Customers',
			value: valueOrLoading(customerCount),
			description: 'Customers registered',
			icon: UsersRound,
			tone: 'violet',
		},
	]

	return (
		<main className="min-w-0 flex-1 bg-slate-50 p-6 sm:p-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-7">
					<p className="text-sm font-medium text-teal-700">Overview</p>
					<h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
						Dashboard
					</h1>
					<p className="mt-2 text-sm text-slate-500">
						Your laundry business at a glance.
					</p>
				</div>

				{error && (
					<p className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
						{error}
					</p>
				)}

				<section
					className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
					aria-label="Business summary"
				>
					{metrics.map((metric) => (
						<DashboardCard key={metric.title} {...metric} />
					))}
				</section>
			</div>
		</main>
	)
}

export default Dashboard