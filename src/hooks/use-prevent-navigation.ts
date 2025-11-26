'use client'

import { useEffect } from 'react'

export function usePreventNavigation(shouldPrevent: boolean) {
    useEffect(() => {
        if (!shouldPrevent) return

        // 1. Handle BeforeUnload (Tab Close / Refresh)
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ''
        }

        // 2. Handle Link Clicks (Internal Navigation)
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const anchor = target.closest('a')

            if (anchor) {
                // Ignore if opening in new tab
                if (anchor.target === '_blank' || e.ctrlKey || e.metaKey) return

                // Confirm navigation
                if (!window.confirm('変更内容が保存されていません。移動しますか？')) {
                    e.preventDefault()
                    e.stopPropagation()
                }
            }
        }

        // 3. Handle PopState (Back Button)
        const handlePopState = (e: PopStateEvent) => {
            // Confirm navigation
            if (!window.confirm('変更内容が保存されていません。移動しますか？')) {
                // If cancelled, push state back to stay on current page
                window.history.pushState(null, '', window.location.href)
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        window.addEventListener('click', handleClick, true) // Capture phase
        window.addEventListener('popstate', handlePopState)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            window.removeEventListener('click', handleClick, true)
            window.removeEventListener('popstate', handlePopState)
        }
    }, [shouldPrevent])
}
