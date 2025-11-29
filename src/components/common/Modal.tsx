import { ReactNode, useEffect, useRef } from "react"
import ReactDOM from "react-dom"

interface ModalProps {
    isOpen: boolean
    title?: string
    children: ReactNode
    onClose: () => void
}

function Modal({ isOpen, title, children, onClose }: ModalProps) {
    const dialogRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!isOpen) return

        const previousActiveElement = document.activeElement as HTMLElement | null

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.stopPropagation()
                onClose()
            }
        }

        document.addEventListener("keydown", handleKeyDown)

        // focus the dialog container
        if (dialogRef.current) {
            dialogRef.current.focus()
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            // restore focus
            previousActiveElement?.focus()
        }
    }, [isOpen, onClose])

    if (!isOpen || typeof document === "undefined") return null

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose()
        }
    }

    const modalContent = (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={handleOverlayClick}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                className="w-full max-w-md rounded-lg bg-[#1E1E2E] p-4 text-[#CDD6F4] shadow-xl"
            >
                {title && (
                    <h2 className="mb-3 text-lg font-semibold text-[#CDD6F4]">
                        {title}
                    </h2>
                )}
                {children}
            </div>
        </div>
    )

    return ReactDOM.createPortal(modalContent, document.body)
}

export default Modal


