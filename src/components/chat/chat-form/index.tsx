import React from 'react';
import './style.css'
import {cn as bem} from "@bem-react/classname";

interface ChatFormProps {
  onChange: (e: any) => any,
  onSubmit: () => any,
  t: (text: string) => string,
  value: string
}

const ChatForm = (props: ChatFormProps) => {
  const cn = bem('ChatForm')
  const callbacks = {
    onSubmit: (e: any) => {
      e.preventDefault()
      props.onSubmit()
    },
  }
  return (
    <div className={cn()}>
      <form onSubmit={callbacks.onSubmit} className={cn('form')}>
        <textarea className={cn('textarea')}
                  onChange={props.onChange} placeholder={props.t('chat.placeholder')}
                  value={props.value ?? ""}></textarea>
        <button className={cn('button')} type='submit'>{props.t('chat.submitMessage')}</button>
      </form>
    </div>
  );
};

export default React.memo(ChatForm);
