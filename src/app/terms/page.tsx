'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
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
                    <h1 className="text-3xl font-bold text-white mb-2">利用規約</h1>
                    <p className="text-sm text-zinc-500 mb-12">最終更新日: 2025年11月29日</p>

                    <div className="space-y-12 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第1条（適用）</h2>
                            <p>
                                本規約は、SOZO Anime Studio（以下「当社」といいます。）が提供するアニメーション制作管理システム（以下「本サービス」といいます。）の利用に関する条件を定めるものです。本サービスを利用する全てのユーザー（以下「利用者」といいます。）は、本規約に同意したものとみなされます。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第2条（アカウント管理）</h2>
                            <p>
                                利用者は、当社から発行または招待されたアカウント（メールアドレス、パスワード、OTP等を含みます。）を自己の責任において適切に管理するものとします。アカウント情報の漏洩や第三者による不正使用により生じた損害について、当社は一切の責任を負いません。
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第3条（AI生成機能に関する特約）</h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-600">
                                <li>
                                    本サービスは、OpenAI社等の第三者が提供する生成AI技術（API）を利用しています。
                                </li>
                                <li>
                                    当社は、本サービスを通じて生成された成果物（シナリオ、画像、動画等）の完全性、正確性、有用性、および第三者の権利を侵害していないことを保証しません。
                                </li>
                                <li>
                                    利用者は、生成AI特有の性質（いわゆる「ハルシネーション」等の事実と異なる出力や、予期しない出力が含まれる可能性）を理解し、自己の判断と責任において成果物を利用するものとします。
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第4条（知的財産権）</h2>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-600">
                                <li>
                                    本サービスを通じて生成された成果物の著作権その他一切の権利は、特段の定めがない限り、納品完了をもって利用者に帰属するものとします。
                                </li>
                                <li>
                                    利用者が本サービスに入力したデータ（プロンプト、指示文等）は、AIモデルの学習目的には使用されません。ただし、サービスの改善や不具合対応のために、当社およびAPI提供者が当該データを一時的に参照する場合があります。
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第5条（禁止事項）</h2>
                            <p className="mb-4">利用者は、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-zinc-600">
                                <li>法令または公序良俗に違反する行為。</li>
                                <li>犯罪行為に関連する行為。</li>
                                <li>
                                    生成AIに対して、性的、暴力的、差別的、その他他人に不快感を与えるコンテンツを生成させるようなプロンプトを入力する行為。
                                </li>
                                <li>当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為。</li>
                                <li>その他、当社が不適切と判断する行為。</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-white mb-4">第6条（免責）</h2>
                            <p>
                                当社は、本サービスの利用または利用不能により利用者に生じた損害（AI生成物の内容に起因するトラブルを含みます。）について、当社の故意または重過失による場合を除き、一切の責任を負わないものとします。また、当社が責任を負う場合であっても、その賠償額は、利用者が当社に支払った利用料金の直近1ヶ月分を上限とします。
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
