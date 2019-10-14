import React from 'react';
import { Link } from 'react-router-dom';
import BasicLayout from '../complexes/BasicLayout';
import firebase from '../middleware/firebase';
import { getConferencePath } from '../models/conferences';
import { isAdmin, useUser } from '../models/users';
import { BasicHeading1 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';

const HomePage: React.FC = () => {
  const [user, userInitialized] = useUser(firebase.auth());

  if (!userInitialized) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <BasicLayout>
      <BasicHeading1>Home</BasicHeading1>
      {user ? (
        <>
          <p>Welcome!</p>
          <p>
            <Link to="/logout">Log out</Link>
          </p>
          {isAdmin(user) && (
            <p>
              <Link to="/admin">Admin</Link>
            </p>
          )}
        </>
      ) : (
        <p>
          <Link to="/login">Log in</Link>
        </p>
      )}
      <ul>
        <li>
          <Link to={getConferencePath('list')}>Active Conferences</Link>
        </li>
      </ul>
    </BasicLayout>
  );
};

export default HomePage;
