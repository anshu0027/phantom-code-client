import { ReactNode, MouseEvent, useEffect, useRef } from "react"

interface ContextMenuItem {
    label: string
    icon: ReactNode
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
    destructive?: boolean
}

interface ContextMenuProps {
    top: number
    left: number
    items: ContextMenuItem[]
}

function ContextMenu({ top, left, items }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const menuNode = menuRef.current
        if (!menuNode) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                // Close menu by clicking outside or blurring
                menuNode.blur()
            }
        }

        menuNode.addEventListener("keydown", handleKeyDown)
        // Focus the menu when it opens
        menuNode.focus()

        return () => {
            menuNode.removeEventListener("keydown", handleKeyDown)
        }
    }, [])

    return (
        <div
            ref={menuRef}
            className="absolute z-10 w-[150px] rounded-md border border-darkHover bg-dark p-1"
            style={{ top, left }}
            role="menu"
            aria-label="Context menu"
            tabIndex={0}
        >
            {items.map((item) => (
                <button
                    key={item.label}
                    onClick={item.onClick}
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1 hover:bg-darkHover ${
                        item.destructive ? "text-danger" : ""
                    }`}
                    role="menuitem"
                    aria-label={item.label}
                >
                    {item.icon}
                    {item.label}
                </button>
            ))}
        </div>
    )
}

export type { ContextMenuItem, ContextMenuProps }
export default ContextMenu


