/**
 * Преобразование списка в иерархию.
 * @param tree {Array} Иерархия - список узлов со свойством children.
 * @param [callback] {Function} Для пользовательского преобразования элемента.
 * @param [level] {Number} Начальный уровень вложенности.
 * @param [result] {Array} Результат функции - используется рекурсией.
 * @returns {Array} Корневые узлы
 */

interface TreeToListValidObject {
  children?: TreeToListValidObject[]
}

export default function treeToList(tree: TreeToListValidObject[], callback?: (item: TreeToListValidObject, level: number) => any, level = 0, result: any[] = []) {
  for (const item of tree) {
    const pushItem = callback ? callback(item, level) : item
    result.push(pushItem);
    if (item.children?.length) treeToList(item.children, callback, level + 1, result);
  }
  return result;
}
