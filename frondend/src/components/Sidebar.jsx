import {
	ClipboardList,
	LayoutDashboard,
	Shirt,
	UsersRound,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
	{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
	{ label: 'Orders', href: '/orders', icon: ClipboardList },
	{ label: 'Customers', href: '/customers', icon: UsersRound },
	{ label: 'Services', href: '/services', icon: Shirt },
]

function Sidebar() {
	const { pathname } = useLocation()
	const currentPath = pathname.replace(/\/+$/, '') || '/'

	return (
		<aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 text-slate-700 md:flex">
			<Link
				className="mb-9 flex items-center gap-3 px-3 text-slate-900 no-underline"
				to="/dashboard"
				aria-label="Laundr dashboard"
			>
				<span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
					<Shirt size={21} aria-hidden="true" />
				</span>
				<span className="text-xl font-bold tracking-tight">
					laundry<span className="text-teal-600">.</span>
				</span>
			</Link>

			<p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
				Menu
			</p>
			<nav className="flex flex-col gap-1" aria-label="Dashboard menu">
				{menuItems.map(({ label, href, icon: Icon }) => {
					const isActive =
						currentPath === href || currentPath.startsWith(`${href}/`)

					return (
						<Link
							key={label}
							to={href}
							aria-current={isActive ? 'page' : undefined}
							className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium no-underline transition-colors ${
								isActive
									? 'bg-teal-50 text-teal-800'
									: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
							}`}
						>
							<Icon size={19} aria-hidden="true" />
							<span>{label}</span>
						</Link>
					)
				})}
			</nav>

			<div className="mt-auto flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
				<span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
				<span>Branch open</span>
			</div>
		</aside>
	)
}

export default Sidebar