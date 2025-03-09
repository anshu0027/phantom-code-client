import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { useSocket } from "@/context/SocketContext"
import { ChatMessage } from "@/types/chat"
import { SocketEvent } from "@/types/socket"
import { formatDate } from "@/utils/formateDate"
import { FormEvent, useRef } from "react"
import { LuSendHorizonal } from "react-icons/lu"
import { v4 as uuidV4 } from "uuid"

function ChatInput() {
    const { currentUser } = useAppContext()
    const { socket } = useSocket()
    const { setMessages } = useChatRoom()
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const inputVal = inputRef.current?.value.trim()

        if (inputVal && inputVal.length > 0) {
            const message: ChatMessage = {
                id: uuidV4(),
                message: inputVal,
                username: currentUser.username,
                timestamp: formatDate(new Date().toISOString()),
            }
            socket.emit(SocketEvent.SEND_MESSAGE, { message })
            setMessages((messages) => [...messages, message])

            if (inputRef.current) inputRef.current.value = ""
        }
    }

    return (
        <form
            onSubmit={handleSendMessage}
            className="flex justify-between rounded-lg border border-[#CBA6F7] bg-secondary p-2"
        >
            <input
                type="text"
                className="w-full flex-grow text-gray-600 rounded-md border-none bg-background p-2 text-foreground outline-none placeholder-secondary"
                placeholder="Enter a message..."
                ref={inputRef}
            />
            <button
                className="flex items-center justify-center rounded-md bg-accent1 p-2 text-background hover:bg-opacity-80 transition"
                type="submit"
            >
                <LuSendHorizonal size={24} color="#fff" />
            </button>
        </form>
    )
}

export default ChatInput
