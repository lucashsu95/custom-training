import { getQuestionClassByType } from '@/classes/Question'
import { toast } from 'sonner'

// 打亂陣列
export function shuffleAry(ary) {
  return [...ary].sort(() => Math.random() - 0.5)
}

// 題目等級 -> 時間
const dueLevel = {
  0: 0.5, // 12 小時
  1: 1, // 1 天
  2: 3,
  3: 5,
  4: 7
}

// 過濾 練習時間還沒到的題目
export function filterByTime(questions) {
  const currentDate = new Date().getTime()
  return questions.filter((question) => {
    if (question.due > 4) {
      return false
    }
    if (questions.last_answered_time === null || question.due === null) {
      return true
    }
    const prevDay = currentDate - question.last_answered_time
    const nextDay = questions.due <= 0 ? 0 : dueLevel[question.due] * 86400
    return prevDay >= nextDay
  })
}

// 依照 due 排序 並分組 打亂組內順序
export function shuffleAryByDue(ary) {
  return [...ary]
    .sort((a, b) => {
      if ((a.due === null || a.due === 0) && (b.due === null || b.due === 0)) {
        return Math.random() - 0.5
      }
      if (a.due !== b.due) {
        return a.due - b.due
      }
      return a.last_answered_time - b.last_answered_time
    })
    .reduce((acc, item, index, array) => {
      if (index === 0 || item.due !== array[index - 1].due) {
        acc.push([item])
      } else {
        acc[acc.length - 1].push(item)
      }
      return acc
    }, [])
    .flatMap((group) => group.sort(() => Math.random() - 0.5))
}

// 根據標籤取得題目
export function getQuestionByTag(questions, tag) {
  // tag type is Set
  if (tag.has('全部')) {
    return questions
  }
  return questions.filter((question) => tag.has(question.tag))
}

// 根據數量取得題目
export function getLimitedQuestions(questions, number) {
  if (questions.length < number) {
    toast('⚠️題目數量不足!', {
      description: '請回到首頁重新操作或反饋問題給我們'
    })
  }
  return questions.slice(0, number)
}

export function getTags(questions) {
  const tags = new Set()
  questions.forEach((question) => {
    tags.add(question.tag)
  })
  return Array.from(tags)
}

export const createQuestion = (question) => {
  return getQuestionClassByType[question.type].create(question)
}

export const getQuestionByType = (questions, type) => {
  return questions.filter((question) => question.type === type)
}

export const getVocabularyShuffled = (problems, hasName) => {
  const vocabulary = getQuestionByType(problems, '單字題')
  if (vocabulary.length === 0) {
    return problems
  }

  // 取得所有單字題的 name & answer
  const [names, answers] = vocabulary.reduce(
    (acc, problem) => {
      acc[0].push(problem.name)
      acc[1].push(problem.answer)
      return acc
    },
    [[], []]
  )

  // 將單字題的選項打亂
  // 如果有 hasName 將 name 也打亂
  const result = []
  const temp = []
  for (const p of problems) {
    if (p.type === '單字題') {
      p.getAnswerOptions(answers)
      if (hasName) {
        const p2 = createQuestion({ ...p })
        p2.getNameOptions(names)
        temp.push(p2)
      }
    }
    result.push(p)
  }
  return [...result, ...temp]
}

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
}

export const formatDate = (seconds) => {
  return new Date(seconds).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const productTech = (problems) => {
  const newProblems = [...problems]
  let j = 0
  for (let i = 0; i < problems.length; i++) {
    const problem = problems[i]
    if (problem.due !== null || problem.isRotate === true) {
      continue
    }

    const techProblem = createQuestion({ ...problem, type2: '教學' })
    if (['選擇題', '單字題'].includes(problem.type)) {
      if (i % 2 == 0 && i > 0) {
        j = newProblems.indexOf(problem)
      }
      newProblems.splice(j, 0, techProblem)
    }
  }
  return newProblems
}

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const sortByTech = (problems) => {
  const newProblems = shuffleAry(problems)
  newProblems.forEach((p, i) => {
    if (p.type2 === '教學') return
    const techProblem = newProblems.find(
      (x) => x.type2 === '教學' && x.name === (p.isRotate ? p.answer : p.name)
    )
    const techIndex = newProblems.indexOf(techProblem)
    if (techIndex > i) {
      ;[newProblems[i], newProblems[techIndex]] = [newProblems[techIndex], newProblems[i]]
    }
  })
  return newProblems
}

export const getProblemLength = (problem) => {
  if (Array.isArray(problem?.options)) {
    return problem.options.length
  }
  return 1
}
