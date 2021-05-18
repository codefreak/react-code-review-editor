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
        marginLeft: '4.65em'
      }}
    >
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item onClick={onExpandClick}>
              <div style={menuItemStyle}>
                <p>Expand all</p>
                <p style={shortcutStyle}>alt + e</p>
              </div>
            </Menu.Item>
            <Menu.Item onClick={onCollapseClick}>
              <div style={menuItemStyle}>
                <p>Collapse all</p>
                <p style={shortcutStyle}>alt + c</p>
              </div>
            </Menu.Item>
            <Menu.Item onClick={onShowClick}>
              <div style={menuItemStyle}>
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
          <Button icon={<SettingOutlined />} type="text" shape="circle" />
        </Tooltip>
      </Dropdown>
    </div>
  )
}

export default ShortcutMenu
