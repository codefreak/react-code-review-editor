import React, { CSSProperties } from 'react'
import { Button, Dropdown, Menu, Tooltip } from 'antd'
import { SettingOutlined } from '@ant-design/icons'

const menuItemStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
}

const shortcutStyle: CSSProperties = {
  background: '#ECECEC',
  marginLeft: '1em',
  paddingLeft: '0.5em',
  paddingRight: '0.5em',
  borderRadius: '5px'
}

interface ShortcutMenuProps {
  onExpandClick: () => void
  onCollapseClick: () => void
  onShowClick: () => void
  isShown: boolean
}

const ShortcutMenu: React.FC<ShortcutMenuProps> = ({
  onExpandClick,
  onShowClick,
  onCollapseClick,
  isShown
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row-reverse',
        borderLeft: '1px solid #d9d9d9',
        marginLeft: '4.7em'
      }}
      data-testid="shortcuts"
    >
      <Dropdown
        overlay={
          <Menu data-testid="shortcutMenu">
            <Menu.Item onClick={onExpandClick}>
              <div style={menuItemStyle} data-testid="expandButton">
                <p>Expand all</p>
                <p style={shortcutStyle}>alt + e</p>
              </div>
            </Menu.Item>
            <Menu.Item onClick={onCollapseClick}>
              <div style={menuItemStyle} data-testid="collapseButton">
                <p>Collapse all</p>
                <p style={shortcutStyle}>alt + c</p>
              </div>
            </Menu.Item>
            <Menu.Item onClick={onShowClick}>
              <div style={menuItemStyle} data-testid="showButton">
                {isShown ? <p>Hide comments</p> : <p>Show comments</p>}
                <p style={shortcutStyle}>alt + h</p>
              </div>
            </Menu.Item>
          </Menu>
        }
        placement="bottomCenter"
        trigger={['click']}
      >
        <Tooltip title="shortcuts">
          <Button
            icon={<SettingOutlined />}
            type="text"
            shape="circle"
            data-testid="shortcutButton"
          />
        </Tooltip>
      </Dropdown>
    </div>
  )
}

export default ShortcutMenu
