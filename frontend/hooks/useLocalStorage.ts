import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Başlangıç değerini localStorage'dan almaya çalış
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  // localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.log('LocalStorage kayıt hatası:', error)
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue] as const
} 