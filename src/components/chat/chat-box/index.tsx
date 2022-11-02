import React, {ForwardedRef} from 'react';
import './style.css'
import {cn as bem} from "@bem-react/classname";
import {ChatMessage} from "@src/store/data-model/store/chat";

interface ChatBoxProps {
  messages: ChatMessage[]
  onScroll: (e: any) => any,
  renderFunction: (c: any) => React.ReactNode | React.ReactNode[]
}

const ChatBox = React.forwardRef((props: ChatBoxProps, ref: ForwardedRef<HTMLDivElement>) => {
  const cn = bem("ChatBox")
  return (
    <div className={cn('items')} ref={ref} onScroll={props.onScroll}>
      {props.messages.map(m => props.renderFunction(m))}
    </div>
  )
})

export default React.memo(ChatBox);
