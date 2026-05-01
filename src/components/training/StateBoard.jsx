import { Toggle } from '@/components/ui/toggle'

import PropTypes from 'prop-types'

import { formatTime, getTags } from '@/lib/functions'
import { useEffect, useState } from 'react'
import { useQuestion } from '@/provider/QuestionProvider'

export default function StateBoard({ mod, onTimeUpdate, initialTime = 0 }) {
  const { problems } = useQuestion()
  const tags = getTags(problems)

  const [isActive, setIsActive] = useState(true)
  const [time, setTime] = useState(initialTime)

  // Timer
  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1
          if (onTimeUpdate) onTimeUpdate(newTime)
          return newTime
        })
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, onTimeUpdate])

  const startTimer = () => {
    setIsActive(true)
  }

  const stopTimer = () => {
    setIsActive(false)
  }

  useEffect(() => {
    startTimer()
  }, [])

  useEffect(() => {
    if (mod === 'completed') {
      stopTimer()
    }
  }, [mod])

  return (
    <section className="my-2 space-y-3 rounded-lg border p-3 shadow">
      <ul className="ml-5 list-outside list-disc leading-7">
        <li className="gap-1">
          <div className="flex flex-wrap items-center gap-1">
            標籤：
            {tags.map((tag, index) => (
              <Toggle size="sm" variant="outline" key={index} disabled>
                {tag}
              </Toggle>
            ))}
          </div>
        </li>
        <li>
          時間：
          {formatTime(time)}
        </li>
      </ul>
    </section>
  )
}

StateBoard.propTypes = {
  mod: PropTypes.string,
  onTimeUpdate: PropTypes.func,
  initialTime: PropTypes.number
}
