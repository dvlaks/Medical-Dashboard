import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
				<div className="flex justify-center mb-6">
					<Shield className="h-16 w-16 text-red-500" />
				</div>
				
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Access Denied
				</h1>
				
				<p className="text-gray-600 mb-6">
					You don't have permission to access this page. Please contact your administrator if you believe this is an error.
				</p>
				
				<div className="space-y-3">
					<Link
						to="/login"
						className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Login
					</Link>
					
					<Link
						to="/"
						className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
					>
						Go to Dashboard
					</Link>
				</div>
			</div>
		</div>
	);
};

export default UnauthorizedPage;
