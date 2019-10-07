import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import BasicLayout from '../complexes/BasicLayout';
import { useConference } from '../models/conferences';
import { BasicHeading1 } from '../pure/BasicHeading';
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
    </BasicLayout>
  );
};

export default ConferenceListPage;
