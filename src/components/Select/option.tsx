import { ReactNode, FC, useContext, MouseEvent } from "react";
import { SelectContext } from "./select";
import classNames from "classnames";
import Icon from "../Icon";
export interface SelectOptionProps {
  index?: string;
  /** 默认根据此属性值进行筛选, 该值不能相同 */
  value:string;
  /**选项标签, 若不设置默认与value相同 */
  label?: string;
  /** 是否禁用 */
  disabled?: boolean;
  children?: ReactNode
}

export const Option: FC<SelectOptionProps> = ({ index, value, label, disabled, children }) => {
  const { onSelect, selectedValues, multiple } = useContext(SelectContext)
  const isSelected = selectedValues && selectedValues.includes(value)
  const classes = classNames('stone-select-item', {
    'is-disabled': disabled,
    'is-selected': isSelected
  })
  const handleClick = (e: MouseEvent, value: string, isSelected: boolean) => {
    e.preventDefault()
    if(onSelect && !disabled){
      onSelect(value, isSelected)
    }
  }

  return(
    <li key={index} className={classes} onClick={(e:MouseEvent) => handleClick(e, value, isSelected as boolean)}>
      {children || label ? label: value}
      {multiple && isSelected && <Icon icon="check"/>}
    </li>
  )
}

Option.displayName = 'Option'
export default Option