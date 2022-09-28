import useServices from "./use-services";
import {useEffect} from 'react';

/**
 * Хук для создания отдельного экземпляра Store. Экземпляр уничтожается, когда демонтируется компонент, в котором
 * применен хук
 */
export default function useSeparateStore(){
  const destroySeparateStore = useServices().separateStore();
  const prevParamsState = window.location.search
  useEffect(() => {
    window.history.replaceState({}, document.title, '/')
    return () => {
      window.history.replaceState({}, document.title, prevParamsState)
      destroySeparateStore()
    }
  }, [destroySeparateStore])
}
