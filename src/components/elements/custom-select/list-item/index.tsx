import React from 'react';
import {cn as bem} from "@bem-react/classname";
import './styles.css'

interface CustomSelectListItemProps {
  name: string,
  onClick?: () => void,
  code?: string
  tabIndex?: number,
  selected?: boolean
}

const CustomSelectListItem = React.forwardRef<HTMLSpanElement, CustomSelectListItemProps>((props, ref) => {
  const cn = bem('CustomSelectListItem');
  return (
    <span ref={ref} data-selected={props.selected ?? false} className={cn()}
          onClick={props.onClick}
          onKeyDown={e => {
            if(e.code === "Enter" || e.code === "Space") {
              e.preventDefault()
              props.onClick && props.onClick()
            }
          }}
          role="option" tabIndex={props.tabIndex}>
      <p aria-hidden="true" className={cn('code')}>{props.code?.substring(0, 2) ?? props.name?.substring(0, 2).toUpperCase() ?? " "}</p>
      <p className={cn('name')}><abbr title={props.name}>{props.name}</abbr></p>
    </span>
  )
})

export default React.memo(CustomSelectListItem);
