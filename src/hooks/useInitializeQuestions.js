// lib
import { useCallback } from 'react'
import { createQuestion } from '@/lib/functions'
import { v4 as uuidv4 } from 'uuid'

// provider
import { useQuestion } from '@/provider/QuestionProvider'

// hook
import { useIndexedDB } from '@/hooks/useIndexedDB'

import exampleQuestion from '@/assets/example.json'
import JsonFile from '@/assets/economy.json'
import JsonFile3 from '@/assets/financial-management.json'

export function useInitializeQuestions() {
  const { setQuestions } = useQuestion()
  const { addItem, getAllItem, clearAll } = useIndexedDB('questions')

  const seeder = useCallback(() => {
    const seederData = [...exampleQuestion, ...JsonFile, ...JsonFile3]
    seederData.forEach((question) => (question.id = uuidv4()))
    addItem(seederData)
    setQuestions(seederData.map((question) => createQuestion(question)))
  }, [addItem, setQuestions])

  return useCallback(() => {
    getAllItem((allItems) => {
      const visitedDate = '2025-06-12-v2'
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
  }, [clearAll, getAllItem, seeder, setQuestions])
}
