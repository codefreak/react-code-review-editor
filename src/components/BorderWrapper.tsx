import React from 'react'

interface BorderWrapperProps {
  heightTop: number
  heightBottom: number
}

// creates an upright border above and below the left hand side of its children
const BorderWrapper: React.FC<BorderWrapperProps> = ({
  heightTop,
  heightBottom,
  children
}) => {
  return (
    <div>
      <div
        className="extraBorderBottom"
        style={{
          borderLeft: '1px solid #d9d9d9',
          height: heightTop + 'em'
        }}
      >
        {'\u200C'}
      </div>
      {children}
      <div
        className="extraBorderBottom"
        style={{
          borderLeft: '1px solid #d9d9d9',
          height: heightBottom + 'em'
        }}
      >
        {'\u200C'}
      </div>
    </div>
  )
}

export default BorderWrapper
