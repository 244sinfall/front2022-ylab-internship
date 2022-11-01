import StateModule from "@src/store/module";

export interface ModalWindow {
  name: string,
  params: any,
  resolve: Promise<any>
}
/**
 * Управление модальными окнами
 */
class ModalsState extends StateModule{
  initState() {
    const modals: ModalWindow[] = []
    return {
      opened: modals
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
        opened: [...this.getState().opened, { name: name, params, resolve }] as ModalWindow[]
      }, `Открытие модалки ${name}`)
    })
  }
  /**
   * Закрытие модального окна. Данное решение работает безотказно до тех пор, пока не появится кейс закрытия одной модалки
   * из другой модалки / другого компонента
   */
  async close(result?: any){
    const lastOpenedModal = this.getState().opened.at(-1)
    if(lastOpenedModal.resolve) {
      lastOpenedModal.resolve(result)
    }
    this.setState({opened: this.getState().opened.slice(0, -1) as ModalWindow[] }, `Закрытие модалки`);
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
