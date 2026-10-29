import {
	ClipboardList,
	LayoutDashboard,
	X,
	Shirt,
	UsersRound,
} from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
	{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
	{ label: 'Orders', href: '/orders', icon: ClipboardList },
	{ label: 'Customers', href: '/customers', icon: UsersRound },
	{ label: 'Services', href: '/services', icon: Shirt },
]

function Sidebar({ isOpen, onClose }) {
	const { pathname } = useLocation()
	const currentPath = pathname.replace(/\/+$/, '') || '/'

	useEffect(() => {
		if (!isOpen) return undefined

		function handleKeyDown(event) {
			if (event.key === 'Escape') onClose()
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onClose])

	return (
		<>
			{isOpen && (
				<button
					className="fixed inset-0 z-20 bg-slate-950/40 min-[1101px]:hidden"
					type="button"
					onClick={onClose}
					aria-label="Close navigation menu"
				/>
			)}
			<aside
				id="site-sidebar"
				className={`fixed inset-y-0 left-0 z-30 flex h-screen w-72 max-w-[85vw] shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white px-4 py-6 text-slate-700 transition-transform duration-200 min-[1101px]:sticky min-[1101px]:top-0 min-[1101px]:h-auto min-[1101px]:min-h-screen min-[1101px]:w-64 min-[1101px]:max-w-none min-[1101px]:translate-x-0 min-[1101px]:overflow-visible ${
					isOpen
						? 'visible translate-x-0'
						: 'invisible -translate-x-full min-[1101px]:visible min-[1101px]:translate-x-0'
				}`}
				aria-label="Main navigation"
			>
				<div className="mb-9 flex items-center justify-between px-3 min-[1101px]:justify-start">
					<Link
						className="flex items-center gap-3 text-slate-900 no-underline"
						to="/dashboard"
						onClick={onClose}
						aria-label="Laundry dashboard"
					>
						<span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-700">
							<Shirt size={21} aria-hidden="true" />
						</span>
						<span className="text-xl font-bold tracking-tight">
							laundry<span className="text-teal-600">.</span>
						</span>
					</Link>
					<button
						className="grid size-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 min-[1101px]:hidden"
						type="button"
						onClick={onClose}
						aria-label="Close navigation menu"
					>
						<X size={21} aria-hidden="true" />
					</button>
				</div>

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
								onClick={onClose}
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
		</>
	)
}

export default Sidebar