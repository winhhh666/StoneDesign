import { FC, ReactNode } from "react"
import { CSSTransition } from "react-transition-group"
import { CSSTransitionProps } from "react-transition-group/CSSTransition"

type AnimationName = 'zoom-in-top' | 'zoom-in-left' | 'zoom-in-bottom' | 'zoom-in-right'


type TransitionProps = CSSTransitionProps & {
  animation?: AnimationName,
  wrapper?: boolean,
  children?: ReactNode
}

const Transition: FC<TransitionProps> = (props) => {
  const { unmountOnExit = true, appear = true ,children, classNames, animation, wrapper, ...restProps} = props
  return(
    <CSSTransition unmountOnExit={unmountOnExit} appear={appear} classNames={ classNames ? classNames : animation } {...restProps}>
      {wrapper ? <div>{children}</div> : children}
    </CSSTransition>
  )
}


export default Transition