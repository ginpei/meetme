import firebase from '../middleware/firebase';
import { useEffect, useState } from 'react';

export const dummyTimetable: ConferenceTimetable = {
  rooms: [
    { name: 'Room A' },
    { name: 'Room B' },
    { name: 'Room C' },
  ],
  schedule: [
    {
      startsAt: '12:00',
      sessions: [
        { body: 'Open' },
        { body: '' },
        { body: '' },
      ],
    },
    {
      startsAt: '13:00',
      sessions: [
        { body: 'Opening talk' },
        { body: '' },
        { body: '' },
      ],
    },
    {
      startsAt: '13:30',
      sessions: [
        { body: 'The State of JavaScript' },
        { body: '' },
        { body: '' },
      ],
    },
    {
      startsAt: '14:15',
      sessions: [
        { body: 'Visualizing Connections' },
        { body: 'Building one touch sign-in experience using WebAuthN' },
        { body: 'JavaScript AST プログラミング: 入門とその1歩先へ' },
      ],
    },
    {
      startsAt: '14:45',
      sessions: [
        { body: 'Defining Open Source' },
        { body: 'Awakened by Accessibility' },
        { body: 'Four Years of JS Procedural Generation' },
      ],
    },
    {
      startsAt: '15:30',
      sessions: [
        { body: 'TBD' },
        { body: 'Wrap-up: Runtime-friendly JavaScript' },
        { body: 'Technical SEO for JavaScript developers' },
      ],
    },
    {
      startsAt: '',
      sessions: [
        { body: '' },
        { body: '' },
        { body: '' },
      ],
    },
  ],
};

type InstancePathActions =
  | 'edit'
  | 'editTimetable'
  | 'view';

type GeneralPathActions =
  | 'new'
  | 'list';

export function getConferencePath(action: InstancePathActions, conf: Conference): string;
export function getConferencePath(action: GeneralPathActions): string;
export function getConferencePath(
  action: InstancePathActions | GeneralPathActions,
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
  timeline: string;
}

type NewConferenceData = Pick<Conference, 'description' | 'name'>

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
};

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
    timeline: String(data.timeline || ''),
  };
}

function conferenceToDocumentData (conf: Conference) {
  const { id, ...data } = conf;
  return data;
}
