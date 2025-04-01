import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useSettings } from "@/context/SettingContext"
import { useSocket } from "@/context/SocketContext"
import usePageEvents from "@/hooks/usePageEvents"
import useResponsive from "@/hooks/useResponsive"
import { editorThemes } from "@/resources/Themes"
import { FileSystemItem } from "@/types/file"
import { SocketEvent } from "@/types/socket"
import { color } from "@uiw/codemirror-extensions-color"
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link"
import { LanguageName, loadLanguage } from "@uiw/codemirror-extensions-langs"
import CodeMirror, {
    Extension,
    ViewUpdate,
    scrollPastEnd,
} from "@uiw/react-codemirror"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { cursorTooltipBaseTheme, tooltipField } from "./tooltip"
import "@/styles/global.css"
import { GoogleGenerativeAI } from "@google/generative-ai"

function Editor() {
    const { users, currentUser } = useAppContext()
    const { activeFile, setActiveFile } = useFileSystem()
    const { theme, language, fontSize } = useSettings()
    const { socket } = useSocket()
    const { viewHeight } = useResponsive()
    const [timeOut, setTimeOut] = useState(setTimeout(() => { }, 0))
    const [extensions, setExtensions] = useState<Extension[]>([])
    const [suggestion, setSuggestion] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const filteredUsers = useMemo(
        () => users.filter((u) => u.username !== currentUser.username),
        [users, currentUser],
    )

    const getApiKey = () => import.meta.env.VITE_GOOGLE_API_KEY

    const handleAIRequest = async (code: string, lang: string) => {
        try {
            setIsProcessing(true)
            const apiKey = getApiKey()
            if (!apiKey) {
                throw new Error("Google API key is not configured")
            }

            const genAI = new GoogleGenerativeAI(apiKey)
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

            const prompt = `Provide a code suggestion for the following ${lang} code snippet. Return only the suggested code without explanation:\n\n${code}`
            const result = await model.generateContent(prompt)
            const response = result.response
            const suggestedCode = response.text()
            setSuggestion(suggestedCode.trim())
        } catch (error) {
            console.error("AI suggestion failed:", error)
            setSuggestion(null)
        } finally {
            setIsProcessing(false)
        }
    }

    const onCodeChange = (code: string, view: ViewUpdate) => {
        if (!activeFile) return

        const file: FileSystemItem = { ...activeFile, content: code }
        setActiveFile(file)
        const cursorPosition = view.state?.selection?.main?.head
        socket.emit(SocketEvent.TYPING_START, { cursorPosition })
        socket.emit(SocketEvent.FILE_UPDATED, {
            fileId: activeFile.id,
            newContent: code,
        })
        clearTimeout(timeOut)

        const newTimeOut = setTimeout(() => {
            socket.emit(SocketEvent.TYPING_PAUSE)
            // Trigger AI suggestion after pause
            if (!isProcessing) {
                handleAIRequest(code, language)
            }
        }, 1000)
        setTimeOut(newTimeOut)
    }

    usePageEvents()

    useEffect(() => {
        const extensions = [
            color,
            hyperLink,
            tooltipField(filteredUsers),
            cursorTooltipBaseTheme,
            scrollPastEnd(),
        ]
        const langExt = loadLanguage(language.toLowerCase() as LanguageName)
        if (langExt) {
            extensions.push(langExt)
        } else {
            toast.error(
                "Syntax highlighting is unavailable for this language. Please adjust the editor settings; it may be listed under a different name.",
                {
                    duration: 5000,
                },
            )
        }

        setExtensions(extensions)
    }, [filteredUsers, language])

    const applySuggestion = () => {
        if (!suggestion || !activeFile) return
        const updatedFile: FileSystemItem = { ...activeFile, content: suggestion }
        setActiveFile(updatedFile)
        socket.emit(SocketEvent.FILE_UPDATED, {
            fileId: activeFile.id,
            newContent: suggestion,
        })
        setSuggestion(null)
    }

    return (
        <div className="relative">
            <CodeMirror
                theme={editorThemes[theme]}
                onChange={onCodeChange}
                value={activeFile?.content}
                extensions={extensions}
                minHeight="100%"
                maxWidth="100vw"
                className="custom-scrollbar-hide"
                style={{
                    fontSize: fontSize + "px",
                    height: viewHeight,
                    position: "relative",
                }}
            />
            {suggestion && !isProcessing && (
                <div className="absolute bottom-4 right-4 bg-gray-800 text-white p-2 rounded-md shadow-lg">
                    <p className="text-sm mb-2">AI Suggestion:</p>
                    <pre className="bg-gray-900 p-2 rounded-md max-h-40 overflow-auto">
                        {suggestion}
                    </pre>
                    <button
                        onClick={applySuggestion}
                        className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md"
                    >
                        Apply
                    </button>
                </div>
            )}
            {isProcessing && (
                <div className="absolute bottom-4 right-4 bg-gray-800 text-white p-2 rounded-md shadow-lg">
                    <p className="text-sm">Generating suggestion...</p>
                </div>
            )}
        </div>
    )
}

export default Editor