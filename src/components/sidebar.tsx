'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/components/sidebar-provider'
import {
    LayoutDashboard,
    FolderOpen,
    Settings,
    LogOut,
    Plus,
    Video,
    FileText,
    Sparkles,
    Home,
    PanelLeftClose,
    PanelLeftOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const { isCollapsed, toggleSidebar } = useSidebar()

    return (
        <div
            className={cn(
                'pb-12 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out',
                isCollapsed ? 'w-20' : 'w-64',
                className
            )}
        >
            <div className="space-y-4 py-4 h-full flex flex-col">
                <div className="px-3 py-2 flex-1">
                    <div className={cn("flex items-center mb-8 transition-all duration-300", isCollapsed ? "justify-center px-0" : "gap-3 px-4")}>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10 shrink-0">
                            <Sparkles className="h-5 w-5 text-white fill-white/20" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col overflow-hidden whitespace-nowrap">
                                <span className="font-bold text-lg tracking-tight leading-none text-white">
                                    SOZO
                                </span>
                                <span className="text-[10px] font-medium text-indigo-300 tracking-widest uppercase">
                                    Anime Studio
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Button
                            asChild
                            variant={pathname === '/' ? 'secondary' : 'ghost'}
                            className={cn(
                                "w-full transition-all duration-300",
                                isCollapsed
                                    ? "h-auto flex-col justify-center gap-1 py-3 px-0"
                                    : "justify-start"
                            )}
                        >
                            <Link href="/">
                                <Home className={cn("transition-all", isCollapsed ? "h-6 w-6 mb-1" : "mr-2 h-4 w-4")} />
                                <span className={cn("transition-all", isCollapsed ? "text-[10px] leading-none" : "")}>
                                    ホーム
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant={pathname === '/projects/new' ? 'secondary' : 'ghost'}
                            className={cn(
                                "w-full transition-all duration-300 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30",
                                isCollapsed
                                    ? "h-auto flex-col justify-center gap-1 py-3 px-0"
                                    : "justify-start mb-2"
                            )}
                        >
                            <Link href="/projects/new">
                                <Plus className={cn("transition-all", isCollapsed ? "h-6 w-6 mb-1" : "mr-2 h-4 w-4")} />
                                <span className={cn("transition-all", isCollapsed ? "text-[10px] leading-none" : "")}>
                                    作成
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant={pathname === '/projects' ? 'secondary' : 'ghost'}
                            className={cn(
                                "w-full transition-all duration-300",
                                isCollapsed
                                    ? "h-auto flex-col justify-center gap-1 py-3 px-0"
                                    : "justify-start"
                            )}
                        >
                            <Link href="/projects">
                                <FolderOpen className={cn("transition-all", isCollapsed ? "h-6 w-6 mb-1" : "mr-2 h-4 w-4")} />
                                <span className={cn("transition-all", isCollapsed ? "text-[10px] leading-none" : "")}>
                                    一覧
                                </span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {!isCollapsed && (
                    <>
                        <Separator className="mx-4 w-auto bg-zinc-800" />
                        <div className="px-3 py-2">
                            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-zinc-400 whitespace-nowrap overflow-hidden">
                                最近のプロジェクト
                            </h2>
                            <div className="space-y-1">
                                <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white truncate">
                                    <FileText className="mr-2 h-4 w-4 shrink-0" />
                                    <span className="truncate">Project Alpha</span>
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white truncate">
                                    <FileText className="mr-2 h-4 w-4 shrink-0" />
                                    <span className="truncate">Project Beta</span>
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                <div className={cn("px-4 mt-auto", isCollapsed ? "px-2" : "px-4")}>
                    {/* Toggle Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        className={cn(
                            "w-full mb-4 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50",
                            isCollapsed ? "h-10 p-0" : "justify-center"
                        )}
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen className="h-5 w-5" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <PanelLeftClose className="h-4 w-4" />
                                <span>メニューを閉じる</span>
                            </div>
                        )}
                    </Button>

                    <div className={cn(
                        "flex items-center gap-3 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 transition-all duration-300",
                        isCollapsed ? "justify-center flex-col p-1 border-none bg-transparent" : ""
                    )}>
                        <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                            <AvatarFallback>PM</AvatarFallback>
                        </Avatar>
                        {!isCollapsed && (
                            <>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium leading-none text-white truncate">Production Manager</p>
                                    <p className="text-xs text-zinc-400 truncate">pm@sozo-anime.com</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white shrink-0">
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
