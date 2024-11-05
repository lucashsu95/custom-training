export default class Question {
  constructor(question) {
    this.name = question.name
    this.options = question.options
    this.answer = question.answer
    this.tag = question.tag
    this.remark = question.remark
    this.due = parseInt(question.due)
    this.answerStr = this.options[this.answer]
  }

  static create(question) {
    return new Question(question)
  }

  toPayload() {
    return {
      name: this.name,
      options: this.options,
      answer: this.answer,
      tag: this.tag,
      remark: this.remark,
      due: parseInt(this.due)
    }
  }
}
