import { useState, useEffect } from 'react'

export function useIndexedDB(dbName, storeName) {
  const [db, setDb] = useState(null)

  useEffect(() => {
    const request = indexedDB.open(dbName, 1)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true })
      }
    }

    request.onsuccess = (event) => {
      setDb(event.target.result)
      // console.log('db1:', db)
    }

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.errorCode)
    }
  }, [dbName, storeName])

  const getItem = (id, callback) => {
    // console.log('db2:', db)

    if (!db) {
      console.error('Database is not initialized')
      return
    }
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.get(id)

    request.onsuccess = () => {
      callback(request.result)
    }

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.errorCode)
    }
  }

  const getAllItem = (callback, tag = false) => {
    if (!db) {
      console.error('Database is not initialized')
      return
    }

    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => {
      const allItems = request.result

      if (!tag) {
        callback(allItems)
        return
      }
      const filteredItems = allItems.filter((item) => item.tag === tag)
      callback(filteredItems)
      return
    }

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.errorCode)
    }
  }

  const addItem = (questions) => {
    if (!db) {
      console.error('Database is not initialized')
      return
    }

    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    if (Array.isArray(questions)) {
      questions.forEach((question) => {
        store.add(question)
      })
    } else {
      console.error('questions is not an array')
    }
  }

  return { getItem, addItem, getAllItem }
}
