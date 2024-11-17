import { getQuestionClassByType } from '@/classes/Question'

// 打亂陣列
export function shuffleAry(ary) {
  return [...ary].sort(() => Math.random() - 0.5)
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

export const getVocabularyShuffled = (problems) => {
  const vocabulary = getQuestionByType(problems, '單字題')
  if (vocabulary.length === 0) {
    return problems
  }
  const [names, answers] = vocabulary.reduce(
    (acc, problem) => {
      acc[0].push(problem.name)
      acc[1].push(problem.answer)
      return acc
    },
    [[], []]
  )
  console.log(names, answers)

  return problems.map((p) => {
    if (p.type === '單字題') {
      p.getOptions(names, answers)
    }
    return p
  })
}
