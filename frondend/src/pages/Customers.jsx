import { useEffect, useState } from 'react'
import axios from 'axios'
import CustomerTable from '../components/CustomerTable'
import Pagination from '../components/Pagination'

const pageSize = 10

function Customers({ searchTerm }) {
	const [customers, setCustomers] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [pagination, setPagination] = useState({ page: 1, searchTerm })
	const currentPage = pagination.searchTerm === searchTerm ? pagination.page : 1

	useEffect(() => {
		let active = true

		axios
			.get('/api/customers')
			.then(({ data }) => {
				if (active) setCustomers(data)
			})
			.catch(() => {
				if (active) {
					setError('Could not load customers. Check that the backend and MongoDB are running.')
				}
			})
			.finally(() => {
				if (active) setLoading(false)
			})

		return () => {
			active = false
		}
	}, [])

	const filteredCustomers = customers.filter((customer) =>
		JSON.stringify(customer).toLowerCase().includes(searchTerm.trim().toLowerCase()),
	)
	const pageCount = Math.ceil(filteredCustomers.length / pageSize)
	const visiblePage = pageCount > 0 ? Math.min(currentPage, pageCount) : 1
	const visibleCustomers = filteredCustomers.slice(
		(visiblePage - 1) * pageSize,
		visiblePage * pageSize,
	)

	return (
		<main className="min-w-0 flex-1 bg-slate-50 p-6 sm:p-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-7">
					<p className="text-sm font-medium text-teal-700">Laundry management</p>
					<h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
						Customers
					</h1>
					<p className="mt-2 text-sm text-slate-500">
						View customer contact details and account information.
					</p>
				</div>
				<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
					<h2 className="text-lg font-semibold text-slate-900">
						Customer list{' '}
						<span className="text-sm font-normal text-slate-500">
							({filteredCustomers.length})
						</span>
					</h2>
				</div>
				{error && (
					<p className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
						{error}
					</p>
				)}
				{loading ? (
					<p className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500" role="status">
						Loading customers…
					</p>
				) : (
					<CustomerTable
						customers={visibleCustomers}
						emptyMessage={
							searchTerm
								? 'No customers match your search.'
								: 'No customer information is available yet.'
						}
					/>
				)}
				<Pagination
					currentPage={visiblePage}
					pageSize={pageSize}
					totalItems={filteredCustomers.length}
					onPageChange={(page) => setPagination({ page, searchTerm })}
				/>
			</div>
		</main>
	)
}

export default Customers