import { Toggle } from '@/components/ui/toggle'

import PropTypes from 'prop-types'

import { formatTime, getTags } from '@/lib/functions'
import { useEffect, useState, useContext } from 'react'
import { DataContext } from '@/context/DataContext'

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
  mod: PropTypes.string
}
