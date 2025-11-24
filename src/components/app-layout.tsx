import { Sidebar } from '@/components/sidebar'

interface AppLayoutProps {
    children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
            <Sidebar />
            <main className="pl-64 min-h-screen">
                <div className="container py-6 px-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
