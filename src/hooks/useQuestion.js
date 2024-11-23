import { DataContext } from '@/context/DataContext'
import { useCallback } from 'react'
import { useContext } from 'react'
import { useIndexedDB } from './useIndexedDB'
import { createQuestion } from '@/lib/functions'

export function useQuestion() {
  const { questions, setQuestions, setProblems } = useContext(DataContext)
  const { updateItem } = useIndexedDB('questions')

  const updateDue = useCallback(
    (id, isCorrect) => {
      const second = new Date().getTime()
      const question = questions.find((q) => q.id === id)
      question.due = question.due === null ? 0 : question.due
      console.log('isCorrect:', isCorrect, 'id:', id)

      question.due += isCorrect ? 1 : -2
      question.due = Math.max(question.due, -3)

      updateItem(id, { due: question.due, lastAnsweredTime: second })
      setQuestions((prev) => {
        const updatedQuestions = prev.map((p) =>
          p.id === id ? createQuestion({ ...p, due: question.due, lastAnsweredTime: second }) : p
        )
        return updatedQuestions
      })
    },
    [questions, setQuestions, updateItem]
  )

  const updateQuestion = useCallback(
    (id, question) => {
      updateItem(id, question)
      setQuestions((prev) => {
        const updatedQuestions = prev.map((p) =>
          p.id === id ? createQuestion({ ...p, ...question }) : p
        )
        return updatedQuestions
      })
      setProblems((prev) => {
        const updatedQuestions = prev.map((p) =>
          p.id === id ? createQuestion({ ...p, ...question }) : p
        )
        return updatedQuestions
      })
    },
    [setQuestions, setProblems, updateItem]
  )

  return { updateDue, updateQuestion }
}
