import StateModule from "@src/store/module";
/**
 * Состояние чата
 */
class ChatState extends StateModule{

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      messages: [],
      lastSubmittedKeys: [],
      maxOut: false,
      waiting: false,
      authorized: false,
    };
  }
  async _onAuthResponseReceived(result) {
    if (!result) return await this.services.chat.stopKeepAlive()
    this.setState({...this.getState(), authorized: true, waiting: false})
    await this.services.chat.getNewMessages(this.getState().lastMessageDate)
  }
  async _onLastResponseReceived(items) {
    if(this.getState().messages.length === 0) {
      this.setState({...this.getState(), messages: items},
        "Новые сообщения загружены")
      return
    }
    this.setState({...this.getState(), messages: [...this.getState().messages,
        ...items.filter(payloadItem => this.getState().messages.findIndex(existedItem => existedItem._key === payloadItem._key) === -1)]})
  }
  async _onPostResponseReceived(message) {
    if(this.getState().lastSubmittedKeys.includes(message._key)) {
      // Заменяем нужное сообщение тем, что пришло. Флага isDelivering там нет, поэтому статус заменится
      const existingMessageIndex = this.getState().messages.findIndex(i => i._key === message._key)
      const newMessages = [...this.getState().messages]
      newMessages[existingMessageIndex] = message
      this.setState({...this.getState(), messages: newMessages.sort((m1, m2) => {
          const d1 = new Date(m1)
          const d2 = new Date(m2)
          if (d1 === d2) return 0
          if (d1 < d2) return -1
          return 1
        }), lastSubmittedKeys: this.getState().lastSubmittedKeys.filter(i => i._key !== message._key)})
      return
    }
    this.setState({...this.getState(), messages: [...this.getState().messages, message]}, "Получено новое сообщение")
  }
  async _onOldResponseReceived(items) {
    if(items.length === 1 || this.getState().maxOut) {
      this.setState({...this.getState(), maxOut: true, waiting: false})
      return
    }
    this.setState({...this.getState(), messages: [...items.filter(m => !this.getState().messages.find(has => has._key === m._key)),
        ...this.getState().messages], waiting: false}, "Загрузка старых сообщений")
  }
  /**
   * Слушатель события сообщений. Не для прямого обращения
   * @param e
   * @returns {Promise<void>}
   * @private
   */
  async _onMessageReceived(e) {
    const response = JSON.parse(e.data)
    switch (response.method) {
      case "auth": return this._onAuthResponseReceived(response.payload.result)
      case "last": return this._onLastResponseReceived(response.payload.items)
      case "post": return this._onPostResponseReceived(response.payload)
      case "old": return this._onOldResponseReceived(response.payload.items)
    }
  }

  /**
   * Слушатель события для реконнекта. Не для прямого обращения
   * @param token токен пользователя
   * @param e событие закрытия соединения
   * @returns {Promise<void>}
   * @private
   */
  async _onDisconnect(token, e) {
    if(e.wasClean) return
    await this.services.chat.stopKeepAlive()
    this.setState({...this.getState(), authorized: false, lastMessageDate: this.getState().messages.at(-1).dateCreate})
    const timeout = setInterval(() => {
      this.services.chat.establish()
        .then((persistence) => persistence && clearInterval(timeout))
        .then(() => this._getConnected(token))
    }, 5000)
  }

  /**
   * Логика усатновки соединения под ключ
   * @param token Токен пользователя
   * @returns {Promise<void>}
   * @private
   */
  async _getConnected(token) {
    const connectionResponse = await this.services.chat.establish();
    if(!connectionResponse) throw new Error('Соединение не может быть установлено')
    // Поскольку события связаны с состоянием, биндим контекст состояния для доступа к нему
    await this.services.chat.listen('onmessage', this._onMessageReceived.bind(this))
    await this.services.chat.listen('onclose', this._onDisconnect.bind(this, token))
    await this.services.chat.auth(token)
  }
  /**
   * Очистка закешированных сообщений
   */
  clearChat() {
    this.setState({...this.getState(), messages: [], maxOut: false})
  }
  /**
   * Отправка сообщения
   * @param message сообщение
   * @param userId ID пользователя для верификации сообщения до доставки
   * @param userName Имя пользователя, для верификации сообщения до доставки
   * @returns {Promise<*>}
   */
  async sendMessage(message, userId, userName) {
    const key = await this.services.chat.sendMessage(message)
    this.setState({...this.getState(), lastSubmittedKeys: [...this.getState().lastSubmittedKeys, key],
      messages: [...this.getState().messages,
        {_key: key, text: message, author: {_id: userId, profile: {name: userName}}, dateCreate: new Date().toString(), isDelivering: true}]})
  }

  /**
   * Загрузка старых сообщений
   * @param id ID сообщения, которое будет последним в загруженных (самое новое из старых)
   * @returns {Promise<*>}
   */
  async loadOlderMessages(id) {
    if (!this.getState().maxOut) {
      this.setState({...this.getState(), oldestMessage: id ,waiting: true})
      return this.services.chat.getOlderMessage(id)
    }
  }
  /**
   * Инициализация чата
   * @param token Токен пользователя. Не работает без авторизации
   * @returns {Promise<void>}
   */
  async init(token){
    this.setState({...this.getState(), waiting: true})
    await this._getConnected(token)
    return this.services.chat.keepAlive()
  }
}

export default ChatState;
