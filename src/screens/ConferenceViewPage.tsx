import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import ConferenceTimetableTable from '../basics/ConferenceTimetableTable';
import BasicLayout from '../complexes/BasicLayout';
import { dummyTimetable, getConferencePath, useConference } from '../models/conferences';
import { useAdminUser } from '../models/users';
import { BasicHeading1, BasicHeading2 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';
import NotFoundScreen from './NotFoundPage';

type Props = RouteComponentProps<{ id: string }>

const ConferenceListPage: React.FC<Props> = (props) => {
  const [conf, confInitialized] = useConference(props.match.params.id);
  const [admin, adminInitialized] = useAdminUser();

  if (!confInitialized || !adminInitialized) {
    return <LoadingScreen />
  }

  if (!conf) {
    return <NotFoundScreen />
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
      <ConferenceTimetableTable timetable={dummyTimetable} />
    </BasicLayout>
  );
};

export default ConferenceListPage;
