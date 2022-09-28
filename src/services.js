import Store from "./store";
import APIService from "./api";
import createStoreRedux from "./store-redux";

class Services {

  constructor(config) {
    this.config = config;
  }

  /**
   * Сервис Store
   * @returns {Store}
   */
  get store(){
    if (!this._store) {
      this._store = [new Store(this, this.config.store)];
    }
    return this._store[this._store.length-1];
  }

  /**
   * Метод для создания отдельного экземпляра Store. Для хранения нескольких экземпляров используется структура
   * данных стек. Метод возвращает функцию для уничтожения нового экземпляра.
   * @returns {function(): T}
   */
  separateStore() {
    if(!this._store) {
      this._store = [new Store(this, this.config.store)];
    }
    this._store.push(new Store(this, this.config.store))
    return () => this._store.pop()
  }

  /**
   * Сервис АПИ
   * @returns {APIService}
   */
  get api(){
    if (!this._api) {
      this._api = new APIService(this, this.config.api);
    }
    return this._api;
  }

  /**
   * Redux store
   */
  get storeRedux(){
    if (!this._storeRedux) {
      this._storeRedux = createStoreRedux(this, this.config.storeRedux);
    }
    return this._storeRedux;
  }
}

export default Services;
