import React, {useEffect, useRef} from 'react';
import { cn as bem } from "@bem-react/classname";
import './styles.css';
import CustomSelectListItem from './list-item'
import { useState } from 'react';
import { useMemo } from 'react';
import { CustomSelectOption } from '@src/store/data-model/components/custom-select';

interface CustomSelectProps {
  options: CustomSelectOption[],
  onChange?: (value: string) => void,
  value?: string,
}

function CustomSelect(props: CustomSelectProps) {
  const cn = bem('CustomSelect');
  const [selectedItem, setSelectedItem] = useState(props.options.find(i => i.value === props.value) ?? props.options[0])
  const [searchString, setSearchString] = useState("")
  const [opened, setOpened] = useState<boolean | null>(null)

  const currentSelection = useRef<HTMLSpanElement | null>(null)
  const selectorRef = useRef<HTMLSpanElement | null>(null)
  const componentRef = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const searchRegExp = useMemo(() => {
    return searchString ? new RegExp(`${searchString}`, "i") : null
  }, [searchString])

  const callbacks = {
    handleClickOutside: (e: any) => {
      if(componentRef.current) {
        if(opened && !componentRef.current.contains(e.target)) {
          callbacks.handleDropdownOpenClose()
        }
      }
    },
    handleArrowFocusShift: (e: any) => {
      if(e.code !== "ArrowDown" && e.code !== "ArrowUp") return
      e.preventDefault()
      if(currentSelection.current !== null) {
        if(e.code === "ArrowDown" && currentSelection.current.nextSibling) {
          currentSelection.current = currentSelection.current.nextSibling as HTMLSpanElement
        }
        if(e.code === "ArrowUp" && currentSelection.current.previousSibling) {
          currentSelection.current = currentSelection.current.previousSibling as HTMLSpanElement
        }
        currentSelection.current.focus()
      }
    },
    handleDropdownOpenClose: () => {
      if(opened) return setOpened(false)
      if(dropdownRef.current) dropdownRef.current.style.display = "block"
      setTimeout(() => setOpened(true))
    },
    handleEscapeKeyWhileOpened: (e: any) => {
      if(e.code === "Escape" && opened) callbacks.handleDropdownOpenClose()
    },
    handleDropdownOpenByKeys: (e: any) => {
      if((e.code === "Enter" || e.code === "Space") && !opened) {
        e.preventDefault()
        callbacks.handleDropdownOpenClose()
      }
    },
    handleDropdownCloseAnimationEnd: () => {
      if(!opened && dropdownRef.current)
        dropdownRef.current.style.display = "none"
    }
  }
  /**
   * useEffect используется для отслеживания клика за пределами селектора.
   */
  useEffect(() => {
    document.addEventListener("mousedown", callbacks.handleClickOutside)
    return () => document.removeEventListener("mousedown", callbacks.handleClickOutside)
  })
  /**
   * Первое условие обновляет внутреннее состояние под изменение внешнего, если такое происходит
   * Второе условие сбрасывает поиск при изменении свойств / закрытии выпадашки
   * Третье возвращает фокус на селектор при закрытии выпадашки
   */
  useEffect(() => {
    if(props.value !== undefined && props.value !== selectedItem.value) setSelectedItem(props.options.find(i => i.value === props.value) ?? props.options[0])
    if(!opened) setSearchString("")
    if(selectorRef.current && opened === false) selectorRef.current.focus()
  }, [props, opened])

  const defaultRenderItems = useMemo(() => {
    return props.options.map((v) => {
      if(!searchRegExp || searchRegExp.test(v.title) || searchRegExp.test(v.code))
        return <CustomSelectListItem key={v.value} name={v.title} code={v.code} onClick={() => {
          if(v.value !== selectedItem.value) {
            setSelectedItem({value: v.value, title: v.title, code: v.code})
            if(props.onChange) props.onChange(v.value)
          }
          callbacks.handleDropdownOpenClose()
        }} ref={currentSelection.current === null ? currentSelection :
          v.value === selectedItem.value ? currentSelection : null}
                                     selected={v.value === selectedItem.value}/>})
  },[props, selectedItem, searchRegExp, opened])

  return (
    <div ref={componentRef} className={cn()} onKeyDown={callbacks.handleEscapeKeyWhileOpened}
         onKeyDownCapture={callbacks.handleArrowFocusShift}>
        <span ref={selectorRef} className={cn('selector')} onClick={callbacks.handleDropdownOpenClose} style={opened ? {outline: "0"} : undefined}
        onKeyDown={callbacks.handleDropdownOpenByKeys} tabIndex={0} role="listbox">
          <CustomSelectListItem name={selectedItem.title} code={selectedItem.code} tabIndex={-1} />
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08925L6.58928 7.08925C6.26384 7.41468 5.7362 7.41468 5.41077 7.08925L0.410765 2.08925C0.0853278 1.76381 0.0853278 1.23617 0.410765 0.910734Z" fill="black" />
          </svg>
        </span>
        <div className={cn('dropdown')} ref={dropdownRef}
             data-state={opened ? "opened" : "closed"} style={{display: "none"}}
             onTransitionEnd={callbacks.handleDropdownCloseAnimationEnd}>
        <input className={cn('search')} value={searchString} placeholder="Поиск" onChange={(e) => setSearchString(e.target.value)}/>
        <div className={cn('dropdown-items')}>
          {defaultRenderItems}
        </div>
      </div>
    </div>
  )
}



export default React.memo(CustomSelect);
