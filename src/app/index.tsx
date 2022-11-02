import React from 'react';
import {Routes, Route} from "react-router-dom";
import useInit from "@src/hooks/use-init";
import useStore from "@src/hooks/use-store";
import Protected from "@src/containers/protected";
import Main from "./main";
import Article from "./article";
import Login from "./login";
import Profile from "./profile";
import ModalProvider from '@src/containers/modal-provider';
import Chat from '@src/app/chat';
import Canvas from '@src/app/canvas';

/**
 * Приложение
 * @return {React.ReactElement} Виртуальные элементы React
 */
function App() {

  const store = useStore();

  useInit(async ()=>{
    await store.modules.session.remind();
  })

  return (
    <>
      <Routes>
        <Route path={''} element={<Main/>}/>
        <Route path={"/articles/:id"} element={<Article/>}/>
        <Route path={"/login"} element={<Login/>}/>
        <Route path={"/profile"} element={<Protected redirect={'/login'}><Profile/></Protected>}/>
        <Route path={'/chat'} element={<Protected redirect={'/login'}><Chat/></Protected>}/>
        <Route path={'/canvas'} element={<Canvas/>}/>
      </Routes>
      <ModalProvider/>
    </>
  );
}

export default React.memo(App);
