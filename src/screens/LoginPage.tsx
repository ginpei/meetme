import * as firebaseui from 'firebaseui';
import React, { FC, useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import BasicLayout from '../complexes/BasicLayout';
import firebase from '../middleware/firebase';
import LoadingScreen from './LoadingScreen';

const uiConfig: firebaseui.auth.Config = {
  credentialHelper: firebaseui.auth.CredentialHelper.NONE, // disable AccountChooser.com
  // privacyPolicyUrl: () => appHistory.push('/privacy'),
  signInOptions: [
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  signInSuccessUrl: '/',
  // tosUrl: () => appHistory.push('/terms'),
};

const LoginPage: FC = () => {
  const auth = firebase.auth();

  const [loggedIn, setLoggedIn] = useState(Boolean(auth.currentUser));

  useEffect(() => auth.onAuthStateChanged((user) => {
    setLoggedIn(Boolean(user));
  }), [auth]);

  if (loggedIn) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <BasicLayout className="LoginPage">
      <h2>ログイン</h2>
      <StyledFirebaseAuth
        firebaseAuth={auth}
        uiConfig={uiConfig}
      />
    </BasicLayout>
  );
};

export default LoginPage;
