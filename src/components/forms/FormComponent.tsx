import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { SocketEvent } from "@/types/socket"
import { USER_STATUS } from "@/types/user"
import { ChangeEvent, FormEvent, useEffect, useRef } from "react"
import { toast } from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"

const FormComponent = () => {
    const location = useLocation()
    const { currentUser, setCurrentUser, status, setStatus } = useAppContext()
    const { socket } = useSocket()

    const usernameRef = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const createNewRoomId = () => {
        setCurrentUser({ ...currentUser, roomId: crypto.randomUUID() })
        toast.success("Created a new Room Id")
        usernameRef.current?.focus()
    }

    const handleInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value
        setCurrentUser({ ...currentUser, [name]: value })
    }

    const validateForm = () => {
        if (currentUser.username.trim().length === 0) {
            toast.error("Enter your username", { style: { background: "#F38BA8", color: "#1E1E2E" } })
            return false
        } else if (currentUser.roomId.trim().length === 0) {
            toast.error("Enter a room id", { style: { background: "#F38BA8", color: "#1E1E2E" } })
            return false
        } else if (currentUser.roomId.trim().length < 5) {
            toast.error("ROOM Id must be at least 5 characters long", { style: { background: "#F38BA8", color: "#1E1E2E" } })
            return false
        } else if (currentUser.username.trim().length < 3) {
            toast.error("Username must be at least 3 characters long", { style: { background: "#F38BA8", color: "#1E1E2E" } })
            return false
        }
        return true
    }

    const joinRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (status === USER_STATUS.ATTEMPTING_JOIN) return
        if (!validateForm()) return
        toast.loading("Joining room...", { style: { background: "#2A2A3A", color: "#CDD6F4" } })
        setStatus(USER_STATUS.ATTEMPTING_JOIN)
        socket.emit(SocketEvent.JOIN_REQUEST, currentUser)
    }

    useEffect(() => {
        if (currentUser.roomId.length > 0) return
        if (location.state?.roomId) {
            setCurrentUser({ ...currentUser, roomId: location.state.roomId })
            if (currentUser.username.length === 0) {
                toast.success("Enter your username", { style: { background: "#CBA6F7", color: "#1E1E2E" } })
            }
        }
    }, [currentUser, location.state?.roomId, setCurrentUser])

    useEffect(() => {
        if (status === USER_STATUS.DISCONNECTED && !socket.connected) {
            socket.connect()
            return
        }

        const isRedirect = sessionStorage.getItem("redirect") || false

        if (status === USER_STATUS.JOINED && !isRedirect) {
            const username = currentUser.username
            sessionStorage.setItem("redirect", "true")
            navigate(`/editor/${currentUser.roomId}`, {
                state: {
                    username,
                },
            })
        } else if (status === USER_STATUS.JOINED && isRedirect) {
            sessionStorage.removeItem("redirect")
            setStatus(USER_STATUS.DISCONNECTED)
            socket.disconnect()
            socket.connect()
        }
    }, [currentUser, location.state?.redirect, navigate, setStatus, socket, status])

    return (
        <div className="flex w-full max-w-[500px] flex-col items-center justify-center gap-4 p-6 sm:w-[500px] sm:p-8 bg-[#1E1E2E] shadow-xl rounded-lg">
            <form onSubmit={joinRoom} className="flex w-full flex-col gap-4">
                <input
                    type="text"
                    name="roomId"
                    placeholder="Room Id"
                    className="w-full rounded-md text-center border border-[#CBA6F7] bg-[#1E1E2E] px-4 py-3 text-[#CDD6F4] focus:outline-none focus:ring-2 focus:ring-[#CBA6F7]"
                    onChange={handleInputChanges}
                    value={currentUser.roomId}
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="w-full rounded-md text-center border border-[#CBA6F7] bg-[#1E1E2E] px-4 py-3 text-[#CDD6F4] focus:outline-none focus:ring-2 focus:ring-[#CBA6F7]"
                    onChange={handleInputChanges}
                    value={currentUser.username}
                    ref={usernameRef}
                />
                <button
                    type="submit"
                    className="mt-2 w-full rounded-md bg-[#CBA6F7] px-8 py-3 text-lg font-semibold text-[#1E1E2E] hover:bg-opacity-90 transition"
                >
                    Join the ROOM
                </button>
            </form>
            <button
                className="cursor-pointer select-none text-[#CBA6F7] underline hover:text-opacity-80 transition"
                onClick={createNewRoomId}
            >
                Generate Unique Room Id
            </button>
        </div>
    )
}

export default FormComponent
