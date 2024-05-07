import classNames from "classnames";
import { Children, FC, FunctionComponentElement, ReactNode, useState, MouseEvent } from "react";
import { TabItemProps } from './tabItem'
export interface TabsProps {
  /**当前激活tab面板的index, 默认为0 */
  defaultIndex?: number;
  /**可以扩展的className */
  className?: string;
  /**点击tab触发的回调函数 */
  onSelect?: (selectedIndex: number) => void;
  /**Tabs的样式, 两种可选, 默认为line */
  type?: 'line' | 'card';
  children?: ReactNode 
}

/**
 * 选项卡切换组件
 * 提供平级的区域将大块内容进行收纳和展现, 保持界面整洁
 * ### 引用方法
 * 
 * ~~~js
 * import { Tabs } from 'stone-design'
 * ~~~
 */
export const Tabs: FC<TabsProps> = (props) => {
  const {
    defaultIndex = 0,
    className,
    onSelect,
    type = 'line',
    children
  } = props

  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const handleClick = (e: MouseEvent, index: number, disabled: boolean|undefined) => {
    if(!disabled) {
      setActiveIndex(index)
      onSelect && onSelect(index)
    }
   
  }
  
  const navClass = classNames('stone-tabs-tab', {
    'nav-line': type === 'line',
    'nav-card': type === 'card'
  })
  
  const renderNavLinks = () => {
    //这里的map只会对children中可遍历的元素起作用, 不用担心如果用户搞其他东西进去会报错
    return Children.map(children, (child, index) => {
      const childElement = child as FunctionComponentElement<TabItemProps>
      const {label, disabled} = childElement.props
      const classes = classNames('stone-tabs-nav-item', {
        'is-active': activeIndex === index,
        'disabled': disabled
      })
      return(
        <li className={classes} key={`nav-item-${index}`}
        onClick={(e) => {handleClick(e, index, disabled)}}
        >
          {label}
        </li>
      )
    })
  }
  const renderContent = () => {
    return Children.map(children, (child, index) => {
      if(index === activeIndex){
        return child
      }
    })
  }
  return(
    <div className={`stone-tabs ${className}`}>
      <ul className={navClass}>
        {renderNavLinks()}
      </ul>
      <div className="stone-tabs-content">
       {renderContent()}
      </div>
    </div>
  )
}

export default Tabs