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
   * @param params {Object} Параметры, которые передадуться модальному окну
   */
  async open(name, params = {}){
    return new Promise(resolve => {
      this.setState({
        opened: [...this.getState().opened, { name: name, params, resolve }]
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

  /**
   * Закрытие всех модальных окон с внешней стороны без сохранения результата
   */
  async closeAll() {
    while(this.getState().opened.length !== 0) {
      await this.close()
    }
  }
}

export default ModalsState;
