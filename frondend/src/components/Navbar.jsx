import { Menu, Shirt } from 'lucide-react'
import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'
import './Navbar.css'

function Navbar({ searchTerm, onSearchChange, onMenuClick, isMenuOpen }) {
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
						<span className="profile-name">Shared workspace</span>
						<span className="profile-role">No sign-in required</span>
					</span>
				</div>
			</div>
		</header>
	)
}

export default Navbar
