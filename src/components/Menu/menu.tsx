import React, { CSSProperties, FC, ReactNode, useState , createContext, Children, FunctionComponentElement, cloneElement} from "react";
import classNames from "classnames";
import { MenuItemProps } from "./menuItem";




type SelectCallback = (selectedIndex: string) => void

type MenuMode = 'horizontal' | 'vertical'

export interface MenuProps {
  className?: string,
  mode?: MenuMode,
  defaultIndex?: string,
  style?: CSSProperties,
  onSelect?: SelectCallback,
  children?: ReactNode
  defaultOpenSubMenus?: string[];
}

interface IMenuContext {
  index: string,
  onSelect?: SelectCallback,
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];
}

export const MenuContext = createContext<IMenuContext>(
 { index: '0'}
)
const Menu: FC<MenuProps> = (props) => {
  const { className, mode='horizontal', defaultIndex='0', onSelect, style, children, defaultOpenSubMenus= []} = props

  const [ activeIndex, setActive] = useState(defaultIndex)
  const classes = classNames('StoneMenu', className, {
    'menu-vertical' : mode === 'vertical',
     'menu-horizontal': mode !== 'vertical'
  }) 
  
  const handleClick = (index: string) => {
    setActive(index)
    if(onSelect) {
      onSelect(index)
      //这里的onselect是父组件中的参数onSelect 
    }
  }

  const passedContext: IMenuContext = {
    index: activeIndex,
    onSelect: handleClick,
    mode,
    defaultOpenSubMenus,
  }
  
  const renderChildren = () => {
    return Children.map(children,  (child, index) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>

      const { displayName } = childElement.type
      //  childElement 本身是一个 React 元素，而 childElement.type 指向的是创建这个元素的组件。

      if(displayName === 'MenuItem' || displayName === 'SubMenu') {
        return cloneElement(childElement, {
          index: index.toString()
        })
      } else {
        console.error("Warning: Menu has a child which is not a MenuItem component")
      }
    })
  }

  return (
    <ul className={classes} style={style} data-testid="test-menu">
      <MenuContext.Provider value={passedContext}>
      {renderChildren()}
      </MenuContext.Provider>
      
    </ul>
  )
}

export default Menu