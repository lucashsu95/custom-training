import { useCallback, useMemo } from 'react'
import { createQuestion } from '@/lib/functions'
import { v4 as uuidv4 } from 'uuid'

import { useQuestion } from '@/provider/QuestionProvider'
import { useIndexedDB } from '@/hooks/useIndexedDB'

import exampleQuestion from '@/assets/example.json'
import Iot from '@/assets/iot-with-ids.json'

const DEFAULT_VERSION = 1
const DEFAULT_META = { due: null, lastAnsweredTime: null, isEnabled: true }

const normalizeQuestion = (question) => ({
  ...question,
  id: question.id ?? uuidv4(),
  version: question.version ?? DEFAULT_VERSION
})

const buildSeederData = () => [...exampleQuestion, ...Iot].map((q) => normalizeQuestion({ ...q }))

const mergeByVersion = (localQuestions, seedQuestions) => {
  const localMap = new Map(localQuestions.map((q) => [q.id, q]))
  const seedMap = new Map(seedQuestions.map((q) => [q.id, q]))
  const merged = []

  seedMap.forEach((seed, id) => {
    const local = localMap.get(id)
    if (!local) {
      merged.push({ ...seed, ...DEFAULT_META })
      return
    }
    const seedVersion = seed.version ?? DEFAULT_VERSION
    const localVersion = local.version ?? DEFAULT_VERSION
    
    if (seedVersion > localVersion) {
      // 保留用戶的 due, lastAnsweredTime, isEnabled
      merged.push({
        ...seed,
        due: local.due,
        lastAnsweredTime: local.lastAnsweredTime,
        isEnabled: local.isEnabled
      })
    } else {
      merged.push(local)
    }
    localMap.delete(id)
  })

  localMap.forEach((value) => merged.push(value))
  return merged
}

export function useInitializeQuestions() {
  const { setQuestions } = useQuestion()
  const { addItem, getAllItem, clearAll, ready } = useIndexedDB('questions')

  const seederData = useMemo(() => buildSeederData().map(q => ({ ...q, ...DEFAULT_META })), [])

  const seeder = useCallback(() => {
    clearAll()
    addItem(seederData)
    setQuestions(seederData.map((question) => createQuestion(question)))
  }, [addItem, clearAll, seederData, setQuestions])

  const initialize = useCallback(() => {
    if (!ready) return

    getAllItem((questionItems) => {
      if (questionItems.length === 0) {
        seeder()
        return
      }

      const mergedQuestions = mergeByVersion(
        questionItems.map(normalizeQuestion),
        seederData
      )

      clearAll()
      addItem(mergedQuestions)
      setQuestions(mergedQuestions.map((q) => createQuestion(q)))
    })
  }, [addItem, clearAll, getAllItem, ready, seeder, seederData, setQuestions])

  return { initialize, ready }
}
