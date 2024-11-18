import { useEffect } from 'react'
import { toast } from 'sonner'

const PreventRefresh = () => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
        e.preventDefault()
        toast('當前頁面不能刷新！', {
          description: '請使用頁面上的按鈕來進行操作'
        })
      }
    }
    window.onbeforeunload = function (e) {
      alert('當前頁面不能刷新！')
      var dialogText = '你確定要離開此頁面吗？'
      e.returnValue = dialogText
      return dialogText
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.onbeforeunload = null
    }
  }, [])

  return <></>
}

export default PreventRefresh
