import StateModule from "@src/store/module";
import qs from '@src/utils/search-params';
import diff from "@src/utils/diff";

/**
 * Состояние каталога
 */
class CatalogState extends StateModule {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      items: [],
      count: 0,
      loaded: 0,
      params: {
        page: 1,
        skip: 0,
        limit: 10,
        sort: 'order',
        query: '',
        category: ''
      },
      waiting: false
    };
  }

  /**
   * Инициализация параметров.
   * Восстановление из query string адреса
   * @param params
   * @return {Promise<void>}
   */
  async initParams(params = {}) {
    // Параметры из URl. Их нужно валидирвать, приводить типы и брать толкьо нужные
    const urlParams = qs.parse(window.location.search);
    let validParams = {};
    if (urlParams.page) validParams.page = Number(urlParams.page) || 1;
    if (urlParams.limit) validParams.limit = Number(urlParams.limit) || 10;
    if (urlParams.sort) validParams.sort = urlParams.sort;
    if (urlParams.query) validParams.query = urlParams.query;
    if (urlParams.category) validParams.category = urlParams.category;

    // Итоговые параметры из начальных, из URL и из переданных явно
    const newParams = {...this.initState().params, ...validParams, ...params};
    // Установка параметров и подгрузка данных
    await this.setParams(newParams, true);
  }

  /**
   * Сброс параметров к начальным
   * @param params
   * @return {Promise<void>}
   */
  async resetParams(params = {}) {
    // Итоговые параметры из начальных, из URL и из переданных явно
    const newParams = {...this.initState().params, ...params};
    // Установк параметров и подгрузка данных
    await this.setParams(newParams);
  }

  /**
   * Метод для догрузки нового товара без изменения параметров. Используется свойство loaded, которое не сохраняется у
   * пользователя вне сессии (не записывается в параметры ссылки)
   * @returns {Promise<void>}
   */
  async loadMoreItems() {
    // Берем от текуего состояния страницы + свойства loaded, которое отражает количество загруженных предметов
    const newSkip = (this.getState().params.page-1) * 10 + this.getState().loaded
    // Проверяем, что в АПИ есть ее товар, который мы можем получить догрузкой. Если нет - сразу выходим.
    if(newSkip - this.getState().params.limit >= this.getState().count) return
    // Установка новых параметров и признака загрузки
    this.setState({
      ...this.getState(),
      waiting: true
    }, 'Смена параметров каталога');
    // ?search[query]=text&search[category]=id

    const apiParams = {
      ...this.getState().params,
      skip: newSkip,
    }

    // ?search[query]=text&search[category]=id
    const json = await this.services.api.request({url: `/api/v1/articles${qs.stringify(apiParams)}`});

    // Установка полученных данных и сброс признака загрузки
    const newItems = [...this.getState().items, ...json.result.items]
    this.setState({
      ...this.getState(),
      items: newItems,
      loaded: newItems.length,
      waiting: false
    }, 'Обновление списка товара');
  }

  /**
   * Устанвока параметров и загрузка списка товаров
   * @param params
   * @param historyReplace {Boolean} Заменить адрес (true) или сделаит новую запис в истории браузера (false)
   * @returns {Promise<void>}
   */
  async setParams(params = {}, historyReplace = false) {
    const newParams = {...this.getState().params, ...params};

    // Установка новых параметров и признака загрузки
    this.setState({
      ...this.getState(),
      params: newParams,
      waiting: true
    }, 'Смена параметров каталога');

    const apiParams = diff({
      limit: newParams.limit,
      skip: (newParams.page - 1) * newParams.limit,
      fields: 'items(*),count',
      sort: newParams.sort,
      search: {
        query: newParams.query, // search[query]=text
        category: newParams.category  // -> search[category]=id
      }
    }, {skip: 0, search: {query: '', category: ''}});

    // ?search[query]=text&search[category]=id
    const json = await this.services.api.request({url: `/api/v1/articles${qs.stringify(apiParams)}`});

    // Установка полученных данных и сброс признака загрузки
    this.setState({
      ...this.getState(),
      items: json.result.items,
      loaded: json.result.items.length,
      count: json.result.count,
      waiting: false
    }, 'Обновление списка товара');
    await this.loadMoreItems()
    // Запоминаем параметры в URL, которые отличаются от начальных
    let queryString = qs.stringify(diff(newParams, this.initState().params));
    const url = window.location.pathname + queryString + window.location.hash;
    if (historyReplace) {
      window.history.replaceState({}, '', url);
    } else {
      window.history.pushState({}, '', url);
    }
  }
}

export default CatalogState;
