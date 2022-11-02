import './style.css'
import React from 'react';
import {cn as bem} from "@bem-react/classname";

interface ChatMessageProps{
  isAuthor?: boolean,
  isDelivering?: boolean,
  userName: string,
  messageDate: string,
  text: string,
  t: (text: string) => string
}

const ChatMessage = (props: ChatMessageProps) => {
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

export default React.memo(ChatMessage);
