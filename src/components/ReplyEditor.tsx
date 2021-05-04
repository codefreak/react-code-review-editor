import React, { useEffect, useState } from 'react'
import { extractTargetValue } from './CommentEditor'
import { Button, Space } from 'antd'
import './ReplyEditor.css'
import TextArea from 'antd/lib/input/TextArea'
import { EditorTypes } from '../types/types'

export interface ReplyEditorProps {
  onSubmit: (value: string) => void
  type: EditorTypes
  textValue?: string
  onCancel?: () => void
}

const ReplyEditor: React.FC<ReplyEditorProps> = ({
  onSubmit,
  type,
  textValue,
  onCancel
}) => {
  const [value, setValue] = useState<string>(textValue || '')
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [rows, setRows] = useState<number>(1)

  useEffect(() => {
    if (textValue !== undefined) {
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
    if (type === 'Edit') return 'Edit'
    else {
      return 'Add ' + type
    }
  }

  return (
    <div className="replyEditor" data-testid="replyEditor">
      <TextArea
        rows={rows}
        placeholder={'Add ' + type + ' ...'}
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

export default ReplyEditor
