'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/utils/supabase/client'
import { Plus, Search, Filter, MoreHorizontal, FileText, X, LayoutGrid, List } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

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

export default function ProjectsPage() {
    const router = useRouter()
    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
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
        const matchesFilter = statusFilter ? project.status === statusFilter : true
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
            <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">プロジェクト一覧</h1>
                            <p className="text-zinc-400 mt-1">すべてのプロジェクトを管理します。</p>
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
                                            className="pl-9 pr-8 bg-zinc-900/50 border-zinc-800 focus:ring-indigo-500 transition-all"
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
                                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                    >
                                        <Search className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>

                            {/* Filter Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`transition-colors ${isFilterOpen || statusFilter ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                            >
                                <Filter className="h-5 w-5" />
                            </Button>

                            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white ml-2">
                                <Link href="/projects/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    新規プロジェクト
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Expandable Filter Bar */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isFilterOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="flex items-center gap-2 p-1">
                            <Badge
                                variant="outline"
                                className={`cursor-pointer px-4 py-1.5 border-zinc-700 hover:bg-zinc-800 transition-colors ${!statusFilter ? 'bg-zinc-800 text-white border-zinc-600' : 'text-zinc-400'}`}
                                onClick={() => setStatusFilter(null)}
                            >
                                すべて
                            </Badge>
                            <Badge
                                variant="outline"
                                className={`cursor-pointer px-4 py-1.5 border-indigo-500/30 hover:bg-indigo-500/20 transition-colors ${statusFilter === 'production' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50' : 'text-zinc-400'}`}
                                onClick={() => setStatusFilter('production')}
                            >
                                制作チーム対応中
                            </Badge>
                            <Badge
                                variant="outline"
                                className={`cursor-pointer px-4 py-1.5 border-amber-500/30 hover:bg-amber-500/20 transition-colors ${statusFilter === 'review' ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'text-zinc-400'}`}
                                onClick={() => setStatusFilter('review')}
                            >
                                クライアント様確認中
                            </Badge>
                            <Badge
                                variant="outline"
                                className={`cursor-pointer px-4 py-1.5 border-emerald-500/30 hover:bg-emerald-500/20 transition-colors ${statusFilter === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'text-zinc-400'}`}
                                onClick={() => setStatusFilter('completed')}
                            >
                                完了
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Modern List View */}
                <div className="rounded-xl overflow-hidden bg-zinc-900/30 border border-zinc-800/50">
                    <Table>
                        <TableHeader className="bg-zinc-900/50">
                            <TableRow className="border-zinc-800 hover:bg-transparent">
                                <TableHead className="text-zinc-400 font-medium pl-6">プロジェクト名</TableHead>
                                <TableHead className="text-zinc-400 font-medium">クライアント</TableHead>
                                <TableHead className="text-zinc-400 font-medium">ステータス</TableHead>
                                <TableHead className="text-zinc-400 font-medium">現在のフェーズ</TableHead>
                                <TableHead className="text-zinc-400 font-medium">最終更新</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                        読み込み中...
                                    </TableCell>
                                </TableRow>
                            ) : filteredProjects.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                        プロジェクトが見つかりません
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProjects.map((project) => (
                                    <TableRow
                                        key={project.id}
                                        className="border-zinc-800/50 hover:bg-zinc-800/50 group cursor-pointer transition-colors"
                                        onClick={() => router.push(`/projects/${project.id}`)}
                                    >
                                        <TableCell className="font-medium text-white pl-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-md bg-zinc-800/50 text-zinc-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
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
        </AppLayout>
    )
}
