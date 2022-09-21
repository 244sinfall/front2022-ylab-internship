import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { cn as bem } from "@bem-react/classname";
import './styles.css';
import CustomSelectListItem from './list-item'
import { useState } from 'react';
import Input from '../input';
import { useMemo } from 'react';

function CustomSelect(props) {
  const cn = bem('CustomSelect');
  const [selectedItem, setSelectedItem] = useState(props.items[0])
  const [searchString, setSearchString] = useState("")
  const [opened, setOpened] = useState(false)
  const searchRegExp = useMemo(() => {
    return searchString ? new RegExp(`${searchString}`, "i") : null
  }, [searchString])

  useEffect(() => {
    if(!opened) setSearchString("")
  }, [opened])
  // Кто вообще пользуется этими табами................
  return (
    <div className={cn()} onKeyDown={e => e.code === "Escape" && opened && setOpened(false)}>
        <span className={cn('selector')} onClick={() => setOpened(!opened)} onKeyDown={e => e.code === "Space" && !opened && setOpened(true)} tabIndex="0" role="listbox">
          <CustomSelectListItem name={selectedItem.name} code={selectedItem.code} />
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08925L6.58928 7.08925C6.26384 7.41468 5.7362 7.41468 5.41077 7.08925L0.410765 2.08925C0.0853278 1.76381 0.0853278 1.23617 0.410765 0.910734Z" fill="black" />
          </svg>
        </span>
        {opened && <div className={cn('dropdown')}>
        {props.items.length > 4 && <input className={cn('search')} placeholder="Поиск" onChange={(e) => setSearchString(e.target.value)}/>}
        <div className={cn('dropdown-items')}>
          {props.items.filter((v, idx) => v.name !== selectedItem.name).map((v) => {
            if(!searchRegExp || searchRegExp.test(v.name) || searchRegExp.test(v.code))
              return <CustomSelectListItem name={v.name} code={v.code} onClick={() => {
                setSelectedItem({name: v.name, code: v.code}) 
                setOpened(false)
                props.onChange(v.name)
              }}/>
            })}
        </div>
      </div>}
    </div>
  )
}

CustomSelect.propTypes = {
  items: propTypes.arrayOf(propTypes.object).isRequired,
  onChange: propTypes.func
}

CustomSelect.defaultProps = {
  onChange: (newValue) => { console.log(newValue) }
}

// List.propTypes = {
//   items: propTypes.arrayOf(propTypes.object).isRequired,
//   renderItem: propTypes.func
// }

// List.defaultProps = {
//   items: [],
//   renderItem: (item) => {
//     return item.toString()
//   }
// }

export default React.memo(CustomSelect);
