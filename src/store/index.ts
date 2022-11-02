import * as modules from './exports';
import Services from "@src/services";
import {GlobalState, StoreModules} from "@src/store/data-model/store";

export interface ModuleConfig {
  name: string
}

interface StoreConfig {
  log?: boolean
  modules?: Object
}

class Store {
  /**
   * @param services {Services}
   * @param config {Object}
   */
  services: Services
  config: StoreConfig
  readonly modules: StoreModules
  state: GlobalState
  listeners: (() => any)[]
  constructor(services: Services, config: StoreConfig) {
    // Менеджер сервисов
    this.services = services;
    this.config = config
    // Состояние приложения (данные)
    // Слушатели изменений state
    this.listeners = [];
    let initializedModules: any = {}
    let initializedState: any = {}
    // Модули
    for (const name of Object.keys(modules)) {
      // Экземпляр модуля. Передаём ему ссылку на store и навзание модуля.
      initializedModules[name] = new modules[name as keyof typeof modules](this, this._getModuleConfig(name));
      // По названию модля устанавливается свойство с анчальным состоянием от модуля
      initializedState[name] = initializedModules[name].initState();
    }
    this.modules = initializedModules as StoreModules
    this.state = initializedState as GlobalState
  }
  private _getModuleConfig(name: string) {
    const moduleConfig = this.config.modules ? this.config.modules[name as keyof typeof this.config.modules] ?
      this.config.modules[name as keyof typeof this.config.modules]: {} : {}
    return {name, ...moduleConfig}
  }
  /**
   * Создает новый модуль состояния из базового. Может использоваться для дублирования логики, но разделения значений
   * @param name Имя нового состояния
   * @param base Имя состояния, которое клонируется
   * @returns {(function(): void)|*} Функция для уничтожения созданного состояния
   */
  createSeparateState(name: string, base:string) {
    const baseModuleKey = base as keyof StoreModules
    const module: any = new modules[baseModuleKey](this, this._getModuleConfig(name));
    this.modules[name as keyof typeof this.modules] = module
    this.state[name as keyof typeof this.state] = module.initState();
    return () => {
      delete this.modules[name as keyof typeof this.modules]
      delete this.state[name as keyof typeof this.state]
    }
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
  setState(newState: any, description = 'setState') {
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
  subscribe(callback: () => any) {
    this.listeners.push(callback);
    // Возвращаем функцию для удаления слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== callback);
    }
  }
}

export default Store;
