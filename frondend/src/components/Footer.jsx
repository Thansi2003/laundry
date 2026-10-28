import { Link } from 'react-router-dom'

const currentYear = new Date().getFullYear()

function Footer() {
	return (
		<footer className="border-t border-slate-200 bg-white px-6 py-5 text-sm text-slate-500 sm:px-8">
			<div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<p>
					<span className="font-semibold text-slate-700">Laundry Management</span>
					<span className="mx-2 text-slate-300" aria-hidden="true">|</span>
					&copy; {currentYear} All rights reserved.
				</p>
				<nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer navigation">
					<Link className="hover:text-teal-700" to="/dashboard">Dashboard</Link>
					<Link className="hover:text-teal-700" to="/orders">Orders</Link>
					<Link className="hover:text-teal-700" to="/customers">Customers</Link>
					<Link className="hover:text-teal-700" to="/services">Services &amp; prices</Link>
				</nav>
			</div>
		</footer>
	)
}

export default Footer