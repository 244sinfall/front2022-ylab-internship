import {v4 as uuidv4} from 'uuid';

class ChatService {

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services, config = {}) {
    this.services = services
    this.config = config
  }

  /**
   * Используется для установки и проверки соединения с WebSocket. Если соединение упало при запросе establish,
   * промис попытается пересоздать соединение. Возвращает объект устойчивого соединения
   * @returns {Promise<unknown>} Объект WebSocket
   */
  async establish() {
    if(this._persistence && this._persistence.readyState === this._persistence.OPEN) return this._persistence
    return new Promise((resolve, reject) => {
      this._persistence = new WebSocket(this.config.websocketServer)
      let attempt = 0
      const interval = setInterval(() => {
        if(attempt > 3) {
          clearTimeout(interval)
          reject()
        } else if (this._persistence.readyState === this._persistence.OPEN) {
          clearInterval(interval)
          resolve(this._persistence)
        }
        attempt++
      }, 200)
    })
  }

  /**
   * Закрытие сокета
   * @returns {Promise<void>}
   */
  async close() {
    const socket = await this.establish()
    socket.close()
  }

  /**
   * Закрытие пингов каждые 30 секунд, нужно в том числе при реконнекте
   * @returns {Promise<void>}
   */
  async stopKeepAlive() {
    this._pingCanceller()
  }
  /**
   * Пингует сервер каждые 30 секунд
   * @returns {Promise<function(): void>} функция для уничтожения интервала
   */
  async keepAlive() {
    const socket = await this.establish()
    const intervalId = setInterval(() => {
      socket.send(JSON.stringify({
        method: "ping",
        payload: {}
      }))
    }, 30000)
    // Для доступа из сервиса
    this._pingCanceller = () => {
      clearInterval(intervalId)
      socket.close()
    }
    return this._pingCanceller
  }
  /**
   * Устанавливает слушатель для WebSocket
   * @param event {string} (onmessage, onclose, onopen и.т.д.)
   * @param callback {function} колбек для события.
   * @returns {Promise<void>}
   */
  async listen(event, callback) {
    const socket = await this.establish()
    socket[event] = callback
  }

  /**
   * Передает сообщение об авторизации
   * @param token {string} Токен пользователя для авторизации
   * @returns {Promise<*>}
   */
  async auth(token) {
    const socket = await this.establish()
    return socket.send(JSON.stringify({
      method: "auth",
      payload: {
        token: token
      }
    }))
  }

  /**
   * Передает сообщение серверу
   * @param message {string} Сообщение
   * @returns {Promise<*>} Ключ отправленного сообщения
   */
  async sendMessage(message) {
    const socket = await this.establish()
    const key = uuidv4()
    await socket.send(JSON.stringify({
      method: "post",
      payload: {
        _key: key,
        text: message
      }
    }))
    return key
  }

  /**
   * Получает новые сообщения (последние 10 шт) или начиная от даты, указанной в параметре
   * @param fromDate {string | undefined} Дата, с которой необходимо вернуть новые сообщения
   * @returns {Promise<*>}
   */
  async getNewMessages(fromDate = undefined) {
    const socket = await this.establish()
    return socket.send(JSON.stringify({
      method: "last",
      payload: {
        fromDate: fromDate
      }
    }))
  }

  /**
   * Получает 10 старых сообщений, включая то, которое передано аргументом
   * @param fromId сообщение, старее которого нужно вернуть
   * @returns {Promise<*>}
   */
  async getOlderMessage(fromId) {
    if(!fromId) throw new Error("Не указан ID для загрузки старых сообщений")
    const socket = await this.establish()
    return socket.send(JSON.stringify({
      method: "old",
      payload: {
        fromId: fromId
      }
    }))
  }

  /**
   * Удаляет все сообщения из базы данных
   * @returns {Promise<*>}
   */
  async clearMessages() {
    const socket = await this.establish()
    return socket.send(JSON.stringify({
      method: "clear",
      payload: {}
    }))
  }
}

export default ChatService;
