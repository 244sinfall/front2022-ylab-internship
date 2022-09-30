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
   */
  async open(name){
    return new Promise(resolve => {
      this.setState({
        opened: [...this.getState().opened, { name: name, resolve, result: null }]
      }, `Открытие модалки ${name}`)
    })
  }
  /**
   * Закрытие модального окна. Данное решение работает безотказно до тех пор, пока не появится кейс закрытия одной модалки
   * из другой модалки / другого компонента
   */
  async close(result){
    const lastOpenedModal = this.getState().opened.at(-1)
    if(lastOpenedModal.resolve) {
      lastOpenedModal.resolve(result)
    }
    this.setState({opened: this.getState().opened.slice(0, -1) }, `Закрытие модалки`);
  }
}

export default ModalsState;
