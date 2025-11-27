'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'


interface HearingTabProps {
    projectId: string
}

export function HearingTab({ projectId }: HearingTabProps) {
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()
    const [formData, setFormData] = useState({
        // 1. プロジェクト概要
        title: '',
        purpose: '',
        aspectRatio: '',
        targetAge: '',
        targetGender: '',
        viewingHabit: '',
        device: '',
        length: '',
        // 2. コンセプト・メッセージ
        message: '',
        keywords: '',
        hook: '',
        emotionFlow: '',
        finalEmotion: '',
        climaxMessage: '',
        conceptNotes: '',
        // 3. 参考・競合分析
        referenceUrls: '',
        avoidExpressions: '',
        differentiation: '',
        usp: '',
        // 4. ビジュアル・技術仕様
        animationStyle: '',
        characterDesign: '',
        brandColor: '',
        speed: '',
        narration: '',
        voiceTone: '',
        subtitles: '',
        bgm: '',
        sfx: '',
        forbiddenVisuals: '',
        // 5. プラットフォーム戦略
        platform: '',
        postStrategy: '',
        hashtagStrategy: '',
        postTime: '',
        platformOptimization: '',
        // 6. 視聴者行動設計
        action: '',
        commentReaction: '',
        linkGuidance: '',
        cta: '',
        // 7. ブランディング・権利
        logoUsage: '',
        characterUsage: '',
        trademarkNotes: '',
        secondaryUse: '',
        // 8. 制作・納期
        budget: '',
        deadline: '',
        revisionLimit: '',
        checkTiming: '',
        format: '',
        assets: '',
        // 9. AI利用・権利関係
        aiDisclosure: '',
        dataConstraints: '',
        ownership: '',
        compliance: '',
        // 10. その他
        otherNotes: '',
        expectations: '',
    })

    useEffect(() => {
        const loadData = async () => {
            if (!projectId) return
            setIsLoading(true)
            const { data, error } = await supabase
                .from('hearing_sheets')
                .select('responses')
                .eq('project_id', projectId)
                .single()

            if (data && data.responses) {
                setFormData(prev => ({ ...prev, ...data.responses }))
            }
            setIsLoading(false)
        }
        loadData()
    }, [projectId])

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Check if exists
            const { data: existing } = await supabase
                .from('hearing_sheets')
                .select('id')
                .eq('project_id', projectId)
                .single()

            let error;
            if (existing) {
                const { error: updateError } = await supabase
                    .from('hearing_sheets')
                    .update({
                        responses: formData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('project_id', projectId)
                error = updateError
            } else {
                const { error: insertError } = await supabase
                    .from('hearing_sheets')
                    .insert({
                        project_id: projectId,
                        responses: formData,
                        status: 'draft'
                    })
                error = insertError
            }

            if (error) throw error
            alert('保存しました')
        } catch (e) {
            console.error('Error saving hearing sheet:', e)
            alert('保存に失敗しました')
        } finally {
            setIsSaving(false)
        }
    }

    // if (isLoading) {
    //     return <div className="text-center py-20 text-zinc-500">読み込み中...</div>
    // }

    return (
        <div className="space-y-8 pb-20 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-indigo-400" />
                        ヒアリングシート
                        {isLoading && (
                            <span className="text-sm font-normal text-zinc-500 ml-2 animate-pulse">
                                データ読み込み中...
                            </span>
                        )}
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        プロジェクトの要件を詳細に定義します。全10セクション。
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving || isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                >
                    {isSaving ? (
                        <>保存中...</>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            保存する
                        </>
                    )}
                </Button>
            </div>

            {/* 1. プロジェクト概要 */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg text-indigo-300">1. プロジェクト概要</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                        <Label>動画のタイトル</Label>
                        <Input placeholder="制作する動画のタイトル" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label>目的・用途</Label>
                        <Select value={formData.purpose} onValueChange={(v) => handleChange('purpose', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ad_web">広告（WEB広告、SNS広告など）</SelectItem>
                                <SelectItem value="sns_organic">SNS投稿（オーガニック）</SelectItem>
                                <SelectItem value="presentation">プレゼンテーション資料</SelectItem>
                                <SelectItem value="training">研修・教育コンテンツ</SelectItem>
                                <SelectItem value="event">イベント・展示会用</SelectItem>
                                <SelectItem value="website">Webサイト掲載用</SelectItem>
                                <SelectItem value="brand_awareness">ブランド認知向上</SelectItem>
                                <SelectItem value="product_intro">商品・サービス紹介</SelectItem>
                                <SelectItem value="recruit">採用・リクルート</SelectItem>
                                <SelectItem value="engagement">顧客エンゲージメント向上</SelectItem>
                                <SelectItem value="viral">バイラル拡散狙い</SelectItem>
                                <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>公開予定媒体（アスペクト比）</Label>
                        <Select value={formData.aspectRatio} onValueChange={(v) => handleChange('aspectRatio', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="16:9">16:9（YouTube、Webサイト、プレゼン画面用）</SelectItem>
                                <SelectItem value="9:16">9:16（TikTok、Instagramリール、Shorts）</SelectItem>
                                <SelectItem value="1:1">1:1（Instagramフィード投稿など）</SelectItem>
                                <SelectItem value="4:5">4:5（Instagramフィード投稿など縦長）</SelectItem>
                                <SelectItem value="undecided">決めていない/未定</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>ターゲット年齢層</Label>
                        <Select value={formData.targetAge} onValueChange={(v) => handleChange('targetAge', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10s">10代</SelectItem>
                                <SelectItem value="20s_early">20代前半</SelectItem>
                                <SelectItem value="20s_late">20代後半</SelectItem>
                                <SelectItem value="30s">30代</SelectItem>
                                <SelectItem value="40s_plus">40代以上</SelectItem>
                                <SelectItem value="wide">幅広い年齢層</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>ターゲット性別</Label>
                        <Select value={formData.targetGender} onValueChange={(v) => handleChange('targetGender', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">男性</SelectItem>
                                <SelectItem value="female">女性</SelectItem>
                                <SelectItem value="any">問わない</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>視聴習慣</Label>
                        <Select value={formData.viewingHabit} onValueChange={(v) => handleChange('viewingHabit', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="morning">朝</SelectItem>
                                <SelectItem value="lunch">昼休み</SelectItem>
                                <SelectItem value="night">夜</SelectItem>
                                <SelectItem value="bedtime">就寝前</SelectItem>
                                <SelectItem value="any">特に考慮不要</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>主な視聴デバイス</Label>
                        <Select value={formData.device} onValueChange={(v) => handleChange('device', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mobile">主にスマホ</SelectItem>
                                <SelectItem value="tablet_mix">タブレット併用</SelectItem>
                                <SelectItem value="pc_mix">PC併用</SelectItem>
                                <SelectItem value="any">特に考慮不要</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>希望の長さ</Label>
                        <Select value={formData.length} onValueChange={(v) => handleChange('length', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15s">15秒</SelectItem>
                                <SelectItem value="30s">30秒</SelectItem>
                                <SelectItem value="45s">45秒</SelectItem>
                                <SelectItem value="60s">60秒</SelectItem>
                                <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* 2. コンセプト・メッセージ */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg text-indigo-300">2. コンセプト・メッセージ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>伝えたいメッセージやストーリー</Label>
                        <Textarea placeholder="メインメッセージ" value={formData.message} onChange={(e) => handleChange('message', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>追加したいキーワードやテーマ</Label>
                            <Input value={formData.keywords} onChange={(e) => handleChange('keywords', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>フック要素（最初の3秒）の要望</Label>
                            <Input value={formData.hook} onChange={(e) => handleChange('hook', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>想定している感情の流れ</Label>
                            <Select value={formData.emotionFlow} onValueChange={(v) => handleChange('emotionFlow', v)}>
                                <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="surprise_empathy">驚き→共感→満足</SelectItem>
                                    <SelectItem value="question_understanding">疑問→理解→納得</SelectItem>
                                    <SelectItem value="interest_emotion">関心→感動→行動意欲</SelectItem>
                                    <SelectItem value="other">その他</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>視聴者に最終的に感じてほしい感情</Label>
                            <Input value={formData.finalEmotion} onChange={(e) => handleChange('finalEmotion', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>クライマックスで最も伝えたいメッセージ</Label>
                        <Input value={formData.climaxMessage} onChange={(e) => handleChange('climaxMessage', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label>このセクションについて（備考）</Label>
                        <Input placeholder="例：コンセプトはお任せ" value={formData.conceptNotes} onChange={(e) => handleChange('conceptNotes', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                    </div>
                </CardContent>
            </Card>

            {/* 3. 参考・競合分析 */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg text-indigo-300">3. 参考・競合分析</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>参考にしたい類似動画（3-5本のURL）</Label>
                        <Textarea value={formData.referenceUrls} onChange={(e) => handleChange('referenceUrls', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label>絶対に避けたい表現や演出</Label>
                        <Input value={formData.avoidExpressions} onChange={(e) => handleChange('avoidExpressions', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>競合他社との差別化ポイント</Label>
                            <Input value={formData.differentiation} onChange={(e) => handleChange('differentiation', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>ブランドの独自性・強み</Label>
                            <Input value={formData.usp} onChange={(e) => handleChange('usp', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 4. ビジュアル・技術仕様 */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg text-indigo-300">4. ビジュアル・技術仕様</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>アニメーションスタイル</Label>
                        <Select value={formData.animationStyle} onValueChange={(v) => handleChange('animationStyle', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2d_hand">2D手描き風</SelectItem>
                                <SelectItem value="2d_digital">2Dデジタル</SelectItem>
                                <SelectItem value="3d">3D</SelectItem>
                                <SelectItem value="motion_graphics">モーショングラフィックス</SelectItem>
                                <SelectItem value="vfx">実写合成</SelectItem>
                                <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>キャラクターデザイン</Label>
                        <Select value={formData.characterDesign} onValueChange={(v) => handleChange('characterDesign', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="simple">シンプル</SelectItem>
                                <SelectItem value="real">リアル</SelectItem>
                                <SelectItem value="cute">可愛い系</SelectItem>
                                <SelectItem value="cool">クール系</SelectItem>
                                <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>メインカラー・ブランドカラー</Label>
                        <Input value={formData.brandColor} onChange={(e) => handleChange('brandColor', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label>アニメーションの速度感</Label>
                        <Select value={formData.speed} onValueChange={(v) => handleChange('speed', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="speedy">スピーディ</SelectItem>
                                <SelectItem value="standard">標準的</SelectItem>
                                <SelectItem value="slow">ゆっくり</SelectItem>
                                <SelectItem value="variable">場面により変化</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>ナレーション</Label>
                        <Select value={formData.narration} onValueChange={(v) => handleChange('narration', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">男性</SelectItem>
                                <SelectItem value="female">女性</SelectItem>
                                <SelectItem value="none">不要</SelectItem>
                                <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>ナレーション声優の年齢・トーン</Label>
                        <Select value={formData.voiceTone} onValueChange={(v) => handleChange('voiceTone', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="20s_bright">20代明るい</SelectItem>
                                <SelectItem value="30s_calm">30代落ち着いた</SelectItem>
                                <SelectItem value="40s_deep">40代以上重厚</SelectItem>
                                <SelectItem value="child">子供っぽい</SelectItem>
                                <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>字幕・テキストオーバーレイ</Label>
                        <Select value={formData.subtitles} onValueChange={(v) => handleChange('subtitles', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jp_only">日本語のみ</SelectItem>
                                <SelectItem value="en_mix">英語併記</SelectItem>
                                <SelectItem value="multi">多言語対応</SelectItem>
                                <SelectItem value="none">不要</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>BGMのジャンル・雰囲気</Label>
                        <Select value={formData.bgm} onValueChange={(v) => handleChange('bgm', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pop">ポップ</SelectItem>
                                <SelectItem value="rock">ロック</SelectItem>
                                <SelectItem value="classic">クラシック</SelectItem>
                                <SelectItem value="electronic">エレクトロニック</SelectItem>
                                <SelectItem value="acoustic">アコースティック</SelectItem>
                                <SelectItem value="emotional">エモーショナル</SelectItem>
                                <SelectItem value="energetic">エネルギッシュ</SelectItem>
                                <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>効果音</Label>
                        <Select value={formData.sfx} onValueChange={(v) => handleChange('sfx', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="heavy">多用</SelectItem>
                                <SelectItem value="standard">標準的</SelectItem>
                                <SelectItem value="minimal">最小限</SelectItem>
                                <SelectItem value="none">不要</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>使用禁止な色彩・デザイン要素</Label>
                        <Input value={formData.forbiddenVisuals} onChange={(e) => handleChange('forbiddenVisuals', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                    </div>
                </CardContent>
            </Card>

            {/* 5. プラットフォーム戦略 */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg text-indigo-300">5. プラットフォーム戦略</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>最初に投稿するプラットフォーム</Label>
                        <Select value={formData.platform} onValueChange={(v) => handleChange('platform', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="multi">複数同時</SelectItem>
                                <SelectItem value="undecided">未定</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>投稿戦略</Label>
                        <Select value={formData.postStrategy} onValueChange={(v) => handleChange('postStrategy', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="simultaneous">同時投稿</SelectItem>
                                <SelectItem value="sequential">順次投稿</SelectItem>
                                <SelectItem value="single">一つのプラットフォームのみ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>ハッシュタグ戦略</Label>
                        <Select value={formData.hashtagStrategy} onValueChange={(v) => handleChange('hashtagStrategy', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="important">重要視する</SelectItem>
                                <SelectItem value="standard">標準的</SelectItem>
                                <SelectItem value="none">特に考慮不要</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>投稿時間帯の考慮</Label>
                        <Select value={formData.postTime} onValueChange={(v) => handleChange('postTime', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="morning">朝</SelectItem>
                                <SelectItem value="lunch">昼</SelectItem>
                                <SelectItem value="night">夜</SelectItem>
                                <SelectItem value="midnight">深夜</SelectItem>
                                <SelectItem value="none">特に考慮不要</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>プラットフォーム別の最適化</Label>
                        <Select value={formData.platformOptimization} onValueChange={(v) => handleChange('platformOptimization', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="required">必要</SelectItem>
                                <SelectItem value="standard">標準対応</SelectItem>
                                <SelectItem value="none">不要</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* 6. 視聴者行動設計 */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg text-indigo-300">6. 視聴者行動設計</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>視聴後に期待するアクション</Label>
                        <Select value={formData.action} onValueChange={(v) => handleChange('action', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="like">いいね</SelectItem>
                                <SelectItem value="share">シェア</SelectItem>
                                <SelectItem value="follow">フォロー</SelectItem>
                                <SelectItem value="comment">コメント</SelectItem>
                                <SelectItem value="visit">サイト訪問</SelectItem>
                                <SelectItem value="purchase">商品購入</SelectItem>
                                <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>コメント欄で期待する反応</Label>
                        <Select value={formData.commentReaction} onValueChange={(v) => handleChange('commentReaction', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="question">質問</SelectItem>
                                <SelectItem value="impression">感想</SelectItem>
                                <SelectItem value="experience">体験談共有</SelectItem>
                                <SelectItem value="discussion">議論</SelectItem>
                                <SelectItem value="none">特に期待なし</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>関連動画への誘導</Label>
                        <Select value={formData.linkGuidance} onValueChange={(v) => handleChange('linkGuidance', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="required">必要</SelectItem>
                                <SelectItem value="none">不要</SelectItem>
                                <SelectItem value="considering">検討中</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>CTA（コールトゥアクション）</Label>
                        <Select value={formData.cta} onValueChange={(v) => handleChange('cta', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="clear">明確に入れる</SelectItem>
                                <SelectItem value="subtle">さりげなく入れる</SelectItem>
                                <SelectItem value="none">不要</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* 7. ブランディング・権利 */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg text-indigo-300">7. ブランディング・権利</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>ロゴ・ブランドカラーの使用</Label>
                        <Select value={formData.logoUsage} onValueChange={(v) => handleChange('logoUsage', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="required">必須</SelectItem>
                                <SelectItem value="preferred">希望</SelectItem>
                                <SelectItem value="none">不要</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>既存キャラクター・マスコット</Label>
                        <Select value={formData.characterUsage} onValueChange={(v) => handleChange('characterUsage', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="use">使用する</SelectItem>
                                <SelectItem value="no_use">使用しない</SelectItem>
                                <SelectItem value="create">新規作成</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>商標・権利関係の注意事項</Label>
                        <Input value={formData.trademarkNotes} onChange={(e) => handleChange('trademarkNotes', e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                        <Label>二次利用・転用の可能性</Label>
                        <Select value={formData.secondaryUse} onValueChange={(v) => handleChange('secondaryUse', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">あり</SelectItem>
                                <SelectItem value="no">なし</SelectItem>
                                <SelectItem value="undecided">未定</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* 8. 制作・納期 */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg text-indigo-300">8. 制作・納期</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>予算</Label>
                        <Select value={formData.budget} onValueChange={(v) => handleChange('budget', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="under_50">50万円以下</SelectItem>
                                <SelectItem value="50_100">50-100万円</SelectItem>
                                <SelectItem value="100_200">100-200万円</SelectItem>
                                <SelectItem value="over_200">200万円以上</SelectItem>
                                <SelectItem value="consult">要相談</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>希望納期</Label>
                        <Select value={formData.deadline} onValueChange={(v) => handleChange('deadline', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1week">1週間以内</SelectItem>
                                <SelectItem value="2weeks">2週間以内</SelectItem>
                                <SelectItem value="1month">1ヶ月以内</SelectItem>
                                <SelectItem value="2months">2ヶ月以内</SelectItem>
                                <SelectItem value="3months">3ヶ月以内</SelectItem>
                                <SelectItem value="consult">要相談</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>修正回数の上限希望</Label>
                        <Select value={formData.revisionLimit} onValueChange={(v) => handleChange('revisionLimit', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1回</SelectItem>
                                <SelectItem value="2">2回</SelectItem>
                                <SelectItem value="3">3回</SelectItem>
                                <SelectItem value="unlimited">無制限</SelectItem>
                                <SelectItem value="consult">要相談</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>中間チェックのタイミング</Label>
                        <Select value={formData.checkTiming} onValueChange={(v) => handleChange('checkTiming', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="planning">企画段階</SelectItem>
                                <SelectItem value="storyboard">絵コンテ段階</SelectItem>
                                <SelectItem value="first_draft">初回動画完成時</SelectItem>
                                <SelectItem value="consult">要相談</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>最終納品形式</Label>
                        <Select value={formData.format} onValueChange={(v) => handleChange('format', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mp4">mp4</SelectItem>
                                <SelectItem value="mov">mov</SelectItem>
                                <SelectItem value="both">両方</SelectItem>
                                <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>追加素材制作の可能性</Label>
                        <Select value={formData.assets} onValueChange={(v) => handleChange('assets', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="yes">あり</SelectItem>
                                <SelectItem value="no">なし</SelectItem>
                                <SelectItem value="undecided">未定</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* 9. AI利用・権利関係 */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg text-indigo-300">9. AI利用・権利関係</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>使用するAIツールの開示</Label>
                        <Select value={formData.aiDisclosure} onValueChange={(v) => handleChange('aiDisclosure', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full">全て開示必要</SelectItem>
                                <SelectItem value="major">主要ツールのみ開示</SelectItem>
                                <SelectItem value="none">開示不要</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>学習データへの投稿制約</Label>
                        <Select value={formData.dataConstraints} onValueChange={(v) => handleChange('dataConstraints', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no_corporate">企業情報の投稿は避ける</SelectItem>
                                <SelectItem value="none">制限なし</SelectItem>
                                <SelectItem value="consult">要相談</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>AI生成物の権利帰属</Label>
                        <Select value={formData.ownership} onValueChange={(v) => handleChange('ownership', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="buyout">完全買取希望</SelectItem>
                                <SelectItem value="shared">共有</SelectItem>
                                <SelectItem value="creator">制作会社帰属</SelectItem>
                                <SelectItem value="consult">要相談</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>コンプライアンス書類</Label>
                        <Select value={formData.compliance} onValueChange={(v) => handleChange('compliance', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="certificate">AI使用に関する証明書必要</SelectItem>
                                <SelectItem value="simple">簡易報告で可</SelectItem>
                                <SelectItem value="none">不要</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* 10. その他 */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-lg text-indigo-300">10. その他</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>特記事項・その他要望</Label>
                        <Textarea value={formData.otherNotes} onChange={(e) => handleChange('otherNotes', e.target.value)} className="bg-zinc-950/50 border-zinc-800 min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                        <Label>制作会社への期待・重視する点</Label>
                        <Select value={formData.expectations} onValueChange={(v) => handleChange('expectations', v)}>
                            <SelectTrigger className="bg-zinc-950/50 border-zinc-800"><SelectValue placeholder="選択してください" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="quality">クオリティ</SelectItem>
                                <SelectItem value="speed">スピード</SelectItem>
                                <SelectItem value="communication">コミュニケーション</SelectItem>
                                <SelectItem value="price">価格</SelectItem>
                                <SelectItem value="track_record">実績</SelectItem>
                                <SelectItem value="other">その他</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4 sticky bottom-6">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 min-w-[200px] h-12 text-lg"
                >
                    {isSaving ? (
                        <>
                            <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                            保存中...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-5 w-5" />
                            ヒアリング内容を保存
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
