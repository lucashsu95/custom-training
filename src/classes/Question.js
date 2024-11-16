import { shuffleAry } from '@/lib/functions'

// 抽象類別
class Question {
  constructor(question) {
    this.name = question.name
    this.tag = question.tag
    this.remark = question.remark
    this.due = parseInt(question.due)
    this.type = question.type
    this.selected
  }

  toPayload() {}
  getCorrectCount() {}
}

// 選擇題
export class MultipleChoiceQuestion extends Question {
  constructor(question) {
    super(question)
    this.options = question.options
    this.shuffledOptions = shuffleAry(Object.values(question.options))
    this.answer = question.answer
    this.answerStr = question.options[question.answer]
    this.selected = ''
  }
  static create(question) {
    return new MultipleChoiceQuestion(question)
  }
  getCorrectCount() {
    return this.selected === this.answerStr ? 1 : 0
  }
}

// 填空題
export class FillInTheBlankQuestion extends Question {
  constructor(question) {
    super(question)
    this.options = question.options
    this.shuffledOptions = shuffleAry(question.options)
    this.selected = new Map()
  }

  static create(question) {
    return new FillInTheBlankQuestion(question)
  }

  getCorrectCount() {
    return this.options.reduce(
      (acc, option, j) => (this.selected.get(j) === option ? acc + 1 : acc),
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
    this.selected = new Map()
  }

  static create(question) {
    return new MatchingQuestion(question)
  }

  getCorrectCount() {
    return this.shuffledName.reduce(
      (acc, name, j) =>
        this.selected.get(j) === this.options[this.name.indexOf(name)] ? acc + 1 : acc,
      0
    )
  }
}

export const getQuestionClassByType = {
  選擇題: MultipleChoiceQuestion,
  填空題: FillInTheBlankQuestion,
  配對題: MatchingQuestion
}
