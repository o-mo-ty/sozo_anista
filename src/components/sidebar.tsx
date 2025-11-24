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
        <div className={cn('pb-12 w-64 border-r bg-zinc-950/50 backdrop-blur-xl h-screen fixed left-0 top-0 z-50', className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex items-center gap-2 px-4 mb-6">
                        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                            <Video className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-lg font-bold tracking-tight text-white">
                            AI Anime Studio
                        </h2>
                    </div>
                    <div className="space-y-1">
                        <Button
                            asChild
                            variant={pathname === '/' ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                        >
                            <Link href="/">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant={pathname.startsWith('/projects') ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                        >
                            <Link href="/projects">
                                <FolderOpen className="mr-2 h-4 w-4" />
                                Projects
                            </Link>
                        </Button>
                    </div>
                </div>
                <Separator className="mx-4 w-auto bg-zinc-800" />
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-zinc-400">
                        Recent Projects
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
