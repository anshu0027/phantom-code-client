import { Component, ErrorInfo, ReactNode } from "react"
import { Link } from "react-router-dom"
import { logger } from "@/utils/logger"

interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Log to console for now; can be wired to external service later
        logger.error("ErrorBoundary caught an error:", error, info)
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children
        }

        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#1E1E2E] px-4 text-center text-[#CDD6F4]">
                <span className="text-lg font-medium">
                    Oops! Something went wrong. Please try again.
                </span>
                {import.meta.env.DEV && this.state.error && (
                    <pre className="max-w-xl overflow-auto rounded-md bg-[#181825] p-3 text-left text-xs text-[#F5E0DC]">
                        {this.state.error.message}
                    </pre>
                )}
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        className="rounded-md bg-[#CBA6F7] px-8 py-2 font-bold text-[#1E1E2E] hover:bg-[#A990D0]"
                        onClick={this.handleReload}
                    >
                        Reload
                    </button>
                    <Link
                        className="rounded-md bg-[#89B4FA] px-8 py-2 font-bold text-[#1E1E2E] hover:bg-[#74A0E4]"
                        to="/"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        )
    }
}

export default ErrorBoundary


