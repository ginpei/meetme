import { useEffect, useState } from 'react';
import firebase from '../middleware/firebase';

export type User = {
  id: string;
  level: UserLevel;
}

export type UserLevel =
  | 'admin';

/**
 * @returns `[user, initialized, error]`
 */
export function useUser (auth: firebase.auth.Auth): [User | null, boolean, firebase.auth.Error | null] {
  const [error, setError] = useState<firebase.auth.Error | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return auth.onAuthStateChanged(async (fbUser) => {
      const user = await loadUser(fbUser);
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

export async function loadUser (fbUser: firebase.User | null) {
  if (!fbUser) {
    return null;
  }

  const { uid } = fbUser;
  const ss = await firebase.firestore().collection('users').doc(uid).get();
  const user = ssToUser(ss);
  return user;
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

function ssToUser(ss: firebase.firestore.DocumentSnapshot): User {
  const data = ss.data() || {};
  return {
    id: ss.id,
    level: data.level || '',
  }
}