'use client'

import { AppLayout } from '@/components/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  // TODO: Fetch projects from Supabase
  const projects = [
    { id: '1', title: 'Project Alpha', client: 'Client A', status: 'In Progress', phase: 'Step 4: Storyboard' },
    { id: '2', title: 'Project Beta', client: 'Client B', status: 'Review', phase: 'Step 6: Rough Video' },
    { id: '3', title: 'Project Gamma', client: 'Client C', status: 'Completed', phase: 'Step 7: Delivery' },
  ]

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">ホーム</h1>
          <p className="text-muted-foreground mt-1">プロジェクトとタスクの状況を確認します。</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          新規プロジェクト
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="bg-card/40 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {project.client}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">ステータス</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        project.status === 'Review' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">フェーズ</span>
                    <span className="text-zinc-300">{project.phase}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppLayout>
  )
}
