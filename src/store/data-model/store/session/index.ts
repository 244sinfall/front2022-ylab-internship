import {UserInfo} from "@src/store/data-model/user";

export interface AuthData {
  login: string,
  password: string
}

export interface SessionValues {
  user: UserInfo | null,
  token: string | null,
  exists: boolean,
  errors: any[] | null
  waiting: boolean
}
