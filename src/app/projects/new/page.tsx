'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewProjectPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Redirect to project detail (mock ID 1 for now)
        router.push('/projects/1')
    }

    return (
        <AppLayout>
            <div className="max-w-2xl mx-auto">
                <Button variant="ghost" asChild className="mb-6 pl-0 hover:pl-2 transition-all text-zinc-400 hover:text-white">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ホームに戻る
                    </Link>
                </Button>

                <Card className="bg-card/50 border-border backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">新規プロジェクト作成</CardTitle>
                        <CardDescription>
                            新しいアニメーション制作プロジェクトを開始します。
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">プロジェクト名</Label>
                                <Input
                                    id="title"
                                    placeholder="例: エナジードリンクCM 2025春"
                                    className="bg-zinc-900/50 border-zinc-800"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="client">クライアント名</Label>
                                <Input
                                    id="client"
                                    placeholder="例: 株式会社SOZO"
                                    className="bg-zinc-900/50 border-zinc-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="clientEmail">クライアント メールアドレス</Label>
                                <Input
                                    id="clientEmail"
                                    type="email"
                                    placeholder="例: client@example.com"
                                    className="bg-zinc-900/50 border-zinc-800"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">プロジェクト概要</Label>
                                <Textarea
                                    id="description"
                                    placeholder="プロジェクトの目的やターゲット層などを入力してください"
                                    className="min-h-[120px] bg-zinc-900/50 border-zinc-800"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-4">
                                <Button variant="outline" type="button" asChild>
                                    <Link href="/">キャンセル</Link>
                                </Button>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                            作成中...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            プロジェクトを作成
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
