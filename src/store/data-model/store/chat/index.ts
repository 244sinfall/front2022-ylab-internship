export interface ChatMessage {
  author: {
    profile: {
      avatar: any,
      name: string
    },
    username: string,
    _id: string
  }
  dateCreate: string,
  text: string,
  _id: string,
  _key: string
}

export interface ChatValues {
  messages: ChatMessage[],
  lastSubmittedKeys: string[],
  lastMessageDate?: string,
  maxOut: boolean,
  authorized: boolean,
  waiting: boolean
}
