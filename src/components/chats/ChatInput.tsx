"use client"

import { RiSendPlaneLine } from "react-icons/ri"
import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { useSocket } from "@/context/SocketContext"
import type { ChatMessage } from "@/types/chat"
import { SocketEvent } from "@/types/socket"
import { formatDate } from "@/utils/formateDate"
import { type FormEvent, useRef, useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"

function ChatInput() {
    const { currentUser } = useAppContext()
    const { socket } = useSocket()
    const { setMessages } = useChatRoom()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAIRequest = async (prompt: string) => {
        try {
            setIsProcessing(true)
            setError(null)

            // Add a loading message from AI
            const loadingMessage: ChatMessage = {
                id: crypto.randomUUID(),
                message: "Processing your request...",
                username: "AI Assistant",
                timestamp: formatDate(new Date().toISOString()),
            }
            setMessages((messages) => [...messages, loadingMessage])

            // Get API key from environment variable
            const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

            if (!apiKey) {
                throw new Error("Google API key is not configured")
            }

            // Initialize the Google Generative AI with your API key
            const genAI = new GoogleGenerativeAI(apiKey)

            // For text-only input, use the gemini-pro model
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

            // Generate content
            const result = await model.generateContent(prompt)
            const response = result.response
            const text = response.text()

            // Replace loading message with actual response
            const aiMessage: ChatMessage = {
                id: loadingMessage.id,
                message: `${text}`, // Add code block with syntax highlighting
                username: "AI Coder",
                timestamp: formatDate(new Date().toISOString()),
            }

            setMessages((messages) => messages.map((msg) => (msg.id === loadingMessage.id ? aiMessage : msg)))

            // Broadcast AI response to all users
            socket.emit(SocketEvent.SEND_MESSAGE, { message: aiMessage })
        } catch (error) {
            console.error("AI request failed:", error)

            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
            setError(errorMessage)

            // Send error message
            const errorChatMessage: ChatMessage = {
                id: crypto.randomUUID(),
                message: `Sorry, I couldn't process your request: ${errorMessage}`,
                username: "AI Assistant",
                timestamp: formatDate(new Date().toISOString()),
            }

            setMessages((messages) => [...messages, errorChatMessage])
            socket.emit(SocketEvent.SEND_MESSAGE, { message: errorChatMessage })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const inputVal = inputRef.current?.value.trim()

        if (inputVal && inputVal.length > 0) {
            // Check if message is an AI request
            if (inputVal.startsWith("@ai")) {
                // Send the user's message first
                const userMessage: ChatMessage = {
                    id: crypto.randomUUID(),
                    message: inputVal,
                    username: currentUser.username,
                    timestamp: formatDate(new Date().toISOString()),
                }
                socket.emit(SocketEvent.SEND_MESSAGE, { message: userMessage })
                setMessages((messages) => [...messages, userMessage])

                // Extract the prompt (everything after "@ai ")
                const code = inputVal.substring(4).trim()
                const promptToPass = `Provide only the suggested code for the following snippet. Do not include any formatting, language tags, comments, explanation, or extra text. Return raw code only — nothing else.\n\n${code}`
                if (promptToPass) {
                    await handleAIRequest(promptToPass)
                }
            } else {
                // Regular message
                const message: ChatMessage = {
                    id: crypto.randomUUID(),
                    message: inputVal,
                    username: currentUser.username,
                    timestamp: formatDate(new Date().toISOString()),
                }
                socket.emit(SocketEvent.SEND_MESSAGE, { message })
                setMessages((messages) => [...messages, message])
            }

            if (inputRef.current) inputRef.current.value = ""
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {error && (
                <div className="text-[#F38BA8] text-sm px-2">
                    Error: {error}. Please make sure you've set up the Google API key.
                </div>
            )}
            <form
                onSubmit={handleSendMessage}
                className="flex justify-between rounded-lg border border-[#CBA6F7] bg-secondary p-2"
            >
                <input
                    type="text"
                    className="w-full flex-grow text-gray-600 rounded-md border-none bg-background p-2 text-foreground outline-none placeholder-secondary"
                    placeholder={isProcessing ? "AI is processing..." : "Enter a message or type @ai to ask AI..."}
                    ref={inputRef}
                    disabled={isProcessing}
                />
                <button
                    className="flex items-center justify-center rounded-md bg-accent1 p-2 text-background hover:bg-opacity-80 transition"
                    type="submit"
                    disabled={isProcessing}
                >
                    <RiSendPlaneLine size={24} color="#fff" />
                </button>
            </form>
        </div>
    )
}

export default ChatInput
