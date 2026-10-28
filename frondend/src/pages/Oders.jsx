import { useEffect, useState } from 'react'
import api from '../lib/api'
import { Plus, X } from 'lucide-react'
import OrderForm from '../components/OrderForm'
import OrderTable from '../components/OrderTable'
import Pagination from '../components/Pagination'
import StatuseBadge from '../components/StatuseBadge'

const orderStatuses = ['Pending', 'In Progress', 'Ready', 'Completed', 'Cancelled']
const pageSize = 10

function normalizeStatus(status) {
	return String(status || 'Pending')
		.trim()
		.replace(/[_-]+/g, ' ')
		.replace(/\s+/g, ' ')
		.toLowerCase()
}

function Orders({ searchTerm }) {
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(true)
	const [formOpen, setFormOpen] = useState(true)
	const [editingOrder, setEditingOrder] = useState(null)
	const [notice, setNotice] = useState('')
	const [error, setError] = useState('')
	const [statusFilter, setStatusFilter] = useState('All')
	const [pagination, setPagination] = useState({ page: 1, searchTerm, statusFilter })
	const currentPage =
		pagination.searchTerm === searchTerm && pagination.statusFilter === statusFilter
			? pagination.page
			: 1

	useEffect(() => {
		let active = true

		api
			.get('/api/orders')
			.then(({ data }) => {
				if (active) setOrders(data)
			})
			.catch(() => {
				if (active) {
					setError('Could not load orders. Check that the backend and MongoDB are running.')
				}
			})
			.finally(() => {
				if (active) setLoading(false)
			})

		return () => {
			active = false
		}
	}, [])

	const searchQuery = searchTerm.trim().toLowerCase()
	const filteredOrders = orders.filter((order) => {
		const matchesSearch =
			!searchQuery || JSON.stringify(order).toLowerCase().includes(searchQuery)
		const matchesStatus =
			statusFilter === 'All' ||
			normalizeStatus(order.status) === normalizeStatus(statusFilter)

		return matchesSearch && matchesStatus
	})
	const pageCount = Math.ceil(filteredOrders.length / pageSize)
	const visiblePage = pageCount > 0 ? Math.min(currentPage, pageCount) : 1
	const visibleOrders = filteredOrders.slice(
		(visiblePage - 1) * pageSize,
		visiblePage * pageSize,
	)

	async function createOrder(orderDetails) {
		setError('')
		setNotice('')
		try {
			const { data: order } = await api.post('/api/orders', orderDetails)
			setOrders((currentOrders) => [order, ...currentOrders])
			setFormOpen(false)
			setNotice(`Order ${order._id} saved to MongoDB.`)
		} catch (requestError) {
			setError(
				requestError.response?.data?.message ||
					'Could not save the order. Check that the backend and MongoDB are running.',
			)
		}
	}

	async function updateOrder(orderDetails) {
		const id = editingOrder?._id ?? editingOrder?.id ?? editingOrder?.orderId
		if (!id) {
			setError('This order cannot be edited because it has no valid ID.')
			return
		}

		setError('')
		setNotice('')
		try {
			const { data: updatedOrder } = await api.put(`/api/orders/${id}`, orderDetails)
			setOrders((currentOrders) =>
				currentOrders.map((order) =>
					(order._id ?? order.id ?? order.orderId) === id ? updatedOrder : order,
				),
			)
			setEditingOrder(null)
			setFormOpen(false)
			setNotice(`Order ${id} updated.`)
		} catch (requestError) {
			setError(
				requestError.response?.data?.message ||
					'Could not update the order. Check that the backend and MongoDB are running.',
			)
		}
	}

	async function deleteOrder(order) {
		const id = order._id ?? order.id ?? order.orderId
		if (!id) {
			setError('This order cannot be deleted because it has no valid ID.')
			return
		}
		if (!window.confirm(`Delete order ${id}? This cannot be undone.`)) return

		setError('')
		setNotice('')
		try {
			const { data } = await api.delete(`/api/orders/${id}`)
			setOrders((currentOrders) =>
				currentOrders.filter(
					(currentOrder) =>
						(currentOrder._id ?? currentOrder.id ?? currentOrder.orderId) !== id,
				),
			)
			if ((editingOrder?._id ?? editingOrder?.id ?? editingOrder?.orderId) === id) {
				setEditingOrder(null)
				setFormOpen(false)
			}
			setNotice(data.message || `Order ${id} deleted.`)
		} catch (requestError) {
			setError(
				requestError.response?.data?.message ||
					'Could not delete the order. Check that the backend and MongoDB are running.',
			)
		}
	}

	return (
		<main className="min-w-0 flex-1 bg-slate-50 p-6 sm:p-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-7 flex flex-wrap items-end justify-between gap-4">
					<div>
						<p className="text-sm font-medium text-teal-700">Laundry management</p>
						<h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
							All orders
						</h1>
						<p className="mt-2 text-sm text-slate-500">
							Review laundry orders, due dates, totals, and current status.
						</p>
					</div>
					<button
						className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
						type="button"
						onClick={() => {
							setNotice('')
							if (formOpen) {
								setFormOpen(false)
								setEditingOrder(null)
							} else {
								setEditingOrder(null)
								setFormOpen(true)
							}
						}}
						aria-expanded={formOpen}
					>
						{formOpen ? <X size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
						{formOpen ? 'Close form' : 'New order'}
					</button>
				</div>

				{notice && (
					<p className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
						{notice}
					</p>
				)}
				{error && (
					<p className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
						{error}
					</p>
				)}

				{formOpen && (
					<OrderForm
						key={editingOrder?._id ?? editingOrder?.id ?? editingOrder?.orderId ?? 'new-order'}
						initialOrder={editingOrder}
						onSubmit={editingOrder ? updateOrder : createOrder}
						onCancel={() => {
							setFormOpen(false)
							setEditingOrder(null)
						}}
					/>
				)}

				<section
					className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
					aria-label="Filter orders by status"
				>
					<h2 className="mr-1 text-sm font-medium text-slate-600">
						Filter by status
					</h2>
					<button
						className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
							statusFilter === 'All'
								? 'bg-slate-800 text-white'
								: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
						}`}
						type="button"
						onClick={() => {
							setStatusFilter('All')
							setPagination({ page: 1, searchTerm, statusFilter: 'All' })
						}}
						aria-pressed={statusFilter === 'All'}
					>
						All
						<span>{orders.length}</span>
					</button>
					{orderStatuses.map((status) => (
						<button
							className={`inline-flex items-center gap-2 rounded-full p-0.5 ${
								statusFilter === status
									? 'ring-2 ring-teal-700 ring-offset-2'
									: 'hover:opacity-80'
							}`}
							key={status}
							type="button"
							onClick={() => {
								setStatusFilter(status)
								setPagination({ page: 1, searchTerm, statusFilter: status })
							}}
							aria-pressed={statusFilter === status}
						>
							<StatuseBadge status={status} />
							<span className="pr-2 text-xs font-semibold text-slate-600">
								{orders.filter(
									(order) => normalizeStatus(order.status) === normalizeStatus(status),
								).length}
							</span>
						</button>
					))}
				</section>

				<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
					<h2 className="text-lg font-semibold text-slate-900">
						Orders <span className="text-sm font-normal text-slate-500">({filteredOrders.length})</span>
					</h2>
				</div>
				{loading ? (
					<p className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500" role="status">
						Loading orders…
					</p>
				) : (
					<OrderTable
						orders={visibleOrders}
						onEdit={(order) => {
							setError('')
							setNotice('')
							setEditingOrder(order)
							setFormOpen(true)
						}}
						onDelete={deleteOrder}
						emptyMessage={
							searchTerm
								? 'No orders match your search.'
								: 'No laundry orders to display yet.'
						}
					/>
				)}
				<Pagination
					currentPage={visiblePage}
					pageSize={pageSize}
					totalItems={filteredOrders.length}
					onPageChange={(page) =>
						setPagination({ page, searchTerm, statusFilter })
					}
				/>
			</div>
		</main>
	)
}

export default Orders