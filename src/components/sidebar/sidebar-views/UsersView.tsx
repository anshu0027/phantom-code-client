import Users from "@/components/common/Users"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import useResponsive from "@/hooks/useResponsive"
import { USER_STATUS } from "@/types/user"
import { toastError, toastSuccess } from "@/utils/toast"
import { GoSignOut } from "react-icons/go"
import { IoShareOutline } from "react-icons/io5"
import { LuCopy } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import { logger } from "@/utils/logger"

function UsersView() {
    const navigate = useNavigate()
    const { viewHeight } = useResponsive()
    const { setStatus } = useAppContext()
    const { socket } = useSocket()

    const copyURL = async () => {
        const url = window.location.href
        try {
            await navigator.clipboard.writeText(url)
            toastSuccess("URL copied to clipboard")
        } catch (error) {
            toastError("Unable to copy URL to clipboard")
            logger.error("Failed to copy URL to clipboard:", error)
        }
    }

    const shareURL = async () => {
        const url = window.location.href
        try {
            await navigator.share({ url })
        } catch (error) {
            toastError("Unable to share URL")
            logger.error("Failed to share URL:", error)
        }
    }

    const leaveRoom = () => {
        socket.disconnect()
        setStatus(USER_STATUS.DISCONNECTED)
        navigate("/", {
            replace: true,
        })
    }

    return (
        <div
            className="flex flex-col p-4"
            style={{
                height: viewHeight,
                backgroundColor: "#1E1E2E", // Background color
                color: "#CDD6F4", // Foreground text
            }}
        >
            <h1 className="text-xl font-semibold">Users</h1>

            {/* List of connected users */}
            <Users />

            <div className="flex flex-col items-center gap-4 pt-4">
                <div className="flex w-full gap-4">
                    {/* Share URL button */}
                    <button
                        className="flex grow items-center justify-center rounded-md bg-[#CBA6F7] p-3 text-[#1E1E2E] font-semibold hover:bg-[#A990D0] transition"
                        onClick={shareURL}
                        title="Share Link"
                        aria-label="Share room URL"
                    >
                        <IoShareOutline size={26} />
                    </button>

                    {/* Copy URL button */}
                    <button
                        className="flex grow items-center justify-center rounded-md bg-[#CBA6F7] p-3 text-[#1E1E2E] font-semibold hover:bg-[#A990D0] transition"
                        onClick={copyURL}
                        title="Copy Link"
                        aria-label="Copy room URL to clipboard"
                    >
                        <LuCopy size={22} />
                    </button>

                    {/* Leave room button */}
                    <button
                        className="flex grow items-center justify-center rounded-md bg-[#F38BA8] p-3 text-[#1E1E2E] font-semibold hover:bg-[#D87892] transition"
                        onClick={leaveRoom}
                        title="Leave Room"
                        aria-label="Leave room"
                    >
                        <GoSignOut size={22} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UsersView
