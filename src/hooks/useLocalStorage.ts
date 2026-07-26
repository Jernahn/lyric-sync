import { useEffect, useRef, useState } from 'react';

interface UseLocalStorageOptions {
  serializer?: (value: unknown) => string;
  deserializer?: (value: string) => unknown;
}

export const useLocalStorage = <T>(
  key: string,
  initialValue?: T,
  options?: UseLocalStorageOptions,
): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return options?.deserializer
          ? (options.deserializer(item) as T)
          : JSON.parse(item);
      }
      return initialValue as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue as T;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(
        key,
        options?.serializer
          ? options.serializer(valueToStore)
          : JSON.stringify(valueToStore),
      );
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};
