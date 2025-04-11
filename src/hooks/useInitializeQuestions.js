// lib
import { useCallback } from 'react'
import { createQuestion } from '@/lib/functions'
import { v4 as uuidv4 } from 'uuid'

// provider
import { useQuestion } from '@/provider/QuestionProvider'

// hook
import { useIndexedDB } from '@/hooks/useIndexedDB'

import JsonFile from '@/assets/marketing-1.json'
import JsonFile2 from '@/assets/marketing-2.json'

export function useInitializeQuestions() {
  const { setQuestions } = useQuestion()
  const { addItem, getAllItem, clearAll } = useIndexedDB('questions')

  const seeder = useCallback(() => {
    const seederData = [...JsonFile, ...JsonFile2]
    seederData.forEach((question) => (question.id = uuidv4()))
    addItem(seederData)
    setQuestions(seederData.map((question) => createQuestion(question)))
  }, [addItem, setQuestions])

  return useCallback(() => {
    getAllItem((allItems) => {
      const visitedDate = '2025-04-11-v4'
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
