import { defaultAdmin, usersStorageKey } from '../constants';

export const readStoredJson = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const writeStoredJson = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getStoredUsers = () => {
  const users = readStoredJson(usersStorageKey, []);
  const hasAdmin = users.some((user) => user.email === defaultAdmin.email);
  const nextUsers = hasAdmin ? users : [...users, defaultAdmin];

  if (!hasAdmin) {
    writeStoredJson(usersStorageKey, nextUsers);
  }

  return nextUsers;
};
