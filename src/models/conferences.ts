import firebase from '../middleware/firebase';
import { useEffect, useState } from 'react';

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

/**
 * @param id Conference ID
 * @returns `[conference, initialized]`
 */
export function useConference(id: string): [Conference | null, boolean] {
  const [initialized, setInitialized] = useState(false);
  const [conf, setConf] = useState<Conference | null>(null);

  useEffect(() => {
    const coll = getConferencesCollection();
    const doc = coll.doc(id);
    return doc.onSnapshot({
      next: (ss) => {
        setInitialized(true);
        const cur = ssToConference(ss);
        setConf(cur);
      },
      error: (error) => {
        setInitialized(true);
        setConf(null);
        throw error;
      },
    })
  }, [id]);

  return [conf, initialized];
}

/**
 * @returns `[conferences, initialized]`
 */
export function useActiveConferences(): [Conference[], boolean] {
  const [initialized, setInitialized] = useState(false);
  const [conferences, setConferences] = useState<Conference[]>([]);

  useEffect(() => {
    const coll = getConferencesCollection();
    coll.onSnapshot({
      next: (ss) => {
        setConferences(ss.docs.map((dss) => ssToConference(dss)));
        setInitialized(true);
      },
      error: (error) => {
        setInitialized(true);
        throw error;
      },
    });
  }, []);

  return [conferences, initialized];
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

export async function saveConference(conf: Conference) {
  const data = conferenceToDocumentData(conf);
  await getConferencesCollection().doc(conf.id).set(data);
}

function ssToConference (ss: firebase.firestore.DocumentSnapshot): Conference {
  const data = ss.data() || {};

  return {
    description: String(data.description || ''),
    id: ss.id,
    name: String(data.name || ''),
  };
}

function conferenceToDocumentData (conf: Conference) {
  const { id, ...data } = conf;
  return data;
}
