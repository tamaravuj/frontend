import { useEffect, useState } from 'react';
import { readStoredJson, writeStoredJson } from '../utils/storage';

export const useStoredState = (key, fallback) => {
  const [value, setValue] = useState(() => readStoredJson(key, fallback));

  useEffect(() => {
    writeStoredJson(key, value);
  }, [key, value]);

  return [value, setValue];
};
