// lib
import { useCallback } from 'react'
import { createQuestion } from '@/lib/functions'
import { v4 as uuidv4 } from 'uuid'

// provider
import { useQuestion } from '@/provider/QuestionProvider'

// hook
import { useIndexedDB } from '@/hooks/useIndexedDB'

import exampleQuestion from '@/assets/example.json'
import Iot from '@/assets/iot.json'

export function useInitializeQuestions() {
  const { setQuestions } = useQuestion()
  const { addItem, getAllItem, clearAll, ready } = useIndexedDB('questions')

  const seeder = useCallback(() => {
    const seederData = [...exampleQuestion, ...Iot]
    seederData.forEach((question) => (question.id = uuidv4()))
    addItem(seederData)
    setQuestions(seederData.map((question) => createQuestion(question)))
  }, [addItem, setQuestions])

  const initialize = useCallback(() => {
    if (!ready) {
      return
    }
    getAllItem((allItems) => {
      const visitedDate = '2025-12-21-v2'
      const isVisited = localStorage.getItem('visited')
      if (allItems.length === 0 || isVisited !== visitedDate) {
        clearAll()
        allItems.length = 0
        localStorage.setItem('visited', visitedDate)
        seeder()
      } else {
        setQuestions(allItems.map((question) => createQuestion(question)))
      }
    })
  }, [clearAll, getAllItem, seeder, setQuestions, ready])

  return { initialize, ready }
}
