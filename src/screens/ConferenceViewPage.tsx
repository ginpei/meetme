import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import ConferenceTimetableTable from '../basics/ConferenceTimetableTable';
import BasicLayout from '../complexes/BasicLayout';
import { dummyTimetable, getConferencePath, useConference, ConferenceTimetable } from '../models/conferences';
import { useAdminUser } from '../models/users';
import { BasicHeading1, BasicHeading2 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';
import NotFoundScreen from './NotFoundPage';

type Props = RouteComponentProps<{ id: string }>

const ConferenceListPage: React.FC<Props> = (props) => {
  const [conf, confInitialized] = useConference(props.match.params.id);
  const [timetable, setTimetable] = useState<ConferenceTimetable | null>(null);
  const [timetableInitialized, setTimetableInitialized] = useState(false);
  const [admin, adminInitialized] = useAdminUser();

  if (!confInitialized || !adminInitialized) {
    return <LoadingScreen />
  }

  if (!conf) {
    return <NotFoundScreen />
  }

  if (!timetableInitialized) {
    setTimetableInitialized(true);
    try {
      const data = JSON.parse(conf.timeline);
      setTimetable(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <BasicLayout className="ConferenceListPage">
      <BasicHeading1>{conf.name}</BasicHeading1>
      {admin && (
        <p>
          {'Admin: '}
          <Link to={getConferencePath('edit', conf)}>Edit</Link>
        </p>
      )}
      <div>{conf.description}</div>
      <BasicHeading2>Timetable</BasicHeading2>
      {timetable ? (
        <ConferenceTimetableTable timetable={timetable} />
      ) : (
        <div>Failed to build timetable.</div>
      )}
    </BasicLayout>
  );
};

export default ConferenceListPage;
