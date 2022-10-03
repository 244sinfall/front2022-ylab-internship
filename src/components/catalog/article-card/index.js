import React from 'react';
import propTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname'
import numberFormat from "@src/utils/number-format";
import './style.css';

function ArticleCard(props) {

  // CSS классы по БЭМ
  const cn = bem('ArticleCard');
  return (
    <div className={cn()}>
      <div className={cn('description')}>{props.article.description}</div>
      <div className={cn('prop')}>
        <div className={cn('label')}>{props.t('article.manufacturer')}:</div>
        <div className={cn('value')}>{props.article.maidIn?.title} ({props.article.maidIn?.code})</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>{props.t('article.category')}:</div>
        <div className={cn('value')}>{props.article.category?.title}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>{props.t('article.productionYear')}:</div>
        <div className={cn('value')}>{props.article.edition}</div>
      </div>
      <div className={cn('prop', {size: 'big'})}>
        <div className={cn('label')}>{props.t('article.price')}:</div>
        <div className={cn('value')}>{numberFormat(props.article.price)} ₽</div>
      </div>
      <div className={cn('controls')}>
        <button onClick={() => props.onAdd(props.article._id)}>{props.t('article.add')}</button>
        {props.onGotoPage && <button onClick={() => props.onGotoPage(props.article._id)}>{props.t('article.goTo')}</button> }
      </div>
    </div>
  )
}

ArticleCard.propTypes = {
  article: propTypes.object.isRequired,
  onAdd: propTypes.func,
  onGotoPage: propTypes.func,
  t: propTypes.func.isRequired,
}

ArticleCard.defaultProps = {
  article: {},
  onAdd: () => {}
}

export default React.memo(ArticleCard);
