'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Check, Edit2, Sparkles } from 'lucide-react'
import { useState } from 'react'

// Mock data for scenarios
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

export function ScenarioTab() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)

    // TODO: In a real app, this would be fetched from Supabase
    // and role-based access would determine if the user can edit or just select.

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-white">シナリオ選択</h2>
                    <p className="text-zinc-400">このプロジェクトに最適な方向性を選択してください。</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        {isEditing ? '編集完了' : 'シナリオを編集'}
                    </Button>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                        <Sparkles className="mr-2 h-4 w-4" />
                        AIで生成
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {MOCK_SCENARIOS.map((scenario) => (
                    <Card
                        key={scenario.id}
                        className={`relative transition-all duration-200 border-2 flex flex-col
              ${selectedOption === scenario.id
                                ? 'bg-indigo-950/30 border-indigo-500 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]'
                                : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}
                    >
                        {selectedOption === scenario.id && (
                            <div className="absolute -top-3 -right-3 bg-indigo-500 text-white p-1 rounded-full shadow-lg">
                                <Check className="h-4 w-4" />
                            </div>
                        )}

                        <CardHeader>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {scenario.tags.map(tag => (
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
                            {isEditing ? (
                                <Textarea
                                    defaultValue={scenario.content}
                                    className="min-h-[200px] bg-zinc-950/50 border-zinc-800 focus:border-indigo-500"
                                />
                            ) : (
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    {scenario.content}
                                </p>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant={selectedOption === scenario.id ? "default" : "outline"}
                                className={`w-full ${selectedOption === scenario.id ? 'bg-indigo-600 hover:bg-indigo-700' : 'border-zinc-700 hover:bg-zinc-800'}`}
                                onClick={() => setSelectedOption(scenario.id)}
                            >
                                {selectedOption === scenario.id ? '選択中' : 'この案を選択'}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
