import React from 'react';
import './style.css'
import {cn as bem} from "@bem-react/classname";
import propTypes from 'prop-types';

const ChatBox = React.forwardRef((props, ref) => {
  const cn = bem("ChatBox")
  return (
    <div className={cn('items')} ref={ref} onScroll={props.onScroll}>
      {props.messages.map(m => props.renderFunction(m))}
    </div>
  )
})

ChatBox.propTypes = {
  messages: propTypes.arrayOf(propTypes.object),
  onScroll: propTypes.func,
  renderFunction: propTypes.func.isRequired
};

ChatBox.defaultProps = {
  messages: []
}

export default ChatBox;
