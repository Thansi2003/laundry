import { useState } from 'react'
import { Menu, Shirt, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import SearchBar from './SearchBar'
import './Navbar.css'

const navigationItems = [
	{ label: 'Dashboard', to: '/dashboard' },
	{ label: 'Orders', to: '/orders' },
	{ label: 'Customers', to: '/customers' },
	{ label: 'Services', to: '/services' },
]

function Navbar({ searchTerm, onSearchChange }) {
	const [menuOpen, setMenuOpen] = useState(false)

	return (
		<header className="site-header">
			<Link className="brand" to="/dashboard" aria-label="Laundry dashboard">
				<span className="brand-mark" aria-hidden="true">
					<Shirt size={21} strokeWidth={2} />
				</span>
				<span className="brand-name">laundry<span>.</span></span>
			</Link>

			<div className="header-search">
				<SearchBar
					value={searchTerm}
					onChange={onSearchChange}
					placeholder="Search orders or customers…"
					label="Search orders or customers"
				/>
			</div>

			<button
				className="menu-toggle"
				type="button"
				aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
				aria-expanded={menuOpen}
				aria-controls="primary-navigation"
				onClick={() => setMenuOpen((open) => !open)}
			>
				{menuOpen ? <X size={21} /> : <Menu size={21} />}
			</button>

			<nav
				className={`primary-navigation${menuOpen ? ' is-open' : ''}`}
				id="primary-navigation"
				aria-label="Main navigation"
			>
				{navigationItems.map(({ label, to }) => (
					<NavLink
						className="navigation-link"
						key={to}
						to={to}
						onClick={() => setMenuOpen(false)}
					>
						{label}
					</NavLink>
				))}
			</nav>

			<div className="header-profile" role="group" aria-label="Administrator profile">
				<span className="profile-avatar" aria-hidden="true">A</span>
				<span className="profile-details">
					<span className="profile-name">Admin</span>
					<span className="profile-role">Administrator</span>
				</span>
			</div>
		</header>
	)
}

export default Navbar
