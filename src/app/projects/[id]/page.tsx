'use client'

import { AppLayout } from '@/components/app-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, CheckCircle2, Clock, FileText, Film, LayoutGrid, Send } from 'lucide-react'
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
    client: 'Client A',
    status: 'In Progress',
    phase: 4, // Step 4: Text Storyboard
    description: '新しいエナジードリンクの15秒アニメCM。',
}

export default function ProjectDetailPage() {
    const params = useParams()
    const [activeTab, setActiveTab] = useState('overview')

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
                            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-base px-3 py-1">
                                Step {MOCK_PROJECT.phase}: 字コンテ
                            </Badge>
                        </div>
                        <p className="text-zinc-400">クライアント: {MOCK_PROJECT.client}</p>
                    </div>
                </div>
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
                                    <ProjectProgressStepper currentPhase={MOCK_PROJECT.phase} />
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
