'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, ArrowRight, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [isLoading, setIsLoading] = useState(false)

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
        setStep('otp')
    }

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value[0]
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (otp.some(d => !d)) return
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        // Redirect would happen here
        window.location.href = '/projects'
    }

    return (
        <div className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo Area */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/20 mb-6 border border-white/10">
                        <Sparkles className="h-8 w-8 text-white fill-white/20" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                        SOZO Anime Studio
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        次世代のアニメーション制作管理プラットフォーム
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {step === 'email' ? (
                                <motion.div
                                    key="email-step"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-white mb-2">ログイン</h2>
                                        <p className="text-sm text-zinc-400">
                                            招待されたメールアドレスを入力してください。
                                        </p>
                                    </div>

                                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-zinc-300 ml-1">メールアドレス</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                                                <Input
                                                    type="email"
                                                    placeholder="name@company.com"
                                                    className="pl-10 bg-zinc-950/50 border-zinc-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-11 transition-all"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    ログインコードを送信
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="otp-step"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-6">
                                        <button
                                            onClick={() => setStep('email')}
                                            className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center mb-4 transition-colors"
                                        >
                                            <ArrowLeft className="mr-1 h-3 w-3" />
                                            メールアドレス入力に戻る
                                        </button>
                                        <h2 className="text-xl font-semibold text-white mb-2">認証コードを入力</h2>
                                        <p className="text-sm text-zinc-400">
                                            <span className="text-zinc-200 font-medium">{email}</span> 宛に送信された6桁のコードを入力してください。
                                        </p>
                                    </div>

                                    <form onSubmit={handleLogin} className="space-y-6">
                                        <div className="flex justify-between gap-2">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                                    className="w-10 h-12 md:w-12 md:h-14 text-center text-xl font-bold bg-zinc-950/50 border border-zinc-800 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-white"
                                                />
                                            ))}
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300"
                                            disabled={isLoading || otp.some(d => !d)}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    ログイン
                                                    <CheckCircle2 className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
                                                onClick={() => {
                                                    setIsLoading(true)
                                                    setTimeout(() => setIsLoading(false), 1000)
                                                }}
                                            >
                                                コードが届かない場合は再送信
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer / Legal */}
                    <div className="bg-zinc-950/30 border-t border-white/5 p-4 text-center">
                        <p className="text-[10px] text-zinc-500 mb-2">
                            ログインすることで、以下の規約に同意したことになります。
                        </p>
                        <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-600">
                            <Link href="#" className="hover:text-zinc-400 transition-colors">利用規約</Link>
                            <span className="text-zinc-800">|</span>
                            <Link href="#" className="hover:text-zinc-400 transition-colors">プライバシーポリシー</Link>
                            <span className="text-zinc-800">|</span>
                            <Link href="#" className="hover:text-zinc-400 transition-colors">運営会社</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
