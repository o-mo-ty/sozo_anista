'use client'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Play, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

// Type definition for a Scene
export type Scene = {
    id: string
    sceneNo: number
    action: string
    dialogue: string
    duration: number
    imageUrl?: string
    videoUrl?: string
    status: 'pending' | 'generating' | 'completed' | 'approved'
}

// Mock data
const INITIAL_DATA: Scene[] = [
    {
        id: '1',
        sceneNo: 1,
        action: '主人公が路地裏を走る。息を切らしている。',
        dialogue: '（ハァハァ……）',
        duration: 3,
        status: 'completed',
        imageUrl: 'https://placehold.co/300x169/222/FFF?text=Scene+1',
    },
    {
        id: '2',
        sceneNo: 2,
        action: 'エナジードリンクを取り出し、一口飲む。',
        dialogue: 'これさえあれば……！',
        duration: 2,
        status: 'pending',
    },
    {
        id: '3',
        sceneNo: 3,
        action: '目が光り、猛スピードで壁を駆け上がる。',
        dialogue: 'いくぞおおお！',
        duration: 4,
        status: 'pending',
    },
]

export function WorkspaceTab() {
    const [data, setData] = useState<Scene[]>(INITIAL_DATA)

    const columns: ColumnDef<Scene>[] = [
        {
            accessorKey: 'sceneNo',
            header: 'No.',
            cell: ({ row }) => <div className="font-bold text-center w-8">{row.getValue('sceneNo')}</div>,
        },
        {
            accessorKey: 'action',
            header: 'ト書き (Action)',
            cell: ({ row }) => (
                <Textarea
                    defaultValue={row.getValue('action')}
                    className="min-h-[80px] bg-transparent border-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
            ),
        },
        {
            accessorKey: 'dialogue',
            header: 'セリフ (Dialogue)',
            cell: ({ row }) => (
                <Textarea
                    defaultValue={row.getValue('dialogue')}
                    className="min-h-[80px] bg-transparent border-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
            ),
        },
        {
            accessorKey: 'duration',
            header: '秒数',
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Input
                        type="number"
                        defaultValue={row.getValue('duration')}
                        className="w-16 bg-zinc-900 border-zinc-700 text-center"
                    />
                    <span className="text-xs text-zinc-500">sec</span>
                </div>
            ),
        },
        {
            id: 'preview',
            header: 'プレビュー',
            cell: ({ row }) => {
                const scene = row.original
                return (
                    <div className="w-[160px] h-[90px] bg-zinc-900 rounded-md border border-zinc-800 flex items-center justify-center relative group overflow-hidden">
                        {scene.imageUrl ? (
                            <img src={scene.imageUrl} alt={`Scene ${scene.sceneNo}`} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-zinc-600 flex flex-col items-center gap-1">
                                <ImageIcon className="h-6 w-6" />
                                <span className="text-[10px]">No Image</span>
                            </div>
                        )}

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                                <Play className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                )
            },
        },
        {
            id: 'actions',
            header: '操作',
            cell: ({ row }) => (
                <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-7 border-zinc-700 hover:bg-zinc-800">
                        画像生成
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7 border-zinc-700 hover:bg-zinc-800">
                        動画生成
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-zinc-500 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">ワークスペース</h2>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" />
                    シーンを追加
                </Button>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/30">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-zinc-800 hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-zinc-400 font-medium">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-zinc-800 hover:bg-zinc-900/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4 align-top">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-zinc-800">
                <div className="text-right text-sm text-zinc-500 mr-auto">
                    合計時間: <span className="text-white font-bold">9.0</span> 秒
                </div>
                <Button variant="outline" className="border-zinc-700">下書き保存</Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    次のフェーズへ進む (絵コンテ)
                </Button>
            </div>
        </div>
    )
}
