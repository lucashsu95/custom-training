import { formatDate } from '@/lib/functions'
import { createContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useContext } from 'react'

const SettingContext = createContext()

export function SettingProvider({ children }) {
  const [enableTraining, setEnableTraining] = useState(localStorage.getItem('enableTraining'))
  const [trainingCount, setTrainingCount] = useState(localStorage.getItem('trainingCount'))

  const handleSetEnableTraining = useCallback((val) => {
    setEnableTraining(val)
    localStorage.setItem('enableTraining', val)
  }, [])

  const initTrainingCount = useCallback(() => {
    if (enableTraining !== formatDate(new Date().getTime()) && enableTraining != 'false') {
      localStorage.setItem('enableTraining', formatDate(new Date().getTime()))
      setEnableTraining(formatDate(new Date().getTime()))
      setTrainingCount(0)
      localStorage.setItem('trainingCount', 0)
    }
    if (!trainingCount && trainingCount !== 0) {
      localStorage.setItem('trainingCount', 0)
      setTrainingCount(0)
    }
  }, [enableTraining, trainingCount])

  const addTrainingCount = () => {
    setTrainingCount((prev) => {
      const newCount = parseInt(prev) + 1
      localStorage.setItem('trainingCount', newCount)
      return newCount
    })
  }

  const checkTrainingCount = useCallback(() => {
    if (enableTraining == 'false') return false
    return parseInt(trainingCount ?? 0) >= 3
  }, [enableTraining, trainingCount])

  return (
    <SettingContext.Provider
      value={{
        enableTraining,
        trainingCount,
        handleSetEnableTraining,
        initTrainingCount,
        addTrainingCount,
        checkTrainingCount
      }}
    >
      {children}
    </SettingContext.Provider>
  )
}

SettingProvider.propTypes = {
  children: PropTypes.node.isRequired
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSetting = () => {
  const context = useContext(SettingContext)

  if (context === undefined) throw new Error('useSetting must be used within a SettingProvider')

  return context
}
