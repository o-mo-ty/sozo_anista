'use client'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    Row,
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
import { Plus, Trash2, Play, Image as ImageIcon, GripVertical } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Type definition for a Scene
export type Scene = {
    id: string
    // sceneNo is now derived from index, but we keep it in type if needed for backend
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

// Helper to format seconds into MM:SS
const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

// Draggable Row Component
const DraggableRow = ({ row }: { row: Row<Scene> }) => {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative',
    }

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            data-state={row.getIsSelected() && "selected"}
            className="border-zinc-800 hover:bg-zinc-900/50 group"
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="py-4 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}

export function WorkspaceTab() {
    const [data, setData] = useState<Scene[]>(INITIAL_DATA)

    // Calculate total duration for footer
    const totalDuration = useMemo(() => {
        return data.reduce((acc, scene) => acc + (scene.duration || 0), 0)
    }, [data])

    // Helper to update scene data
    const updateScene = (id: string, field: keyof Scene, value: any) => {
        setData(prev => prev.map(scene =>
            scene.id === id ? { ...scene, [field]: value } : scene
        ))
    }

    const columns = useMemo<ColumnDef<Scene>[]>(() => [
        {
            id: 'drag',
            header: '',
            cell: ({ row }) => {
                const { attributes, listeners } = useSortable({
                    id: row.original.id,
                })
                return (
                    <div className="flex items-center justify-center h-full pt-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800"
                            {...attributes}
                            {...listeners}
                        >
                            <GripVertical className="h-5 w-5" />
                        </Button>
                    </div>
                )
            },
            size: 40,
        },
        {
            accessorKey: 'action',
            header: 'シーン',
            cell: ({ row }) => (
                <Textarea
                    value={row.original.action}
                    onChange={(e) => updateScene(row.original.id, 'action', e.target.value)}
                    className="min-h-[80px] bg-transparent border-none focus:ring-1 focus:ring-indigo-500 resize-none"
                    placeholder="シーンの内容を入力..."
                />
            ),
            size: 300,
        },
        {
            accessorKey: 'dialogue',
            header: 'セリフ',
            cell: ({ row }) => (
                <Textarea
                    value={row.original.dialogue}
                    onChange={(e) => updateScene(row.original.id, 'dialogue', e.target.value)}
                    className="min-h-[80px] bg-transparent border-none focus:ring-1 focus:ring-indigo-500 resize-none"
                    placeholder="セリフを入力..."
                />
            ),
            size: 300,
        },
        {
            accessorKey: 'duration',
            header: '秒数',
            cell: ({ row }) => (
                <div className="flex items-center gap-1 pt-2">
                    <Input
                        type="number"
                        value={row.original.duration}
                        onChange={(e) => updateScene(row.original.id, 'duration', Number(e.target.value))}
                        className="w-16 bg-zinc-900 border-zinc-700 text-center"
                        min={0}
                    />
                    <span className="text-xs text-zinc-500">sec</span>
                </div>
            ),
            size: 100,
        },
        {
            id: 'time',
            header: '時間',
            cell: ({ row, table }) => {
                // Calculate start time based on previous rows in the CURRENT table model (which reflects current data order)
                const rows = table.getRowModel().rows
                const currentIndex = row.index // This index is based on the current sorted/filtered model

                let startTimeInSeconds = 0
                for (let i = 0; i < currentIndex; i++) {
                    startTimeInSeconds += rows[i].original.duration || 0
                }

                const duration = row.original.duration || 0
                const endTimeInSeconds = startTimeInSeconds + duration

                return (
                    <div className="text-xs text-zinc-400 font-mono pt-3 whitespace-nowrap">
                        {formatTime(startTimeInSeconds)}〜{formatTime(endTimeInSeconds)}
                    </div>
                )
            },
            size: 120,
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
            size: 200,
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
            size: 100,
        },
    ], []) // Dependencies are empty as we use row/table context and updateScene is stable (or we can add it to deps if we used useCallback)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id, // Important for dnd-kit
    })

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor)
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setData((old) => {
                const oldIndex = old.findIndex((item) => item.id === active.id)
                const newIndex = old.findIndex((item) => item.id === over.id)
                return arrayMove(old, oldIndex, newIndex)
            })
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="mr-2 h-4 w-4" />
                    シーンを追加
                </Button>
            </div>

            <div className="rounded-md border border-zinc-800 bg-zinc-900/30">
                <DndContext
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                >
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
                            <SortableContext
                                items={data.map((row) => row.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <DraggableRow key={row.id} row={row} />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </SortableContext>
                        </TableBody>
                    </Table>
                </DndContext>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-zinc-800">
                <div className="text-right text-sm text-zinc-500 mr-auto">
                    合計時間: <span className="text-white font-bold">{totalDuration.toFixed(1)}</span> 秒
                </div>
                <Button variant="outline" className="border-zinc-700">下書き保存</Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    次のフェーズへ進む (絵コンテ)
                </Button>
            </div>
        </div>
    )
}
