import { shuffleAry } from '@/lib/functions'

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

// 選擇題
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

// 填空題
export class FillInTheBlankQuestion extends Question {
  constructor(question) {
    super(question)
    this.options = question.options
    this.shuffledOptions = shuffleAry(question.options)
  }

  static create(question) {
    return new FillInTheBlankQuestion(question)
  }

  static getCorrectCount(problem, selected, i) {
    return problem.options.reduce(
      (acc, option, j) => (selected.get(`${i}-${j}`) === option ? acc + 1 : acc),
      0
    )
  }
}
// 配對題
export class MatchingQuestion extends Question {
  constructor(question) {
    super(question)
    this.shuffledName = shuffleAry(question.name)
    this.options = question.options
    this.shuffledOptions = shuffleAry(question.options)
  }

  static create(question) {
    return new MatchingQuestion(question)
  }

  static getCorrectCount(problem, selected, i) {
    return problem.shuffledName.reduce(
      (acc, name, j) =>
        selected.get(`${i}-${j}`) === problem.options[problem.name.indexOf(name)]
          ? acc + 1
          : acc,
      0
    )
  }
}

export const questionType = {
  選擇題: MultipleChoiceQuestion,
  填空題: FillInTheBlankQuestion,
  配對題: MatchingQuestion
}
