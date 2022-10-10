import './style.css'

import React from 'react';

import {cn as bem} from "@bem-react/classname";
import propTypes from 'prop-types';

const ChatMessage = (props) => {
  const cn = bem('ChatMessage')
  return (
    <span className={cn({isAuthor: props.isAuthor})}>
      <div className={cn('content')}>
        <span className={cn('credentials')}>
          {props.isAuthor ? props.t('chat.you') : props.userName} {props.t('chat.messageAt')} {props.messageDate}
        </span>
        <span className={cn('body')}>
          {props.text}
        </span>
        <span className={cn('status')}>
          {props.isAuthor && (props.isDelivering ? props.t('chat.sent') : props.t('chat.delivered'))}
        </span>
      </div>
    </span>
  );
};

ChatMessage.propTypes = {
  isAuthor: propTypes.bool,
  isDelivering: propTypes.bool,
  userName: propTypes.string.isRequired,
  messageDate: propTypes.string.isRequired,
  text: propTypes.string.isRequired,
  t: propTypes.func.isRequired
}

ChatMessage.defaultProps = {
  isAuthor: false,
  isDelivering: true
}

export default React.memo(ChatMessage);