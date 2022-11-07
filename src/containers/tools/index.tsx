import React, {useCallback, useMemo} from "react";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Menu from "@src/components/navigation/menu";
import BasketSimple from "@src/components/catalog/basket-simple";
import LayoutFlex from "@src/components/layouts/layout-flex";
import useStore from '@src/hooks/use-store';

interface ToolsContainerProps {
  hideMenu: boolean
}

function ToolsContainer(props: ToolsContainerProps) {

  const store = useStore();

  const select = useSelector(state => ({
    amount: state.basket.amount,
    sum: state.basket.sum,
    lang: state.locale.lang
  }));

  const {t} = useTranslate();

  const callbacks = {
    // Открытие корзины
    openModalBasket: useCallback(async() => {
      await store.get("modals").open('basket');
    }, []),
  };

  const options = {
    menu: useMemo(() => ([
      {key: 1, title: t('menu.main'), link: '/'},
      {key: 2, title: t('chat.title'), link: '/chat'},
      {key: 3, title: t('canvas.menuItem'), link: '/canvas'}
    ]), [t]),
  }

  return (
    <LayoutFlex flex={props.hideMenu ? "end" : "between"} indent="big">
      {!props.hideMenu && <Menu items={options.menu}/>}
      <BasketSimple onOpen={callbacks.openModalBasket} amount={select.amount} sum={select.sum}
                    t={t}/>
    </LayoutFlex>
  );
}

export default React.memo(ToolsContainer);
