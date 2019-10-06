import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import BasicLayout from '../complexes/BasicLayout';
import { useAdminUser } from '../models/users';
import { BasicHeading1 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';
import NotFoundScreen from './NotFoundPage';

type RouteProps = RouteComponentProps<{}>

type Props = RouteProps;

const AdminTopPage: FC<Props> = (props) => {
  const admin = useAdminUser();

  if (admin === undefined) {
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
