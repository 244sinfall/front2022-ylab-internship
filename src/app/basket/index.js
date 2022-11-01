import React, {useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import BasketTotal from "@src/components/catalog/basket-total";
import LayoutModal from "@src/components/layouts/layout-modal";
import ItemBasket from "@src/components/catalog/item-basket";
import List from "@src/components/elements/list";

function Basket() {
  const store = useStore();

  const select = useSelector(state => ({
    items: state.basket.items,
    amount: state.basket.amount,
    sum: state.basket.sum
  }));

  const {t} = useTranslate();

  const callbacks = {
    // Закрытие любой модалки
    closeModal: useCallback(() => {
      store.modules.modals.close()
    }, []),
    // Открывает информацию о товаре в модальном окне
    onItemInspect: useCallback(_id => store.modules.modals.open('article', { id: _id }), []),
    // Удаление из корзины
    removeFromBasket: useCallback(_id => store.modules.basket.removeFromBasket(_id), []),
    // Открытие модального окна для добавления новых товаров. Возвраается промис с массивом объектов товаров, которые
    // выбрал пользователь
    onAddMore: useCallback(async() => {
      const resultItems = await store.modules.modals.open('addExtraItems')
      resultItems.forEach(i => store.modules.basket.addItemToBasket(i))
    }, [])
  };

  const renders = {
    itemBasket: useCallback(item => (
      <ItemBasket
        item={item}
        onRemove={callbacks.removeFromBasket}
        onClick={callbacks.onItemInspect}
        labelUnit={t('basket.unit')}
        labelDelete={t('basket.delete')}
      />
    ), []),
  }

  return (
    <LayoutModal title={t('basket.title')} labelClose={t('basket.close')}
                 onClose={callbacks.closeModal}>
      <List items={select.items} renderItem={renders.itemBasket}/>
      <BasketTotal sum={select.sum} t={t} onAddMore={callbacks.onAddMore}/>
    </LayoutModal>
  )
}

export default React.memo(Basket);
