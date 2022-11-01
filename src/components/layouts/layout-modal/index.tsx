import React, {useEffect, useRef} from 'react';
import {cn as bem} from "@bem-react/classname";
import './style.less';

interface LayoutModalProps {
  title: string,
  onClose: () => any,
  children: React.ReactNode | React.ReactNode[],
  theme?: string,
  labelClose: string
}

function LayoutModal(props: LayoutModalProps) {
  const cn = bem('LayoutModal');

  const frame = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if(frame.current) {
      let top = 10;
      if (window.innerWidth > frame.current.clientHeight) {
        top = Math.max(top, (window.innerHeight - frame.current.clientHeight) / 2 - top);
      }
      frame.current.style.marginTop = `${top}px`;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      }
    }
  });

  return (
    <div className={cn()}>
      <div className={cn('frame', {theme: props.theme ?? "normal"})} ref={frame}>
        <div className={cn('head')}>
          <h1 className={cn('title')}>
            {props.title}
          </h1>
          <button className={cn('close')} onClick={props.onClose}>{props.labelClose}</button>
        </div>
        <div className={cn('content')}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default React.memo(LayoutModal);
