import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-teal-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Something went wrong
            </h2>
            <p className="text-slate-500 mb-2 text-sm">
              We encountered an unexpected error. Our team has been notified.
            </p>
            {this.state.error && (
              <details className="text-left bg-red-50 rounded-xl p-4 mb-6 text-xs text-red-600">
                <summary className="cursor-pointer font-medium mb-2">Error details</summary>
                <code className="block whitespace-pre-wrap break-all">
                  {this.state.error.toString()}
                </code>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
