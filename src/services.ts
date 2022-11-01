import Store from "./store";
import APIService from "./api";
import ChatService from '@src/chat';
// Конфигурация
interface ServicesConfig {
  store: Object,
  api: Object,
  chat: Object
}

class Services {
  private _store: Store
  private _api: APIService
  private _chat: ChatService
  config: ServicesConfig
  constructor(config: ServicesConfig) {
    this.config = config;
  }

  /**
   * Сервис Store
   * @returns {Store}
   */
  get store(){
    if (!this._store) {
      this._store = new Store(this, this.config.store);
    }
    return this._store;
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
   * Сервис чата
   * @returns {ChatService}
   */
  get chat(){
    if(!this._chat) {
      this._chat = new ChatService(this, this.config.chat)
    }
    return this._chat
  }
}

export default Services;
