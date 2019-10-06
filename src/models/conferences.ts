import firebase from '../middleware/firebase';

type PathActions =
  | 'create'
  | 'edit'
  | 'view';

export function getConferencePath(conf?: Conference, action?: PathActions) {
  const base = '/conferences';
  if (!conf) {
    return base;
  }

  const target = `${base}/${conf.id}`;
  if (!action || action === 'view') {
    return target;
  }

  return `/admin${target}/${action}`;
}

function getConferencesCollection () {
  return firebase.firestore().collection('conferences');
}

export type Conference = {
  description: string;
  id: string;
  name: string;
}

type NewConferenceData = Pick<Conference, 'description' | 'name'>

export async function createNewConference(data: NewConferenceData) {
  const doc = await getConferencesCollection().add(data);
  const ss = await doc.get();
  const conf = ssToConference(ss);
  return conf;
}

function ssToConference (ss: firebase.firestore.DocumentSnapshot): Conference {
  const data = ss.data() || {};

  return {
    description: String(data.description || ''),
    id: ss.id,
    name: String(data.name || ''),
  };
}
