import React, {useCallback, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import useTranslate from "@src/hooks/use-translate";
import Layout from "@src/components/layouts/layout";
import LayoutFlex from "@src/components/layouts/layout-flex";
import Input from "@src/components/elements/input";
import Field from "@src/components/elements/field";
import ToolsContainer from "@src/containers/tools";
import TopContainer from "@src/containers/top";
import HeadContainer from "@src/containers/head";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";

function Login() {
  const {t} = useTranslate();
  const store = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const select = useSelector(state => ({
    waiting: state.session.waiting,
    errors: state.session.errors
  }))

  const [data, setData] = useState({
    login: '',
    password: ''
  });

  const callbacks = {
    onChange: useCallback((value: string, name: string) => {
      setData(prevData => ({...prevData, [name]: value}));
    }, []),

    onSubmit: useCallback(async(e: any) => {
      e.preventDefault();
      await store.modules.session.signIn(data, () => {
        // Возврат на страницу, с которой пришли
        const state = location.state as any
        const back = state.back && state.back !== location.pathname
          ? state.back
          : '/';
        navigate(back);
      });
    }, [data, location.state])
  };

  return (
    <Layout>
      <TopContainer/>
      <HeadContainer title={t('login')}/>
      <ToolsContainer hideMenu={false}/>
      <LayoutFlex flex={"start"} indent={"big"}>
        <form onSubmit={callbacks.onSubmit}>
          <h2>{t('auth.title')}</h2>
          <Field label={t('auth.login')} error={select.errors?.login}>
            <Input name="login" onChange={callbacks.onChange}
                   value={data.login}/>
          </Field>
          <Field label={t('auth.password')} error={select.errors?.password}>
            <Input name="password" type="password" onChange={callbacks.onChange}
                   value={data.password}/>
          </Field>
          <Field error={select.errors?.other}/>
          <Field>
            <button disabled={select.waiting} type="submit">{t('auth.signIn')}</button>
          </Field>
        </form>
      </LayoutFlex>

    </Layout>
  )
}

export default React.memo(Login);
