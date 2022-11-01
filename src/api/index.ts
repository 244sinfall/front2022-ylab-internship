import Services from "@src/services";
import {APIConfig} from "@src/config";

class APIService {
  services: Services
  config: APIConfig
  defaultHeaders: any
  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services: Services, config: APIConfig) {
    this.services = services;
    this.config = config
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  /**
   * HTTP запрос
   * @param url
   * @param method
   * @param headers
   * @param options
   * @returns {Promise<any>}
   */
  async request({url = "", method = 'GET', headers = {}, ...options}) {
    if (!url.match(/^(http|\/\/)/)) url = this.config.baseUrl + url;
    const res = await fetch(url, {
      method,
      headers: {...this.defaultHeaders, ...headers},
      ...options,
    });
    return res.json();
  }

  /**
   * Установка или сброс заголовка
   * @param name {String} Название заголвока
   * @param value {String|null} Значение загововка
   */
  setHeader(name: string, value: string | null  = null) {
    if (value) {
      this.defaultHeaders[name] = value;
    } else if (this.defaultHeaders[name]) {
      delete this.defaultHeaders[name];
    }
  }
}

export default APIService;
