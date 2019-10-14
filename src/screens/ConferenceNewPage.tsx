import React, { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import BasicLayout from '../complexes/BasicLayout';
import firebase from '../middleware/firebase';
import { createNewConference, getConferencePath } from '../models/conferences';
import { isAdmin, useUser } from '../models/users';
import { BasicHeading1 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';
import NotFoundScreen from './NotFoundPage';

type RouteProps = RouteComponentProps<{}>

type Props = RouteProps;

const ConferenceNewPage: FC<Props> = (props) => {
  const [user, userInitialized] = useUser(firebase.auth());
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [working, setWorking] = useState(false);

  if (!userInitialized) {
    return <LoadingScreen />;
  }

  if (!isAdmin(user)) {
    return <NotFoundScreen />
  }

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const onDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.currentTarget.value);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name) {
      alert('Name is required');
      return;
    }

    setWorking(true);
    try {
      const conf = await createNewConference({ description, name });
      const nextPath = getConferencePath('edit', conf);
      props.history.push(nextPath);
    } catch (error) {
      setWorking(false);
      throw error;
    }
  };

  return (
    <BasicLayout className="ConferenceNewPage">
      <p>
        <Link to="/admin">← Admin</Link>
      </p>
      <BasicHeading1>New Conference</BasicHeading1>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            <span className="x-wrapper">Name:</span>
            <input type="text" value={name} onChange={onNameChange} />
          </label>
        </div>
        <div>
          <label>
            Description:
            <br/>
            <textarea value={description} onChange={onDescriptionChange} />
          </label>
        </div>
        <div>
          <button type="submit" disabled={working}>Create</button>
        </div>
      </form>
    </BasicLayout>
  );
};

export default ConferenceNewPage;
