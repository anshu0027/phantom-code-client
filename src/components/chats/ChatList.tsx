"use client"

import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { type SyntheticEvent, useEffect, useRef } from "react"

function ChatList() {
    const { messages, isNewMessage, setIsNewMessage, lastScrollHeight, setLastScrollHeight } = useChatRoom()
    const { currentUser } = useAppContext()
    const messagesContainerRef = useRef<HTMLDivElement | null>(null)

    const handleScroll = (e: SyntheticEvent) => {
        const container = e.target as HTMLDivElement
        setLastScrollHeight(container.scrollTop)
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        if (!messagesContainerRef.current) return
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }, [messages])

    useEffect(() => {
        if (isNewMessage) {
            setIsNewMessage(false)
        }
        if (messagesContainerRef.current) messagesContainerRef.current.scrollTop = lastScrollHeight
    }, [isNewMessage, setIsNewMessage, lastScrollHeight])

    return (
        <div
            className="grow overflow-auto rounded-md bg-[#2A2A3A] p-2 shadow-md"
            ref={messagesContainerRef}
            onScroll={handleScroll}
        >
            {/* Chat messages */}
            {messages.map((message) => {
                const isCurrentUser = message.username === currentUser.username
                const isAI = message.username === "AI Assistant"

                return (
                    <div
                        key={message.id}
                        className={`mb-2 w-[80%] wrap-break-word rounded-md px-3 py-2 shadow-sm ${isAI
                                ? "ml-auto bg-[#89B4FA] text-[#1E1E2E]" // AI messages
                                : isCurrentUser
                                    ? "ml-auto bg-[#CBA6F7] text-[#1E1E2E]" // Current user
                                    : "bg-[#1E1E2E] text-[#CDD6F4]" // Other users
                            }`}
                    >
                        <div className="flex justify-between">
                            <span className={`text-xs font-semibold ${isAI ? "text-[#1E1E2E]" : "text-[#993f2e]"}`}>
                                {message.username}
                            </span>
                            <span className={`text-xs font-bold ${isAI ? "text-[#1E1E2E]" : "text-[#993f2e]"} opacity-75`}>
                                {message.timestamp}
                            </span>
                        </div>
                        <p className="py-1 whitespace-pre-wrap">{message.message}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default ChatList

