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
    };
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
      case "auth":
        if(!response.payload.result) return await this.services.chat.stopKeepAlive()
        await this.services.chat.getNewMessages(this.getState().lastMessageDate)
        break;
      case "last":
        if(this.getState().messages.length === 0) {
          this.setState({...this.getState(), messages: [...this.getState().messages, ...response.payload.items]},
            "Новые сообщения загружены")
        }
        break;
      case "post":
        if(this.getState().lastSubmittedKeys.includes(response.payload._key)) {
          // Заменяем нужное сообщение тем, что пришло. Флага isDelivering там нет, поэтому статус заменится
          const existingMessageIndex = this.getState().messages.findIndex(i => i._key === response.payload._key)
          const newMessages = [...this.getState().messages]
          newMessages[existingMessageIndex] = response.payload
          this.setState({...this.getState(), messages: newMessages, lastSubmittedKeys: this.getState().lastSubmittedKeys.filter(i => i._key !== response.payload._key)})
          break
        }
        this.setState({...this.getState(), messages: [...this.getState().messages, response.payload]}, "Получено новое сообщение")
        break;
      case "old":
        if(this.getState().maxOut) return
        if(response.payload.items.length === 1) {
          this.setState({...this.getState(), maxOut: true})
          return
        }
        this.setState({...this.getState(), messages: [...response.payload.items.slice(0, -1), ...this.getState().messages]}, "Загрузка старых сообщений")
        break
      default:
        console.log(response)
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
    this.setState({...this.getState(), lastMessageDate: this.getState().messages.at(-1).dateCreate})
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
    this.setState({...this.getState(), messages: []})
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
      messages: [...this.getState().messages, {_key: key, text: message, author: {_id: userId, profile: {name: userName}}, dateCreate: new Date().toString(), isDelivering: true}]})
  }

  /**
   * Загрузка старых сообщений
   * @param id ID сообщения, которое будет последним в загруженных (самое новое из старых)
   * @returns {Promise<*>}
   */
  async loadOlderMessages(id) {
    if (!this.getState().maxOut) return this.services.chat.getOlderMessage(id)
  }
  /**
   * Инициализация чата
   * @param token Токен пользователя. Не работает без авторизации
   * @returns {Promise<void>}
   */
  async init(token){
    await this._getConnected(token)
    return this.services.chat.keepAlive()
  }
}

export default ChatState;
