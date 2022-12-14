import StateModule from "@src/store/module";
import {BasketItem, CatalogItem} from "@src/store/data-model/shop";


/**
 * Состояние корзины
 */
class BasketState extends StateModule<BasketState>{

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      items: [] as BasketItem[],
      sum: 0,
      amount: 0
    };
  }

  async addItemToBasket(item: CatalogItem) {
    let sum = 0
    let exists = false;
    const items = this.getState().items.map(i => {
      let result = i as BasketItem;
      // Искомый товар для увеличения его количества
      if (result._id ===  item._id) {
        exists = true;

        result = {...result, amount: result.amount ? result.amount + 1 : 1};
      }
      // Добавляея в общую сумму
      sum += result.price * (result.amount ?? 1);
      return result
    }) as BasketItem[];
    if (!exists) {
      items.push({...item, amount: 1})
      sum += item.price
    }
    // Установка состояние, basket тоже нужно сделать новым
    this.setState({
      items,
      sum,
      amount: items.length
    }, 'Добавление в корзину');
  }
  /**
   * Добавление товара в корзину
   * @param _id Код товара
   * @param count Количество товара для добавления в корзину
   */
  async addToBasket(_id: string, count = 1) {
    let sum = 0;
    // Ищем товар в корзие, чтобы увеличить его количество. Заодно получаем новый массив items
    let exists = false;
    const items = this.getState().items.map(item => {
      let result = item;
      // Искомый товар для увеличения его количества
      if (item._id === _id) {
        exists = true;
        result = {...item, amount: item.amount ? item.amount + count : count};
      }
      // Добавляея в общую сумму
      sum += result.price * (result.amount ? result.amount : 1);
      return result
    }) as BasketItem[];

    // Если товар не был найден в корзине, то добавляем его из каталога
    if (!exists) {
      // Поиск товара в каталоге, чтобы его в корзину добавить
      const json = await this.services.api.request({url: `/api/v1/articles/${_id}`});

      const item = json.result as CatalogItem;
      items.push({...item, amount: count});
      // Досчитываем сумму
      sum += item.price * count;
    }

    // Установка состояние, basket тоже нужно сделать новым
    this.setState({
      items,
      sum,
      amount: items.length
    }, 'Добавление в корзину');
  }

  /**
   * Добавление товара в корзину
   * @param _id Код товара
   */
  removeFromBasket(_id: string) {
    let sum = 0;
    const items = this.getState().items.filter(item => {
      // Удаляемый товар
      if (item._id === _id) return false
      // Подсчёт суммы если твоар не удаляем.
      sum += item.price * item.amount!;
      return true;
    }) as BasketItem[];
    this.setState({
      items,
      sum,
      amount: items.length
    }, 'Удаление из корзины')
  }
}

export default BasketState;
