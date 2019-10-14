import React, { useMemo, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import ConferenceTimetableTable from '../basics/ConferenceTimetableTable';
import BasicLayout from '../complexes/BasicLayout';
import firebase from '../middleware/firebase';
import { saveConferenceAttendance, useConferenceAttendance } from '../models/conferenceParticipants';
import { getConferencePath, getTimetable, OnConferenceTimetableSelect, useConference } from '../models/conferences';
import { isAdmin, useUser } from '../models/users';
import { BasicHeading1, BasicHeading2 } from '../pure/BasicHeading';
import ErrorScreen from './ErrorScreen';
import LoadingScreen from './LoadingScreen';
import NotFoundScreen from './NotFoundPage';

type Props = RouteComponentProps<{ id: string }>

const ConferenceListPage: React.FC<Props> = (props) => {
  const confId = props.match.params.id;
  const firestore = firebase.firestore();

  const [conf, confInitialized, confError] = useConference(confId);
  const [selecting, setSelecting] = useState(false);
  const [user, userInitialized, userError] = useUser(firebase.auth());

  const [attendance, attInitialized, attError, setAttendance] = useConferenceAttendance(
    firestore,
    confId,
    user && user.id,
  );

  const timetable = useMemo(
    () => conf && getTimetable(conf),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [conf && conf.timetable],
  );

  if (!confInitialized || !userInitialized || (user && !attInitialized)) {
    return <LoadingScreen />
  }

  const error = confError || userError || attError;
  if (error) {
    return (
      <ErrorScreen error={error} />
    );
  }

  if (!conf) {
    return <NotFoundScreen />
  }

  const onStartSelectingClick = () => {
    setSelecting(true);
  };

  const onFinishSelectingClick = () => {
    setSelecting(false);
  };

  const onSelect: OnConferenceTimetableSelect = async (startsAt, index) => {
    const selection = attendance[startsAt] === index
      ? NaN
      : index;
    const newMap = {
      ...attendance,
      [startsAt]: selection,
    };
    setAttendance(newMap);

    await saveConferenceAttendance(firestore, confId, user!.id, newMap);
  };

  return (
    <BasicLayout className="ConferenceListPage">
      <BasicHeading1>{conf.name}</BasicHeading1>
      {isAdmin(user) && (
        <p>
          {'Admin: '}
          <Link to={getConferencePath('edit', conf)}>Edit</Link>
        </p>
      )}
      <div>{conf.description}</div>
      <BasicHeading2>Timetable</BasicHeading2>
      {user ? (
        <p>
          {selecting ? (
            <button onClick={onFinishSelectingClick}>
              <span aria-hidden>✔️</span>
              Finish selecting sessions
            </button>
          ) : (
            <button onClick={onStartSelectingClick}>
              Start selecting sessions
            </button>
          )}
        </p>
      ) : (
        <p>
          <Link to="/login">Log in to select sessions</Link>
        </p>
      )}
      {timetable ? (
        <ConferenceTimetableTable
          onSelect={onSelect}
          selecting={selecting}
          selections={attendance}
          timetable={timetable}
        />
      ) : (
        <div>Failed to build timetable.</div>
      )}
    </BasicLayout>
  );
};

export default ConferenceListPage;
