export const localStorageMock = (function () {
  const store = new Map<string, string>();

  return {
    getItem: (key: string) => store.get(key),
    setItem: (key: string, value: string) => store.set(key, value),
    clear: () => store.clear(),
    removeItem: (key: string) => store.delete(key)
  };
})();
