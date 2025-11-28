'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Sparkles } from 'lucide-react'
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
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">新規プロジェクト作成</h1>
                    <p className="text-zinc-400 mt-1">新しいアニメーション制作プロジェクトを開始します。</p>
                </div>

                <div className="max-w-4xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info Section */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-zinc-300">プロジェクト名 <span className="text-rose-500">*</span></Label>
                                <Input
                                    id="title"
                                    placeholder="例: エナジードリンクCM 2025春"
                                    className="bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all h-11"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="client" className="text-zinc-300">クライアント名 <span className="text-rose-500">*</span></Label>
                                    <Input
                                        id="client"
                                        placeholder="例: 株式会社SOZO"
                                        className="bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all h-11"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientEmail" className="text-zinc-300">クライアントメールアドレス <span className="text-rose-500">*</span></Label>
                                    <Input
                                        id="clientEmail"
                                        type="email"
                                        multiple
                                        placeholder="例: client@example.com, manager@example.com"
                                        className="bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all h-11"
                                        required
                                    />
                                    <p className="text-xs text-zinc-500">カンマ区切りで複数のメールアドレスを入力できます。</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-zinc-300">プロジェクト概要</Label>
                                <Textarea
                                    id="description"
                                    placeholder="プロジェクトの目的やターゲット層などを入力してください"
                                    className="min-h-[150px] bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px] h-11" disabled={isLoading}>
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
                            <Button variant="ghost" type="button" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-11">
                                <Link href="/">キャンセル</Link>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}
