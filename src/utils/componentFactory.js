import MultipleChoiceItem from '@/components/training/item/MultipleChoiceItem'
import FillInTheBlankItem from '@/components/training/item/FillInTheBlankItem'
import MatchingItem from '@/components/training/item/MatchingItem'
import VocabularyItem from '@/components/training/item/VocabularyItem'
import React from 'react'

export const createComponent = (type, state) => {
  // state = { i, problem, mod, setState, setResult }
  switch (type) {
    case '選擇題':
      return React.createElement(MultipleChoiceItem, state)
    case '填空題':
      return React.createElement(FillInTheBlankItem, state)
    case '配對題':
      return React.createElement(MatchingItem, state)
    case '單字題':
      return React.createElement(VocabularyItem, state)
    default:
      return null
  }
}
