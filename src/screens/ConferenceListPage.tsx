import React from 'react';
import { Link } from 'react-router-dom';
import BasicLayout from '../complexes/BasicLayout';
import { getConferencePath, useActiveConferences } from '../models/conferences';
import { BasicHeading1 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';

const ConferenceListPage: React.FC = () => {
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
            <Link to={getConferencePath('view', conf)}>{conf.name}</Link>
          </li>
        ))}
      </ul>
    </BasicLayout>
  );
};

export default ConferenceListPage;
