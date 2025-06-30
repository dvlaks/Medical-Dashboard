"use client"

import { useState } from "react"
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
	LayoutDashboard,
	Users,
	Calendar,
	Settings,
	Menu,
	User,
	Bell,
	Search,
	Plus,
	UserCheck,
	BarChart3,
} from "lucide-react"

const Layout = () => {
	const { user, logout } = useAuth()
	const currentLocation = useLocation()
	const navigate = useNavigate()
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	const doLogout = () => {
		logout()
		navigate("/login")
	}

	// navigation for admin users
	const adminMenuItems = [
		{ name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
		{ name: "Appointments", href: "/app/incidents", icon: Calendar },
		{ name: "Doctors", href: "/app/doctors", icon: UserCheck },
		{ name: "Patients", href: "/app/patients", icon: Users },
		{ name: "Reports", href: "/app/reports", icon: BarChart3 },
		{ name: "Settings", href: "/app/settings", icon: Settings },
	]

	// navigation for patient users
	const patientMenuItems = [
		{ name: "My Dashboard", href: "/app/my-dashboard", icon: User }
	]

	// determine which nav to show based on user role
	let navigationItems = [];
	if (user && user.role === "Admin") {
		navigationItems = adminMenuItems;
	} else {
		navigationItems = patientMenuItems;
	}

	const NavItem = ({ item }) => {
		const isCurrentPage = currentLocation.pathname === item.href
		return (
			<Link 
				to={item.href} 
				className={`nav-item ${isCurrentPage ? "active" : ""}`} 
				onClick={() => setIsSidebarOpen(false)}
				aria-current={isCurrentPage ? "page" : undefined}
			>
				<item.icon className="h-5 w-5" aria-hidden="true" />
				<span>{item.name}</span>
			</Link>
		)
	}

	return (
		<div className="medical-layout">
			{/* Mobile sidebar overlay */}
			{isSidebarOpen && (
				<div className="fixed inset-0 z-40 lg:hidden">
					<div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
				</div>
			)}

			{/* Sidebar */}
			<div className={`medical-sidebar ${isSidebarOpen ? "open" : ""}`}>
				{/* Brand */}
				<div className="sidebar-brand">
					<div className="brand-icon">
						<Plus className="h-6 w-6" />
					</div>
					<div className="brand-text">ENTNT Dental</div>
				</div>

				{/* Navigation */}
				<nav className="sidebar-nav">
					{navigationItems.map((item) => (
						<NavItem key={item.name} item={item} />
					))}
				</nav>

				{/* Profile section */}
				<div className="sidebar-profile">
					<div className="profile-card">
						<div className="profile-avatar">
							<User className="h-6 w-6" />
						</div>
						<div className="profile-info">
							<h4>Dr. Michael Chen</h4>
							<p>Chief Dental Officer</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main content area */}
			<div className="medical-main">
				{/* Header */}
				<header className="medical-header">
					{/* Mobile menu button */}
					<button
						onClick={() => setIsSidebarOpen(true)}
						className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 mr-4 transition-colors duration-200"
						aria-label="Open navigation menu"
					>
						<Menu className="h-6 w-6" />
					</button>

					<div className="header-title">Dashboard</div>

					{/* Search input */}
					<div className="header-search">
						<Search className="search-icon h-5 w-5" />
						<input 
							type="search" 
							placeholder="Search patients, appointments..." 
							aria-label="Search dashboard content"
						/>
					</div>

					{/* Header actions */}
					<div className="header-actions">
						<button 
							className="header-btn" 
							aria-label="View notifications"
							title="Notifications"
						>
							<Bell className="h-5 w-5" />
							<span className="notification-dot" aria-hidden="true"></span>
						</button>
						<button 
							onClick={doLogout} 
							className="header-btn logout-btn"
							aria-label="Logout"
							title="Logout"
						>
							<User className="h-5 w-5" />
						</button>
					</div>
				</header>

				{/* Page Content */}
				<main className="medical-content">
					<Outlet />
				</main>
			</div>
		</div>
	)
}

export default Layout
