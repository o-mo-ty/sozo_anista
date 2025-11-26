import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectProgressStepperProps {
    currentPhase: number
}

export const STEPS = [
    { id: 1, label: '開始', date: '11/24' },
    { id: 2, label: 'ヒアリング', date: '11/25' },
    { id: 3, label: 'シナリオ', date: '11/28' },
    { id: 4, label: '字コンテ', date: '11/30' },
    { id: 5, label: 'ビデオコンテ', date: '12/03' },
    { id: 6, label: '制作', date: '12/08' },
    { id: 7, label: '納品', date: '12/10' },
]

export function ProjectProgressStepper({ currentPhase }: ProjectProgressStepperProps) {
    // Mock "today" for demonstration
    const today = '11/26'

    return (
        <div className="w-full overflow-x-auto pb-6">
            <div className="flex min-w-max">
                {STEPS.map((step, index) => {
                    const isCompleted = step.id < currentPhase
                    const isCurrent = step.id === currentPhase
                    const isFuture = step.id > currentPhase

                    // Alert logic:
                    // Simple string comparison for demo (MM/DD)
                    // In real app, use Date objects
                    const isPastDue = step.date < today
                    const isNearDue = step.date === today || step.date === '11/27' || step.date === '11/28' // Mock "near" logic

                    // Determine date color
                    let dateColor = "text-zinc-600"
                    if (isCompleted) {
                        dateColor = "text-zinc-500"
                    } else if (isCurrent) {
                        if (isPastDue) dateColor = "text-red-500 font-bold"
                        else if (isNearDue) dateColor = "text-orange-500 font-bold"
                        else dateColor = "text-indigo-400 font-bold"
                    } else if (isFuture) {
                        // Future steps that are already past due (delayed project)
                        if (isPastDue) dateColor = "text-red-400"
                    }

                    return (
                        <div key={step.id} className="relative flex flex-col items-center group">
                            <div
                                className={cn(
                                    "relative flex items-center justify-center h-12 px-8 min-w-[140px] transition-all duration-300",
                                    // Base shape styles using clip-path for chevron effect
                                    "first:pl-6 last:pr-6",
                                    index !== 0 && "-ml-4", // Overlap

                                    // Colors
                                    isCompleted && "bg-slate-800 text-slate-400 z-10",
                                    isCurrent && "bg-gradient-to-r from-indigo-600 to-purple-600 text-white z-20 shadow-lg shadow-indigo-500/20",
                                    isFuture && "bg-slate-900/50 text-slate-600 z-0 border-y border-r border-slate-800/50"
                                )}
                                style={{
                                    clipPath: index === 0
                                        ? 'polygon(0 0, calc(100% - 1rem) 0, 100% 50%, calc(100% - 1rem) 100%, 0 100%)'
                                        : index === STEPS.length - 1
                                            ? 'polygon(1rem 0, 100% 0, 100% 100%, 1rem 100%, 0 50%)'
                                            : 'polygon(1rem 0, calc(100% - 1rem) 0, 100% 50%, calc(100% - 1rem) 100%, 1rem 100%, 0 50%)'
                                }}
                            >
                                <div className="flex items-center gap-2 z-10">
                                    {isCompleted && <Check className="w-4 h-4" />}
                                    <span className={cn(
                                        "text-sm font-bold whitespace-nowrap",
                                        isCurrent ? "text-white" : "text-inherit"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                            </div>

                            {/* Date Display */}
                            <div className={cn(
                                "absolute -bottom-6 text-xs font-mono transition-colors duration-300",
                                dateColor
                            )}>
                                {step.date}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
