import StateModule from "@src/store/module";
import qs from '@src/utils/search-params';
import diff from "@src/utils/diff";
import {CatalogItem} from "@src/store/data-model/shop";
import {CatalogURLParams} from "@src/store/data-model/store/catalog";



/**
 * Состояние каталога
 */
class CatalogState extends StateModule {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    const params: CatalogURLParams = {
      page: 1,
      skip: 0,
      limit: 10,
      sort: 'order',
      query: '',
      category: ''
    }
    const items: CatalogItem[] = []
    return {
      items: items,
      count: 0,
      loaded: 0,
      params,
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
    const urlParams = qs.parse(window.location.search) as any;
    let validParams: CatalogURLParams = {
      skip: Number(urlParams.skip) || 0,
      page: Number(urlParams.page) || 1,
      limit: Number(urlParams.limit) || 10,
      sort: urlParams.sort || "",
      query: urlParams.query || "",
      category: urlParams.category || "",
    };
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
    const params = this.getState().params
    // Берем от текуего состояния страницы + свойства loaded, которое отражает количество загруженных предметов
    const newSkip = params.page * 10 + (this.getState().loaded - 10)
    // Проверяем, что в АПИ есть ее товар, который мы можем получить догрузкой. Если нет - сразу выходим.
    if(newSkip - params.limit >= this.getState().count) return
    // Установка новых параметров и признака загрузки
    this.setState({
      ...this.getState(),
      waiting: true
    }, 'Смена параметров каталога');
    // ?search[query]=text&search[category]=id

    const apiParams = diff({
      limit: params.limit,
      skip:  newSkip,
      fields: 'items(*),count',
      sort: params.sort,
      search: {
        query: params.query, // search[query]=text
        category: params.category  // -> search[category]=id
      }
    }, {skip: 0, search: {query: '', category: ''}});

    // ?search[query]=text&search[category]=id
    const json = await this.services.api.request({url: `/api/v1/articles${qs.stringify(apiParams)}`});

    // Установка полученных данных и сброс признака загрузки
    const newItems = [...this.getState().items, ...json.result.items] as CatalogItem[]
    this.setState({
      ...this.getState(),
      items: newItems,
      loaded: newItems.length,
      waiting: false
    }, 'Обновление списка товара');
  }

  /**
   * Изменяет страницу без обновления списка товаров, прибавляя к текущей строке.
   * реализуется в бесконечном скролле для вычисления страницы текущего скролла
   * @param offset Относительная страница верхушки списка
   */
  mutatePage(offset: number) {
    const currentPage = this.getState().params.page
    if(qs.parse(window.location.search).page === currentPage + offset) return;
    const newParams = {...this.getState().params, page: currentPage + offset}
    this.updateQueryParams(newParams, false)
  }
  /**
   * Обновляет url параметры строки
   * @param params
   * @param historyReplace {Boolean} Заменить адрес (true) или сделаит новую запис в истории браузера (false)
   */
  updateQueryParams(params = {}, historyReplace = false) {
    let queryString = qs.stringify(diff(params, this.initState().params));
    const url = window.location.pathname + queryString + window.location.hash;
    if (historyReplace) {
      window.history.replaceState({}, '', url);
    } else {
      window.history.pushState({}, '', url);
    }
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
    await this.setState({
      ...this.getState(),
      items: json.result.items as CatalogItem[],
      loaded: json.result.items.length,
      count: json.result.count,
      waiting: false
    }, 'Обновление списка товара');
    await this.loadMoreItems()
    // Запоминаем параметры в URL, которые отличаются от начальных
    await this.updateQueryParams(newParams, historyReplace)
  }
}

export default CatalogState;
