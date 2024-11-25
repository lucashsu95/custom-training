import { createQuestion, filterByTime, sortByTech } from '@/lib/functions'
import { createContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useIndexedDB } from '@/hooks/useIndexedDB'
import { useContext } from 'react'

import {
  getQuestionByTag,
  getLimitedQuestions,
  getVocabularyShuffled,
  shuffleAryByDue,
  productTech
} from '@/lib/functions'
import { toast } from 'sonner'
import { useSetting } from '@/provider/SettingProvider'

const QuestionContext = createContext()

export function QuestionProvider({ children }) {
  const [questions, setQuestions] = useState([])
  const [problems, setProblems] = useState([])
  const { checkTrainingCount } = useSetting()
  const { updateItem } = useIndexedDB('questions')

  const updateDue = useCallback(
    (id, isCorrect) => {
      const second = new Date().getTime()
      const question = questions.find((q) => q.id === id)
      question.due = question.due === null ? 0 : question.due
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

  const customStartTraining = (state) => {
    if (state.currentTags.length < 1) {
      alert('請選擇標籤')
      return
    }
    const enabledQuestions = questions.filter((x) => x.isEnabled)
    const selectedQuestions = getQuestionByTag(enabledQuestions, state.currentTags)
    const shuffledQuestions = shuffleAryByDue(selectedQuestions)
    const correctProblems = getLimitedQuestions(shuffledQuestions, state.questionNumber)
    const displayedProblems = getVocabularyShuffled(correctProblems, state.hasName) // 顯示單字題
    const problems = state.hasTech ? productTech(displayedProblems) : displayedProblems
    setProblems(problems)
  }

  const autoStartTraining = () => {
    const vocabulary = questions.filter(
      (x) => (x.type === '單字題' || x.type === '選擇題') && x.isEnabled
    )
    const filteredQuestions = filterByTime(vocabulary)
    const shuffledQuestions = shuffleAryByDue(filteredQuestions)

    if (checkTrainingCount()) {
      toast('已達每日答題量限制', {
        description: '明天再來練習吧!'
      })
      return
    }

    if (shuffledQuestions.length < 3) {
      toast('目前沒有要練習的題目', {
        description: '休息一下之後再來練習吧!'
      })
      return
    }

    const correctProblems = getLimitedQuestions(shuffledQuestions, 3)
    // const correctProblems = getLimitedQuestions(shuffledQuestions, 5)
    // const displayedProblems = getVocabularyShuffled(correctProblems, true) // 顯示單字題
    const displayedProblems = getVocabularyShuffled(correctProblems, false) // 顯示單字題
    const problems = productTech(displayedProblems)
    const sortedTechProblems = sortByTech(problems)
    setProblems(sortedTechProblems)
  }

  return (
    <QuestionContext.Provider
      value={{
        questions,
        setQuestions,
        problems,
        setProblems,
        updateDue,
        updateQuestion,
        customStartTraining,
        autoStartTraining
      }}
    >
      {children}
    </QuestionContext.Provider>
  )
}

QuestionProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useQuestion = () => {
  const context = useContext(QuestionContext)

  if (context === undefined) throw new Error('useQuestion must be used within a QuestionProvider')

  return context
}
