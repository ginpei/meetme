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
