import StateModule from "@src/store/module";
import qs from "@src/utils/search-params";
import {Category} from "@src/store/data-model/store/categories";
/**
 * Состояние товара
 */
class CategoriesState extends StateModule<CategoriesState>{
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      items: [] as Category[],
      waiting: false
    };
  }

  /**
   * Загрузка списка товаров
   */
  async load(){
    this.setState({ waiting: true, items: []}, 'Ожидание загрузки категорий');

    const params = {fields:'_id,title,parent(_id)', limit:'*'};
    const json = await this.services.api.request({url: `/api/v1/categories/${qs.stringify(params)}`});
    // Товар загружен успешно
    this.setState({
      items: json.result.items as Category[],
      waiting: false
    }, 'Катеории загружены');
  }
}

export default CategoriesState;
