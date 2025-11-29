import cn from "classnames"

interface LoadingSpinnerProps {
    size?: "small" | "medium" | "large"
    color?: "primary" | "secondary" | "white"
    className?: string
}

const sizeMap = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
}

const colorMap = {
    primary: "border-[#CBA6F7]",
    secondary: "border-[#CDD6F4]",
    white: "border-white",
}

function LoadingSpinner({
    size = "medium",
    color = "primary",
    className,
}: LoadingSpinnerProps) {
    return (
        <div
            className={cn(
                "inline-block animate-spin rounded-full border-2 border-t-transparent",
                sizeMap[size],
                colorMap[color],
                className,
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    )
}

export default LoadingSpinner

