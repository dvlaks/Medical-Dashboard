import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import MyAdminDashboard from './pages/admin/AdminDashboard';
import PatientManagement from './pages/admin/PatientManagement';
import IncidentManagement from './pages/admin/IncidentManagement';
import CalendarView from './pages/admin/CalendarView';
import MyPatientDashboard from './pages/patient/PatientDashboard';
import Layout from './components/Layout';
import { setupMyData } from './services/storageService';

function App() {
	setupMyData();

	return (
		<ErrorBoundary>
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Navigate to="/login" replace />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/unauthorized" element={<UnauthorizedPage />} />

						<Route path="/app" element={<Layout />}>
							<Route index element={<Navigate to="/app/dashboard" replace />} />

							{/* Admin routes */}
							<Route 
								path="dashboard" 
								element={
									<ProtectedRoute allowedRoles={['Admin']}>
										<MyAdminDashboard />
									</ProtectedRoute>
								} 
							/>
							<Route 
								path="patients" 
								element={
									<ProtectedRoute allowedRoles={['Admin']}>
										<PatientManagement />
									</ProtectedRoute>
								} 
							/>
							<Route 
								path="incidents" 
								element={
									<ProtectedRoute allowedRoles={['Admin']}>
										<IncidentManagement />
									</ProtectedRoute>
								} 
							/>
							<Route 
								path="calendar" 
								element={
									<ProtectedRoute allowedRoles={['Admin']}>
										<CalendarView />
									</ProtectedRoute>
								} 
							/>

							{/* Patient routes */}
							<Route 
								path="my-dashboard" 
								element={
									<ProtectedRoute allowedRoles={['Patient']}>
										<MyPatientDashboard />
									</ProtectedRoute>
								} 
							/>
						</Route>
						
						{/* Fallback route */}
						<Route path="*" element={<Navigate to="/login" replace />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</ErrorBoundary>
	);
}

export default App;