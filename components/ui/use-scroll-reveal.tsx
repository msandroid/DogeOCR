"use client"
import { useEffect, useRef, useState } from "react"

export function useScrollReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [options])

  return { ref, inView }
} 