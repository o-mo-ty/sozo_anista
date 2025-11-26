'use client'

import { Sidebar } from '@/components/sidebar'
import { SidebarProvider, useSidebar } from '@/components/sidebar-provider'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
    children: React.ReactNode
}

function AppLayoutContent({ children }: AppLayoutProps) {
    const { isCollapsed } = useSidebar()

    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-background to-background">
            <Sidebar />
            <main
                className={cn(
                    "min-h-screen transition-all duration-300 ease-in-out",
                    isCollapsed ? "pl-20" : "pl-64"
                )}
            >
                <div className="container py-6 px-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <SidebarProvider>
            <AppLayoutContent>{children}</AppLayoutContent>
        </SidebarProvider>
    )
}
