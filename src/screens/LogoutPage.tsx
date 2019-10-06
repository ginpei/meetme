import React, { FC, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import BasicLayout from '../complexes/BasicLayout';
import firebase from '../middleware/firebase';
import { BasicHeading1 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';

type RouteProps = RouteComponentProps<{}>

type Props = RouteProps;

const LogoutPage: FC<Props> = (props) => {
  const auth = firebase.auth();

  const [loggedIn, setLoggedIn] = useState(Boolean(auth.currentUser));
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => auth.onAuthStateChanged((user) => {
    setLoggedIn(Boolean(user));
  }), [auth]);

  if (!loggedIn || loggingOut) {
    setTimeout(() => props.history.push('/'), 1000);
    return (
      <LoadingScreen />
    );
  }

  const logOut = async () => {
    setLoggingOut(true);
    await auth.signOut();
  };

  return (
    <BasicLayout className="LogoutPage">
      <BasicHeading1>Logout</BasicHeading1>
      <p>
        <button onClick={logOut}>Log out</button>
      </p>
    </BasicLayout>
  );
};

export default LogoutPage;
