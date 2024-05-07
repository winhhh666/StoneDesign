import React, { FC, ReactElement, ReactNode } from 'react'

export interface TabItemProps {
  /**Tab选项文字 */
  label: string | ReactElement;
  /**Tab选项是否被禁用 */
  disabled?: boolean;
  children?: ReactNode;
}

export const TableItem: FC<TabItemProps> = ({children}) => {

  return (
    <div className="stone-tab-item">
      {children}
    </div>
  )
}

export default TableItem