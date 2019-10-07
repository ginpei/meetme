import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BasicLayout from '../complexes/BasicLayout';
import firebase from '../middleware/firebase';
import { getConferencePath } from '../models/conferences';
import { BasicHeading1 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';

const NoteItem: FC<{ note: any }> = (props) => {
  const { note } = props;
  const title = note.title || (note.body as string).split('\n')[0];
  return (
    <li>{title}</li>
  );
};

const HomePage: React.FC = () => {
  const [authInitialized, setAuthInitialized] = useState(false);
  const [user, setUser] = useState<firebase.User | null>(null);
  const [notesInitialized, setNotesInitialized] = useState(false);
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((curUser) => {
      setAuthInitialized(true);
      setUser(curUser);
    });
  }, []);

  useEffect(() => {
    return firebase.firestore().collection('free-notes').onSnapshot({
      next: (snapshot) => {
        const dataList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setNotes(dataList);
        setNotesInitialized(true);
      },
      error: (error) => {
        console.error(error);
        setNotesInitialized(true);
      },
    });
  }, []);

  if (!authInitialized || !notesInitialized) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <BasicLayout>
      <BasicHeading1>Home</BasicHeading1>
      {user ? (
        <>
          <p>Welcome {user.displayName || 'Somebody'}</p>
          <p>
            <Link to="/logout">Log out</Link>
          </p>
        </>
      ) : (
        <p>
          <Link to="/login">Log in</Link>
        </p>
      )}
      <ul>
        <li>
          <Link to={getConferencePath()}>Active Conferences</Link>
        </li>
        {notes.map((note) => (
          <NoteItem key={note.id} note={note} />
        ))}
      </ul>
    </BasicLayout>
  );
};

export default HomePage;
