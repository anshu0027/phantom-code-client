import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useViews } from "@/context/ViewContext"
import { useContextMenu } from "@/hooks/useContextMenu"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { ACTIVITY_STATE } from "@/types/app"
import { FileSystemItem, Id } from "@/types/file"
import { sortFileSystemItem } from "@/utils/file"
import { getIconClassName } from "@/utils/getIconClassName"
import { Icon } from "@iconify/react"
import cn from "classnames"
import {
    Dispatch,
    MouseEvent,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react"
import { AiOutlineFolder, AiOutlineFolderOpen } from "react-icons/ai"
import { MdDelete } from "react-icons/md"
import { PiPencilSimpleFill } from "react-icons/pi"
import {
    RiFileAddLine,
    RiFolderAddLine,
    RiFolderUploadLine,
} from "react-icons/ri"
import RenameView from "./RenameView"
import useResponsive from "@/hooks/useResponsive"
import InputDialog from "@/components/common/InputDialog"
import ConfirmDialog from "@/components/common/ConfirmDialog"
import ContextMenu from "@/components/common/ContextMenu"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import {
    validateFileName,
    validateDirectoryName,
} from "@/utils/validation"

function FileStructureView() {
    const {
        fileStructure,
        createFile,
        createDirectory,
        collapseDirectories,
        deleteDirectory,
        deleteFile,
        isFileOperationLoading,
    } = useFileSystem()
    const explorerRef = useRef<HTMLDivElement | null>(null)
    const [selectedDirId, setSelectedDirId] = useState<Id | null>(null)
    const [dialogType, setDialogType] = useState<
        "create-file" | "create-directory" | "delete-file" | "delete-directory" | null
    >(null)
    const [dialogTargetId, setDialogTargetId] = useState<Id | null>(null)
    const { minHeightReached } = useResponsive()

    const handleClickOutside = (e: MouseEvent) => {
        if (
            explorerRef.current &&
            !explorerRef.current.contains(e.target as Node)
        ) {
            setSelectedDirId(fileStructure.id)
        }
    }

    const handleCreateFile = () => {
        setDialogType("create-file")
        setDialogTargetId(selectedDirId || fileStructure.id)
    }

    const handleCreateDirectory = () => {
        setDialogType("create-directory")
        setDialogTargetId(selectedDirId || fileStructure.id)
    }

    const closeDialog = () => {
        setDialogType(null)
        setDialogTargetId(null)
    }

    const handleConfirmCreate = (name: string) => {
        if (!dialogTargetId) return
        if (dialogType === "create-file") {
            createFile(dialogTargetId, name)
        } else if (dialogType === "create-directory") {
            createDirectory(dialogTargetId, name)
        }
        closeDialog()
    }

    const sortedFileStructure = sortFileSystemItem(fileStructure)

    return (
        <div onClick={handleClickOutside} className="flex grow flex-col">
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {/* Screen reader announcements for file operations */}
            </div>
            <div className="view-title flex justify-between">
                <h2>Files</h2>
                <div className="flex items-center gap-2">
                    {isFileOperationLoading && (
                        <LoadingSpinner size="small" />
                    )}
                    <button
                        className="rounded-md px-1 hover:bg-darkHover disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleCreateFile}
                        title="Create File"
                        disabled={isFileOperationLoading}
                        aria-label="Create File"
                    >
                        <RiFileAddLine size={20} />
                    </button>
                    <button
                        className="rounded-md px-1 hover:bg-darkHover disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleCreateDirectory}
                        title="Create Directory"
                        disabled={isFileOperationLoading}
                        aria-label="Create Directory"
                    >
                        <RiFolderAddLine size={20} />
                    </button>
                    <button
                        className="rounded-md px-1 hover:bg-darkHover disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={collapseDirectories}
                        title="Collapse All Directories"
                        disabled={isFileOperationLoading}
                        aria-label="Collapse All Directories"
                    >
                        <RiFolderUploadLine size={20} />
                    </button>
                </div>
            </div>
            <div
                className={cn(
                    "min-h-[200px] grow overflow-auto pr-2 sm:min-h-0",
                    {
                        "h-[calc(80vh-170px)]": !minHeightReached,
                        "h-[85vh]": minHeightReached,
                    },
                )}
                ref={explorerRef}
                role="tree"
                aria-label="File structure"
            >
                {sortedFileStructure.children &&
                    sortedFileStructure.children.map((item) => (
                        <Directory
                            key={item.id}
                            item={item}
                            setSelectedDirId={setSelectedDirId}
                            setDialogType={setDialogType}
                            setDialogTargetId={setDialogTargetId}
                        />
                    ))}
            </div>

            {/* Create file / directory dialogs */}
            <InputDialog
                open={
                    dialogType === "create-file" ||
                    dialogType === "create-directory"
                }
                title={
                    dialogType === "create-file"
                        ? "Create File"
                        : "Create Directory"
                }
                label={
                    dialogType === "create-file"
                        ? "File name"
                        : "Directory name"
                }
                placeholder={
                    dialogType === "create-file"
                        ? "example.ts"
                        : "new-folder"
                }
                validate={
                    dialogType === "create-file"
                        ? (value) => {
                              const result = validateFileName(value)
                              return result.valid ? null : (result.error || null)
                          }
                        : (value) => {
                              const result = validateDirectoryName(value)
                              return result.valid ? null : (result.error || null)
                          }
                }
                onConfirm={handleConfirmCreate}
                onCancel={closeDialog}
            />

            {/* Delete confirmation dialog */}
            <ConfirmDialog
                open={
                    dialogType === "delete-file" ||
                    dialogType === "delete-directory"
                }
                title={
                    dialogType === "delete-file"
                        ? "Delete file"
                        : "Delete directory"
                }
                description={
                    dialogType === "delete-file"
                        ? "Are you sure you want to delete this file?"
                        : "Are you sure you want to delete this directory and all of its contents?"
                }
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onCancel={closeDialog}
                onConfirm={() => {
                    if (!dialogTargetId) return
                    if (dialogType === "delete-file") {
                        deleteFile(dialogTargetId)
                    } else if (dialogType === "delete-directory") {
                        deleteDirectory(dialogTargetId)
                    }
                    closeDialog()
                }}
            />
        </div>
    )
}

function Directory({
    item,
    setSelectedDirId,
    setDialogType,
    setDialogTargetId,
}: {
    item: FileSystemItem
    setSelectedDirId: (id: Id) => void
    setDialogType: Dispatch<
        SetStateAction<
            "create-file" | "create-directory" | "delete-file" | "delete-directory" | null
        >
    >
    setDialogTargetId: Dispatch<SetStateAction<Id | null>>
}) {
    const [isEditing, setEditing] = useState<boolean>(false)
    const dirRef = useRef<HTMLDivElement>(null!)
    const { coords, menuOpen, setMenuOpen } = useContextMenu({
        ref: dirRef,
    })
    const { toggleDirectory } = useFileSystem()

    const handleDirClick = (dirId: string) => {
        setSelectedDirId(dirId)
        toggleDirectory(dirId)
    }

    const handleRenameDirectory = (e: MouseEvent) => {
        e.stopPropagation()
        setMenuOpen(false)
        setEditing(true)
    }

    const handleDeleteDirectory = (e: MouseEvent, id: Id) => {
        e.stopPropagation()
        setMenuOpen(false)
        setDialogTargetId(id)
        setDialogType("delete-directory")
    }

    // Add keyboard event listeners to directory
    useEffect(() => {
        const dirNode = dirRef.current

        if (!dirNode) return

        dirNode.tabIndex = 0

        const handleKeyDown = (e: KeyboardEvent) => {
            e.stopPropagation()
            if (e.key === "F2") {
                setEditing(true)
            } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleDirClick(item.id)
            }
        }

        dirNode.addEventListener("keydown", handleKeyDown)

        return () => {
            dirNode.removeEventListener("keydown", handleKeyDown)
        }
    }, [item.id])

    if (item.type === "file") {
        return (
            <File
                item={item}
                setSelectedDirId={setSelectedDirId}
                setDialogType={setDialogType}
                setDialogTargetId={setDialogTargetId}
            />
        )
    }

    return (
        <div className="overflow-x-auto">
            <div
                className="flex w-full items-center rounded-md px-2 py-1 hover:bg-darkHover"
                onClick={() => handleDirClick(item.id)}
                ref={dirRef}
                role="treeitem"
                aria-expanded={item.isOpen}
                aria-label={`Directory: ${item.name}`}
            >
                {item.isOpen ? (
                    <AiOutlineFolderOpen size={24} className="mr-2 min-w-fit" />
                ) : (
                    <AiOutlineFolder size={24} className="mr-2 min-w-fit" />
                )}
                {isEditing ? (
                    <RenameView
                        id={item.id}
                        preName={item.name}
                        type="directory"
                        setEditing={setEditing}
                    />
                ) : (
                    <p
                        className="grow cursor-pointer overflow-hidden truncate"
                        title={item.name}
                    >
                        {item.name}
                    </p>
                )}
            </div>
            <div
                className={cn(
                    { hidden: !item.isOpen },
                    { block: item.isOpen },
                    { "pl-4": item.name !== "root" },
                )}
            >
                {item.children &&
                    item.children.map((child) => (
                        <Directory
                            key={child.id}
                            item={child}
                            setSelectedDirId={setSelectedDirId}
                            setDialogType={setDialogType}
                            setDialogTargetId={setDialogTargetId}
                        />
                    ))}
            </div>

            {menuOpen && (
                <DirectoryMenu
                    handleDeleteDirectory={handleDeleteDirectory}
                    handleRenameDirectory={handleRenameDirectory}
                    id={item.id}
                    left={coords.x}
                    top={coords.y}
                />
            )}
        </div>
    )
}

