import React, {useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import useTranslate from "@src/hooks/use-translate";
import ArticleCard from "@src/components/catalog/article-card";
import Spinner from "@src/components/elements/spinner";
import propTypes from 'prop-types';
import useSelector from '@src/hooks/use-selector';
import LayoutModal from '@src/components/layouts/layout-modal';
import {useNavigate} from 'react-router-dom';

interface ArticleModalProps {
  id: string
}

function ArticleModal(props: ArticleModalProps){
  const store = useStore();
  const nav = useNavigate()
  useInit(async () => {
    await store.modules.article.load(props.id);
  }, []);

  const select = useSelector(state => ({
    article: state.article.data,
    waiting: state.article.waiting
  }))

  const {t} = useTranslate();

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback((_id: string) => store.modules.basket.addToBasket(_id), []),
    // Закрытие модалки
    onClose: useCallback(() => store.modules.modals.close(), []),
    // Переход к странице товара
    onGotoPage: useCallback(async (_id: string) => {
      await store.modules.modals.closeAll()
      nav(`/articles/${_id}`)
    }, [])
  };

  return (
    <LayoutModal title={select.article.title || ''} onClose={callbacks.onClose} labelClose={t('articleModal.close')}>
      <Spinner active={select.waiting}>
        <ArticleCard onGotoPage={callbacks.onGotoPage} article={select.article} onAdd={callbacks.addToBasket} t={t}/>
      </Spinner>
    </LayoutModal>
  )
}

ArticleModal.propTypes = {
  id: propTypes.string.isRequired
}

export default React.memo(ArticleModal);
