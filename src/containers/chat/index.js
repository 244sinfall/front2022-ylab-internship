import React, {useCallback, useEffect, useRef, useState} from "react";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import ChatBox from '@src/components/chat/chat-box';
import ChatForm from '@src/components/chat/chat-form';
import ChatMessage from '@src/components/chat/chat-message';
import {convertDateToChatFormat} from '@src/utils/chat-date';

function ChatContainer() {
  const select = useSelector(state => ({
    userId: state.session.user._id,
    token: state.session.token,
    messages: state.chat.messages,
    maxOut: state.chat.maxOut
  }))
  // Для загрузки более старых сообщений
  const [oldestLoaded, setOldestLoaded] = useState()
  // Для мягкого скролла вниз, когда новые загрузились сверху
  const [, setCurrentTopPoint] = useState()
  // Эффект для установки значения для загрузки более старых сообщений
  useEffect(() => {
    if(select.messages.length > 0) setOldestLoaded(select.messages[0]._id)
  }, [select.messages])

  const store = useStore()
  const chatBoxRef = useRef()

  useEffect(() => {
    const destroy = store.get('chat').init(select.token)
    return () => destroy.then(destroy => destroy())
  }, []);
  // Эффект для мягкого скролла, когда меняется высота контейнера из-за загрузки сверху
  useEffect(() => {
    if(chatBoxRef.current) {
      setCurrentTopPoint((prev) => {
        if(prev) {
          chatBoxRef.current.scrollTo({ top: chatBoxRef.current.scrollHeight - prev, behavior: 'smooth' })
        }
        return chatBoxRef.current.scrollHeight
      })
    }
  }, [chatBoxRef.current?.scrollHeight])
  // Эффект для переноса скролла к нижнему сообщению, если клиент находится не далеко
  useEffect(() => {
    if(chatBoxRef.current &&
      chatBoxRef.current.scrollHeight - chatBoxRef.current.scrollTop - chatBoxRef.current.clientHeight < 400) {
      chatBoxRef.current.scrollTo({top: chatBoxRef.current.scrollHeight, behavior: 'smooth'})
    }
  }, [select.messages])

  const {t} = useTranslate()
  // Состояние текстбокса для отправки сообщения
  const [message, setMessage] = useState("")

  const callbacks = {
    // Если доскроленно до верху, пробуем подгрузить новые.
    onItemsScroll: useCallback(async e => {
      if (e.target.scrollTop === 0 && !select.maxOut) {
        await store.get('chat').loadOlderMessages(oldestLoaded)
      }
    }, [oldestLoaded, select.maxOut]),
    // Редактирование сообщения в чатбоксе
    onMessageTextChange: useCallback(e => setMessage(e.target.value), []),
    // Отправка сообщения
    onMessageSubmit: useCallback(() => {
      const safeMessage = message.trim()
      if(safeMessage) store.get('chat').sendMessage(message).then(() => setMessage(""))
    }, [message])
  }

  const renderMessage = useCallback((message) => {
    return <ChatMessage key={message._key} t={t} isAuthor={select.userId === message.author._id}
                        text={message.text} messageDate={convertDateToChatFormat(message.dateCreate)}
                        userName={message.author.profile.name}/>
  }, [t, select.userId])

  return (
    <>
      <ChatBox ref={chatBoxRef} messages={select.messages} renderFunction={renderMessage} onScroll={callbacks.onItemsScroll}/>
      <ChatForm t={t} onChange={callbacks.onMessageTextChange} onSubmit={callbacks.onMessageSubmit} value={message}/>
    </>
  );
}

export default React.memo(ChatContainer);
