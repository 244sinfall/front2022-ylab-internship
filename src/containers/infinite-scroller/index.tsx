import React, {useEffect, useRef, useState} from 'react';

interface InfiniteScrollerProps {
  onIntersection: () => void,
  children: React.ReactNode | React.ReactNode[]
}

const InfiniteScroller = (props: InfiniteScrollerProps) => {
  // container для обертки над тем, что будет скроллиться
  const container = useRef<HTMLDivElement | null>(null)
  // observable - невидимый элемент внутри container для отслеживания пересечения.
  // Отказался от внедрения обсервера в компонент для переиспользования
  const observable = useRef<HTMLDivElement | null>(null)
  // Оценивать необходимость onIntersection будем исходя из высоты элемента container. Т.е следующий intersect сработает
  // Если предыдущий увеличил его высоту.
  const [currentHeight, setCurrentHeight] = useState(0)
  useEffect(() => {
    props.onIntersection()
  }, [currentHeight])
  // Инициализируем обсервер с помощью useEffect при создании рефа на контейнер
  useEffect(() => {
    let observer: IntersectionObserver
    if(container.current) {
      const observeOptions = {
        root: null,
        threshold: 1,
      }
      observer = new IntersectionObserver((entries) => {
        // Замеряем новую высоту исходя из контейнера на момент пересечения
        const newHeight = container.current?.getBoundingClientRect().height
        const entry = entries[0]
        // Проверяем, что 1. новая высота больше, т.е после предыдущего onIntersection она увеличилась
        // 2. Элемент observable полностью присутствует в окне пользователя
        if (newHeight && currentHeight < newHeight && entry &&
          entry.isIntersecting && entry.intersectionRatio >= observeOptions.threshold) {
          setCurrentHeight(newHeight)
        }

      }, observeOptions)
      // Отписка от обсервера, когда он больше не нужен
      if (observable.current) {
        observer.observe(observable.current)
      }
    }
    return () => {
      if(observable.current && observer) {
        observer.unobserve(observable.current)
      }
    }
  }, [container.current, observable.current])

  return (
    <div ref={container} style={{position: "relative"}}>
      {props.children}
      <div ref={observable} style={{position: "absolute", bottom: "60px", width: "100%"}}/>
    </div>
  );
};

export default React.memo(InfiniteScroller);
