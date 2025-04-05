// lib
import { useCallback } from 'react'
import { createQuestion } from '@/lib/functions'
import { v4 as uuidv4 } from 'uuid'

// provider
import { useQuestion } from '@/provider/QuestionProvider'

// hook
import { useIndexedDB } from '@/hooks/useIndexedDB'

import JsonFile2 from '@/assets/unit4&5-reading.json'

export function useInitializeQuestions() {
  const { setQuestions } = useQuestion()
  const { addItem, getAllItem, clearItem } = useIndexedDB('questions')

  const seeder = useCallback(() => {
    const seederData = [...JsonFile2]
    seederData.forEach((question) => (question.id = uuidv4()))
    addItem(seederData)
    setQuestions(seederData.map((question) => createQuestion(question)))
  }, [addItem, setQuestions])

  return useCallback(() => {
    getAllItem((allItems) => {
      const visitedDate = '2025-04-05'
      const isVisited = localStorage.getItem('visited')
      if (isVisited !== visitedDate) {
        clearItem()
        allItems.length = 0
      }
      if (allItems.length === 0 && isVisited !== visitedDate) {
        localStorage.setItem('visited', visitedDate)
        seeder()
      } else {
        setQuestions(allItems.map((question) => createQuestion(question)))
      }
    })
  }, [clearItem, getAllItem, seeder, setQuestions])
}
