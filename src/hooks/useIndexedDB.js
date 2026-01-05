import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import API from '../classes/API'

export function useIndexedDB(storeName) {
  const [api, setApi] = useState(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const apiInstance = new API(storeName)
    let active = true
    apiInstance
      .init()
      .then(() => {
        if (!active) return
        setApi(apiInstance)
        setReady(true)
      })
      .catch((err) => {
        if (!active) return
        setError(err)
        toast('IndexedDB 初始化失敗', {
          description: err?.message || '請稍後再試'
        })
        console.error('IndexedDB init failed', err)
      })
    return () => {
      active = false
    }
  }, [storeName])

  const ensureReady = useCallback(
    (action = '') => {
      if (api) return true
      if (error) {
        toast('IndexedDB 尚未可用', {
          description: error?.message || '請稍後再試'
        })
        console.error('IndexedDB not ready because of previous error', error)
      } else if (!ready) {
        console.warn(`IndexedDB not ready yet${action ? `: ${action}` : ''}`)
        toast('資料庫尚未就緒', {
          description: '請稍候片刻後再試'
        })
      }
      return false
    },
    [api, error, ready]
  )

  const getAllItem = useCallback(
    (callback, tag = false) => {
      if (!ensureReady('getAllItem')) {
        callback([])
        return
      }
      api.get().then((allItems) => {
        if (!tag) {
          callback(allItems)
          return
        }
        const filteredItems = allItems.filter((item) => item.tag === tag)
        callback(filteredItems)
      })
    },
    [api, ensureReady]
  )

  const addItem = useCallback(
    (entries) => {
      if (!ensureReady('addItem')) return
      if (Array.isArray(entries)) {
        entries.forEach((entry) => {
          api.add(entry)
        })
        return
      }
      if (entries && typeof entries === 'object') {
        api.add(entries)
        return
      }
      console.error('addItem expects an object or array of objects')
    },
    [api, ensureReady]
  )

  const clearAll = useCallback(() => {
    if (!ensureReady('clearAll')) return
    api.clear()
  }, [api, ensureReady])

  const clearItem = useCallback(
    (recordQuestionsId) => {
      if (!ensureReady('clearItem')) return

      if (recordQuestionsId && recordQuestionsId.length > 0) {
        for (const id of recordQuestionsId) {
          api.del(id)
        }
      }
    },
    [api, ensureReady]
  )

  const updateItem = useCallback(
    (id, newItem) => {
      if (!ensureReady('updateItem')) return
      api.get().then((items) => {
        const item = items.find((item) => item.id === id)
        if (item) {
          Object.assign(item, newItem)
          api.put(item)
        }
      })
    },
    [api, ensureReady]
  )

  const putItem = useCallback(
    (item) => {
      if (!ensureReady('putItem')) return
      api.put(item)
    },
    [api, ensureReady]
  )

  return { addItem, getAllItem, clearAll, clearItem, updateItem, putItem, ready, error }
}
