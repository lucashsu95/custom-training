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
      question.due = question.due === null ? -1 : question.due
      question.due += isCorrect ? 1 : -1
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
        const updated = prev.map((p) => (p.id === id ? createQuestion({ ...p, ...question }) : p))
        return updated
      })
    },
    [setQuestions, setProblems, updateItem]
  )

  const customStartTraining = (state) => {
    if (state.currentTags.length < 1) {
      alert('請選擇標籤')
      return false
    }
    const enabledQuestions = questions.filter((x) => x.isEnabled)
    const selectedQuestions = getQuestionByTag(enabledQuestions, state.currentTags)
    const shuffledQuestions = shuffleAryByDue(selectedQuestions)
    const correctProblems = getLimitedQuestions(shuffledQuestions, state.questionNumber)
    if (!correctProblems) {
      toast('⚠️題目數量不足!', {
        description: '請回到首頁重新操作或反饋問題給我們'
      })
      return false
    }
    const displayedProblems = getVocabularyShuffled(correctProblems, state.hasName) // 顯示單字題
    const problems = state.hasTech ? productTech(displayedProblems) : displayedProblems
    setProblems(problems)
    return true
  }

  const autoStartTraining = () => {
    const vocabulary = questions.filter(
      (x) => ['單字題', '單選題', '多選題'].includes(x.type) && x.isEnabled
    )
    const filteredQuestions = filterByTime(vocabulary)
    const shuffledQuestions = shuffleAryByDue(filteredQuestions)

    if (checkTrainingCount()) {
      toast('你好棒! 但已經做很多次題目了 讓自己休息一下吧!', {
        description: '如果想繼續練習，可以點擊右上角的設定按鈕'
      })
      return false
    }

    if (shuffledQuestions.length < 1 && vocabulary.length >= 5) {
      toast('題目都被你練完了 目前沒有要練習的題目', {
        description: '休息一下之後再來練習吧! 如果想繼續練習，可以選擇【自定練習】'
      })
      return false
    }

    // const correctProblems = getLimitedQuestions(shuffledQuestions, 3)
    const correctProblems = getLimitedQuestions(
      shuffledQuestions,
      Math.min(10, shuffledQuestions.length)
    )
    if (!correctProblems) {
      toast('⚠️題目數量不足!', {
        description: '請回到首頁重新操作或反饋問題給我們'
      })
      return false
    }
    const displayedProblems = getVocabularyShuffled(correctProblems, true) // 打亂
    // const displayedProblems = getVocabularyShuffled(correctProblems, false) // 打亂
    const problems = productTech(displayedProblems)
    const sortedTechProblems = sortByTech(problems)
    setProblems(sortedTechProblems)
    return true
  }

  return (
    <QuestionContext.Provider
      value={{
        questions,
        problems,
        setQuestions,
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

// eslint-disable-next-line react-refresh/only-export-components
export const useQuestion = () => {
  const context = useContext(QuestionContext)

  if (context === undefined) throw new Error('useQuestion must be used within a QuestionProvider')

  return context
}
