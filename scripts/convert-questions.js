import fs from 'node:fs'
import path from 'node:path'

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const readJson = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

const writeJson = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

const isQuestionStart = (line) => /^[A-D](?:,[A-D])*\s+\d+\./.test(line.trim())

const parseTxtChunk = (chunk, idx) => {
  const normalized = chunk
    .replace(/（\d+,\d+ 則）/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const match = normalized.match(/^([A-D](?:,[A-D])*)\s+\d+\.\s*(.+)$/)
  if (!match) {
    throw new Error(`無法解析題目（index: ${idx}）：${chunk.slice(0, 80)}...`)
  }

  const answerLetters = match[1].split(',').map((s) => s.trim())
  const remainder = match[2]

  const [namePart, ...optionParts] = remainder.split('(A)')
  if (optionParts.length === 0) {
    throw new Error(`缺少選項（index: ${idx}）`)
  }

  const name = namePart.trim()
  const optionString = `(A)${optionParts.join('(A)')}`

  const optionRegex = /\(([A-D])\)\s*([\s\S]*?)(?=\s*\([A-D]\)|$)/g
  const optionsMap = {}
  let matchOpt
  while ((matchOpt = optionRegex.exec(optionString)) !== null) {
    const label = matchOpt[1]
    const text = matchOpt[2].replace(/（\d+,\d+ 則）/g, '').trim()
    if (text) {
      optionsMap[label] = text
    }
  }

  if (Object.keys(optionsMap).length === 0) {
    throw new Error(`無法解析選項（index: ${idx}）`)
  }

  const missing = answerLetters.filter((a) => !optionsMap[a])
  if (missing.length) {
    throw new Error(`找不到答案對應選項：${missing.join(', ')}（index: ${idx}）`)
  }

  if (answerLetters.length === 1) {
    return {
      type: '單選題',
      name,
      options: optionsMap,
      answer: answerLetters[0],
      isEnabled: true,
      tag: 'iot',
      remark: ''
    }
  }

  const answers = [...new Set(answerLetters.map((a) => optionsMap[a]))]
  const answerSet = new Set(answers)
  const incorrectOptions = [...new Set(
    Object.entries(optionsMap)
      .filter(([label]) => !answerLetters.includes(label))
      .map(([, value]) => value)
      .filter((value) => !answerSet.has(value))
  )]

  return {
    type: '多選題',
    name,
    answers,
    options: incorrectOptions,
    isEnabled: true,
    tag: 'iot',
    remark: ''
  }
}

const parseTxtFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split(/\r?\n/)

  const chunks = []
  let current = []

  for (const rawLine of lines) {
    const line = rawLine.replace(/\u00a0/g, ' ').trim()
    if (!line || line.startsWith('________')) continue

    if (isQuestionStart(line)) {
      if (current.length) {
        chunks.push(current.join(' '))
      }
      current = [line]
    } else if (current.length) {
      current.push(line)
    }
  }

  if (current.length) {
    chunks.push(current.join(' '))
  }

  return chunks.map((chunk, idx) => parseTxtChunk(chunk, idx))
}

const normalizeSingleChoice = (question, idx) => {
  const clone = { ...question }
  const { options, answer } = clone

  if (options === undefined) {
    throw new Error(`單選題缺少 options (index: ${idx})`)
  }

  // 標準化成 { A: 'foo', B: 'bar' }
  let optionMap
  if (Array.isArray(options)) {
    optionMap = options.reduce((acc, opt, i) => {
      acc[letters[i]] = opt
      return acc
    }, {})
  } else if (typeof options === 'object' && options !== null) {
    optionMap = { ...options }
  } else {
    throw new Error(`單選題 options 只能是 array 或 object (index: ${idx})`)
  }

  // 決定答案 key，優先使用已給的 key，其次用值比對
  let answerKey = answer
  if (!optionMap[answerKey]) {
    const foundKey = Object.keys(optionMap).find((key) => optionMap[key] === answer)
    if (foundKey) {
      answerKey = foundKey
    }
  }

  if (!answerKey || !optionMap[answerKey]) {
    throw new Error(`單選題找不到對應答案 (index: ${idx})`)
  }

  return {
    ...clone,
    options: optionMap,
    answer: answerKey,
    isEnabled: clone.isEnabled ?? false,
    remark: clone.remark ?? ''
  }
}

const normalizeMultipleChoice = (question, idx) => {
  const clone = { ...question }
  const rawAnswers = clone.answers ?? clone.answer
  const answers = Array.isArray(rawAnswers) ? rawAnswers : rawAnswers ? [rawAnswers] : []
  if (answers.length === 0) {
    throw new Error(`多選題缺少 answers (index: ${idx})`)
  }

  const answerSet = new Set(answers)

  if (clone.options === undefined) {
    throw new Error(`多選題缺少 options (index: ${idx})`)
  }

  let optionList
  if (Array.isArray(clone.options)) {
    optionList = [...clone.options]
  } else if (typeof clone.options === 'object' && clone.options !== null) {
    optionList = Object.values(clone.options)
  } else {
    throw new Error(`多選題 options 只能是 array 或 object (index: ${idx})`)
  }

  // 移除所有正確答案，並移除重複
  const incorrectOptions = []
  const seen = new Set()
  for (const opt of optionList) {
    if (answerSet.has(opt)) continue
    if (seen.has(opt)) continue
    seen.add(opt)
    incorrectOptions.push(opt)
  }

  return {
    ...clone,
    answers: Array.from(answerSet),
    options: incorrectOptions,
    isEnabled: clone.isEnabled ?? false,
    remark: clone.remark ?? ''
  }
}

const convert = (questions) => {
  return questions.map((q, idx) => {
    if (!q || typeof q !== 'object') {
      throw new Error(`題目格式錯誤 (index: ${idx})`)
    }
    if (q.type === '單選題') {
      return normalizeSingleChoice(q, idx)
    }
    if (q.type === '多選題') {
      return normalizeMultipleChoice(q, idx)
    }
    return {
      ...q,
      isEnabled: q.isEnabled ?? false,
      remark: q.remark ?? ''
    }
  })
}

const main = () => {
  const [, , inputPath, outputPathArg] = process.argv
  if (!inputPath) {
    console.error('Usage: node scripts/convert-questions.js <input.json> [output.json]')
    process.exit(1)
  }

  const resolvedInput = path.resolve(process.cwd(), inputPath)
  const resolvedOutput = path.resolve(
    process.cwd(),
    outputPathArg ?? path.join(path.dirname(resolvedInput), 'converted-questions.json')
  )

  const isTxt = path.extname(resolvedInput).toLowerCase() === '.txt'
  const questions = isTxt ? parseTxtFile(resolvedInput) : readJson(resolvedInput)
  if (!Array.isArray(questions)) {
    throw new Error('輸入的 JSON 需為題目陣列')
  }

  const converted = convert(questions)
  writeJson(resolvedOutput, converted)

  console.log(`✅ 轉換完成，輸出檔案：${resolvedOutput}`)
}

main()
