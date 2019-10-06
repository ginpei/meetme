import React, { FC, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import BasicLayout from '../complexes/BasicLayout';
import firebase from '../middleware/firebase';
import { isAdmin } from '../models/users';
import { BasicHeading1 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';
import NotFoundScreen from './NotFoundPage';

type RouteProps = RouteComponentProps<{}>

type Props = RouteProps;

const AdminTopPage: FC<Props> = (props) => {
  const [adminInitialized, setAdminInitialized] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(async (user) => {
      const admin = user ? await isAdmin(user) : false;
      setAdmin(admin);
      setAdminInitialized(true);
    });
  }, []);

  if (!adminInitialized) {
    return <LoadingScreen />;
  }

  if (!admin) {
    return <NotFoundScreen />
  }

  return (
    <BasicLayout className="AdminTopPage">
      <BasicHeading1>Admin</BasicHeading1>
    </BasicLayout>
  );
};

export default AdminTopPage;
