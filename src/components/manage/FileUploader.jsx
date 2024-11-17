'use client'

import { useState, useCallback, useContext } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog'
import { useDropzone } from 'react-dropzone'
import { useIndexedDB } from '@/hooks/useIndexedDB'
import { DataContext } from '@/context/DataContext'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { createQuestion } from '@/lib/functions'

export default function FileUploader() {
  const { addItem } = useIndexedDB('questions')
  const { setQuestions } = useContext(DataContext)

  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState(null)

  const handleFileRead = useCallback(
    (event) => {
      try {
        const questions = JSON.parse(event.target.result)
        questions.forEach((question) => (question.id = uuidv4()))
        addItem(questions)

        setQuestions((prev) => [...prev, ...questions.map((question) => createQuestion(question))])
        toast('✅新增成功！', {
          description: '已成功上傳檔案'
        })
      } catch (error) {
        console.error('Error parsing JSON:', error)
      }
    },
    [addItem, setQuestions]
  )

  const onDrop = useCallback(
    (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0]
      if (uploadedFile && uploadedFile.name.endsWith('.json')) {
        setFile(uploadedFile)
        const reader = new FileReader()
        reader.onload = handleFileRead
        reader.readAsText(uploadedFile)
        setIsOpen(false)
      } else {
        toast('⚠️新增失敗！', {
          description: '請上傳 JSON 檔案'
        })
      }
    },
    [handleFileRead]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    }
  })

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="my-2">新增 題目/標籤</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>新增 題目/標籤</DialogTitle>
          </DialogHeader>
          <DialogDescription>請上傳 JSON 檔以繼續</DialogDescription>
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>將 JSON 檔拖放到此處，或按下以選擇檔 ...</p>
            ) : (
              <p>將 JSON 檔案拖放到此處，或按一下選擇一個文件</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {file && <p className="mt-4 text-green-600">File uploaded: {file.name}</p>}
    </div>
  )
}
