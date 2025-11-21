import { useState, useEffect } from "react";

type UseLocalStorageReturn<T> = [T, (value: T | ((val: T) => T)) => void];

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error: unknown) {
      let errorMessage = "Error reading LocalStorage key";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error(`Error reading localStorage key "${key}":`, errorMessage);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (valueToStore === null || valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error: unknown) {
      let errorMessage = "Error setting localStorage key";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error(
        `Error setting localStorage key "${key}":`,
        errorMessage,
        error
      );
    }
  };

  // Listen for changes to this localStorage key from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error: unknown) {
          let errorMessage = "Error parsing localStorage Key";
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          console.error(
            `Error parsing localStorage key "${key}":`,
            errorMessage
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
};
