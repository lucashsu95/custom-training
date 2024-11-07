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

// 抽象類別
class Question {
  constructor(question) {
    this.name = question.name
    this.tag = question.tag
    this.remark = question.remark
    this.due = parseInt(question.due)
    this.type = question.type
  }

  toPayload() {}
}

// 選擇題類別
export class MultipleChoiceQuestion extends Question {
  constructor(question) {
    super(question)
    this.options = question.options
    this.shuffledOptions = shuffleAry(Object.values(question.options))
    this.answer = question.answer
    this.answerStr = question.options[question.answer]
  }
  static create(question) {
    return new MultipleChoiceQuestion(question)
  }
}

export class FillInTheBlankQuestion extends Question {
  constructor(question) {
    super(question)
    this.options = question.options
    this.shuffledOptions = shuffleAry(question.options)
  }

  static create(question) {
    return new FillInTheBlankQuestion(question)
  }
}
