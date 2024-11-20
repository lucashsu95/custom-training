import { DataContext } from '@/context/DataContext'
import { useContext } from 'react'

export function useQuestion() {
  const { setQuestions } = useContext(DataContext)
  const { updateItem } = useQuestion('questions')

  const updateState = (id, due) => {
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
  }

  return { updateState }
}
