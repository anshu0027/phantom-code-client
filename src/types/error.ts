interface HttpErrorLike {
    message?: string
    response?: {
        data?: unknown
        status?: number
    }
}

interface SocketError {
    message: string
    type: "connection" | "timeout" | "unknown"
}

const isHttpErrorLike = (error: unknown): error is HttpErrorLike => {
    if (!error || typeof error !== "object") return false
    return "response" in error || "message" in error
}

export type { HttpErrorLike, SocketError }
export { isHttpErrorLike }


