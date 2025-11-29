'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Filter, X, Mail, Shield, User as UserIcon, Building2, Briefcase, PenTool } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/page-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type User = {
    id: string
    name: string
    email: string
    role: 'pm' | 'creator' | 'client'
    avatar?: string
    company: string
}

// Mock Data
const MOCK_USERS: User[] = [
    {
        id: '1',
        name: '田中 太郎',
        email: 'tanaka@sozo-anime.com',
        role: 'pm',
        avatar: '/avatars/01.png',
        company: 'SOZO Anime',
    },
    {
        id: '2',
        name: '山田 花子',
        email: 'yamada@client-a.com',
        role: 'client',
        avatar: '/avatars/02.png',
        company: '株式会社クライアントA',
    },
    {
        id: '3',
        name: '佐藤 次郎',
        email: 'sato@sozo-anime.com',
        role: 'creator',
        company: 'SOZO Anime',
    },
    {
        id: '4',
        name: '鈴木 一郎',
        email: 'suzuki@client-b.com',
        role: 'client',
        company: '株式会社クライアントB',
    },
    {
        id: '5',
        name: '高橋 美咲',
        email: 'takahashi@sozo-anime.com',
        role: 'pm',
        avatar: '/avatars/03.png',
        company: 'SOZO Anime',
    },
    {
        id: '6',
        name: 'カルボネロ ニキ',
        email: 'carbonero.niki@example.com',
        role: 'client',
        company: 'Global Tech Industries',
    },
]

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(MOCK_USERS)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [roleFilter, setRoleFilter] = useState<'pm' | 'creator' | 'client' | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newUser, setNewUser] = useState<{
        name: string
        email: string
        role: 'pm' | 'creator' | 'client'
        company: string
    }>({
        name: '',
        email: '',
        role: 'client',
        company: ''
    })

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.company.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = roleFilter ? user.role === roleFilter : true
        return matchesSearch && matchesFilter
    })

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'pm':
                return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20">制作PM</Badge>
            case 'creator':
                return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">制作メンバー</Badge>
            case 'client':
                return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">クライアント</Badge>
            default:
                return <Badge variant="outline" className="text-zinc-400 border-zinc-700">その他</Badge>
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'pm':
                return <Briefcase className="h-3 w-3 text-purple-400" />
            case 'creator':
                return <PenTool className="h-3 w-3 text-blue-400" />
            case 'client':
                return <UserIcon className="h-3 w-3 text-emerald-400" />
            default:
                return <UserIcon className="h-3 w-3 text-zinc-400" />
        }
    }

    const handleCreateUser = () => {
        if (!newUser.name || !newUser.email) return // Simple validation

        const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            ...newUser
        }

        setUsers([user, ...users])
        setIsDialogOpen(false)
        setNewUser({ name: '', email: '', role: 'client', company: '' }) // Reset form
    }

    return (
        <AppLayout>
            <div>
                <div>
                    {/* Header */}
                    <PageHeader
                        title="ユーザー一覧"
                        description="システムを利用するユーザーを管理します。"
                    />

                    {/* Unified Card Container */}
                    <div className="rounded-2xl border border-white/5 bg-zinc-900/30 overflow-hidden backdrop-blur-sm shadow-xl">
                        {/* Card Header / Action Bar */}
                        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5">
                            <div className="text-sm text-zinc-400 font-medium pl-2">
                                全 {filteredUsers.length} 名のユーザー
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Expandable Search */}
                                <div className={`relative transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-64' : 'w-10'}`}>
                                    {isSearchOpen ? (
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                            <Input
                                                autoFocus
                                                placeholder="名前、メール、会社名で検索..."
                                                className="pl-9 pr-8 bg-zinc-950/50 border-zinc-700 focus:ring-indigo-500 transition-all h-9 text-sm"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onBlur={() => !searchQuery && setIsSearchOpen(false)}
                                            />
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('')
                                                    setIsSearchOpen(false)
                                                }}
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsSearchOpen(true)}
                                            className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-9 w-9"
                                        >
                                            <Search className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                {/* Filter Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`transition-colors h-9 w-9 ${isFilterOpen || roleFilter ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                                >
                                    <Filter className="h-4 w-4" />
                                </Button>

                                <div className="h-6 w-px bg-zinc-800 mx-2" />

                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 shadow-none h-9 text-sm px-4">
                                            <Plus className="mr-2 h-4 w-4" />
                                            新規ユーザー
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[480px] bg-zinc-950 border-zinc-800 text-zinc-100 p-0 overflow-hidden gap-0">
                                        <DialogHeader className="p-6 bg-zinc-900/50 border-b border-white/5 flex flex-row items-start gap-4 space-y-0">
                                            <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                                                <UserIcon className="h-5 w-5 text-indigo-400" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <DialogTitle className="text-xl">新規ユーザー作成</DialogTitle>
                                                <DialogDescription className="text-zinc-400">
                                                    新しいユーザーのアカウント情報を入力してください。
                                                </DialogDescription>
                                            </div>
                                        </DialogHeader>

                                        <div className="p-6 space-y-5">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-zinc-300 text-xs font-medium ml-1">
                                                    名前 <span className="text-red-400">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                                    <Input
                                                        id="name"
                                                        placeholder="山田 太郎"
                                                        value={newUser.name}
                                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                                        className="pl-9 bg-zinc-900/50 border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-zinc-300 text-xs font-medium ml-1">
                                                    メールアドレス <span className="text-red-400">*</span>
                                                </Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="taro@example.com"
                                                        value={newUser.email}
                                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                        className="pl-9 bg-zinc-900/50 border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="company" className="text-zinc-300 text-xs font-medium ml-1">
                                                        会社名
                                                    </Label>
                                                    <div className="relative">
                                                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                                        <Input
                                                            id="company"
                                                            placeholder="株式会社..."
                                                            value={newUser.company}
                                                            onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                                                            className="pl-9 bg-zinc-900/50 border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="role" className="text-zinc-300 text-xs font-medium ml-1">
                                                        役割
                                                    </Label>
                                                    <Select
                                                        value={newUser.role}
                                                        onValueChange={(value: 'pm' | 'creator' | 'client') => setNewUser({ ...newUser, role: value })}
                                                    >
                                                        <SelectTrigger className="bg-zinc-900/50 border-zinc-700 focus:ring-indigo-500 focus:border-indigo-500">
                                                            <SelectValue placeholder="役割を選択" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                                            <SelectItem value="client">
                                                                <div className="flex items-center gap-2">
                                                                    <UserIcon className="h-3 w-3 text-emerald-400" />
                                                                    <span>クライアント</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="pm">
                                                                <div className="flex items-center gap-2">
                                                                    <Briefcase className="h-3 w-3 text-purple-400" />
                                                                    <span>制作PM</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="creator">
                                                                <div className="flex items-center gap-2">
                                                                    <PenTool className="h-3 w-3 text-blue-400" />
                                                                    <span>制作メンバー</span>
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>

                                        <DialogFooter className="p-6 py-4 bg-zinc-900/30 border-t-0 items-center">
                                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                                                キャンセル
                                            </Button>
                                            <Button
                                                onClick={handleCreateUser}
                                                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/20"
                                            >
                                                ユーザーを作成
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {/* Expandable Filter Bar (Inside Card) */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-zinc-900/50 border-b border-white/5 ${isFilterOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="flex items-center gap-2 p-3 pl-6">
                                <span className="text-xs text-zinc-500 mr-2">役割:</span>
                                <Badge
                                    variant="outline"
                                    className={`cursor-pointer px-3 py-1 border-zinc-700 hover:bg-zinc-800 transition-colors ${!roleFilter ? 'bg-zinc-800 text-white border-zinc-600' : 'text-zinc-400'}`}
                                    onClick={() => setRoleFilter(null)}
                                >
                                    すべて
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`cursor-pointer px-3 py-1 border-purple-500/30 hover:bg-purple-500/20 transition-colors ${roleFilter === 'pm' ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'text-zinc-400'}`}
                                    onClick={() => setRoleFilter('pm')}
                                >
                                    制作PM
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`cursor-pointer px-3 py-1 border-blue-500/30 hover:bg-blue-500/20 transition-colors ${roleFilter === 'creator' ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' : 'text-zinc-400'}`}
                                    onClick={() => setRoleFilter('creator')}
                                >
                                    制作メンバー
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`cursor-pointer px-3 py-1 border-emerald-500/30 hover:bg-emerald-500/20 transition-colors ${roleFilter === 'client' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'text-zinc-400'}`}
                                    onClick={() => setRoleFilter('client')}
                                >
                                    クライアント
                                </Badge>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-zinc-900/50 border-b border-white/5">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="text-zinc-500 font-medium pl-6 h-12">ユーザー名</TableHead>
                                        <TableHead className="text-zinc-500 font-medium h-12">会社名</TableHead>
                                        <TableHead className="text-zinc-500 font-medium h-12">役割</TableHead>
                                        <TableHead className="text-zinc-500 font-medium h-12">メールアドレス</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-zinc-500">
                                                ユーザーが見つかりません
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <TableRow
                                                key={user.id}
                                                className="border-b border-white/5 hover:bg-white/5 group cursor-pointer transition-all"
                                            >
                                                <TableCell className="font-medium text-white pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 ring-1 ring-white/10">
                                                            <AvatarImage src={user.avatar} />
                                                            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">
                                                                {user.name.slice(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="group-hover:text-indigo-400 transition-colors">{user.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-zinc-300">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-3 w-3 text-zinc-500" />
                                                        {user.company}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getRoleIcon(user.role)}
                                                        {getRoleBadge(user.role)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-zinc-300">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3 text-zinc-500" />
                                                        {user.email}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
