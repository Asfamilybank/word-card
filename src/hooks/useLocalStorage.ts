import { useCallback, useEffect, useState } from "react";

const evtTarget = new EventTarget();

export default function useLocalStorage<T>(
  key: string,
  defaultValue?: T
): [T, (updatedValue: T, remove?: boolean) => void] {
  const raw = localStorage.getItem(key);

  const [value, setValue] = useState<T>(raw ? JSON.parse(raw) : defaultValue);

  // updater: Change useState and change localStorage at the same time
  const updater = useCallback(
    (updatedValue: T) => {
      // change useState
      setValue(updatedValue);
      // change localStorage
      localStorage.setItem(key, JSON.stringify(updatedValue));
      evtTarget.dispatchEvent(
        new CustomEvent("storage_change", { detail: { key } })
      );
    },
    [key]
  );

  // Set default value
  defaultValue !== undefined && !raw && updater(defaultValue);

  // Listen for changes in localStorage to change useState
  useEffect(() => {
    const listener = ({ detail }: any) => {
      if (detail.key === key) {
        const lraw = localStorage.getItem(key);

        lraw !== raw && setValue(lraw && JSON.parse(lraw));
      }
    };
    // add listen callback
    evtTarget.addEventListener("storage_change", listener);
    // remove listener
    return () => evtTarget.removeEventListener("storage_change", listener);
  });

  return [value, updater];
}
