import React from 'react';
import {cn as bem} from "@bem-react/classname";
import './style.less';

interface LayoutFlexProps {
  children: React.ReactNode | React.ReactNode[]
  flex: "start" | "end" | "between"
  indent: "small" | "big"
}

function LayoutFlex(props: LayoutFlexProps){
  const cn = bem('LayoutFlex');

  return (
    <div className={cn({flex: props.flex, indent: props.indent})}>
      {React.Children.map(props.children, (child: any) => (
        child && <div key={child.key} className={cn('item')}>{child}</div>
      ))}
    </div>
  )
}

export default React.memo(LayoutFlex);
