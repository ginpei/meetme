import React, { FC } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import BasicLayout from '../complexes/BasicLayout';
import firebase from '../middleware/firebase';
import { getConferencePath } from '../models/conferences';
import { isAdmin, useUser } from '../models/users';
import { BasicHeading1 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';
import NotFoundScreen from './NotFoundPage';

type RouteProps = RouteComponentProps<{}>

type Props = RouteProps;

const AdminTopPage: FC<Props> = (props) => {
  const [user, userInitialized] = useUser(firebase.auth());

  if (!userInitialized) {
    return <LoadingScreen />;
  }

  if (!isAdmin(user)) {
    return <NotFoundScreen />
  }

  return (
    <BasicLayout className="AdminTopPage">
      <BasicHeading1>Admin</BasicHeading1>
      <ul>
        <li>
          <Link to={getConferencePath('list')}>Conferences</Link>
        </li>
        <li>
          <Link to={getConferencePath('new')}>Create new conference</Link>
        </li>
      </ul>
    </BasicLayout>
  );
};

export default AdminTopPage;
