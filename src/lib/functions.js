import { getQuestionClassByType } from '@/classes/Question'

// 打亂陣列
export function shuffleAry(ary) {
  return [...ary].sort(() => Math.random() - 0.5)
}

// 依照 due 排序 並分組 打亂組內順序
export function shuffleAryByDue(ary) {
  return [...ary]
    .sort((a, b) => a.due - b.due)
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
    alert('題目數量不足')
    throw new Error('Index out of range')
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
  for (let i = 0; i < problems.length; i++) {
    const problem = problems[i]
    if (problem.due !== null || problem.isRotate === true) {
      continue
    }

    const techProblem = createQuestion({ ...problem, type2: '教學' })
    const index = newProblems.indexOf(problem)
    if (index === 0) {
      newProblems.unshift(techProblem)
    } else {
      newProblems.splice(index, 0, techProblem)
    }
  }
  return newProblems
}

export const getProblemLength = (problem) => {
  if (Array.isArray(problem?.options)) {
    return problem.options.length
  }
  return 1
}