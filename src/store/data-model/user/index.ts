/**
 * Отношеняи к сущностям ролей
 */
interface UserRole {
  _id: string,
  _type: string
}

/**
 * Профиль пользователя
 */
interface UserProfileInfo {
  avatar: any,
  birthday: string,
  city: any,
  country: any,
  middlename: string,
  name: string,
  phone: string,
  position: string,
  street: string,
  surname: string
}

/**
 * Сущность пользователя
 */
export interface UserInfo {
  dateCreate: string,
  dateUpdate: string,
  emaiL: string,
  isDeleted: boolean,
  isNew: boolean,
  order: number,
  profile: UserProfileInfo,
  proto: any,
  roles: UserRole[],
  status: string,
  username: string,
  _id: string,
  _key: string,
  _type: string
}
