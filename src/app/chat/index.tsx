import React from "react";
import Layout from "@src/components/layouts/layout";
import TopContainer from "@src/containers/top";
import HeadContainer from "@src/containers/head";
import ToolsContainer from "@src/containers/tools";
import useTranslate from '@src/hooks/use-translate';
import ChatContainer from '@src/containers/chat';

function Chat(){
  const {t} = useTranslate()
  return (
    <Layout>
      <TopContainer/>
      <HeadContainer title={t('chat.title')}/>
      <ToolsContainer hideMenu={false}/>
      <ChatContainer/>
    </Layout>
  )
}

export default React.memo(Chat);
