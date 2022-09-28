// Начальное состояние для управления модалками
// От Филин Д.А: Для реализации каскадности модальных окон, преобразуем состояние модалок в стек.
// В стеке находится объект, содержащий имя модального окна для отрисовки и колбек для исполнения при завершении
const initialState = {
  opened: []
}

// Обработчик действий в redux
export default function(state = initialState, action){
  switch (action.type) {
    case "modal/open":
      return { ...state, opened: [...state.opened, action.payload] };
    case "modal/close":
      return { ...state, opened: state.opened.slice(0, -1) };
    default:
      // Нет изменений
      return state;
  }
}
