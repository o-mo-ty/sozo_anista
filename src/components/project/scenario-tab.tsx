'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Check, Edit2, Sparkles, Save } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Label } from '@/components/ui/label'

// Mock data for scenarios (fallback)
const MOCK_SCENARIOS = [
    {
        id: 'option_a',
        title: '案A: エネルギッシュ & スピード感',
        content: '主人公がパルクールのような動きで障害物を避けながら街を疾走する。手にはエナジードリンクが光っている。一口飲むと、ビルの屋上を飛び越える。空中でカメラが彼の周りを回転する。',
        tags: ['アクション', 'ハイエナジー', '都会的'],
    },
    {
        id: 'option_b',
        title: '案B: エモーショナル & 雰囲気重視',
        content: '雨の夜。主人公はデスクで疲れ切っている。ふとエナジードリンクに目をやる。一口飲むと、雨が止み、朝日が昇る。彼は微笑み、新たな集中力で仕事に戻る。',
        tags: ['エモーショナル', 'シネマティック', '集中'],
    },
    {
        id: 'option_c',
        title: '案C: 抽象的 & サイケデリック',
        content: '缶が開くと、カラフルな液体がドラゴンの姿に変わる。主人公はそのドラゴンに乗ってネオンのトンネルを抜ける。世界が色彩で爆発する。最後にロゴが表示される。',
        tags: ['抽象的', 'ビジュアル重視', 'クリエイティブ'],
    },
]

interface ScenarioTabProps {
    projectId: string
}

