'use client'

import { AppLayout } from '@/components/app-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, FileText, Film, LayoutGrid, MoreHorizontal, Send } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { ScenarioTab } from '@/components/project/scenario-tab'
import { WorkspaceTab } from '@/components/project/workspace-tab'
import { HearingTab } from '@/components/project/hearing-tab'
import { ProjectProgressStepper } from '@/components/project/project-progress-stepper'

// Mock data for development
const MOCK_PROJECT = {
    id: '1',
    title: 'Project Alpha',
    client_name: 'Client A',
    status: 'review', // 'production', 'review', 'completed'
    current_phase: 2, // 1: Initial, 2: Hearing, 3: Scenario, 4: Text Storyboard, 5: Video Storyboard, 6: Production, 7: Final Review, 8: Completed
    description: '新しいエナジードリンクの15秒アニメCM。',
    updated_at: '2023-10-26T10:00:00Z',
}

export default function ProjectDetailPage() {
    const params = useParams()
    const [activeTab, setActiveTab] = useState('overview')

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">完了</Badge>
            case 'review':
                return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">クライアント様確認中</Badge>
            case 'production':
                return <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">制作チーム対応中</Badge>
            default:
                return <Badge variant="outline" className="text-zinc-400 border-zinc-700">準備中</Badge>
        }
    }

    const getNextAction = (phase: number, status: string) => {
        if (status === 'production') {
            return {
                message: '現在、制作チームが作業を進めています。完了までしばらくお待ちください。',
                link: null,
                label: null,
                variant: 'info'
            }
        }
        if (status === 'completed') {
            return {
                message: 'プロジェクトは完了しました。',
                link: null,
                label: null,
                variant: 'success'
            }
        }

        // Status is 'review' (Client needs to act)
        switch (phase) {
            case 2: // Hearing
                return {
                    message: '要対応：ヒアリングシートの記入をお願いします。',
                    link: 'hearing',
                    label: 'ヒアリングシートへ',
                    variant: 'warning'
                }
            case 3: // Scenario
                return {
                    message: '要対応：提案されたシナリオの確認と選択をお願いします。',
                    link: 'scenario',
                    label: 'シナリオ確認へ',
                    variant: 'warning'
                }
            case 4: // Text Storyboard
                return {
                    message: '要対応：字コンテの確認をお願いします。',
                    link: 'workspace',
                    label: '字コンテ確認へ',
                    variant: 'warning'
                }
            default:
                return {
                    message: '要対応：内容の確認をお願いします。',
                    link: 'overview',
                    label: '確認する',
                    variant: 'warning'
                }
        }
    }

    const nextAction = getNextAction(MOCK_PROJECT.current_phase, MOCK_PROJECT.status)

    return (
        <AppLayout>
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4 pl-0 hover:pl-2 transition-all text-zinc-400 hover:text-white">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ホームに戻る
                    </Link>
                </Button>

                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">{MOCK_PROJECT.title}</h1>
                            {getStatusBadge(MOCK_PROJECT.status)}
                        </div>
                        <div className="flex items-center text-zinc-400 gap-4 text-sm">
                            <span>クライアント: {MOCK_PROJECT.client_name}</span>
                            <span>更新日: {new Date(MOCK_PROJECT.updated_at).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Action Banner */}
            <div className={`p-4 rounded-lg border flex items-center justify-between mb-6 ${nextAction.variant === 'warning' ? 'bg-amber-950/30 border-amber-900/50 text-amber-200' :
                nextAction.variant === 'info' ? 'bg-indigo-950/30 border-indigo-900/50 text-indigo-200' :
                    'bg-emerald-950/30 border-emerald-900/50 text-emerald-200'
                }`}>
                <div className="flex items-center gap-3">
                    {nextAction.variant === 'warning' && <AlertCircle className="h-5 w-5 text-amber-400" />}
                    {nextAction.variant === 'info' && <Clock className="h-5 w-5 text-indigo-400" />}
                    {nextAction.variant === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                    <span className="font-medium">{nextAction.message}</span>
                </div>
                {nextAction.link && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab(nextAction.link!)}
                        className={`
                            ${nextAction.variant === 'warning' ? 'border-amber-700 hover:bg-amber-900/50 text-amber-100' : ''}
                            ${nextAction.variant === 'info' ? 'border-indigo-700 hover:bg-indigo-900/50 text-indigo-100' : ''}
                        `}
                    >
                        {nextAction.label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50 border border-border p-1 backdrop-blur-sm">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        概要
                    </TabsTrigger>
                    <TabsTrigger value="hearing" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        ヒアリング
                    </TabsTrigger>
                    <TabsTrigger value="scenario" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                        <FileText className="mr-2 h-4 w-4" />
                        シナリオ
                    </TabsTrigger>
                    <TabsTrigger value="workspace" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                        <Film className="mr-2 h-4 w-4" />
                        ワークスペース
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="space-y-6">
                        <Card className="bg-card/50 border-border backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>プロジェクト詳細</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {MOCK_PROJECT.description}
                                </p>
                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-background/50 border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">開始日</p>
                                        <p className="font-medium">2025年11月24日</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-background/50 border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">納期</p>
                                        <p className="font-medium">2025年12月10日</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 border-border backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>進捗状況</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mt-2">
                                    <ProjectProgressStepper currentPhase={MOCK_PROJECT.current_phase} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="hearing">
                    <HearingTab projectId={MOCK_PROJECT.id} />
                </TabsContent>

                <TabsContent value="scenario">
                    <ScenarioTab projectId={MOCK_PROJECT.id} />
                </TabsContent>

                <TabsContent value="workspace">
                    <WorkspaceTab projectId={MOCK_PROJECT.id} />
                </TabsContent>
            </Tabs>
        </AppLayout>
    )
}
