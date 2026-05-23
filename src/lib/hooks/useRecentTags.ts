import {useCallback, useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'nyxo-sky/recent-tags'
const MAX_RECENT_STORED = 20

export function useRecentTags() {
  const [recentTags, setRecentTags] = useState<string[]>([])

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          setRecentTags(JSON.parse(raw))
        } catch {
          // corrupted, ignore
        }
      }
    })
  }, [])

  const addRecentTag = useCallback((tag: string) => {
    setRecentTags(prev => {
      const deduped = prev.filter(t => t.toLowerCase() !== tag.toLowerCase())
      const next = [tag, ...deduped].slice(0, MAX_RECENT_STORED)
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const removeRecentTag = useCallback((tag: string) => {
    setRecentTags(prev => {
      const next = prev.filter(t => t.toLowerCase() !== tag.toLowerCase())
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return {recentTags, addRecentTag, removeRecentTag}
}
