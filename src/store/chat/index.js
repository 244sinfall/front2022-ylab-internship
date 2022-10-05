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
        if(response.payload.result) await this.services.chat.getNewMessages()
        break;
      case "last":
        if(this.getState().messages.length === 0) {
          this.setState({...this.getState(), messages: [...this.getState().messages, ...response.payload.items]},
            "Новые сообщения загружены")
        }
        break;
      case "post":
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
   * Отправка сообщения
   * @param message сообщение
   * @returns {Promise<*>}
   */
  async sendMessage(message) {
    return this.services.chat.sendMessage(message)
  }

  /**
   * Загрузка старых сообщений
   * @param id ID сообщения, которое будет последним в загруженных (самое новое из старых)
   * @returns {Promise<*>}
   */
  async loadOlderMessages(id) {
    if(!this.getState().maxOut) return this.services.chat.getOlderMessage(id)
  }

  /**
   * Инициализация чата
   * @param token Токен пользователя. Не работает без авторизации
   * @returns {Promise<void>}
   */
  async init(token){
    const authResponse = await this.services.chat.establish();
    if(!authResponse) throw new Error('Соединение не может быть установлено')
    // Поскольку события связаны с состоянием, биндим контекст состояния для доступа к нему
    await this.services.chat.listen('onmessage', this._onMessageReceived.bind(this))
    await this.services.chat.auth(token)
  }
}

export default ChatState;
