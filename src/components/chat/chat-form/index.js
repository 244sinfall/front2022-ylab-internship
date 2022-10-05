import React from 'react';

import propTypes from 'prop-types';

import './style.css'

import {cn as bem} from "@bem-react/classname";

const ChatForm = props => {
  const cn = bem('ChatForm')
  const callbacks = {
    onSubmit: e => {
      e.preventDefault()
      props.onSubmit()
    },
  }
  return (
    <div className={cn()}>
      <form onSubmit={callbacks.onSubmit} className={cn('form')}>
        <textarea className={cn('textarea')}
                  onChange={props.onChange} placeholder={props.t('chat.placeholder')}
                  value={props.value}></textarea>
        <button className={cn('button')} type='submit'>{props.t('chat.submitMessage')}</button>
      </form>
    </div>
  );
};

ChatForm.propTypes = {
  onChange: propTypes.func.isRequired,
  onSubmit: propTypes.func.isRequired,
  t: propTypes.func.isRequired,
  value: propTypes.string
};

ChatForm.defaultProps = {
  value: ""
}

export default React.memo(ChatForm);
