import classNames from "classnames";
import { ReactNode, FC, useRef, useState, MouseEvent, useEffect, Children, cloneElement } from "react";
import { createContext } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import Input from "../Input";
import Transition from "../Transition";
import { SelectOptionProps } from "./option";
import Icon from "../Icon";
export interface SelectProps {
  /**指定默认选中的条目 可以是字符串或者字符串数组 */
  defaultValue?: string | string[];
  /**选择框默认文字 */
  placeholder?: string;
  /**是否禁用 */
  disabled?: boolean;
  /**是否支持多选 */
  multiple?: boolean;
  /**select input 的name属性 */
  name?: string;
  /**选中值变化时触发 */
  onChange?: (selectedValue: string, selectedValues: string[]) => void;
  /**下拉框出现/隐藏时候触发 */
  onVisibleChange?: (visible: boolean) => void;
  children?: ReactNode;
}

export interface ISelectContext {
  onSelect?: (value: string, isSelected?: boolean) => void;
  selectedValues?: string[];
  multiple?: boolean;
}



export const SelectContext = createContext<ISelectContext>({selectedValues: []})

/**
 * 弹出一个下拉菜单给用户选择操作, 用于代替原生的选择器, 或者需要一个更优雅的多选器时
 * ### 引用方法
 * 
 * ~~~js
 * import { Select } from 'stone-design'
 * //然后可以使用 <Select> 和 <Select.Option>
 }
 */

 export const Select:FC<SelectProps> = (props) => {
  const {
    defaultValue,
    placeholder='请选择',
    disabled,
    multiple,
    name='stone-select',
    onChange,
    onVisibleChange,
    children
  } = props

 

  const input = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLInputElement>(null)
  const containerWidth = useRef(0)
  const [selectedValues, setSelectedValues] = useState<string[]>(Array.isArray(defaultValue) ? defaultValue : [])
  const [value, setValue] = useState(typeof defaultValue === 'string'? defaultValue : '')
  const [menuOpen, setMenuOpen] = useState(false)
  const containerClass = classNames('stone-select', {
    'menu-is-open': menuOpen,
    'is-disabled': disabled,
    'is-multiple': multiple,

  })

  useClickOutside(containerRef, () => {
    setMenuOpen(false)
    if(onVisibleChange && menuOpen) {
      onVisibleChange(false)
    }
  })
  
  useEffect(() => {
    // focus input
    if(input.current) {
      input.current.focus()
      if(multiple && selectedValues.length > 0) {
        input.current.placeholder = ''
      } else {
        if(placeholder) input.current.placeholder = placeholder
       }
    }
  }, [selectedValues, multiple, placeholder])

  useEffect(() => {
    if(containerRef.current) {
      containerWidth.current = containerRef.current.getBoundingClientRect().width
    }
  })

  const handleOptionClick = (value: string, isSelected?: boolean) => {
    // update value
    if(!multiple) {
      setMenuOpen(false)
      setValue(value)
      if(onVisibleChange) {
        onVisibleChange(false)
      }
    }else {
      setValue('')
    }
    let updatedValues = [value]
    //click again to remove selected when is multiple mode
    if(multiple) {
      updatedValues = isSelected ? selectedValues.filter((v) => v!== value) : [...selectedValues, value]
      setSelectedValues(updatedValues)
    }
    if(onChange) {
      onChange(value, updatedValues)
    }
  }
  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    if(!disabled){
      setMenuOpen(!menuOpen)
      if(onVisibleChange){
        onVisibleChange(!menuOpen)
      }
    } 
  }
  
  const passedContext: ISelectContext = {
    onSelect: handleOptionClick,
    selectedValues: selectedValues,
    multiple:multiple,
  }
  const generateOptions = () => {
    return Children.map(children, (child, i) => {
      const childElement = child as React.FunctionComponentElement<SelectOptionProps>
      if(childElement.type.displayName === 'Option') {
        return cloneElement(childElement, {
          index: `stone-select-${i}`,
        })
      } else {
        console.error("Warning: Select has a child which is not aOption component")
      }
    })
  }
  return(
    <div className={containerClass} ref={containerRef}>
      <div className="stone-select-input" onClick={handleClick}>
        <Input ref={input} placeholder={placeholder} value={value}
        readOnly
        icon="angle-down"
        disabled={disabled}
        name={name}
        />
      </div>
      <SelectContext.Provider value={passedContext}>
        <Transition
        in={menuOpen}
        animation="zoom-in-top"
        timeout={300}
        >
          <ul className="stone-select-dropdown">
            {generateOptions()}
          </ul>
        </Transition>
      </SelectContext.Provider>
      {multiple && 
        <div className="stone-selected-tags" style={{maxWidth: containerWidth.current-32}}>
          {
            selectedValues.map((value, index) => {
              return (
                <span className="stone-selected-tag" key={`tag-${index}`}>
                  {value}
                    <Icon icon="times" onClick={ () => {
                      handleOptionClick(value, true)
                    } }/>
                 
                </span>
              )
            })
          }
        </div>
      }
    </div>
  )

}
 
