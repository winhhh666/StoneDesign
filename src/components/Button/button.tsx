import classNames from "classnames";
import React, { FC } from "react";

export enum ButtonSize {
  Large = "lg",
  Small = "sm",
}

export enum ButtonType {
  Primary = 'primary',
  Default = 'default',
  Danger = 'danger',
  Link = 'link'

}

interface BaseButtonProps {
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  btnType?: ButtonType;
  children?: React.ReactNode;
  href?: string;
}

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLElement> & BaseButtonProps;
type AnchorButtonProps = React.ButtonHTMLAttributes<HTMLElement> & BaseButtonProps;

export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>
const Button: FC<ButtonProps> = (props) => {
  const { btnType=ButtonType.Default,
          disabled = false, 
          size, 
          children,
          className,
          href,
          ...restProps
        } = props;
  //btn, btn-large, btn-primary
  const classes = classNames('btn', className, {
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    'disabled': (btnType === ButtonType.Link) && disabled
  })
  if(btnType === ButtonType.Link) {
    return(
      <a href={href} 
      className={classes}
      {...restProps}
      >
        {children}
        
      </a>
    )
  }
  else{
    return(
      <button 
      className={classes} 
      disabled={disabled}
      {...restProps}
      >
        {children}
      </button>
    )
  }
  
}


export default Button;