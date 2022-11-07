import * as modules from '../../exports'
import StateModule from "@src/store/module";

export type IModules = typeof modules

export type IStoreModules = {
  [P in keyof IModules]: InstanceType<IModules[P]>
}

export type IRootState = {
  [P in keyof IStoreModules]: ReturnType<IStoreModules[P]['initState']>
}

export type IState<T extends StateModule<T>> = ReturnType<T['initState']>
