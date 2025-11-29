import { Toaster } from "react-hot-toast"

function Toast() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 3000,
                style: {
                    background: "#1E1E2E",
                    color: "#CDD6F4",
                    borderRadius: "8px",
                    padding: "12px 16px",
                },
                success: {
                    duration: 3000,
                    style: {
                        background: "#1E1E2E",
                        color: "#A6E3A1",
                    },
                    iconTheme: {
                        primary: "#A6E3A1",
                        secondary: "#1E1E2E",
                    },
                },
                error: {
                    duration: 4000,
                    style: {
                        background: "#1E1E2E",
                        color: "#F38BA8",
                    },
                    iconTheme: {
                        primary: "#F38BA8",
                        secondary: "#1E1E2E",
                    },
                },
                loading: {
                    style: {
                        background: "#2A2A3A",
                        color: "#CDD6F4",
                    },
                },
            }}
        />
    )
}

export default Toast
