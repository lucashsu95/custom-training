// Desc: useInitializeQuestions hook
// react
import { useCallback } from 'react'
import { createQuestion } from '@/lib/functions'
import { v4 as uuidv4 } from 'uuid'

// provider & hook
import { useQuestion } from '@/provider/QuestionProvider'
import { useIndexedDB } from '@/hooks/useIndexedDB'

import JsonFile from '@/assets/unit4&5-voc.json'
import JsonFile2 from '@/assets/unit4&5-reading.json'

export function useInitializeQuestions() {
  const { setQuestions } = useQuestion()
  const { addItem, getAllItem, clearItem } = useIndexedDB('questions')

  const seeder = useCallback(() => {
    const seederData = [...JsonFile, ...JsonFile2]
    seederData.forEach((question) => (question.id = uuidv4()))
    addItem(seederData)
    setQuestions(seederData.map((question) => createQuestion(question)))
  }, [addItem, setQuestions])

  return useCallback(() => {
    getAllItem((allItems) => {
      const isVisited = localStorage.getItem('visited')
      if (isVisited !== '2024-11-25') {
        clearItem()
        allItems.length = 0
      }
      if (allItems.length === 0 && isVisited !== '2024-11-25') {
        localStorage.setItem('visited', '2024-11-25')
        seeder()
      } else {
        setQuestions(allItems.map((question) => createQuestion(question)))
      }
    })
  }, [clearItem, getAllItem, seeder, setQuestions])
}
