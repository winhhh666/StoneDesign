import { CSSProperties, FC } from "react";
import { ThemeProps } from "../Icon/icon";


export interface ProgressProps {
  percent: number;
  strokeHeight?: number;
  showText?: boolean;
  styles?: CSSProperties;
  theme?: ThemeProps;
}

const Progress: FC<ProgressProps> = (props) => {
  const {
    percent,
    strokeHeight= 15,
    showText=true,
    styles,
    theme="primary",
  } = props;

  return(
    <div className="stone-progress-bar" style={styles}>
      <div className="stone-progress-bar-outer" style={{height: `${strokeHeight}px`}}>
        <div
          className={`stone-progress-bar-inner color-${theme}`}
          style={{width:`${percent}`}}
        >
          {showText && <span>{`${percent}%` }</span>}
        </div>
      </div>
    </div>
  )
}

export default Progress;