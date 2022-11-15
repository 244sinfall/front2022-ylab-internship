import Store from "@src/store/index";
import Services from "@src/services";
import {IModules, IState} from "@src/store/data-model/store";

export interface StateModuleConfig {
  name: string
}

abstract class StateModule {
  store: Store
  services: Services
  config: StateModuleConfig
  /**
   * @param store {Store}
   * @param config {Object}
   */
  constructor(store: Store, config: StateModuleConfig) {
    this.store = store;
    this.config = config;
    this.services = store.services;
  }

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {};
  }

  getState<T extends StateModule>(this: T): IState<T> {
    return this.store.getState()[this.config.name as keyof IModules] as IState<T>;
  }

  setState<T extends StateModule>(newState: IState<T>, description = 'setState'){
    this.store.setState({
      ...this.store.getState(),
      [this.config.name]: newState
    }, description)
  }

}

export default StateModule;
