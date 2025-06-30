import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			hasError: false, 
			error: null 
		};
	}

	static getDerivedStateFromError(error) {
		// update state when error occurs
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error('Error caught by boundary:', error, errorInfo);
	}

	handleRetry = () => {
		// reset error state to try again
		this.setState({ 
			hasError: false, 
			error: null 
		});
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen flex items-center justify-center bg-gray-50">
					<div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
						<div className="flex justify-center mb-4">
							<AlertTriangle className="h-16 w-16 text-red-500" />
						</div>
						<h1 className="text-xl font-bold text-gray-900 mb-2">
							Something went wrong
						</h1>
						<p className="text-gray-600 mb-6">
							We're sorry, but something unexpected happened. Please try refreshing the page.
						</p>
						<button
							onClick={this.handleRetry}
							className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
						>
							<RefreshCcw className="h-4 w-4 mr-2" />
							Try Again
						</button>
						{process.env.NODE_ENV === 'development' && (
							<details className="mt-4 text-left">
								<summary className="cursor-pointer text-sm text-gray-500">
									Error Details (Development)
								</summary>
								<pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
									{this.state.error?.toString()}
								</pre>
							</details>
						)}
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
