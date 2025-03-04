import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedHistory, setStoredHistory] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedHistory));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedHistory]);

  
  return [storedHistory, setStoredHistory] as const;
}
