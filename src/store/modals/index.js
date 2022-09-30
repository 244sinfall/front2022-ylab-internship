import StateModule from "@src/store/module";

/**
 * Управление модальными окнами
 */
class ModalsState extends StateModule{

  initState() {
    return {
      opened: []
    };
  }

  /**
   * Открытие модального окна по названию
   * @param name {String} Название модалки
   * @param resultCallback {Function} Колбек на закрытие модалки
   */
  open(name, resultCallback = () => {}){
    this.setState({opened: [...this.getState().opened, { name, resultCallback }]}, `Открытие модалки ${name}`);
  }

  /**
   * Закрытие модального окна
   */
  close(){
    this.setState({opened: this.getState().opened.slice(0, -1) }, `Закрытие модалки`);
  }
}

export default ModalsState;
