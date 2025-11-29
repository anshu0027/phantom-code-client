import Modal from "./Modal"

interface ConfirmDialogProps {
    open: boolean
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void
    onCancel: () => void
}

function ConfirmDialog({
    open,
    title = "Confirm",
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null

    const handleConfirm = () => {
        onConfirm()
    }

    return (
        <Modal isOpen={open} title={title} onClose={onCancel}>
            {description && (
                <p className="mb-4 text-sm text-[#BAC2DE]">{description}</p>
            )}
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    className="rounded-md border border-[#45475A] px-3 py-1 text-sm text-[#CDD6F4] hover:bg-[#313244]"
                    onClick={onCancel}
                >
                    {cancelLabel}
                </button>
                <button
                    type="button"
                    className="rounded-md bg-[#F38BA8] px-3 py-1 text-sm font-semibold text-[#1E1E2E] hover:bg-[#D87892]"
                    onClick={handleConfirm}
                >
                    {confirmLabel}
                </button>
            </div>
        </Modal>
    )
}

export default ConfirmDialog


