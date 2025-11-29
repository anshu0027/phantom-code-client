import toast from "react-hot-toast"
import type { ToastOptions } from "react-hot-toast"

// Toast configuration constants
export const TOAST_DURATIONS = {
    SUCCESS: 3000,
    ERROR: 4000,
    INFO: 3000,
    LOADING: Infinity, // Indefinite until manually dismissed
} as const

// Standard toast styles
const TOAST_STYLES = {
    success: {
        background: "#1E1E2E",
        color: "#A6E3A1",
    },
    error: {
        background: "#1E1E2E",
        color: "#F38BA8",
    },
    info: {
        background: "#1E1E2E",
        color: "#89B4FA",
    },
    loading: {
        background: "#2A2A3A",
        color: "#CDD6F4",
    },
} as const

/**
 * Shows a success toast notification
 * @param message - The message to display
 * @param options - Optional toast options to override defaults
 */
export function toastSuccess(
    message: string,
    options?: ToastOptions,
): string {
    return toast.success(message, {
        duration: TOAST_DURATIONS.SUCCESS,
        style: TOAST_STYLES.success,
        ...options,
    })
}

/**
 * Shows an error toast notification
 * @param message - The message to display
 * @param options - Optional toast options to override defaults
 */
export function toastError(
    message: string,
    options?: ToastOptions,
): string {
    return toast.error(message, {
        duration: TOAST_DURATIONS.ERROR,
        style: TOAST_STYLES.error,
        ...options,
    })
}

/**
 * Shows an info toast notification
 * @param message - The message to display
 * @param options - Optional toast options to override defaults
 */
export function toastInfo(
    message: string,
    options?: ToastOptions,
): string {
    return toast(message, {
        duration: TOAST_DURATIONS.INFO,
        style: TOAST_STYLES.info,
        icon: "ℹ️",
        ...options,
    })
}

/**
 * Shows a loading toast notification
 * @param message - The message to display
 * @param options - Optional toast options to override defaults
 * @returns Toast ID that can be used to dismiss the toast
 */
export function toastLoading(
    message: string,
    options?: ToastOptions,
): string {
    return toast.loading(message, {
        duration: TOAST_DURATIONS.LOADING,
        style: TOAST_STYLES.loading,
        ...options,
    })
}

/**
 * Dismisses a specific toast by ID
 * @param toastId - The ID of the toast to dismiss
 */
export function toastDismiss(toastId?: string): void {
    toast.dismiss(toastId)
}

/**
 * Dismisses all toasts
 */
export function toastDismissAll(): void {
    toast.dismiss()
}

// Re-export toast for any edge cases where direct access is needed
export { toast }

