// lib
import { useCallback } from 'react'
import { createQuestion } from '@/lib/functions'
import { v4 as uuidv4 } from 'uuid'

// provider
import { useQuestion } from '@/provider/QuestionProvider'

// hook
import { useIndexedDB } from '@/hooks/useIndexedDB'

import JsonFile from '@/assets/unit4&5-voc.json'
import JsonFile2 from '@/assets/unit4&5-reading.json'
import JsonFile3 from '@/assets/manage-1226.json'

export function useInitializeQuestions() {
  const { setQuestions } = useQuestion()
  const { addItem, getAllItem, clearItem } = useIndexedDB('questions')

  const seeder = useCallback(() => {
    const seederData = [...JsonFile, ...JsonFile2, ...JsonFile3]
    seederData.forEach((question) => (question.id = uuidv4()))
    addItem(seederData)
    setQuestions(seederData.map((question) => createQuestion(question)))
  }, [addItem, setQuestions])

  return useCallback(() => {
    getAllItem((allItems) => {
      const isVisited = localStorage.getItem('visited')
      if (isVisited !== '2024-12-26-v4') {
        clearItem()
        allItems.length = 0
      }
      if (allItems.length === 0 && isVisited !== '2024-12-26-v4') {
        localStorage.setItem('visited', '2024-12-26-v4')
        seeder()
      } else {
        setQuestions(
          allItems.map((question) => {
            if (question?.options?.D === '找出完成計畫的最短路徑，此路徑稱為要') {
              question.options.D = '找出完成計畫的最短路徑，此路徑稱為要徑'
            }
            return createQuestion(question)
          })
        )
      }
    })
  }, [clearItem, getAllItem, seeder, setQuestions])
}
