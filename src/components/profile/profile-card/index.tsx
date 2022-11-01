import React from 'react';
import {cn as bem} from '@bem-react/classname';
import './style.css';
import {UserInfo} from "@src/store/data-model/user";

interface ProfileCardProps {
  data?: UserInfo
}

function ProfileCard(props: ProfileCardProps) {
  // CSS классы по БЭМ
  const cn = bem('ProfileCard');

  return (
    <div className={cn()}>
      <h3 className={cn('title')}>Профиль</h3>
      <div className={cn('prop')}>
        <div className={cn('label')}>Имя:</div>
        <div className={cn('value')}>{props.data?.profile?.name}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>Телефон:</div>
        <div className={cn('value')}>{props.data?.profile?.phone}</div>
      </div>
      <div className={cn('prop')}>
        <div className={cn('label')}>email:</div>
        <div className={cn('value')}>{props.data?.email}</div>
      </div>
    </div>
  )
}

export default React.memo(ProfileCard);
