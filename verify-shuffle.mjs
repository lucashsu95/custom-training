// verify-shuffle.mjs — 執行方式: node verify-shuffle.mjs
function shuffleAry(ary) {
  const result = [...ary]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const N = 10000
const input = [1, 2, 3]
const counts = {}

for (let i = 0; i < N; i++) {
  const key = shuffleAry(input).join(',')
  counts[key] = (counts[key] || 0) + 1
}

const permutations = Object.keys(counts)
const expected = N / permutations.length
const tolerance = expected * 0.05

console.log(`Permutations found: ${permutations.length} (expected: 6)`)
console.log(`Expected count per permutation: ${expected.toFixed(0)}`)
console.log(`Tolerance: ±${tolerance.toFixed(0)}`)

let allPass = true
for (const [perm, count] of Object.entries(counts)) {
  const status = Math.abs(count - expected) <= tolerance ? '✅' : '❌'
  if (status === '❌') allPass = false
  console.log(` ${perm}: ${count} ${status}`)
}

console.log(allPass ? '\n✅ Shuffle is uniform' : '\n❌ Shuffle is NOT uniform')
process.exit(allPass ? 0 : 1)
