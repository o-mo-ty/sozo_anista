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
import { ProjectProgressStepper } from '@/components/project/project-progress-stepper'

// Mock data for development
const MOCK_PROJECT = {
    id: '1',
    title: 'Project Alpha',
    client: 'Client A',
    status: 'In Progress',
    phase: 4, // Step 4: Text Storyboard
    description: 'A 15-second anime commercial for a new energy drink.',
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
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                                {MOCK_PROJECT.status}
                            </Badge>
                        </div>
                        <p className="text-zinc-400">クライアント: {MOCK_PROJECT.client}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right mr-4">
                            <p className="text-xs text-zinc-500 uppercase font-semibold">現在のフェーズ</p>
                            <p className="text-sm font-medium text-indigo-400">
                                Step {MOCK_PROJECT.phase}: 字コンテ
                                <span className="ml-2 text-xs text-zinc-500 font-normal">
                                    (締切: 11/30)
                                </span>
                            </p>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Send className="mr-2 h-4 w-4" />
                            レビュー依頼
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50 border border-border p-1 backdrop-blur-sm">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        概要
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
                                <CardDescription>全体の完了率</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                                                In Progress
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-semibold inline-block text-primary">
                                                57%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-muted">
                                        <div style={{ width: "57%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <ProjectProgressStepper currentPhase={MOCK_PROJECT.phase} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="scenario">
                    <ScenarioTab />
                </TabsContent>

                <TabsContent value="workspace">
                    <WorkspaceTab />
                </TabsContent>
            </Tabs>
        </AppLayout>
    )
}
