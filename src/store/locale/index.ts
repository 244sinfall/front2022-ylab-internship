import StateModule from "@src/store/module";
import {LocaleValues} from "@src/store/data-model/store/locale";

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
    } as LocaleValues;
  }

  async setLang(lang: string) {
    this.setState({
      lang
    }, 'Смена локали');
  }
}

export default LocaleState;
