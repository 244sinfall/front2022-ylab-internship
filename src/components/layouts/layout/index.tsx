import React from 'react';
import {cn as bem} from "@bem-react/classname";
import './style.less';


function Layout(props: { children: React.ReactNode | React.ReactNode[] }){
  const cn = bem('Layout');
  return (
    <div className={cn()}>
      <div className={cn('content')}>
        {props.children}
      </div>
    </div>
  )
}


export default React.memo(Layout);
