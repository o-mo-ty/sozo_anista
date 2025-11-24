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
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Manage your anime production projects.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="bg-zinc-900/50 border-zinc-800 hover:border-indigo-500/50 transition-colors cursor-pointer group">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  {project.client}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${project.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400' :
                        project.status === 'Review' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-emerald-500/10 text-emerald-400'}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500">Phase</span>
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
