import StateModule from "@src/store/module";
import {UserInfo} from "@src/store/data-model/user";
import {ProfileValues} from "@src/store/data-model/store/profile";

/**
 * Состояние профиля
 */
class ProfileState extends StateModule<ProfileState>{
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      waiting: false
    } as ProfileValues;
  }

  /**
   * Загрузка профиля
   */
  async load(){
    // Сброс текущего товара и установка признака ожидания загрузки
    this.setState({
      waiting: true,
    }, 'Ожидание загрузки профиля');

    try {
      const json = await this.services.api.request({url: '/api/v1/users/self'});
      // Товар загружен успешно
      this.setState({
        data: json.result as UserInfo,
        waiting: false
      }, 'Профиль загружен');
    } catch (e){
      // Ошибка при загрузке
      this.setState({
        waiting: false
      }, 'Ошибка загрузки профиля');
    }
  }
}

export default ProfileState;
