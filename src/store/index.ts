import * as modules from './exports';
import Services from "@src/services";
import StateModule from "@src/store/module";

export interface ModuleConfig {
  name: string
}

interface StoreConfig {
  log?: boolean
  modules?: Object
}

interface StoreModules {
  basket?: StateModule
  catalog?: StateModule
  modals?: StateModule
  article?: StateModule
  locale?: StateModule
  categories?: StateModule
  session?: StateModule
  profile?: StateModule
  chat?: StateModule
  canvas?: StateModule
}

class Store {
  /**
   * @param services {Services}
   * @param config {Object}
   */
  services: Services
  config: StoreConfig
  modules: StoreModules = {}
  state: StoreModules = {}
  listeners: (() => any)[]
  constructor(services, config = {}) {
    // Менеджер сервисов
    this.services = services;
    this.config = {
      log: false,
      ...config
    }
    // Состояние приложения (данные)
    // Слушатели изменений state
    this.listeners = [];

    // Модули
    for (const name of Object.keys(modules)) {
      // Экземпляр модуля. Передаём ему ссылку на store и навзание модуля.
      this.modules[name] = new modules[name](this, this._getModuleConfig(name));
      // По названию модля устанавливается свойство с анчальным состоянием от модуля
      this.state[name] = this.modules[name].initState();
    }
  }
  private _getModuleConfig(name: string) {
    const moduleConfig = this.config.modules ? this.config.modules[name] ? this.config.modules[name]: {} : {}
    return {name, ...moduleConfig}
  }
  /**
   * Создает новый модуль состояния из базового. Может использоваться для дублирования логики, но разделения значений
   * @param name Имя нового состояния
   * @param base Имя состояния, которое клонируется
   * @returns {(function(): void)|*} Функция для уничтожения созданного состояния
   */
  createSeparateState(name, base) {
    this.modules[name] = new modules[name](this, this._getModuleConfig(name));
    this.state[name] = this.modules[name].initState();
    return () => {
      delete this.modules[name]
      delete this.state[name]
    }
  }
  /**
   * Доступ к модулю состояния
   * @param name {String} Название модуля
   */
  get(name) {
    return this.modules[name];
  }

  /**
   * Выбор state
   * @return {Object}
   */
  getState() {
    return this.state;
  }

  /**
   * Установка state
   * @param newState {Object}
   * @param [description] {String} Описание действия для логирования
   */
  setState(newState, description = 'setState') {
    if (this.config.log) {
      console.group(
        `%c${'store.setState'} %c${description}`,
        `color: ${'#777'}; font-weight: normal`,
        `color: ${'#333'}; font-weight: bold`,
      );
      console.log(`%c${'prev:'}`, `color: ${'#d77332'}`, this.state);
      console.log(`%c${'next:'}`, `color: ${'#2fa827'}`, newState);
      console.groupEnd();
    }
    this.state = newState;
    // Оповещаем всех подписчиков об изменении стейта
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Подписка на изменение state
   * @param callback {Function}
   * @return {Function} Функция для отписки
   */
  subscribe(callback) {
    this.listeners.push(callback);
    // Возвращаем функцию для удаления слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== callback);
    }
  }
}

export default Store;
