import { useState } from 'react'
import { LogOut, Menu, Shirt, X } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
import { clearSavedUser, getSavedUser } from '../lib/session'
import './Navbar.css'

const navigationItems = [
	{ label: 'Dashboard', to: '/dashboard' },
	{ label: 'Orders', to: '/orders' },
	{ label: 'Customers', to: '/customers' },
	{ label: 'Services', to: '/services' },
]

function Navbar({ searchTerm, onSearchChange }) {
	const [menuOpen, setMenuOpen] = useState(false)
	const [profileOpen, setProfileOpen] = useState(false)
	const [user, setUser] = useState(getSavedUser)
	const navigate = useNavigate()

	function handleLogout() {
		clearSavedUser()
		setUser(null)
		setProfileOpen(false)
		navigate('/login', { replace: true })
	}

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

			<div className="header-profile">
				<button
					className="profile-trigger"
					type="button"
					aria-label="Open profile menu"
					aria-expanded={profileOpen}
					aria-controls="profile-menu"
					onClick={() => setProfileOpen((open) => !open)}
				>
					<span className="profile-avatar" aria-hidden="true">
						{user?.name?.trim().charAt(0).toUpperCase() || '?'}
					</span>
					<span className="profile-details">
						<span className="profile-name">{user?.name || 'Profile'}</span>
						<span className="profile-role">Account</span>
					</span>
				</button>
				{profileOpen && (
					<div className="profile-menu" id="profile-menu">
						<div className="profile-menu-details">
							<span className="profile-menu-name">{user?.name || 'No saved profile'}</span>
							{user?.username && <span className="profile-menu-email">@{user.username}</span>}
							{user?.email && <span className="profile-menu-email">{user.email}</span>}
						</div>
						<button className="profile-logout" type="button" onClick={handleLogout}>
							<LogOut size={17} aria-hidden="true" />
							Log out
						</button>
					</div>
				)}
			</div>
		</header>
	)
}

export default Navbar
