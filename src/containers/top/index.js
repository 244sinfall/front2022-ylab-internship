import React, {useCallback} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import useTranslate from "@src/hooks/use-translate";
import LayoutFlex from "@src/components/layouts/layout-flex";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import {useStore as useStoreRedux} from 'react-redux';
import actionsModals from "@src/store-redux/modals/actions";

function TopContainer() {

  const {t} = useTranslate();

  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore();
  const storeRedux = useStoreRedux();
  const select = useSelector(state => ({
    user: state.session.user,
    exists: state.session.exists
  }))

  const callbacks = {
    // Переход к авторизации
    onSignIn: useCallback(() => {
      navigate('/login', {state: {back: location.pathname}});
    }, [location.pathname]),

    // Отмена авторизации
    onSignOut: useCallback(() => {
      store.get('session').signOut();
    }, [location.pathname]),

    // Открыть магазин в модальном окне
    openCatalogModal: useCallback(() => storeRedux.dispatch(actionsModals.open('separateStore')), [])
  };

  return (
    <LayoutFlex flex="end" indent="small">
      <button onClick={callbacks.openCatalogModal}>{t('catalog.openInModal')}</button>
      {select.exists && <Link to="/profile">{select.user.profile.name}</Link>}
      {select.exists
        ? <button onClick={callbacks.onSignOut}>{t('session.signOut')}</button>
        : <button onClick={callbacks.onSignIn}>{t('session.signIn')}</button>
      }
    </LayoutFlex>
  );
}

export default React.memo(TopContainer);