const File = ({
    item,
    setSelectedDirId,
    setDialogType,
    setDialogTargetId,
}: {
    item: FileSystemItem
    setSelectedDirId: (id: Id) => void
    setDialogType: Dispatch<
        SetStateAction<
            "create-file" | "create-directory" | "delete-file" | "delete-directory" | null
        >
    >
    setDialogTargetId: Dispatch<SetStateAction<Id | null>>
}) => {
    const { openFile } = useFileSystem()
    const [isEditing, setEditing] = useState<boolean>(false)
    const { setIsSidebarOpen } = useViews()
    const { isMobile } = useWindowDimensions()
    const { activityState, setActivityState } = useAppContext()
    const fileRef = useRef<HTMLDivElement>(null!)
    const { menuOpen, coords, setMenuOpen } = useContextMenu({
        ref: fileRef,
    })

    const handleFileClick = (fileId: string) => {
        if (isEditing) return
        setSelectedDirId(fileId)

        openFile(fileId)
        if (isMobile) {
            setIsSidebarOpen(false)
        }
        if (activityState === ACTIVITY_STATE.DRAWING) {
            setActivityState(ACTIVITY_STATE.CODING)
        }
    }

    const handleRenameFile = (e: MouseEvent) => {
        e.stopPropagation()
        setEditing(true)
        setMenuOpen(false)
    }

    const handleDeleteFile = (e: MouseEvent, id: Id) => {
        e.stopPropagation()
        setMenuOpen(false)
        setDialogTargetId(id)
        setDialogType("delete-file")
    }

    // Add keyboard event listeners to file
    useEffect(() => {
        const fileNode = fileRef.current

        if (!fileNode) return

        fileNode.tabIndex = 0

        const handleKeyDown = (e: KeyboardEvent) => {
            e.stopPropagation()
            if (e.key === "F2") {
                setEditing(true)
            } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleFileClick(item.id)
            }
        }

        fileNode.addEventListener("keydown", handleKeyDown)

        return () => {
            fileNode.removeEventListener("keydown", handleKeyDown)
        }
    }, [item.id])

    return (
        <div
            className="flex w-full items-center rounded-md px-2 py-1 hover:bg-darkHover"
            onClick={() => handleFileClick(item.id)}
            ref={fileRef}
            role="treeitem"
            aria-label={`File: ${item.name}`}
        >
            <Icon
                icon={getIconClassName(item.name)}
                fontSize={22}
                className="mr-2 min-w-fit"
            />
            {isEditing ? (
                <RenameView
                    id={item.id}
                    preName={item.name}
                    type="file"
                    setEditing={setEditing}
                />
            ) : (
                <p
                    className="grow cursor-pointer overflow-hidden truncate"
                    title={item.name}
                >
                    {item.name}
                </p>
            )}

            {/* Context Menu For File*/}
            {menuOpen && (
                <FileMenu
                    top={coords.y}
                    left={coords.x}
                    id={item.id}
                    handleRenameFile={handleRenameFile}
                    handleDeleteFile={handleDeleteFile}
                />
            )}
        </div>
    )
}

