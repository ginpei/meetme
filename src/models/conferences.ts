import { useEffect, useState } from 'react';
import firebase from '../middleware/firebase';

type FirestoreError = firebase.firestore.FirestoreError;

export type Conference = {
  description: string;
  id: string;
  name: string;
  timetable: string;
}

export type ConferenceTimetable = {
  rooms: {
    name: string;
  }[];
  schedule: {
    startsAt: string;
    sessions: {
      body: string;
    }[];
  }[];
}

export type ConferenceTimetableSchedule = ConferenceTimetable['schedule'][0]

export type ConferenceTimetableSession = ConferenceTimetableSchedule['sessions'][0]

export type OnConferenceTimetableSelect = (time: string, index: number) => void;

export type ConferenceTimetableSelection = {
  /**
   * Pair of start time and room index.
   */
  [startsAt: string]: number;
}

type InstancePathActions =
  | 'edit'
  | 'editTimetable'
  | 'view';

type StaticPathActions =
  | 'new'
  | 'list';

export function getConferencePath(action: InstancePathActions, conf: Conference): string;
export function getConferencePath(action: StaticPathActions): string;
export function getConferencePath(
  action: InstancePathActions | StaticPathActions,
  conf?: Conference,
) {
  const base = '/conferences/';
  if (action === 'list') {
    return base;
  }

  const adminBase = `/admin${base}`;
  if (action === 'new') {
    return `${adminBase}new`
  }

  if (action === 'view') {
    return `${base}${conf!.id}`;
  }

  return `${adminBase}${conf!.id}/${action}`;
}

/**
 * @param id Conference ID
 * @returns `[conference, initialized, error]`
 */
export function useConference(id: string): [Conference | null, boolean, FirestoreError | null] {
  const [initialized, setInitialized] = useState(false);
  const [conf, setConf] = useState<Conference | null>(null);
  const [error, setError] = useState<FirestoreError | null>(null);

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
        setError(error);
      },
    })
  }, [id]);

  return [conf, initialized, error];
}

export function getTimetable(conf: Conference): ConferenceTimetable | null {
  const data = JSON.parse(conf.timetable);
  return data;
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

function getConferencesCollection () {
  return firebase.firestore().collection('conferences');
}

function ssToConference (ss: firebase.firestore.DocumentSnapshot): Conference {
  const data = ss.data() || {};

  return {
    description: String(data.description || ''),
    id: ss.id,
    name: String(data.name || ''),
    timetable: String(data.timetable || ''),
  };
}

function conferenceToDocumentData (conf: Conference) {
  const { id, ...data } = conf;
  return data;
}
