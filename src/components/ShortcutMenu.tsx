import React, { CSSProperties, useState } from 'react'
import {Button, Dropdown, Menu, Tooltip} from 'antd'
import {SettingOutlined} from "@ant-design/icons";

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
}

const ShortcutMenu: React.FC<ShortcutMenuProps> = ({
  onExpandClick,
  onShowClick,
  onCollapseClick
}) => {
  const [isShown, setIsShown] = useState<boolean>(true)

  const handleShowClick = () => {
    setIsShown(!isShown)
    onShowClick()
  }
  return (
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
                  <Menu.Item onClick={handleShowClick}>
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

  )
}

export default ShortcutMenu
