import { useState, useEffect } from 'react'
import API from '../classes/API'
import { useCallback } from 'react'

export function useIndexedDB(storeName) {
  const [api, setApi] = useState(null)

  useEffect(() => {
    const apiInstance = new API(storeName)
    apiInstance.init().then(() => {
      setApi(apiInstance)
    })
  }, [storeName])

  const getAllItem = useCallback(
    (callback, tag = false) => {
      if (!api) {
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
    [api]
  )

  const addItem = useCallback(
    (questions) => {
      if (!api) {
        console.error('API is not initialized')
        return
      }
      if (Array.isArray(questions)) {
        questions.forEach((question) => {
          api.add(question)
        })
      } else {
        console.error('questions is not an array')
      }
    },
    [api]
  )

  const clearAll = useCallback(() => {
    if (!api) {
      console.error('API is not initialized')
      return
    }
    api.clear()
  }, [api])

  const clearItem = useCallback(
    (recordQuestionsId) => {
      if (!api) {
        console.error('API is not initialized')
        return
      }

      if (recordQuestionsId && recordQuestionsId.length > 0) {
        for (const id of recordQuestionsId) {
          api.del(id)
        }
      }
    },
    [api]
  )

  const updateItem = useCallback(
    (id, newItem) => {
      if (!api) {
        console.error('API is not initialized')
        return
      }
      api.get().then((items) => {
        const item = items.find((item) => item.id === id)
        if (item) {
          Object.assign(item, newItem)
          api.put(item)
        }
      })
    },
    [api]
  )

  return { addItem, getAllItem, clearAll, clearItem, updateItem }
}
