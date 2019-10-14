import { useEffect, useState } from "react";

type Firestore = firebase.firestore.Firestore;
type FirestoreError = firebase.firestore.FirestoreError;

export type ConferenceAttendanceMap = {
  [startsAt: string]: number;
}

export function useConferenceAttendance(
  firestore: Firestore,
  confId: string | null,
  userId: string | null,
): [
  ConferenceAttendanceMap,
  boolean,
  FirestoreError | null,
  (newMap: ConferenceAttendanceMap) => void,
] {
  const [error, setError] = useState<FirestoreError | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [map, setMap] = useState<ConferenceAttendanceMap>({});

  const set = (newMap: ConferenceAttendanceMap) => {
    if (!initialized) {
      return;
    }

    setMap(newMap);
  };

  useEffect(() => {
    if (!confId || !userId) {
      return;
    }

    return getDoc(firestore, confId, userId).onSnapshot({
      next(ss) {
        const map = ssToAttendance(ss);
        if (map) {
          setMap(map);
        }
        setInitialized(true);
      },
      error(error) {
        setError(error);
        setInitialized(true);
      },
    });
  }, [firestore, confId, userId]);

  return [map, initialized, error, set];
}

export async function saveConferenceAttendance(
  firestore: Firestore,
  confId: string,
  userId: string,
  attendance: ConferenceAttendanceMap,
) {
  const doc = getDoc(firestore, confId, userId);
  await doc.set(attendance);
}

function getColl(firestore: Firestore, confId: string) {
  return firestore
    .collection('conferences').doc(confId)
    .collection('attendances');
}

function getDoc(firestore: Firestore, confId: string, userId: string) {
  return getColl(firestore, confId).doc(userId);
}

function ssToAttendance(ss: firebase.firestore.DocumentSnapshot | null) {
  if (!ss) {
    return null;
  }

  const data = ss.data() || {};

  const map: ConferenceAttendanceMap = {};
  Object.entries(data).forEach(([startsAt, selection]) => {
    map[startsAt] = Number(selection);
  })
  return map;
}
