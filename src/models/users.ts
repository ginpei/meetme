import { useEffect, useState } from 'react';
import firebase from '../middleware/firebase';

export type UserLevel =
  | 'admin';

export async function loadUser (user: firebase.User) {
  const { uid } = user;
  const ss = await firebase.firestore().collection('users').doc(uid).get();
  const data = ss.data();
  return data;
}

export async function isAdmin (user: firebase.User) {
  try {
    const data = await loadUser(user);
    const level = data && data.level as UserLevel;
    return level === 'admin';
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * @returns `[user, initialized, error]`
 */
export function useUser (auth: firebase.auth.Auth) {
  const [error, setError] = useState<firebase.auth.Error | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setInitialized(true);
    }, (error) => {
      setError(error);
      setInitialized(true);
    });
  }, []);

  return [user, initialized, error];
}

/**
 * @returns `[admin, initialized]`
 */
export function useAdminUser (): [boolean, boolean] {
  const [initialized, setInitialized] = useState(false);
  const [admin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(async (user) => {
      const result = user ? await isAdmin(user) : false;
      setAdmin(result);
      setInitialized(true);
    });
  }, []);

  return [admin, initialized];
}
