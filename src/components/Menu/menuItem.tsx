import React, { useContext,FC, ReactNode } from "react";
import { MenuContext } from "./menu";
import classNames from "classnames";

export interface MenuItemProps {
  index?: string;
  /**选项是否被禁用 */
  disabled?: boolean;
  /**选项扩展的 className */
  className?: string;
  /**选项的自定义 style */
  style?: React.CSSProperties;
  children?: ReactNode;
}
const MenuItem: FC<MenuItemProps> = (props) => {
  const {index, className, disabled, style, children} = props
  const context = useContext(MenuContext)
  const classes = classNames('menu-item', className,{
    'is-disabled': disabled,
    'is-active': context.index === index
  })

  const handleClick = () => {
    // 这里的typeof index === 'string'是为了防止用户在使用时候的运行时错误
    // 比方说用户给你传了一个number类型作为index，但是你的index是string类型
    if(context.onSelect && !disabled && ( typeof index === 'string' )){
      context.onSelect(index)
    }
   
  }
  return (
    <li className={classes} style={style} onClick={handleClick}>{children}</li>
  )

}

MenuItem.displayName = 'MenuItem'
export default MenuItem