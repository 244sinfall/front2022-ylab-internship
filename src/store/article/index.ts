import StateModule from "@src/store/module";
import {CatalogItem} from "@src/store/data-model/shop";
/**
 * Состояние товара
 */
class ArticleState extends StateModule<ArticleState>{

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      data: null as CatalogItem | null,
      waiting: false
    };
  }
  /**
   * Загрузка товаров по id
   */
  async load(id: string){
    // Сброс текущего товара и установка признака ожидания загрузки
    this.setState({
        waiting: true,
        data: null
      }, 'Ожидание загрузки товара');

    try {
      const json = await this.services.api.request({url: `/api/v1/articles/${id}?fields=*,maidIn(title,code),category(title)`});
      // Товар загружен успешно
      this.setState({
        data: json.result as CatalogItem,
        waiting: false
      }, 'Товар по id загружен');
    } catch (e){
      // Ошибка при загрузке
      // @todo В стейт можно положть информауию об ошибке
      this.setState({
        data: null,
        waiting: false
      }, 'Ошибка загрузки товара');
    }
  }
}

export default ArticleState;
