import classNames from "classnames";
import { FC, ReactNode } from "react";

export interface FormItemProps {
  label?: string;
  children?: ReactNode
}

const FormItem: FC<FormItemProps> = (props) => {
  const {
    label, 
    children
  } = props;
  const rowClass = classNames('stone-row', {
    'stone-row-no-label': !label
  })
  return(
    <div className={rowClass}>
      {
        label &&
        <div className="stone-form-item-label">
          <label title={label}>
            {label}
          </label>
        </div>
      }
      <div className="stone-form-item">
        {children}
      </div>
    </div>
  )
}

export default FormItem;