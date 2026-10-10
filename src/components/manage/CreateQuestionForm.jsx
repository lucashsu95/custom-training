import { useState } from 'react'
import PropTypes from 'prop-types'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createQuestion } from '@/lib/functions'
import FormField from '@/components/common/FormField'

export default function CreateQuestionForm({ open, onOpenChange, onCreate }) {
  const [type, setType] = useState('單選題')
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    remark: '',
    options: [],
    answers: [],
    answer: '',
  })
  const [errors, setErrors] = useState({})

  const handleTypeChange = (newType) => {
    setType(newType)
    setFormData((prev) => ({
      ...prev,
      name: newType === '配對題' ? [] : '',
      options: newType === '單選題' ? {} : [],
      answers: [],
      answer: ''
    }))
    setErrors({})
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const addOption = () => {
    if (type === '單選題') {
      const keys = ['A', 'B', 'C', 'D', 'E']
      const currentKeys = Object.keys(formData.options || {})
      const nextKey = keys[currentKeys.length]
      if (nextKey) {
        setFormData((prev) => ({
          ...prev,
          options: { ...(prev.options || {}), [nextKey]: '' }
        }))
      }
    } else if (type === '多選題' || type === '填空題') {
      setFormData((prev) => ({
        ...prev,
        options: [...(Array.isArray(prev.options) ? prev.options : []), '']
      }))
    } else if (type === '配對題') {
      setFormData((prev) => ({
        ...prev,
        name: [...(Array.isArray(prev.name) ? prev.name : []), ''],
        options: [...(Array.isArray(prev.options) ? prev.options : []), '']
      }))
    }
  }

  const updateOption = (index, value) => {
    if (type === '單選題') {
      setFormData((prev) => ({
        ...prev,
        options: { ...prev.options, [index]: value },
      }))
    } else {
      const newOptions = [...formData.options]
      newOptions[index] = value
      setFormData((prev) => ({ ...prev, options: newOptions }))
    }
    setErrors((prev) => {
      if (!prev.options) return prev
      const next = { ...prev }
      delete next.options
      return next
    })
  }

  const updateAnswer = (index, value) => {
    if (type === '多選題') {
      const newAnswers = [...formData.answers]
      newAnswers[index] = value
      setFormData((prev) => ({ ...prev, answers: newAnswers }))
    } else if (type === '配對題') {
      const newNames = [...(formData.name || [])]
      newNames[index] = value
      setFormData((prev) => ({ ...prev, name: newNames }))
      setErrors((prev) => {
        if (!prev.name) return prev
        const next = { ...prev }
        delete next.name
        return next
      })
    } else {
      handleInputChange('answer', value)
    }
  }

  const removeOption = (index) => {
    if (type === '單選題') {
      const newOptions = { ...(formData.options || {}) }
      delete newOptions[index]
      setFormData((prev) => ({ ...prev, options: newOptions }))
    } else if (type === '多選題' || type === '填空題') {
      setFormData((prev) => ({
        ...prev,
        options: (Array.isArray(prev.options) ? prev.options : []).filter((_, i) => i !== index)
      }))
    } else if (type === '配對題') {
      setFormData((prev) => ({
        ...prev,
        name: (Array.isArray(prev.name) ? prev.name : []).filter((_, i) => i !== index),
        options: (Array.isArray(prev.options) ? prev.options : []).filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = () => {
    const newErrors = {}

    if (!formData.name && type !== '配對題') {
      newErrors.name = '請輸入題目內容'
    }
    if (!formData.tag) {
      newErrors.tag = '請輸入標籤'
    }

    if (type === '單選題' && Object.keys(formData.options).length < 2) {
      newErrors.options = '單選題請至少提供兩個選項'
    }
    if (type === '單選題' && !formData.answer) {
      newErrors.answer = '請選擇正確答案'
    }
    if (type === '多選題' && (formData.options.length < 2 || formData.answers.length === 0)) {
      newErrors.options = '多選題請提供至少兩個選項及一個正確答案'
    }
    if (type === '填空題' && formData.options.length === 0) {
      newErrors.options = '請提供至少一個填空答案'
    }
    if (type === '配對題' && (!formData.name || formData.name.length < 2 || formData.options.length !== formData.name.length)) {
      newErrors.name = '配對題請提供至少兩組配對項'
    }
    if (type === '單字題' && !formData.answer) {
      newErrors.answer = '請輸入單字答案'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error(Object.values(newErrors)[0])
      return
    }
    setErrors({})

    const questionData = {
      id: uuidv4(),
      type,
      name: type === '配對題' ? formData.name : formData.name,
      tag: formData.tag,
      remark: formData.remark,
      due: null,
      isEnabled: true,
      version: 1,
    }

    if (type === '單選題') {
      questionData.options = formData.options
      questionData.answer = formData.answer
    } else if (type === '多選題') {
      questionData.options = formData.options
      questionData.answers = formData.answers
    } else if (type === '填空題') {
      questionData.options = formData.options
    } else if (type === '配對題') {
      questionData.name = formData.name
      questionData.options = formData.options
    } else if (type === '單字題') {
      questionData.name = formData.name
      questionData.answer = formData.answer
      questionData.optionsLength = 3
    }

    const question = createQuestion(questionData)
    onCreate(question.toPayload())
    onOpenChange(false)
    // Reset form
    setFormData({
      name: '',
      tag: '',
      remark: '',
      options: type === '單選題' ? {} : [],
      answers: [],
      answer: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>新增題目</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>題型</Label>
              <Select value={type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇題型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="單選題">單選題</SelectItem>
                  <SelectItem value="多選題">多選題</SelectItem>
                  <SelectItem value="填空題">填空題</SelectItem>
                  <SelectItem value="配對題">配對題</SelectItem>
                  <SelectItem value="單字題">單字題</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FormField label="標籤 (Tag)" htmlFor="cqf-tag" error={errors.tag}>
              <Input
                id="cqf-tag"
                value={formData.tag}
                onChange={(e) => handleInputChange('tag', e.target.value)}
                placeholder="例如: 單元1"
                aria-invalid={!!errors.tag}
                aria-describedby={errors.tag ? 'cqf-tag-error' : undefined}
              />
            </FormField>
          </div>

          <FormField label="題目內容" htmlFor="cqf-name" error={errors.name}>
            {type === '配對題' ? (
              <div className="space-y-2">
                {Array.isArray(formData.name) &&
                  formData.name.map((val, i) => (
                    <div key={`q-name-${i}`} className="flex gap-2">
                      <Input
                        value={val}
                        onChange={(e) => updateAnswer(i, e.target.value)}
                        placeholder={`題目 ${i + 1}`}
                      />
                      <Button variant="destructive" onClick={() => removeOption(i)}>
                        刪除
                      </Button>
                    </div>
                  ))}
                <Button variant="outline" onClick={addOption}>
                  新增配對項
                </Button>
              </div>
            ) : (
              <Input
                id="cqf-name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="輸入題目內容"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'cqf-name-error' : undefined}
              />
            )}
          </FormField>

          {type === '單選題' && (
            <FormField label="選項與答案" error={errors.options || errors.answer}>
              <div className="space-y-2">
                {Object.entries(formData.options || {}).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="font-bold w-4">{key}</span>
                    <Input
                      value={val}
                      onChange={(e) => updateOption(key, e.target.value)}
                      placeholder={`選項 ${key}`}
                    />
                    <Select
                      value={formData.answer}
                      onValueChange={(v) => handleInputChange('answer', v)}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="設為答案" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={key}>答案</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="destructive" onClick={() => removeOption(key)}>
                      刪除
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addOption}>
                  新增選項
                </Button>
              </div>
            </FormField>
          )}

          {type === '多選題' && (
            <FormField label="選項 (請輸入所有選項，包含正確答案)" error={errors.options}>
              <div className="space-y-2">
                {Array.isArray(formData.options) &&
                  formData.options.map((val, i) => (
                    <div key={`opt-mc-${i}`} className="flex gap-2">
                      <Input
                        value={val}
                        onChange={(e) => updateOption(i, e.target.value)}
                        placeholder={`選項 ${i + 1}`}
                      />
                      <Button
                        variant={
                          Array.isArray(formData.answers) &&
                          formData.answers.includes(val) &&
                          val !== ''
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => {
                          if (val === '') {
                            toast.error('請先輸入選項內容再設為答案')
                            return
                          }
                          const answers = formData.answers.includes(val)
                            ? formData.answers.filter((a) => a !== val)
                            : [...formData.answers, val]
                          setFormData((prev) => ({ ...prev, answers }))
                          setErrors((prev) => {
                            if (!prev.options) return prev
                            const next = { ...prev }
                            delete next.options
                            return next
                          })
                        }}
                      >
                        {Array.isArray(formData.answers) &&
                        formData.answers.includes(val) &&
                        val !== ''
                          ? '已選'
                          : '設為答案'}
                      </Button>
                      <Button variant="destructive" onClick={() => removeOption(i)}>
                        刪除
                      </Button>
                    </div>
                  ))}
                <Button variant="outline" onClick={addOption}>
                  新增選項
                </Button>
              </div>
            </FormField>
          )}

          {type === '填空題' && (
            <FormField label="答案 (可新增多個填空項)" error={errors.options}>
              <div className="space-y-2">
                {Array.isArray(formData.options) &&
                  formData.options.map((val, i) => (
                    <div key={`opt-fill-${i}`} className="flex gap-2">
                      <Input
                        value={val}
                        onChange={(e) => updateOption(i, e.target.value)}
                        placeholder={`答案 ${i + 1}`}
                      />
                      <Button variant="destructive" onClick={() => removeOption(i)}>
                        刪除
                      </Button>
                    </div>
                  ))}
                <Button variant="outline" onClick={addOption}>
                  新增填空項
                </Button>
              </div>
            </FormField>
          )}

          {type === '配對題' && (
            <div className="space-y-4">
              <Label>對應答案</Label>
              <div className="space-y-2">
                {Array.isArray(formData.options) &&
                  formData.options.map((val, i) => (
                    <div key={`opt-match-${i}`} className="flex gap-2">
                      <span className="flex items-center text-sm text-muted-foreground">
                        {formData.name?.[i] || `題目 ${i + 1}`}
                      </span>
                      <Input
                        value={val}
                        onChange={(e) => updateOption(i, e.target.value)}
                        placeholder={`對應答案 ${i + 1}`}
                      />
                      <Button variant="destructive" onClick={() => removeOption(i)}>
                        刪除
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {type === '單字題' && (
            <FormField label="答案 (定義/翻譯)" htmlFor="cqf-answer" error={errors.answer}>
              <Input
                id="cqf-answer"
                value={formData.answer}
                onChange={(e) => handleInputChange('answer', e.target.value)}
                placeholder="輸入正確答案"
                aria-invalid={!!errors.answer}
                aria-describedby={errors.answer ? 'cqf-answer-error' : undefined}
              />
            </FormField>
          )}

          <div className="space-y-2">
            <Label>備註</Label>
            <Input
              value={formData.remark}
              onChange={(e) => handleInputChange('remark', e.target.value)}
              placeholder="輸入備註"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleSubmit}>建立題目</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

CreateQuestionForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
}
