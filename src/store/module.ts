import Store from "@src/store/index";
import Services from "@src/services";
import {GlobalState} from "@src/store/data-model/store";

export interface StateModuleConfig {
  name: string
}

class StateModule {
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

  getState() {
    return this.store.getState()[this.config.name as keyof GlobalState];
  }

  setState(newState: any, description = 'setState'){
    this.store.setState({
      ...this.store.getState(),
      [this.config.name]: newState
    }, description)
  }

}

export default StateModule;
