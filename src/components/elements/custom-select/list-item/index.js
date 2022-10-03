import React from 'react';
import propTypes from 'prop-types';
import {cn as bem} from "@bem-react/classname";
import './styles.css'

const CustomSelectListItem = React.forwardRef((props, ref) => {
  const cn = bem('CustomSelectListItem');
  return (
    <span ref={ref} data-selected={props.selected} className={cn()}
          onClick={props.onClick}
          onKeyDown={e => {
            if(e.code === "Enter" || e.code === "Space") {
              e.preventDefault()
              props.onClick()
            }
          }}
          role="option" tabIndex={props.tabIndex}>
      <p aria-hidden="true" className={cn('code')}>{props.code?.substring(0, 2) ?? props.name?.substring(0, 2).toUpperCase() ?? " "}</p>
      <p className={cn('name')}><abbr title={props.name}>{props.name}</abbr></p>
    </span>
  )
})

CustomSelectListItem.propTypes = {
  name: propTypes.string.isRequired,
  onClick: propTypes.func,
  code: propTypes.string,
  tabIndex: propTypes.number,
  selected: propTypes.bool,
}

CustomSelectListItem.defaultProps = {
  onClick: () => {},
  tabIndex: 0
}

export default CustomSelectListItem;
