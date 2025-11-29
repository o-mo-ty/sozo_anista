import { cn } from '@/lib/utils'
import { ArrowLeft, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
    title: React.ReactNode
    description?: string
    icon?: LucideIcon
    backHref?: string
    children?: React.ReactNode
    className?: string
}

export function PageHeader({
    title,
    description,
    backHref,
    children,
    className
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-4 mb-8", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {backHref && (
                        <Button variant="outline" size="icon" asChild className="h-10 w-10 rounded-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white shrink-0">
                            <Link href={backHref}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                    )}

                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-zinc-400 mt-1">{description}</p>
                        )}
                    </div>
                </div>

                {children && (
                    <div className="flex items-center gap-2">
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
}
