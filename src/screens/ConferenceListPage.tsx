import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import BasicLayout from '../complexes/BasicLayout';
import { getConferencePath, useActiveConferences } from '../models/conferences';
import { BasicHeading1 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';

type Props = RouteComponentProps<{ id: string }>;

const ConferenceListPage: React.FC<Props> = (props) => {
  const [confList, confInitialized] = useActiveConferences();

  if (!confInitialized) {
    return <LoadingScreen />
  }

  return (
    <BasicLayout className="ConferenceListPage">
      <BasicHeading1>Active Conferences</BasicHeading1>
      <ul>
        {confList.map((conf) => (
          <li key={conf.id}>
            <Link to={getConferencePath(conf)}>{conf.name}</Link>
          </li>
        ))}
      </ul>
    </BasicLayout>
  );
};

export default ConferenceListPage;
