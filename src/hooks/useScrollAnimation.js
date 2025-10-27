import { useEffect, useRef, useState } from 'react'

/**
 * Custom hook for scroll-triggered animations
 * @param {Object} options - Intersection Observer options
 * @returns {Object} - ref and isVisible state
 */
export function useScrollAnimation(options = {}) {
  const elementRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        // Optional: Stop observing after first appearance
        if (options.once !== false) {
          observer.unobserve(entry.target)
        }
      } else if (options.once === false) {
        setIsVisible(false)
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px'
    })

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [options.threshold, options.rootMargin, options.once])

  return { ref: elementRef, isVisible }
}

/**
 * Hook for staggered animations (multiple items)
 * @param {number} count - Number of items
 * @param {number} delay - Delay between items in ms
 */
export function useStaggerAnimation(count, delay = 100) {
  const [visibleItems, setVisibleItems] = useState([])
  const { ref, isVisible } = useScrollAnimation()

  useEffect(() => {
    if (isVisible) {
      const timers = []
      for (let i = 0; i < count; i++) {
        const timer = setTimeout(() => {
          setVisibleItems(prev => [...prev, i])
        }, i * delay)
        timers.push(timer)
      }
      return () => timers.forEach(clearTimeout)
    }
  }, [isVisible, count, delay])

  return { ref, visibleItems }
}
