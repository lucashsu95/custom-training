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

  const addItem = (questions) => {
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
  }

  const clearItem = () => {
    if (!api) {
      console.error('API is not initialized')
      return
    }
    api.clear()
  }
  // const updateItem = (id, updatedData) => {
  //   if (!api) {
  //     console.error('API is not initialized')
  //     return
  //   }
  //   api.get().then((items) => {
  //     const item = items.find((item) => item.id === id)
  //     if (item) {
  //       Object.assign(item, updatedData)
  //       api.put(item)
  //     }
  //   })
  // }

  // const getItem = (id, callback) => {
  //   if (!api) {
  //     console.error('API is not initialized')
  //     return
  //   }
  //   api.get().then((items) => {
  //     const item = items.find((item) => item.id === id)
  //     callback(item)
  //   })
  // }

  return { addItem, getAllItem, clearItem }
}
