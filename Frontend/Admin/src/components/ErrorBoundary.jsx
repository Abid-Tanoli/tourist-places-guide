import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 text-sm mb-6">
              An unexpected error occurred. Please try again or return to the dashboard.
            </p>
            {this.state.error && (
              <pre className="text-xs text-red-600 bg-red-50 rounded p-3 mb-4 text-left overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Try Again
              </button>
              <a
                href="/admin/dashboard"
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