export function ScenarioTab({ projectId }: ScenarioTabProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [clientComment, setClientComment] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [scenarios, setScenarios] = useState<any[]>(MOCK_SCENARIOS)
    const supabase = createClient()

    useEffect(() => {
        const loadData = async () => {
            if (!projectId) return
            setIsLoading(true)
            const { data, error } = await supabase
                .from('scenarios')
                .select('*')
                .eq('project_id', projectId)
                .single()

            if (data) {
                // Parse options if they are stored as JSON strings
                const options = [
                    data.option_a ? JSON.parse(data.option_a) : MOCK_SCENARIOS[0],
                    data.option_b ? JSON.parse(data.option_b) : MOCK_SCENARIOS[1],
                    data.option_c ? JSON.parse(data.option_c) : MOCK_SCENARIOS[2],
                ]
                // Ensure IDs are correct
                options[0].id = 'option_a'
                options[1].id = 'option_b'
                options[2].id = 'option_c'

                setScenarios(options)
                setSelectedOption(data.selected_option)
                setClientComment(data.client_comment || '')
            }
            setIsLoading(false)
        }
        loadData()
    }, [projectId])

    const handleSave = async () => {
        if (!selectedOption) {
            alert('シナリオを選択してください')
            return
        }
        setIsSaving(true)
        try {
            // Check if exists
            const { data: existing } = await supabase
                .from('scenarios')
                .select('id')
                .eq('project_id', projectId)
                .single()

            const payload = {
                project_id: projectId,
                selected_option: selectedOption,
                client_comment: clientComment,
                // For now, we just save the mock data as the options if they don't exist
                // In a real app, these would be generated and saved earlier
                option_a: JSON.stringify(scenarios[0]),
                option_b: JSON.stringify(scenarios[1]),
                option_c: JSON.stringify(scenarios[2]),
                updated_at: new Date().toISOString()
            }

            let error;
            if (existing) {
                const { error: updateError } = await supabase
                    .from('scenarios')
                    .update(payload)
                    .eq('project_id', projectId)
                error = updateError
            } else {
                const { error: insertError } = await supabase
                    .from('scenarios')
                    .insert(payload)
                error = insertError
            }

            if (error) throw error

            // Trigger Mock Text Storyboard Generation
            // In a real app, this would be a backend function triggered by the DB update
            const { data: existingScenes } = await supabase
                .from('scenes')
                .select('id')
                .eq('project_id', projectId)
                .limit(1)

            if (!existingScenes || existingScenes.length === 0) {
                const mockScenes = [
                    {
                        project_id: projectId,
                        scene_no: 1,
                        action: '主人公が路地裏を走る。息を切らしている。',
                        dialogue: '（ハァハァ……）',
                        duration: 3,
                        status: 'pending'
                    },
                    {
                        project_id: projectId,
                        scene_no: 2,
                        action: 'エナジードリンクを取り出し、一口飲む。',
                        dialogue: 'これさえあれば……！',
                        duration: 2,
                        status: 'pending'
                    },
                    {
                        project_id: projectId,
                        scene_no: 3,
                        action: '目が光り、猛スピードで壁を駆け上がる。',
                        dialogue: 'いくぞおおお！',
                        duration: 4,
                        status: 'pending'
                    }
                ]
                const { error: sceneError } = await supabase
                    .from('scenes')
                    .insert(mockScenes)

                if (sceneError) console.error('Error generating scenes:', sceneError)
            }

            alert('シナリオ選択を保存しました。字コンテが生成されました。')
        } catch (e) {
            console.error('Error saving scenario:', e)
            alert('保存に失敗しました')
        } finally {
            setIsSaving(false)
        }
    }

    // if (isLoading) {
    //     return <div className="text-center py-20 text-zinc-500">読み込み中...</div>
    // }

    return (
        <div className="space-y-6 pb-20 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        シナリオ選択
                        {isLoading && (
                            <span className="text-sm font-normal text-zinc-500 ml-2 animate-pulse">
                                データ読み込み中...
                            </span>
                        )}
                    </h2>
                    <p className="text-zinc-400">このプロジェクトに最適な方向性を選択してください。</p>
                </div>
                <div className="flex gap-2">
                    {/* Admin only controls would go here */}
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="hidden">
                        <Edit2 className="mr-2 h-4 w-4" />
                        {isEditing ? '編集完了' : 'シナリオを編集'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {scenarios.map((scenario) => (
                    <Card
                        key={scenario.id}
                        className={`relative transition-all duration-200 border-2 flex flex-col cursor-pointer
              ${selectedOption === scenario.id
                                ? 'bg-indigo-950/30 border-indigo-500 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]'
                                : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}
                        onClick={() => setSelectedOption(scenario.id)}
                    >
                        {selectedOption === scenario.id && (
                            <div className="absolute -top-3 -right-3 bg-indigo-500 text-white p-1 rounded-full shadow-lg">
                                <Check className="h-4 w-4" />
                            </div>
                        )}

                        <CardHeader>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {scenario.tags && scenario.tags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="bg-zinc-800 text-zinc-400 text-[10px]">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <CardTitle className={`text-lg ${selectedOption === scenario.id ? 'text-indigo-400' : 'text-zinc-200'}`}>
                                {scenario.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                {scenario.content}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <div className={`w-full text-center text-sm ${selectedOption === scenario.id ? 'text-indigo-400 font-medium' : 'text-zinc-500'}`}>
                                {selectedOption === scenario.id ? '選択中' : 'クリックして選択'}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Selection & Comment Area */}
            <Card className="bg-zinc-900/50 border-zinc-800 mt-8">
                <CardHeader>
                    <CardTitle className="text-lg text-white">選択したシナリオへのコメント・要望</CardTitle>
                    <CardDescription>
                        選択した案について、修正したい点や具体的な要望があればご記入ください。
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="例: 案Aの方向性で良いですが、最後のシーンはもう少し落ち着いた雰囲気にしたいです。"
                        value={clientComment}
                        onChange={(e) => setClientComment(e.target.value)}
                        className="min-h-[120px] bg-zinc-950/50 border-zinc-800"
                    />
                </CardContent>
                <CardFooter className="flex justify-end border-t border-zinc-800 pt-6">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !selectedOption}
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
                                決定して次へ
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
