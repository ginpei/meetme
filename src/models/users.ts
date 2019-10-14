import { useEffect, useState } from 'react';
import firebase from '../middleware/firebase';

export type User = {
  id: string;
  imageUrl: string;
  level: UserLevel;
  name: string;
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
      try {
        const user = await loadUser(fbUser);
        setUser(user);
      } catch (error) {
        setError(error);
      } finally {
        setInitialized(true);
      }
    }, (error) => {
      setError(error);
      setInitialized(true);
    });
  }, [auth]);

  return [user, initialized, error];
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

export function isAdmin (user: User | null) {
  return user
    ? user.level === 'admin'
    : false;
}

function ssToUser(ss: firebase.firestore.DocumentSnapshot): User {
  const data = ss.data() || {};
  return {
    id: ss.id,
    imageUrl: String(data.imageUrl || '/icon-512.png'),
    level: data.level || '',
    name: String(data.name || 'Anonymouse'),
  }
}
