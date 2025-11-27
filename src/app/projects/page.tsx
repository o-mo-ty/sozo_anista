'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { createClient } from '@/utils/supabase/client'
import { Plus, Search, Filter, MoreHorizontal, FileText } from 'lucide-react'
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

export default function ProjectsPage() {
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

    const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
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

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
                return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20">確認中</Badge>
            case 'production':
                return <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20">制作中</Badge>
            default:
                return <Badge variant="outline" className="text-zinc-400 border-zinc-700">準備中</Badge>
        }
    }

    return (
        <AppLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">プロジェクト一覧</h1>
                        <p className="text-zinc-400 mt-1">すべてのプロジェクトを管理します。</p>
                    </div>
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Link href="/projects/new">
                            <Plus className="mr-2 h-4 w-4" />
                            新規プロジェクト
                        </Link>
                    </Button>
                </div>

                <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="relative w-72">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <Input
                                    placeholder="プロジェクト名、クライアント名で検索..."
                                    className="pl-8 bg-zinc-950/50 border-zinc-800 focus:ring-indigo-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:text-white">
                                <Filter className="mr-2 h-4 w-4" />
                                フィルター
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-zinc-800 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-zinc-950/50">
                                    <TableRow className="border-zinc-800 hover:bg-transparent">
                                        <TableHead className="text-zinc-400 font-medium">プロジェクト名</TableHead>
                                        <TableHead className="text-zinc-400 font-medium">クライアント</TableHead>
                                        <TableHead className="text-zinc-400 font-medium">ステータス</TableHead>
                                        <TableHead className="text-zinc-400 font-medium">現在のフェーズ</TableHead>
                                        <TableHead className="text-zinc-400 font-medium">最終更新</TableHead>
                                        <TableHead className="text-right text-zinc-400 font-medium">操作</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                                読み込み中...
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredProjects.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center text-zinc-500">
                                                プロジェクトが見つかりません
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProjects.map((project) => (
                                            <TableRow key={project.id} className="border-zinc-800 hover:bg-zinc-900/50 group">
                                                <TableCell className="font-medium text-white">
                                                    <Link href={`/projects/${project.id}`} className="flex items-center hover:text-indigo-400 transition-colors">
                                                        <FileText className="mr-2 h-4 w-4 text-zinc-500 group-hover:text-indigo-400" />
                                                        {project.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-zinc-300">{project.client_name}</TableCell>
                                                <TableCell>{getStatusBadge(project.status)}</TableCell>
                                                <TableCell className="text-zinc-300 text-sm">
                                                    {getPhaseLabelJa(project.current_phase)}
                                                </TableCell>
                                                <TableCell className="text-zinc-500 text-sm">
                                                    {new Date(project.updated_at).toLocaleDateString('ja-JP')}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
