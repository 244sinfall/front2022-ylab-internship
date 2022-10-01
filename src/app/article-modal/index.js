import React, {useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useInit from "@src/hooks/use-init";
import useTranslate from "@src/hooks/use-translate";
import ArticleCard from "@src/components/catalog/article-card";
import Spinner from "@src/components/elements/spinner";
import propTypes from 'prop-types';
import useSelector from '@src/hooks/use-selector';
import LayoutModal from '@src/components/layouts/layout-modal';

function ArticleModal(props){
  const store = useStore();

  useInit(async () => {
    await store.get('article').load(props.params.id);
  }, [props.params.id]);

  const select = useSelector(state => ({
    article: state.article.data,
    waiting: state.article.waiting
  }))

  const {t} = useTranslate();

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(_id => store.get('basket').addToBasket(_id), []),
    onClose: useCallback(() => store.get('modals').close(), [])
  };

  return (
    <LayoutModal title={select.article.title || ''} onClose={callbacks.onClose} labelClose={t('articleModal.close')}>
      <Spinner active={select.waiting}>
        <ArticleCard article={select.article} onAdd={callbacks.addToBasket} t={t}/>
      </Spinner>
    </LayoutModal>
  )
}

ArticleModal.propTypes = {
  params: {
    id: propTypes.string.isRequired
  }
}

export default React.memo(ArticleModal);
