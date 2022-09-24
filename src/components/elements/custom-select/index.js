import React, { useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import { cn as bem } from "@bem-react/classname";
import './styles.css';
import CustomSelectListItem from './list-item'
import { useState } from 'react';
import { useMemo } from 'react';

function CustomSelect(props) {
  const cn = bem('CustomSelect');
  const [selectedItem, setSelectedItem] = useState(props.options.find(i => i.value === props.value) ?? props.options[0])
  const [searchString, setSearchString] = useState("")
  const [opened, setOpened] = useState(null)

  const currentSelection = useRef()
  const selectorRef = useRef()
  const componentRef = useRef()
  const dropdownRef = useRef()

  const searchRegExp = useMemo(() => {
    return searchString ? new RegExp(`${searchString}`, "i") : null
  }, [searchString])

  const handleClickOutside = e => opened && !componentRef.current.contains(e.target) && handleDropdownOpenClose()

  const handleDropdownOpenClose = () => {
    if(opened) return setOpened(false)
    if(dropdownRef.current) dropdownRef.current.style.display = "block"
    setTimeout(() => setOpened(true))
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  })

  useEffect(() => {
    if(props.value !== selectedItem.value) setSelectedItem(props.options.find(i => i.value === props.value) ?? props.options[0])
    if(!opened) setSearchString("")
    if(selectorRef && opened === false) selectorRef.current.focus() // Я сделал это, потому что не хочу, чтобы он брался в фокус при первом рендер
  }, [props, opened])

  return (
    <div ref={componentRef} className={cn()} onKeyDown={e => e.code === "Escape" && opened && handleDropdownOpenClose()}
         onKeyDownCapture={e => {
           if(e.code !== "ArrowDown" && e.code !== "ArrowUp") return
           e.preventDefault()
           if(e.code === "ArrowDown" && currentSelection.current?.nextSibling)
             currentSelection.current = currentSelection.current.nextSibling
           if(e.code === "ArrowUp" && currentSelection.current?.previousSibling)
             currentSelection.current = currentSelection.current.previousSibling
           currentSelection.current?.focus()
         }}>
        <span ref={selectorRef} className={cn('selector')} onClick={() => handleDropdownOpenClose()} style={opened ? {outline: "0"} : undefined}
        onKeyDown={e => e.code === "Space" && !opened && handleDropdownOpenClose()} tabIndex={0} role="listbox">
          <CustomSelectListItem name={selectedItem.title} code={selectedItem.code} tabIndex={-1} />
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08925L6.58928 7.08925C6.26384 7.41468 5.7362 7.41468 5.41077 7.08925L0.410765 2.08925C0.0853278 1.76381 0.0853278 1.23617 0.410765 0.910734Z" fill="black" />
          </svg>
        </span>
        <div className={cn('dropdown')} ref={dropdownRef} data-state={opened ? "opened" : "closed"} onTransitionEnd={() => {
          if(!opened && dropdownRef.current)
            dropdownRef.current.style.display = "none"}
        }>
        {props.options.length > 4 && <input className={cn('search')} placeholder="Поиск" onChange={(e) => setSearchString(e.target.value)}/>}
        <div className={cn('dropdown-items')}>
          {props.options.map((v) => {
            if(!searchRegExp || searchRegExp.test(v.title) || searchRegExp.test(v.code))
              return <CustomSelectListItem key={v.value} name={v.title} code={v.code} onClick={() => {
                if(v.value !== selectedItem.value) {
                  setSelectedItem({value: v.value, title: v.title, code: v.code})
                  props.onChange(v.value)
                }
                handleDropdownOpenClose()
              }} ref={v.value === selectedItem.value ? currentSelection : null}
                                           selected={v.value === selectedItem.value}/>
            })}
        </div>
      </div>
    </div>
  )
}

CustomSelect.propTypes = {
  options: propTypes.arrayOf(propTypes.object).isRequired,
  onChange: propTypes.func,
  value: propTypes.any
}

CustomSelect.defaultProps = {
  onChange: () => { }
}


export default React.memo(CustomSelect);
