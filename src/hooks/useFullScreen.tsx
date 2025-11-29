import { useEffect } from "react"
import { logger } from "@/utils/logger"

function useFullScreen() {
    function detectMob() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i,
        ]

        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem)
        })
    }
    const isMobile = detectMob()

    useEffect(() => {
        if (!isMobile) return

        // Use native Fullscreen API
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch((err) => {
                logger.error("Error attempting to enable fullscreen:", err)
            })
        }
    }, [isMobile])
}

export default useFullScreen
