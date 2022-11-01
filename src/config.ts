/**
 * Настройки сервисов
 */
export interface StoreConfig {
  log: boolean
  modules: {
    session: {
      tokenHeader: string
    }
  }
}

export interface APIConfig {
  baseUrl: string
}

export interface ChatConfig {
  websocketServer: "ws://example.front.ylab.io/chat"
}

export interface ServicesConfig {
  store: StoreConfig,
  api: APIConfig,
  chat: ChatConfig
}

const config: ServicesConfig ={
  store: {
    log: false,

    modules: {
      session: {
        tokenHeader: 'X-Token'
      }
    }
  },

  api: {
    baseUrl: ''
  },
  chat: {
    websocketServer: "ws://example.front.ylab.io/chat"
  }
}

export default config;
