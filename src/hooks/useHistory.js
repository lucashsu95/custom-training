import { useIndexedDB } from './useIndexedDB'

export function useHistory() {
  const { addItem, getAllItem, clearAll, clearItem, ready, error } = useIndexedDB('history')

  return {
    addHistory: addItem,
    getHistory: getAllItem,
    clearAllHistory: clearAll,
    deleteHistory: clearItem,
    ready,
    error
  }
}
