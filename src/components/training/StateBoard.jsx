import { Toggle } from '@/components/ui/toggle'

import PropTypes from 'prop-types'

import { getTags } from '@/lib/functions'
import { useEffect, useState, useContext } from 'react'
import { DataContext } from '@/App'

export default function StateBoard({ mod }) {
  const { problems } = useContext(DataContext)
  const tags = getTags(problems)

  const [isActive, setIsActive] = useState(true)
  const [time, setTime] = useState(0)

  // Timer
  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else if (!isActive && time !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, time])

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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  return (
    <section className="my-2 space-y-3 rounded-lg border p-4 shadow">
      <h1 className="text-xl font-bold">練習中</h1>
      <ul className="ml-5 list-outside list-disc leading-7">
        <li>共有 {problems.length} 題</li>
        <li>
          標籤：
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag, index) => (
              <Toggle variant="outline" key={index} disabled>
                {tag}
              </Toggle>
            ))}
          </div>
        </li>
        <li>
          <b>時間：</b>
          {formatTime(time)}
        </li>
      </ul>
    </section>
  )
}

StateBoard.propTypes = {
  mod: PropTypes.string
}
