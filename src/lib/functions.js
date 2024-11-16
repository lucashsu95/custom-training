import { questionType } from '@/classes/Question'

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
export function getQuestionByNumber(questions, number) {
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

export function getProblemType(problem) {
  return questionType[problem.type].create(problem)
}
