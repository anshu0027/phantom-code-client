import { ChangeEvent } from "react"
import { PiCaretDownBold } from "react-icons/pi"

interface SelectProps {
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
    value: string
    options: string[]
    title: string
}

function Select({ onChange, value, options, title }: SelectProps) {
    return (
        <div className="relative w-full">
            <label className="mb-2 text-[#CDD6F4]">{title}</label>
            <div className="relative">
                <select
                    className="w-full rounded-md border border-[#CBA6F7] bg-[#2A2A3A] px-4 py-2 text-[#CDD6F4] outline-none appearance-none"
                    value={value}
                    onChange={onChange}
                >
                    {options.sort().map((option) => {
                        const formattedValue = option
                        const formattedName =
                            option.charAt(0).toUpperCase() + option.slice(1)

                        return (
                            <option key={formattedName} value={formattedValue} className="bg-[#1E1E2E] text-[#CDD6F4]">
                                {formattedName}
                            </option>
                        )
                    })}
                </select>
                <PiCaretDownBold
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CDD6F4] pointer-events-none"
                />
            </div>
        </div>
    )
}

export default Select
