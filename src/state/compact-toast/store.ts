import {useSyncExternalStore} from 'react'

export type CompactToast = {
  id: string
  node: React.ReactNode
  duration: number
}

const MAX_VISIBLE = 3

let toasts: CompactToast[] = []
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach(l => l())
}

export const compactToastStore = {
  show(toast: Omit<CompactToast, never>) {
    const next = [...toasts.filter(t => t.id !== toast.id), toast]
    toasts = next.slice(Math.max(0, next.length - MAX_VISIBLE))
    emit()
    return toast.id
  },
  dismiss(id: string) {
    toasts = toasts.filter(t => t.id !== id)
    emit()
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  getSnapshot() {
    return toasts
  },
}

export function useCompactToasts() {
  return useSyncExternalStore(
    compactToastStore.subscribe,
    compactToastStore.getSnapshot,
  )
}
