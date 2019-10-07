import React, { ChangeEvent, FormEvent, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import BasicLayout from '../complexes/BasicLayout';
import { Conference, saveConference, useConference } from '../models/conferences';
import { BasicHeading1, BasicHeading2 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';
import NotFoundScreen from './NotFoundPage';

type ConferenceFormProps = {
  conf: Conference;
  disabled: boolean;
  onSubmit: (conf: Conference) => void;
}

const ConferenceForm: React.FC<ConferenceFormProps> = (props) => {
  const { conf, disabled } = props;
  const [name, setName] = useState(conf.name);
  const [description, setDescription] = useState(conf.description);

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const onDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.currentTarget.value);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const editedConf: Conference = {
      description,
      id: conf.id,
      name,
    };
    props.onSubmit(editedConf);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>
          Name:
          <input
            disabled={disabled}
            onChange={onNameChange}
            type="text"
            value={name}
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <br/>
          <textarea
            disabled={disabled}
            onChange={onDescriptionChange}
            value={description}
          />
        </label>
      </div>
      <div>
        <button type="submit" disabled={disabled}>Save</button>
      </div>
    </form>
  );
};

type Props = RouteComponentProps<{ id: string }>;

const ConferenceEditPage: React.FC<Props> = (props) => {
  const [conf, confInitialized] = useConference(props.match.params.id);
  const [saving, setSaving] = useState(false);

  if (!confInitialized) {
    return <LoadingScreen />
  }

  if (!conf) {
    return <NotFoundScreen />
  }

  const onBasicsSubmit = (conf: Conference) => {
    setSaving(true);
    saveConference(conf);
    setSaving(false);
  };

  return (
    <BasicLayout>
      <p>
        <Link to="/admin">← Admin</Link>
      </p>
      <BasicHeading1>{conf.name}</BasicHeading1>
      <BasicHeading2>Basic Information</BasicHeading2>
      <ConferenceForm
        conf={conf}
        disabled={saving}
        onSubmit={onBasicsSubmit}
      />
    </BasicLayout>
  );
};

export default ConferenceEditPage;
