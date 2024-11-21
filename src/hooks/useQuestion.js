import { DataContext } from '@/context/DataContext'
import { useCallback } from 'react'
import { useContext } from 'react'
import { useIndexedDB } from './useIndexedDB'

export function useQuestion() {
  const { setQuestions } = useContext(DataContext)
  const { updateItem } = useIndexedDB('questions')

  const updateState = useCallback(
    (id, due) => {
      const second = new Date().getTime()
      updateItem(id, { due, last_answered_time: second })
      setQuestions((prev) => {
        for (const p of prev) {
          if (p.id === id) {
            p.due = due
            p.last_answered_time = second
          }
        }
        return prev
      })
    },
    [setQuestions, updateItem]
  )

  return { updateState }
}
