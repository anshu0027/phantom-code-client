import { FormEvent, useState } from "react"
import Modal from "./Modal"

interface InputDialogProps {
    open: boolean
    title?: string
    label?: string
    placeholder?: string
    initialValue?: string
    validate?: (value: string) => string | null
    onConfirm: (value: string) => void
    onCancel: () => void
}

function InputDialog({
    open,
    title,
    label,
    placeholder,
    initialValue = "",
    validate,
    onConfirm,
    onCancel,
}: InputDialogProps) {
    const [value, setValue] = useState<string>(initialValue)
    const [error, setError] = useState<string | null>(null)

    if (!open) return null

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        const trimmed = value.trim()
        if (!trimmed) {
            setError("Name cannot be empty")
            return
        }

        const validationError = validate ? validate(trimmed) : null
        if (validationError) {
            setError(validationError)
            return
        }

        onConfirm(trimmed)
        setError(null)
        setValue("") // Reset value after confirmation
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onCancel()
        }
    }

    return (
        <Modal isOpen={open} title={title} onClose={onCancel}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {label && (
                    <label className="text-sm font-medium text-[#CDD6F4]">
                        {label}
                    </label>
                )}
                <input
                    type="text"
                    className="w-full rounded-md border border-[#45475A] bg-[#1E1E2E] px-3 py-2 text-sm text-[#CDD6F4] outline-none focus:border-[#CBA6F7]"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                        if (error) setError(null)
                    }}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                {error && (
                    <p className="text-xs text-[#F38BA8]" role="alert">
                        {error}
                    </p>
                )}
                <div className="mt-2 flex justify-end gap-2">
                    <button
                        type="button"
                        className="rounded-md border border-[#45475A] px-3 py-1 text-sm text-[#CDD6F4] hover:bg-[#313244]"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-[#CBA6F7] px-3 py-1 text-sm font-semibold text-[#1E1E2E] hover:bg-[#A990D0]"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default InputDialog


