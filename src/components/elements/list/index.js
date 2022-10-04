import React from 'react';
import propTypes from 'prop-types';
import {cn as bem} from "@bem-react/classname";
import './style.css';

function List(props) {
  const cn = bem('List');
  return (
    <div className={cn()}>{props.items.map((item, idx) =>
      <div key={`${item._id}-${props.idSpreader}-${Math.random()*10000}`} className={cn('item')}>
        {props.renderItem(item, idx)}
      </div>
    )}
    </div>
  )
}

List.propTypes = {
  items: propTypes.arrayOf(propTypes.object).isRequired,
  // Для избежания конфликтов ключей, когда открыто несколько каталогов
  idSpreader: propTypes.string,
  renderItem: propTypes.func
}

List.defaultProps = {
  items: [],
  idSpreader: "catalog",
  renderItem: (item) => {
    return item.toString()
  }
}

export default React.memo(List);
