import { useRunCode } from "@/context/RunCodeContext"
import useResponsive from "@/hooks/useResponsive"
import { ERROR_MESSAGES } from "@/constants/errors"
import { ChangeEvent } from "react"
import { toastError, toastSuccess } from "@/utils/toast"
import { LuCopy } from "react-icons/lu"
import { PiCaretDownBold } from "react-icons/pi"
import { logger } from "@/utils/logger"
import LoadingSpinner from "@/components/common/LoadingSpinner"

function RunView() {
    const { viewHeight } = useResponsive()
    const {
        setInput,
        output,
        isRunning,
        supportedLanguages,
        selectedLanguage,
        setSelectedLanguage,
        runCode,
    } = useRunCode()

    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        try {
            const parsed = JSON.parse(e.target.value)

            if (
                !parsed ||
                typeof parsed !== "object" ||
                typeof (parsed as { language?: unknown }).language !== "string"
            ) {
                throw new Error("Invalid language object")
            }

            setSelectedLanguage(parsed)
        } catch (error) {
            logger.error("Failed to parse selected language:", error)
            toastError(ERROR_MESSAGES.PARSE_LANGUAGE_FAILED)
        }
    }

    const copyOutput = () => {
        navigator.clipboard.writeText(output)
        toastSuccess("Output copied to clipboard")
    }

    return (
        <div
            className="flex flex-col items-center gap-2 p-4"
            style={{ height: viewHeight, backgroundColor: "#1E1E2E" }}
        >
            <h1 className="text-xl font-bold text-[#CDD6F4]">Run Code</h1>
            <div className="flex h-[90%] w-full flex-col items-end gap-2 md:h-[92%]">
                {/* Language Selector */}
                <div className="relative w-full">
                    <select
                        className="w-full rounded-md border-none bg-[#2A2A3A] px-4 py-2 text-[#CDD6F4] outline-none"
                        value={JSON.stringify(selectedLanguage)}
                        onChange={handleLanguageChange}
                        aria-label="Select Programming Language"
                    >
                        {supportedLanguages
                            .sort((a, b) => (a.language > b.language ? 1 : -1))
                            .map((lang, i) => {
                                return (
                                    <option
                                        key={i}
                                        value={JSON.stringify(lang)}
                                        className="bg-[#2A2A3A] text-[#CDD6F4]"
                                    >
                                        {lang.language +
                                            (lang.version
                                                ? ` (${lang.version})`
                                                : "")}
                                    </option>
                                )
                            })}
                    </select>
                    <PiCaretDownBold
                        size={16}
                        className="absolute bottom-3 right-4 z-10 text-[#CDD6F4]"
                    />
                </div>

                {/* Input Box */}
                <textarea
                    className="min-h-[120px] w-full resize-none rounded-md border-none bg-[#2A2A3A] p-2 text-[#CDD6F4] outline-none"
                    placeholder="Write your input here..."
                    onChange={(e) => setInput(e.target.value)}
                />

                {/* Run Button */}
                <button
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#CBA6F7] p-2 font-bold text-[#1E1E2E] outline-none transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={runCode}
                    disabled={isRunning}
                    aria-label="Run Code"
                >
                    {isRunning && <LoadingSpinner size="small" color="white" />}
                    {isRunning ? "Running..." : "Run"}
                </button>

                {/* Output Section */}
                <label className="flex w-full justify-between text-[#CDD6F4]">
                    Output :
                    <button
                        onClick={copyOutput}
                        title="Copy Output"
                        aria-label="Copy Output to Clipboard"
                    >
                        <LuCopy
                            size={18}
                            className="cursor-pointer text-[#CDD6F4] hover:text-[#CBA6F7] transition-all duration-200"
                        />
                    </button>
                </label>
                <div
                    className="w-full grow resize-none overflow-y-auto rounded-md border-none bg-[#2A2A3A] p-2 text-[#F5E0DC] outline-none"
                    role="log"
                    aria-live="polite"
                    aria-label="Code Execution Output"
                >
                    <code>
                        <pre className="text-wrap">{output}</pre>
                    </code>
                </div>
            </div>
        </div>
    )
}

export default RunView
