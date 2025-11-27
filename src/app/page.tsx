'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Clock, FileText, MoreHorizontal, PlayCircle, Star, TrendingUp, AlertCircle, CheckCircle2, FileEdit } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  // Mock Data
  const stats = [
    { label: '進行中のプロジェクト', value: '12', icon: PlayCircle, color: 'text-indigo-400' },
    { label: '要対応', value: '3', icon: FileEdit, color: 'text-rose-400' },
    { label: '確認待ち', value: '4', icon: Clock, color: 'text-zinc-400' },
  ]

  const recentActivity = [
    { id: 1, user: 'Client A', action: 'がシナリオ案にコメントしました', project: 'Project Alpha', time: '10分前' },
    { id: 2, user: 'PM Tanaka', action: 'が字コンテを更新しました', project: 'Project Beta', time: '1時間前' },
    { id: 3, user: 'System', action: 'が新規プロジェクトを作成しました', project: 'Project Gamma', time: '3時間前' },
  ]

  const activeProjects = [
    { id: '1', title: 'Project Alpha', client: 'Client A', status: 'In Progress', phase: 'Step 4: 字コンテ', progress: 60 },
    { id: '2', title: 'Project Beta', client: 'Client B', status: 'Review', phase: 'Step 6: ラフ動画', progress: 85 },
    { id: '3', title: 'Project Gamma', client: 'Client C', status: 'Completed', phase: 'Step 7: 納品', progress: 100 },
  ]

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">ダッシュボード</h1>
          <p className="text-zinc-400 mt-1">プロジェクトの状況概要とタスク確認</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, i) => (
            <Card key={i} className={`border-zinc-800 backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg ${stat.label === '要対応'
              ? 'bg-gradient-to-br from-rose-950/30 to-zinc-900/50 border-rose-900/30 hover:shadow-rose-900/20'
              : stat.label === '進行中のプロジェクト'
                ? 'bg-gradient-to-br from-indigo-950/30 to-zinc-900/50 border-indigo-900/30 hover:shadow-indigo-900/20'
                : 'bg-zinc-900/50 hover:bg-zinc-900/70'
              }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.label === '要対応' ? 'bg-rose-500/10' :
                  stat.label === '進行中のプロジェクト' ? 'bg-indigo-500/10' : 'bg-zinc-800'
                  }`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                {/* Decorative background icon */}
                <stat.icon className={`absolute -bottom-4 -right-4 h-24 w-24 opacity-5 ${stat.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-7">
          {/* Main Content: Active Projects */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">進行中のプロジェクト</h2>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white" asChild>
                <Link href="/projects">すべて見る</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {activeProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="group flex items-center justify-between p-4 rounded-lg bg-zinc-900/30 border border-zinc-800 hover:bg-zinc-900/60 hover:border-indigo-500/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500/50 transition-colors">
                        <FileText className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-zinc-200 group-hover:text-indigo-300 transition-colors">{project.title}</h3>
                        <p className="text-xs text-zinc-500">{project.client} • {project.phase}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-zinc-400 mb-1">進捗率</div>
                        <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar: Recent Activity */}
          <div className="md:col-span-3 space-y-6">
            <h2 className="text-xl font-semibold text-white">最近のアクティビティ</h2>
            <Card className="bg-zinc-900/30 border-zinc-800">
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-800">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="p-4 flex gap-3 items-start hover:bg-zinc-900/50 transition-colors">
                      <div className="h-2 w-2 mt-2 rounded-full bg-indigo-500 shrink-0" />
                      <div>
                        <p className="text-sm text-zinc-300">
                          <span className="font-medium text-white">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {activity.project} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
