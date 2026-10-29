import { Menu, Shirt } from 'lucide-react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import './Navbar.css'

function Navbar({
	searchTerm,
	onSearchChange,
	onMenuClick,
	isMenuOpen,
	userName,
	onSignOut,
}) {
	return (
		<header className="site-header">
			<button
				className="mobile-menu-button grid min-[1101px]:hidden"
				type="button"
				onClick={onMenuClick}
				aria-label="Open navigation menu"
				aria-controls="site-sidebar"
				aria-expanded={isMenuOpen}
			>
				<Menu size={22} aria-hidden="true" />
			</button>
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

			<div className="header-profile">
				<div className="profile-trigger">
					<span className="profile-avatar" aria-hidden="true">
						<Shirt size={17} aria-hidden="true" />
					</span>
					<span className="profile-details">
						<span className="profile-name">{userName}</span>
						<span className="profile-role">Signed in</span>
					</span>
				</div>
				<button
					className="ml-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
					type="button"
					onClick={onSignOut}
				>
					Sign out
				</button>
			</div>
		</header>
	)
}

export default Navbar
