import { shuffleAry } from '@/lib/functions'

// 抽象類別
class Question {
  constructor(question) {
    this.id = question.id
    this.name = question.name
    this.tag = question.tag
    this.remark = question.remark ?? ''
    this.due = question.due ?? null
    this.type = question.type
    this.type2 = question.type2 ?? null // 是否為教學題
    this.afterErr = question.afterErr ?? false // 答錯後產生的題目
    this.lastAnsweredTime = question.lastAnsweredTime ?? null
    this.isEnabled = question.isEnabled ?? true
    this.isChecked = question.isChecked ?? false
    this.selected
  }

  isCorrect() {}
  getCorrectCount() {
    return this.isCorrect() ? 1 : 0
  }
  getProblemLength() {
    return 1
  }
  toPayload() {}
}

// 單選題
export class SignleChoiceQuestion extends Question {
  constructor(question) {
    super(question)
    this.options = question.options
    this.shuffledOptions = shuffleAry(Object.values(question.options))
    this.answer = question.answer
    this.answerStr = question.options[question.answer]
    this.selected = ''
  }
  static create(question) {
    return new SignleChoiceQuestion(question)
  }

  isCorrect() {
    return this.selected === this.answerStr
  }

  toPayload() {
    return {
      id: this.id,
      tag: this.tag,
      remark: this.remark,
      due: this.due,
      answer: this.answer,
      name: this.name,
      type: this.type,
      options: this.options,
      lastAnsweredTime: this.lastAnsweredTime,
      isEnabled: this.isEnabled
    }
  }
}
// 多選題
export class MultipleChoiceQuestion extends Question {
  constructor(question) {
    super(question)
    const options = Array.isArray(question.options) ? question.options : []
    const answers = Array.isArray(question.answers) ? question.answers : []
    if (!Array.isArray(question.options) || !Array.isArray(question.answers)) {
      console.warn('Invalid multiple choice payload', { id: question.id, options: question.options, answers: question.answers })
    }

    this.options = options
    this.answers = answers
    this.shuffledOptions = question.shuffledOptions ?? shuffleAry([...options, ...answers])
    this.selected = question?.selected ?? []
    this.hasSubmit = question?.hasSubmit ?? false
  }
  static create(question) {
    return new MultipleChoiceQuestion(question)
  }
  isCorrect() {
    return (
      this.selected.length > 0 &&
      this.answers.every((answer) => this.selected.includes(answer)) &&
      this.options.every((option) => !this.selected.includes(option))
    )
  }
  toPayload() {
    return {
      id: this.id,
      tag: this.tag,
      remark: this.remark,
      due: this.due,
      answers: this.answers,
      name: this.name,
      type: this.type,
      options: this.options,
      lastAnsweredTime: this.lastAnsweredTime,
      isEnabled: this.isEnabled
    }
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

  isCorrect() {
    return this.options.every((option, j) => this.selected.get(j) === option)
  }

  getProblemLength() {
    return this.options.length
  }
  getCorrectCount() {
    return this.options.reduce(
      (acc, option, j) => (this.selected.get(j) === option ? acc + 1 : acc),
      0
    )
  }

  toPayload() {
    return {
      id: this.id,
      tag: this.tag,
      remark: this.remark,
      name: this.name,
      due: this.due,
      options: this.options,
      type: this.type,
      lastAnsweredTime: this.lastAnsweredTime,
      isEnabled: this.isEnabled
    }
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

  isCorrect() {
    return this.shuffledName.every(
      (name, j) => this.selected.get(j) === this.options[this.name.indexOf(name)]
    )
  }

  getCorrectCount() {
    return this.shuffledName.reduce(
      (acc, name, j) =>
        this.selected.get(j) === this.options[this.name.indexOf(name)] ? acc + 1 : acc,
      0
    )
  }

  getProblemLength() {
    return this.shuffledName.length
  }

  toPayload() {
    return {
      id: this.id,
      tag: this.tag,
      remark: this.remark,
      name: this.name,
      due: this.due,
      options: this.options,
      type: this.type,
      lastAnsweredTime: this.lastAnsweredTime,
      isEnabled: this.isEnabled
    }
  }
}

// 單字題
export class VocabularyQuestion extends Question {
  constructor(question) {
    super(question)
    this.answer = question.answer
    this.optionsLength = question.optionsLength ?? 3
    this.selected = ''
    this.isRotate = question.isRotate ?? false
    this.shuffledOptions = question.shuffledOptions ?? []
  }

  static create(question) {
    return new VocabularyQuestion(question)
  }

  getNameOptions(names) {
    const filteredNames = names.filter((x) => x !== this.name)
    ;[this.name, this.answer] = [this.answer, this.name]
    const options = [...shuffleAry(filteredNames).slice(0, this.optionsLength - 1), this.answer]
    this.shuffledOptions = shuffleAry(options)
    this.isRotate = true
  }

  getAnswerOptions(answers) {
    const filteredAnswers = answers.filter((x) => x !== this.answer)
    const options = [...shuffleAry(filteredAnswers).slice(0, this.optionsLength - 1), this.answer]
    this.shuffledOptions = shuffleAry(options)
  }

  isCorrect() {
    return this.selected === this.answer
  }

  toPayload() {
    return {
      id: this.id,
      tag: this.tag,
      remark: this.remark,
      due: this.due,
      name: this.name,
      type: this.type,
      lastAnsweredTime: this.lastAnsweredTime,
      isEnabled: this.isEnabled,
      answer: this.answer,
      optionsLength: this.optionsLength
    }
  }
}

export const getQuestionClassByType = {
  單選題: SignleChoiceQuestion,
  多選題: MultipleChoiceQuestion,
  填空題: FillInTheBlankQuestion,
  配對題: MatchingQuestion,
  單字題: VocabularyQuestion
}
