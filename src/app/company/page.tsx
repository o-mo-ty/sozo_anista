'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function CompanyPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-indigo-500/30">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
                            <Sparkles className="h-4 w-4 text-white fill-white/20" />
                        </div>
                        <span className="font-bold text-white tracking-tight">SOZO Anime Studio</span>
                    </div>
                    <Button variant="ghost" asChild className="text-zinc-400 hover:text-white hover:bg-white/5">
                        <Link href="/login">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            ログイン画面に戻る
                        </Link>
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-12">運営会社</h1>

                    <div className="border border-white/10 rounded-xl overflow-hidden bg-zinc-900/20">
                        <dl className="divide-y divide-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 hover:bg-white/5 transition-colors">
                                <dt className="font-medium text-zinc-400">社名 (商号)</dt>
                                <dd className="md:col-span-2 font-bold text-white text-lg">株式会社 海馬</dd>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 hover:bg-white/5 transition-colors">
                                <dt className="font-medium text-zinc-400">代表者</dt>
                                <dd className="md:col-span-2 text-zinc-100">代表取締役社長 北村 勝利</dd>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 hover:bg-white/5 transition-colors">
                                <dt className="font-medium text-zinc-400">本店所在地</dt>
                                <dd className="md:col-span-2 text-zinc-100">東京都港区麻布十番</dd>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 hover:bg-white/5 transition-colors">
                                <dt className="font-medium text-zinc-400">設立</dt>
                                <dd className="md:col-span-2 text-zinc-100">2021年</dd>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 hover:bg-white/5 transition-colors">
                                <dt className="font-medium text-zinc-400">Webサイト</dt>
                                <dd className="md:col-span-2">
                                    <a
                                        href="https://kaiba.company"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                                    >
                                        https://kaiba.company
                                        <ExternalLink className="ml-1 h-4 w-4" />
                                    </a>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 bg-zinc-950">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <p className="text-xs text-zinc-600">
                        Copyright &copy; Kaiba Inc. All Rights Reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
