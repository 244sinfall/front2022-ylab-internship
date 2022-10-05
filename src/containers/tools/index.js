import React, {useCallback, useMemo} from "react";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Menu from "@src/components/navigation/menu";
import BasketSimple from "@src/components/catalog/basket-simple";
import LayoutFlex from "@src/components/layouts/layout-flex";
import useStore from '@src/hooks/use-store';

function ToolsContainer({showMenu = true}) {

  const store = useStore();

  const select = useSelector(state => ({
    amount: state.basket.amount,
    sum: state.basket.sum,
    lang: state.locale.lang
  }));

  const {t} = useTranslate();

  const callbacks = {
    // Открытие корзины
    openModalBasket: useCallback(() => {
      store.get('modals').open('basket');
    }, []),
  };

  const options = {
    menu: useMemo(() => ([
      {key: 1, title: t('menu.main'), link: '/'},
      {key: 2, title: t('chat.title'), link: '/chat'}
    ]), [t]),
  }

  return (
    <LayoutFlex flex={showMenu ? "between" : "end"} indent="big">
      {showMenu && <Menu items={options.menu}/>}
      <BasketSimple onOpen={callbacks.openModalBasket} amount={select.amount} sum={select.sum}
                    t={t}/>
    </LayoutFlex>
  );
}

export default React.memo(ToolsContainer);
