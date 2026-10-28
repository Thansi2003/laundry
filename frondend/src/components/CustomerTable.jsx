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

function getCustomerName(customer) {
	return (
		customer.name ||
		customer.fullName ||
		[customer.firstName, customer.lastName].filter(Boolean).join(' ') ||
		'Unnamed customer'
	)
}

function CustomerTable({
	customers = [],
	emptyMessage = 'No customer information is available yet.',
}) {
	const customerList = Array.isArray(customers) ? customers : []

	return (
		<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div className="overflow-x-auto">
				<table className="w-full min-w-[700px] border-collapse text-left">
					<caption className="sr-only">Customer contact information</caption>
					<thead className="bg-slate-50">
						<tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
							<th className="px-5 py-4" scope="col">Customer</th>
							<th className="px-5 py-4" scope="col">Email</th>
							<th className="px-5 py-4" scope="col">Phone</th>
							<th className="px-5 py-4" scope="col">Address</th>
							<th className="px-5 py-4" scope="col">Joined</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{customerList.length === 0 ? (
							<tr>
								<td
									className="px-5 py-14 text-center text-sm text-slate-500"
									colSpan={5}
								>
									{emptyMessage}
								</td>
							</tr>
						) : (
							customerList.map((customer, index) => {
								const id = customer.id ?? customer._id
								const address =
									typeof customer.address === 'string'
										? customer.address
										: customer.address?.street ?? customer.address?.city ?? '—'

								return (
									<tr
										className="text-sm text-slate-700 hover:bg-slate-50/70"
										key={id ?? `customer-${index}`}
									>
										<td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
											{getCustomerName(customer)}
										</td>
										<td className="whitespace-nowrap px-5 py-4">
											{customer.email || '—'}
										</td>
										<td className="whitespace-nowrap px-5 py-4">
											{customer.phone || customer.phoneNumber || '—'}
										</td>
										<td className="px-5 py-4">{address}</td>
										<td className="whitespace-nowrap px-5 py-4">
											{formatDate(customer.createdAt ?? customer.joinedAt)}
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

export default CustomerTable