import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

// Like useState, but the value is saved in LocalStorage and restored on reload.
// The third item is true when the browser refused to save (e.g. storage full).
export function useLocalStorage<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isValid(parsed)) return parsed;
      }
    } catch {
      // Corrupted data or storage blocked: fall back to the initial value.
    }
    return initial;
  });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, [key, value]);

  return [value, setValue, failed];
}
