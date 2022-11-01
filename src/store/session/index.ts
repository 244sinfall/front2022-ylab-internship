import StateModule from "@src/store/module";
import simplifyErrors from "@src/utils/simplify-errors";
import {ModuleConfig} from "@src/store";

interface SessionStateConfig extends ModuleConfig {
  tokenHeader: string
}

interface UserRole {
  _id: string,
  _type: string
}

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
/**
 * Сессия
 */
class SessionState extends StateModule {
  config: SessionStateConfig
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    const user: UserInfo | {} = {}
    return {
      user: user,
      token: null,
      errors: null,
      exists: false,
      waiting: true
    };
  }

  /**
   * Авторизация (вход)
   * @param data
   * @param onSuccess
   * @returns {Promise<void>}
   */
  async signIn(data, onSuccess) {
    this.setState(this.initState(), 'Авторизация (начало)');
    try {
      const json = await this.services.api.request({
        method: 'POST',
        url: '/api/v1/users/sign',
        body: JSON.stringify(data)
      });
      if (json.error) {
        this.setState({
          ...this.getState(),
          errors: simplifyErrors(json.error.data.issues),
          waiting: false
        }, 'Ошибка авторизации');
      } else {
        this.setState({
          ...this.getState(),
          token: json.result.token,
          user: json.result.user as UserInfo,
          exists: true,
          waiting: false
        }, 'Успешная авторизация');

        // Запоминаем токен, чтобы потом автоматически аутентифицировать юзера
        window.localStorage.setItem('token', json.result.token);
        // Устанавливаем токен в АПИ
        this.services.api.setHeader(this.config.tokenHeader, json.result.token);

        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Отмена авторизации (выход)
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await this.services.api.request({method: 'DELETE', url: '/api/v1/users/sign'});
      this.services.api.setHeader(this.config.tokenHeader, null);
    } catch (error) {
      console.error(error);
    }
    this.setState({...this.initState(), waiting: false});
  }

  /**
   * По токену восстановление сессии
   * @return {Promise<void>}
   */
  async remind() {
    const token = localStorage.getItem('token');
    if (token) {
      // Устанавливаем токен в АПИ
      this.services.api.setHeader(this.config.tokenHeader, token);
      const json = await this.services.api.request({url: '/api/v1/users/self'});
      if (json.error) {
        // Удаляем плохой токен
        window.localStorage.removeItem('token');
        this.services.api.setHeader(this.config.tokenHeader, null);
      } else {
        this.setState({
          ...this.getState(),
          token: token,
          user: json.result as UserInfo,
          exists: true,
          waiting: false
        }, 'Успешно вспомнили сессию');
      }
    } else {
      this.setState({
        ...this.getState(),
        exists: false,
        waiting: false
      }, 'Сессии нет');
    }
  }
}

export default SessionState;
