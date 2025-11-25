'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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

    return (
        <div className={cn('pb-12 w-64 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl h-screen fixed left-0 top-0 z-50 transition-colors duration-300', className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center gap-3 px-4 mb-8">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
                            <Sparkles className="h-5 w-5 text-white fill-white/20" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg tracking-tight leading-none text-white">
                                SOZO
                            </span>
                            <span className="text-[10px] font-medium text-indigo-300 tracking-widest uppercase">
                                Anime Studio
                            </span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Button
                            asChild
                            variant={pathname === '/' ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                        >
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                ホーム
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant={pathname.startsWith('/projects') ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                        >
                            <Link href="/projects">
                                <FolderOpen className="mr-2 h-4 w-4" />
                                プロジェクト
                            </Link>
                        </Button>
                    </div>
                </div>
                <Separator className="mx-4 w-auto bg-zinc-800" />
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-zinc-400">
                        最近のプロジェクト
                    </h2>
                    <div className="space-y-1">
                        {/* TODO: Fetch recent projects dynamically */}
                        <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white">
                            <FileText className="mr-2 h-4 w-4" />
                            Project Alpha
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white">
                            <FileText className="mr-2 h-4 w-4" />
                            Project Beta
                        </Button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 left-0 w-full px-4">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                        <AvatarFallback>PM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium leading-none text-white truncate">Production Manager</p>
                        <p className="text-xs text-zinc-400 truncate">pm@sozo-anime.com</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
