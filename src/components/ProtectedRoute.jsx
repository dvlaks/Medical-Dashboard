import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
	const { user } = useAuth();
	const currentLocation = useLocation();

	// check if user is logged in
	if (!user) {
		return <Navigate to="/login" state={{ from: currentLocation }} replace />;
	}

	// Check if user has the required role
	if (allowedRoles) {
		let hasValidRole = false;
		for (let i = 0; i < allowedRoles.length; i++) {
			if (allowedRoles[i] === user.role) {
				hasValidRole = true;
				break;
			}
		}
		
		if (!hasValidRole) {
			return <Navigate to="/unauthorized" replace />;
		}
	}

	return children;
};

export default ProtectedRoute;