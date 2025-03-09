import { useFileSystem } from "@/context/FileContext"
import useResponsive from "@/hooks/useResponsive"
import cn from "classnames"
import Editor from "./Editor"
import FileTab from "./FileTab"
import "@/styles/global.css"

function EditorComponent() {
    const { openFiles } = useFileSystem()
    const { minHeightReached } = useResponsive()

    if (openFiles.length <= 0) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <h1 className="text-xl text-white">
                    No file is currently open.
                </h1>
            </div>
        )
    }

    return (
        <main
            className={cn(
                "flex w-full flex-col overflow-hidden md:h-screen custom-scrollbar-hide",
                {
                    "h-[calc(100vh-50px)]": !minHeightReached,
                    "h-full": minHeightReached,
                }
            )}
        >
            <FileTab />
            <Editor />
        </main>
    )
}

export default EditorComponent
