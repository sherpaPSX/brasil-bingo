import { useState, useEffect } from "react";

function useLocalStorage(key: string) {
  const [value, setValue] = useState(localStorage.getItem(key));

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(event.newValue);
      }
    };

    const handleLocalChange = () => {
      setValue(localStorage.getItem(key));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageChange", handleLocalChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleLocalChange);
    };
  }, [key]);

  return value;
}

export default useLocalStorage;
