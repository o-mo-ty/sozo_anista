import { Sidebar } from '@/components/sidebar'

interface AppLayoutProps {
    children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-background to-background">
            <Sidebar />
            <main className="pl-64 min-h-screen">
                <div className="container py-6 px-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
