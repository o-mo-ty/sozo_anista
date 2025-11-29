'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
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
                    <h1 className="text-3xl font-bold text-white mb-2">プライバシーポリシー</h1>
                    <p className="text-sm text-zinc-500 mb-12">最終更新日: 2025年11月29日</p>

                    <div className="space-y-12 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第1条（個人情報の定義）</h2>
                            <p>
                                本ポリシーにおける個人情報とは、氏名、メールアドレス、所属企業名、および特定の個人を識別できる情報を指します。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第2条（収集する情報）</h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-600">
                                <li>アカウント情報（氏名、メールアドレス）</li>
                                <li>システム利用ログ（アクセス日時、IPアドレス）</li>
                                <li>AI生成のために入力されたテキスト・画像データ</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第3条（利用目的）</h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-600">
                                <li>本サービスの提供および本人確認のため。</li>
                                <li>不正利用の防止およびセキュリティ確保のため。</li>
                                <li>アフターサービスおよびお問い合わせ対応のため。</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第4条（AIモデルへのデータ送信と非学習保証）</h2>
                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-6">
                                <p className="font-medium text-indigo-200 mb-4">【重要】</p>
                                <ul className="list-disc pl-5 space-y-2 marker:text-indigo-500/50">
                                    <li>
                                        本サービスは、生成機能の提供のためにOpenAI社等の外部APIを利用します。
                                    </li>
                                    <li>
                                        利用者が入力したデータ（プロンプト等）は、外部APIプロバイダーに送信されますが、<strong className="text-white">AIモデルの学習（トレーニング）には利用されません</strong>（各APIの規約に準拠）。
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第5条（第三者提供）</h2>
                            <p>
                                法令に基づく場合や、上記AIプロバイダーへのAPI送信を除き、利用者の同意なく第三者に個人情報を提供しません。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第6条（安全管理措置）</h2>
                            <p>
                                データの暗号化（SSL/TLS）やアクセス制御など、適切なセキュリティ対策を講じています。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第7条（お問い合わせ窓口）</h2>
                            <p>
                                個人情報の取り扱いに関するお問い合わせは、運営事務局までご連絡ください。
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 bg-zinc-950">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <p className="text-xs text-zinc-600">
                        &copy; 2025 SOZO Anime Studio. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
