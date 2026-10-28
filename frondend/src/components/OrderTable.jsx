import StatuseBadge from './StatuseBadge'

function getCustomerName(order) {
	const customer = order.customerName ?? order.customer
	if (typeof customer === 'string') return customer
	return customer?.name ?? customer?.fullName ?? '—'
}

function getServiceName(order) {
	const service = order.serviceName ?? order.service
	if (typeof service === 'string') return service
	return service?.name ?? '—'
}

function formatDate(value) {
	if (!value) return '—'

	const date = new Date(value)
	return Number.isNaN(date.getTime())
		? '—'
		: new Intl.DateTimeFormat(undefined, {
				month: 'short',
				day: 'numeric',
				year: 'numeric',
			}).format(date)
}

function formatAmount(value) {
	if (value === null || value === undefined || value === '') return '—'

	const amount = Number(value)
	return Number.isFinite(amount)
		? new Intl.NumberFormat('en-IN', {
				style: 'currency',
				currency: 'INR',
			}).format(amount)
		: '—'
}

function OrderTable({
	orders = [],
	emptyMessage = 'No laundry orders to display yet.',
}) {
	const orderList = Array.isArray(orders) ? orders : []

	return (
		<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div className="overflow-x-auto">
				<table className="w-full min-w-[760px] border-collapse text-left">
					<caption className="sr-only">All laundry orders</caption>
					<thead className="bg-slate-50">
						<tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
							<th className="px-5 py-4" scope="col">Order</th>
							<th className="px-5 py-4" scope="col">Customer</th>
							<th className="px-5 py-4" scope="col">Service</th>
							<th className="px-5 py-4" scope="col">Received</th>
							<th className="px-5 py-4" scope="col">Due date</th>
							<th className="px-5 py-4 text-right" scope="col">Total</th>
							<th className="px-5 py-4" scope="col">Status</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{orderList.length === 0 ? (
							<tr>
								<td
									className="px-5 py-14 text-center text-sm text-slate-500"
									colSpan={7}
								>
									{emptyMessage}
								</td>
							</tr>
						) : (
							orderList.map((order, index) => {
								const id = order.orderId ?? order.id ?? order._id
								const status = String(order.status || 'Pending')
								const receivedAt =
									order.receivedAt ?? order.createdAt ?? order.orderDate
								const dueAt = order.dueAt ?? order.dueDate
								const total = order.total ?? order.amount ?? order.price

								return (
									<tr
										className="text-sm text-slate-700 hover:bg-slate-50/70"
										key={id ?? `order-${index}`}
									>
										<td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
											{id ? `#${id}` : `Order ${index + 1}`}
										</td>
										<td className="whitespace-nowrap px-5 py-4">
											{getCustomerName(order)}
										</td>
										<td className="whitespace-nowrap px-5 py-4">
											{getServiceName(order)}
										</td>
										<td className="whitespace-nowrap px-5 py-4">
											{formatDate(receivedAt)}
										</td>
										<td className="whitespace-nowrap px-5 py-4">
											{formatDate(dueAt)}
										</td>
										<td className="whitespace-nowrap px-5 py-4 text-right font-medium text-slate-900">
											{formatAmount(total)}
										</td>
										<td className="whitespace-nowrap px-5 py-4">
											<StatuseBadge status={status} />
										</td>
									</tr>
								)
							})
						)}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default OrderTable