import {TreeToListValidObject} from "@src/utils/tree-to-list";

interface ListToTreeValidObject {
  _id?: string | number
  children?: ListToTreeValidObject[] | null
  parent?: ListToTreeValidObject | null
}
/**
 * Преобразование списка в иерархию
 * @param list {Array} Список объектов с отношеним на родителя
 * @param key {String} Свойство с первичным ключём
 * @returns {Array} Корневые узлы
 */
export default function listToTree(list: ListToTreeValidObject[], key = '_id'): TreeToListValidObject[] {
  let trees: any = {};
  let roots: any = {};
  for (const item of list) {

    // Добавление элемента в индекс узлов с создание свойства children
    if (!trees[item[key as keyof typeof item] as keyof typeof trees]) {
      trees[item[key as keyof typeof item] as keyof typeof trees] = item;
      trees[item[key as keyof typeof item] as keyof typeof trees].children = [];
      // Ещё никто не ссылался, поэтому пока считаем корнем
      roots[item[key as keyof typeof item] as keyof typeof roots] = trees[item[key as keyof typeof item] as keyof typeof trees];
    } else {
      trees[item[key as keyof typeof item] as keyof typeof trees] = Object.assign(trees[item[key as keyof typeof item] as keyof typeof trees], item);
    }

    // Если элемент имеет родителя, то добавляем его в подчиенные родителя
    if (item.parent?._id) {
      // Если родителя ещё нет в индексе, то индек созадётся, ведь _id родителя известен
      if (!trees[item.parent._id]) trees[item.parent._id] = { children: [] };
      // Добавления в подчиенные родителя
      trees[item.parent._id].children.push(trees[item[key as keyof typeof item] as keyof typeof trees]);
      // Так как элемент добавлен к родителю, то он уже не является корневым
      if (roots[item[key as keyof typeof item] as keyof typeof roots]) delete roots[item[key as keyof typeof item] as keyof typeof roots];
    }
  }
  return Object.values(roots);
}
