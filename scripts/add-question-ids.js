import fs from 'node:fs'
import path from 'node:path'
import { v4 as uuidv4 } from 'uuid'

const DEFAULT_VERSION = 1

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'))
const writeJson = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

const ensureIdAndVersion = (question) => {
  const next = { ...question }
  if (!next.id) {
    next.id = uuidv4()
  }
  if (next.version === undefined) {
    next.version = DEFAULT_VERSION
  }
  return next
}

const buildOutputPath = (inputPath, customOutput) => {
  if (customOutput) return path.resolve(process.cwd(), customOutput)
  const { dir, name, ext } = path.parse(path.resolve(process.cwd(), inputPath))
  return path.join(dir, `${name}-with-ids${ext || '.json'}`)
}

const main = () => {
  const [, , inputPath, outputPathArg] = process.argv
  if (!inputPath) {
    console.error('Usage: node scripts/add-question-ids.js <input.json> [output.json]')
    process.exit(1)
  }

  const resolvedInput = path.resolve(process.cwd(), inputPath)
  const resolvedOutput = buildOutputPath(resolvedInput, outputPathArg)

  const data = readJson(resolvedInput)
  if (!Array.isArray(data)) {
    throw new Error('輸入的 JSON 需為題目陣列')
  }

  const normalized = data.map(ensureIdAndVersion)
  writeJson(resolvedOutput, normalized)

  console.log(`✅ 已新增 id/version，輸出檔案：${resolvedOutput}`)
}

main()
