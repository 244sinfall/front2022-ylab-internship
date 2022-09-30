import React from 'react';
import propTypes from 'prop-types';
import numberFormat from "@src/utils/number-format";
import './styles.css';

function BasketTotal(props) {
  return (
    <div className="BasketTotal">
      <span className="BasketTotal-cell">{props.t('basket.total')}</span>
      <span className="BasketTotal-cell"> {numberFormat(props.sum)} ₽</span>
      <span className="BasketTotal-cell"></span>
      <button onClick={props.onAddMore}>{props.t('basket.addMore')}</button>
    </div>
  )
}

BasketTotal.propTypes = {
  sum: propTypes.number,
  onAddMore: propTypes.func,
  t: propTypes.func
}

BasketTotal.defaultProps = {
  sum: 0,
  t: (text) => text
}

export default React.memo(BasketTotal);
