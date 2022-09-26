import React, {useEffect, useRef, useState} from 'react';
import propTypes from 'prop-types';

const InfiniteScroller = (props) => {
  const container = useRef()
  const observable = useRef()

  const [currentHeight, setCurrentHeight] = useState(0)
  useEffect(() => {
    props.onIntersection()
  }, [currentHeight])
  useEffect(() => {
    if(container.current) {
      const observeOptions = {
        root: null,
        threshold: 0.5,
      }
      const observer = new IntersectionObserver( (entries) => {
        const newHeight = container.current.getBoundingClientRect().height
        const entry = entries[0]
        if(currentHeight < newHeight && entry && entry.isIntersecting && entry.intersectionRatio >= observeOptions.threshold) {
          setCurrentHeight(newHeight)
        }

      }, observeOptions)
      observer.observe(observable.current)
      return () => observer.unobserve(observable.current)
    }
  }, [container])

  return (
    <div ref={container} style={{position: "relative"}}>
      {props.children}
      <div ref={observable} style={{position: "absolute", bottom: (100 - props.triggerIntersectionAt * 100) + "%"}}/>
    </div>
  );
};

InfiniteScroller.propTypes = {
  triggerIntersectionAt: propTypes.number,
  onIntersection: propTypes.func,
  children: propTypes.node.isRequired
}

InfiniteScroller.defaultProps = {
  triggerIntersectionAt: 0.7,
  onIntersection: () => {}
}

export default React.memo(InfiniteScroller);