const FileMenu = ({
    top,
    left,
    id,
    handleRenameFile,
    handleDeleteFile,
}: {
    top: number
    left: number
    id: Id
    handleRenameFile: (e: MouseEvent) => void
    handleDeleteFile: (e: MouseEvent, id: Id) => void
}) => {
    return (
        <ContextMenu
            top={top}
            left={left}
            items={[
                {
                    label: "Rename",
                    icon: <PiPencilSimpleFill size={18} />,
                    onClick: handleRenameFile,
                },
                {
                    label: "Delete",
                    icon: <MdDelete size={20} />,
                    destructive: true,
                    onClick: (e) => handleDeleteFile(e, id),
                },
            ]}
        />
    )
}

const DirectoryMenu = ({
    top,
    left,
    id,
    handleRenameDirectory,
    handleDeleteDirectory,
}: {
    top: number
    left: number
    id: Id
    handleRenameDirectory: (e: MouseEvent) => void
    handleDeleteDirectory: (e: MouseEvent, id: Id) => void
}) => {
    return (
        <ContextMenu
            top={top}
            left={left}
            items={[
                {
                    label: "Rename",
                    icon: <PiPencilSimpleFill size={18} />,
                    onClick: handleRenameDirectory,
                },
                {
                    label: "Delete",
                    icon: <MdDelete size={20} />,
                    destructive: true,
                    onClick: (e) => handleDeleteDirectory(e, id),
                },
            ]}
        />
    )
}

export default FileStructureView
