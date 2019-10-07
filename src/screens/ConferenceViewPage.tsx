import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ConferenceTimetableTable from '../basics/ConferenceTimetableTable';
import BasicLayout from '../complexes/BasicLayout';
import { dummyTimetable, useConference } from '../models/conferences';
import { BasicHeading1, BasicHeading2 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';
import NotFoundScreen from './NotFoundPage';

type Props = RouteComponentProps<{ id: string }>

const ConferenceListPage: React.FC<Props> = (props) => {
  const [conf, confInitialized] = useConference(props.match.params.id);

  if (!confInitialized) {
    return <LoadingScreen />
  }

  if (!conf) {
    return <NotFoundScreen />
  }

  return (
    <BasicLayout className="ConferenceListPage">
      <BasicHeading1>{conf.name}</BasicHeading1>
      <div>{conf.description}</div>
      <BasicHeading2>Timetable</BasicHeading2>
      <ConferenceTimetableTable timetable={dummyTimetable} />
    </BasicLayout>
  );
};

export default ConferenceListPage;
