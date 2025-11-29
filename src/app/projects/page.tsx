'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/utils/supabase/client'
import { Plus, Search, Filter, MoreHorizontal, FileText, X, LayoutGrid, List } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, Suspense } from 'react'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'

type Project = {
    id: string
    title: string
    client_name: string
    status: string
    current_phase: number
    updated_at: string
}

// Mock Data
const MOCK_PROJECTS: Project[] = [
    {
        id: '1',
        title: 'Project Alpha',
        client_name: 'Client A',
        status: 'production',
        current_phase: 4,
        updated_at: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Project Beta',
        client_name: 'Client B',
        status: 'review',
        current_phase: 6,
        updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
        id: '3',
        title: 'Project Gamma',
        client_name: 'Client C',
        status: 'completed',
        current_phase: 7,
        updated_at: new Date(Date.now() - 172800000).toISOString(),
    },
]

function ProjectsContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialFilter = searchParams.get('filter')

    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(!!initialFilter)
    const [statusFilter, setStatusFilter] = useState<string | null>(initialFilter)

    // Update filter when URL changes
    useEffect(() => {
        const filter = searchParams.get('filter')
        if (filter) {
            setStatusFilter(filter)
            setIsFilterOpen(true)
        } else {
            // Optional: clear filter if URL param is removed, or keep current state
            // For now, let's respect the URL if it exists, otherwise keep manual state
        }
    }, [searchParams])

    // const supabase = createClient()

    // useEffect(() => {
    //     const fetchProjects = async () => {
    //         setIsLoading(true)
    //         const { data, error } = await supabase
    //             .from('projects')
    //             .select('*')
    //             .order('updated_at', { ascending: false })

    //         if (data) {
    //             setProjects(data)
    //         }
    //         setIsLoading(false)
    //     }
    //     fetchProjects()
    // }, [])

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.client_name.toLowerCase().includes(searchQuery.toLowerCase())

        let matchesFilter = true
        if (statusFilter === 'not_completed') {
            matchesFilter = project.status !== 'completed'
        } else if (statusFilter) {
            matchesFilter = project.status === statusFilter
        }

        return matchesSearch && matchesFilter
    })

    const getPhaseLabel = (phase: number) => {
        const phases = [
            'Project Launch',
            'Hearing',
            'Scenario',
            'Text Storyboard',
            'Video Storyboard',
            'Rough Video',
            'Delivery'
        ]
        // Adjust for 1-based index if necessary, assuming phase stored as 1-7
        const index = phase - 1
        return phases[index] ? `Step ${phase}: ${phases[index]}` : `Step ${phase}`
    }

    // Japanese Phase Labels for display
    const getPhaseLabelJa = (phase: number) => {
        const phases = [
            'プロジェクト立ち上げ',
            'ヒアリング',
            'シナリオ',
            '字コンテ',
            '絵コンテ', // Assuming Video Storyboard maps to 絵コンテ or similar
            'ラフ動画',
            '納品'
        ]
        const index = phase - 1
        return phases[index] ? `Step ${phase}: ${phases[index]}` : `Step ${phase}`
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">完了</Badge>
            case 'review':
                return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20">クライアント様確認中</Badge>
            case 'production':
                return <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20">制作チーム対応中</Badge>
            default:
                return <Badge variant="outline" className="text-zinc-400 border-zinc-700">準備中</Badge>
        }
    }

    return (
        <AppLayout>
            <div>
                <div>
                    {/* Header */}
                    <PageHeader
                        title="プロジェクト一覧"
                        description="すべてのプロジェクトを管理します。"
                    />

                    {/* Unified Card Container */}
                    <div className="rounded-2xl border border-white/5 bg-zinc-900/30 overflow-hidden backdrop-blur-sm shadow-xl">
                        {/* Card Header / Action Bar */}
                        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5">
                            <div className="text-sm text-zinc-400 font-medium pl-2">
                                全 {filteredProjects.length} 件のプロジェクト
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Expandable Search */}
                                <div className={`relative transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-64' : 'w-10'}`}>
                                    {isSearchOpen ? (
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input
                                                autoFocus
                                                placeholder="検索..."
                                                className="pl-9 pr-8 bg-zinc-950/50 border-zinc-700 focus:ring-indigo-500 transition-all h-9 text-sm"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onBlur={() => !searchQuery && setIsSearchOpen(false)}
                                            />
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('')
                                                    setIsSearchOpen(false)
                                                }}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsSearchOpen(true)}
                                            className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-9 w-9"
                                        >
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                {/* Filter Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`transition-colors h-9 w-9 ${isFilterOpen || statusFilter ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                                >
                                    <Filter className="h-4 w-4" />
                                </Button>

                                <div className="h-6 w-px bg-zinc-800 mx-2" />

                                <Button asChild className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 shadow-none h-9 text-sm px-4">
                                    <Link href="/projects/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        新規プロジェクト
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Expandable Filter Bar (Inside Card) */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-zinc-900/50 border-b border-white/5 ${isFilterOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="flex items-center gap-2 p-3 pl-6">
                                <span className="text-xs text-zinc-500 mr-2">ステータス:</span>
                                <Badge
                                    variant="outline"
                                    className={`cursor-pointer px-3 py-1 border-zinc-700 hover:bg-zinc-800 transition-colors ${!statusFilter ? 'bg-zinc-800 text-white border-zinc-600' : 'text-zinc-400'}`}
                                    onClick={() => setStatusFilter(null)}
                                >
                                    すべて
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`cursor-pointer px-3 py-1 border-indigo-500/30 hover:bg-indigo-500/20 transition-colors ${statusFilter === 'not_completed' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' : 'text-zinc-400'}`}
                                    onClick={() => setStatusFilter('not_completed')}
                                >
                                    完了以外
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`cursor-pointer px-3 py-1 border-indigo-500/30 hover:bg-indigo-500/20 transition-colors ${statusFilter === 'production' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' : 'text-zinc-400'}`}
                                    onClick={() => setStatusFilter('production')}
                                >
                                    制作チーム対応中
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`cursor-pointer px-3 py-1 border-amber-500/30 hover:bg-amber-500/20 transition-colors ${statusFilter === 'review' ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'text-zinc-400'}`}
                                    onClick={() => setStatusFilter('review')}
                                >
                                    クライアント様確認中
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`cursor-pointer px-3 py-1 border-emerald-500/30 hover:bg-emerald-500/20 transition-colors ${statusFilter === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'text-zinc-400'}`}
                                    onClick={() => setStatusFilter('completed')}
                                >
                                    完了
                                </Badge>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-zinc-900/50 border-b border-white/5">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="text-zinc-500 font-medium pl-6 h-12">プロジェクト名</TableHead>
                                        <TableHead className="text-zinc-500 font-medium h-12">クライアント</TableHead>
                                        <TableHead className="text-zinc-500 font-medium h-12">ステータス</TableHead>
                                        <TableHead className="text-zinc-500 font-medium h-12">現在のフェーズ</TableHead>
                                        <TableHead className="text-zinc-500 font-medium h-12">最終更新</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                                                読み込み中...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredProjects.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                                                プロジェクトが見つかりません
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProjects.map((project) => (
                                            <TableRow
                                                key={project.id}
                                                className="border-b border-white/5 hover:bg-white/5 group cursor-pointer transition-all"
                                                onClick={() => router.push(`/projects/${project.id}`)}
                                            >
                                                <TableCell className="font-medium text-white pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-zinc-800/50 text-zinc-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors ring-1 ring-white/5">
                                                            <FileText className="h-4 w-4" />
                                                        </div>
                                                        <span className="group-hover:text-indigo-400 transition-colors">{project.title}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-zinc-300">{project.client_name}</TableCell>
                                                <TableCell>{getStatusBadge(project.status)}</TableCell>
                                                <TableCell className="text-zinc-300 text-sm">
                                                    {getPhaseLabelJa(project.current_phase)}
                                                </TableCell>
                                                <TableCell className="text-zinc-500 text-sm">
                                                    {new Date(project.updated_at).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default function ProjectsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProjectsContent />
        </Suspense>
    )
}
