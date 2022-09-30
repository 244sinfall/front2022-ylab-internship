import {useEffect} from 'react';
import useStore from '@src/hooks/use-store';

/**
 * Хук для создания отдельного экземпляра Store. Экземпляр уничтожается, когда демонтируется компонент, в котором
 * применен хук
 */
export default function useSeparateCatalog(){
  const store = useStore();
  const separateCatalogName = `catalog-${Math.floor(Math.random() * 100)}`
  const destroySeparateCatalog = store.createSeparateCatalog(separateCatalogName)
  const prevParamsState = window.location.search
  useEffect(() => {
    window.history.replaceState({}, document.title, '/')
    return () => {
      window.history.replaceState({}, document.title, prevParamsState)
      destroySeparateCatalog()
    }
  }, [destroySeparateCatalog])
  return separateCatalogName
}
