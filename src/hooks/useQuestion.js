import { DataContext } from '@/context/DataContext'
import { useCallback } from 'react'
import { useContext } from 'react'
import { useIndexedDB } from './useIndexedDB'

export function useQuestion() {
  const { setQuestions } = useContext(DataContext)
  const { updateItem } = useIndexedDB('questions')

  const updateDue = useCallback(
    (id, due) => {
      const second = new Date().getTime()
      updateItem(id, { due, lastAnsweredTime: second })

      setQuestions((prev) => {
        const updatedQuestions = prev.map((p) =>
          p.id === id ? { ...p, due, lastAnsweredTime: second } : p
        )
        return updatedQuestions
      })
    },
    [setQuestions, updateItem]
  )

  const updateEnabled = useCallback(
    (id, isEnabled) => {
      updateItem(id, { isEnabled })
      setQuestions((prev) => {
        const updatedQuestions = prev.map((p) => (p.id === id ? { ...p, isEnabled } : p))
        return updatedQuestions
      })
    },
    [setQuestions, updateItem]
  )

  return { updateDue, updateEnabled }
}
