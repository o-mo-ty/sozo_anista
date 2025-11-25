import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectProgressStepperProps {
    currentPhase: number
}

const STEPS = [
    { id: 1, label: '開始' },
    { id: 2, label: 'ヒアリング' },
    { id: 3, label: 'シナリオ' },
    { id: 4, label: '字コンテ' },
    { id: 5, label: '絵コンテ' },
    { id: 6, label: '動画編集' },
    { id: 7, label: '納品' },
]

export function ProjectProgressStepper({ currentPhase }: ProjectProgressStepperProps) {
    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="flex min-w-max">
                {STEPS.map((step, index) => {
                    const isCompleted = step.id < currentPhase
                    const isCurrent = step.id === currentPhase
                    const isFuture = step.id > currentPhase

                    return (
                        <div
                            key={step.id}
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
                    )
                })}
            </div>
        </div>
    )
}
