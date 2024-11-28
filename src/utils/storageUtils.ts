const STORAGE_PREFIX = 'voice-games';
const MAX_CHUNK_SIZE = 500000; // 500KB per chunk

export const saveToStorage = (key: string, value: string) => {
  try {
    // Split data into chunks if it's too large
    if (value.length > MAX_CHUNK_SIZE) {
      const chunks = Math.ceil(value.length / MAX_CHUNK_SIZE);
      for (let i = 0; i < chunks; i++) {
        const chunk = value.slice(i * MAX_CHUNK_SIZE, (i + 1) * MAX_CHUNK_SIZE);
        localStorage.setItem(`${STORAGE_PREFIX}:${key}:chunk:${i}`, chunk);
      }
      localStorage.setItem(`${STORAGE_PREFIX}:${key}:chunks`, chunks.toString());
    } else {
      localStorage.setItem(`${STORAGE_PREFIX}:${key}`, value);
    }
  } catch (error) {
    console.error('Error saving to storage:', error);
    // Clean up partial saves
    clearGameStorage(key);
  }
};

export const loadFromStorage = (key: string, defaultValue: any): string | null => {
  try {
    const chunksStr = localStorage.getItem(`${STORAGE_PREFIX}:${key}:chunks`);
    if (chunksStr) {
      const chunks = parseInt(chunksStr, 10);
      let value = '';
      for (let i = 0; i < chunks; i++) {
        const chunk = localStorage.getItem(`${STORAGE_PREFIX}:${key}:chunk:${i}`);
        if (chunk) {
          value += chunk;
        }
      }
      return value;
    }
    return localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
  } catch (error) {
    console.error('Error loading from storage:', error);
    return defaultValue;
  }
};

export const clearGameStorage = (key: string): void => {
  try {
    const chunksStr = localStorage.getItem(`${STORAGE_PREFIX}:${key}:chunks`);
    if (chunksStr) {
      const chunks = parseInt(chunksStr, 10);
      for (let i = 0; i < chunks; i++) {
        localStorage.removeItem(`${STORAGE_PREFIX}:${key}:chunk:${i}`);
      }
      localStorage.removeItem(`${STORAGE_PREFIX}:${key}:chunks`);
    }
    localStorage.removeItem(`${STORAGE_PREFIX}:${key}`);
  } catch (error) {
    console.error('Error clearing game storage:', error);
  }
};