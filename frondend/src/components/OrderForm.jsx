import { useState } from 'react'

function getToday() {
	const now = new Date()
	const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
	return localDate.toISOString().slice(0, 10)
}

function OrderForm({ onSubmit, onCancel }) {
	const [submitting, setSubmitting] = useState(false)
	const [formData, setFormData] = useState({
		customerName: '',
		phone: '',
		email: '',
		service: '',
		receivedAt: getToday(),
		dueAt: '',
		total: '',
	})

	function handleChange(event) {
		const { name, value } = event.target
		setFormData((current) => ({ ...current, [name]: value }))
	}

	async function handleSubmit(event) {
		event.preventDefault()
		setSubmitting(true)
		try {
			await onSubmit({
				...formData,
				total: Number(formData.total),
				status: 'Pending',
			})
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<form
			className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
			onSubmit={handleSubmit}
		>
			<div className="mb-5">
				<h2 className="text-lg font-semibold text-slate-900">New laundry order</h2>
				<p className="mt-1 text-sm text-slate-500">
					Enter the customer and pickup details to create an order.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<label className="block text-sm font-medium text-slate-700">
					Customer name
					<input
						className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
						name="customerName"
						value={formData.customerName}
						onChange={handleChange}
						autoComplete="name"
						required
					/>
				</label>

				<label className="block text-sm font-medium text-slate-700">
					Phone number
					<input
						className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
						type="tel"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						autoComplete="tel"
					/>
				</label>

				<label className="block text-sm font-medium text-slate-700">
					Email address
					<input
						className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						autoComplete="email"
					/>
				</label>

				<label className="block text-sm font-medium text-slate-700">
					Service
					<select
						className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
						name="service"
						value={formData.service}
						onChange={handleChange}
						required
					>
						<option value="" disabled>Select a service</option>
						<option value="Wash & Fold">Wash &amp; Fold</option>
						<option value="Dry Cleaning">Dry Cleaning</option>
						<option value="Ironing">Ironing</option>
						<option value="Bedding">Bedding</option>
						<option value="Other">Other</option>
					</select>
				</label>

				<label className="block text-sm font-medium text-slate-700">
					Received date
					<input
						className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
						type="date"
						name="receivedAt"
						value={formData.receivedAt}
						onChange={handleChange}
						required
					/>
				</label>

				<label className="block text-sm font-medium text-slate-700">
					Due date
					<input
						className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
						type="date"
						name="dueAt"
						value={formData.dueAt}
						onChange={handleChange}
						min={formData.receivedAt}
						required
					/>
				</label>

				<label className="block text-sm font-medium text-slate-700">
					Total
					<input
						className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
						type="number"
						name="total"
						value={formData.total}
						onChange={handleChange}
						min="0"
						step="0.01"
						placeholder="0.00"
						required
					/>
				</label>
			</div>

			<div className="mt-6 flex flex-wrap justify-end gap-3">
				<button
					className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
					type="button"
					onClick={onCancel}
					disabled={submitting}
				>
					Cancel
				</button>
				<button
					className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
					type="submit"
					disabled={submitting}
				>
					{submitting ? 'Saving order…' : 'Create order'}
				</button>
			</div>
		</form>
	)
}

export default OrderForm