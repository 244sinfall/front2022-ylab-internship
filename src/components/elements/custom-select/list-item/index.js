import React from 'react';
import propTypes from 'prop-types';
import {cn as bem} from "@bem-react/classname";
import './styles.css'

function CustomSelectListItem(props) {
  const cn = bem('CustomSelectListItem');
  return (
    <span aria-role className={cn()} onClick={props.onClick} onKeyDown={e => e.code === "Enter" && props.onClick()} role="option" tabIndex={props.tabIndex}>
      <p aria-hidden="true" className={cn('code')}>{props.code ?? props.name.substring(0, 2).toUpperCase()}</p>
      <p className={cn('name')}>{props.name}</p>
    </span>
  )
}

CustomSelectListItem.propTypes = {
  name: propTypes.string.isRequired,
  onClick: propTypes.func,
  code: propTypes.string,
  tabIndex: propTypes.string
 
}

CustomSelectListItem.defaultProps = {
  onClick: () => {},
  tabIndex: 0
}

export default React.memo(CustomSelectListItem);
