import React, { useEffect, useState } from 'react'
import { extractTargetValue } from '../utils/UtilityFunctions'
import { Button, Space } from 'antd'
import './ReplyEditor.css'
import TextArea from 'antd/lib/input/TextArea'
import { EditorPlaceholder } from '../types/types'

export interface CommentEditorProps {
  onSubmit: (value: string) => void
  placeholder: EditorPlaceholder
  textValue?: string
  onCancel?: () => void
  line?: number
  focus?: boolean
}

const CommentEditor: React.FC<CommentEditorProps> = ({
  onSubmit,
  placeholder,
  textValue,
  onCancel,
  line,
  focus
}) => {
  const [value, setValue] = useState<string>(textValue || '')
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [rows, setRows] = useState<number>(1)

  useEffect(() => {
    if (textValue !== undefined || focus) {
      handleFocus()
    }
  }, [textValue])

  const handleFocus = () => {
    setRows(4)
    setIsFocused(true)
  }

  const handleSubmit = () => {
    onSubmit(value)
    resetReplyEditor()
  }

  const resetReplyEditor = () => {
    setRows(1)
    setIsFocused(false)
    setValue('')
    if (onCancel) {
      onCancel()
    }
  }

  const getSubmitButtonText = () => {
    if (placeholder === 'Edit') return 'Edit'
    else {
      return 'Add ' + placeholder
    }
  }

  const getPlaceholder = () => {
    if (line !== undefined) {
      return 'Add a ' + placeholder + ' to line ' + (line + 1) + ' ...'
    } else {
      return 'Add ' + placeholder + ' ...'
    }
  }

  return (
    <div className="replyEditor" data-testid="replyEditor">
      <TextArea
        rows={rows}
        placeholder={getPlaceholder()}
        onChange={extractTargetValue(setValue)}
        value={value}
        onFocus={() => handleFocus()}
        onBlur={() => {
          if (value === '') {
            resetReplyEditor()
          }
        }}
        style={{ resize: 'none' }}
        data-testid="textArea"
      />
      {isFocused && (
        <div className="controlElementsReply">
          <Space>
            <Button
              htmlType="reset"
              onClick={() => resetReplyEditor()}
              type="default"
              data-testid="cancelButton"
              danger
            >
              Cancel
            </Button>

            {value && (
              <Button
                htmlType="submit"
                onClick={() => handleSubmit()}
                type="primary"
                data-testid="replyButton"
              >
                {getSubmitButtonText()}
              </Button>
            )}

            {!value && (
              <Button
                htmlType="submit"
                onClick={() => handleSubmit()}
                type="primary"
                data-testid="replyButton"
                disabled
              >
                {getSubmitButtonText()}
              </Button>
            )}
          </Space>
        </div>
      )}
    </div>
  )
}

export default CommentEditor
