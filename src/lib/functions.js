import { getQuestionClassByType } from '@/classes/Question'

// 打亂陣列
export function shuffleAry(ary) {
  return [...ary].sort(() => Math.random() - 0.5)
}

// 題目等級 -> 時間
/*
1小時 = 3600秒
24小時 = 86400秒
*/
export const practiceIntervalByLevel = {
  '-2': 60, // 1分鐘
  '-1': 120, // 2分鐘
  0: 10800, // 3 小時
  1: 21600, // 6 小時
  2: 43200, // 12 小時
  3: 57600, // 16 小時
  4: 86400, // 1 天
  5: 108000, // 1 天 6 小時
  6: 129600, // 1 天半
  7: 172800, // 2 天
  8: 345600 // 4 天
}

// 檢查是否到達練習時間
const checkCorrectTime = (p) => {
  const currentDate = new Date().getTime()
  if (p.lastAnsweredTime === null) {
    return false
  }
  const prevDay = (currentDate - p.lastAnsweredTime) / 1000
  const nextDay = p.due < 0 ? 0 : practiceIntervalByLevel[p.due]
  return prevDay >= nextDay
}

// 過濾練習時間還沒到的題目
export function filterByTime(questions) {
  return questions.filter((question) => {
    if (question.due > Math.max(Object.keys(practiceIntervalByLevel))) {
      return false
    }
    if (question.lastAnsweredTime === null || question.due === null) {
      return true
    }
    return checkCorrectTime(question)
  })
}

/*
依照 due 排序 並分組 打亂組內順序

  1. 到練習時間的題目
    - lastAnsweredTime
    - order by lastAnsweredTime ASC
  2. 未作答的題目
    - due === null
  3. 隨機排序
    - Math.random() - 0.5

*/
export function shuffleAryByDue(ary) {
  return [...ary]
    .sort((a, b) => {
      const correctTimeA = checkCorrectTime(a)
      const correctTimeB = checkCorrectTime(b)
      if (correctTimeA && correctTimeB) {
        return a.lastAnsweredTime - b.lastAnsweredTime
      }

      if (correctTimeA || correctTimeB) {
        return correctTimeA ? -1 : 1
      }

      if (a.due === null || b.due === null) {
        return a.due === null ? -1 : 1
      }
      return Math.random() - 0.5
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
    return false
  }
  return questions.slice(0, number)
}

export function getTags(questions) {
  const tags = new Set()
  questions.forEach((question) => {
    if (question.isEnabled) {
      tags.add(question.tag)
    }
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
  for (const problem of problems) {
    const p = createQuestion({ ...problem })
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
