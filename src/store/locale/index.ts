import StateModule from "@src/store/module";

/**
 * Состояние товара
 */
class LocaleState extends StateModule<LocaleState>{
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      lang: 'ru',
    };
  }

  async setLang(lang: string) {
    this.setState({
      lang
    }, 'Смена локали');
  }
}

export default LocaleState;
