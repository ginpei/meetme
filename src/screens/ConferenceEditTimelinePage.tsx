import React, { ChangeEvent, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import BasicLayout from '../complexes/BasicLayout';
import { Conference, getConferencePath, saveConference, useConference, ConferenceTimetable } from '../models/conferences';
import { BasicHeading1, BasicHeading2 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';
import NotFoundScreen from './NotFoundPage';
import styled from 'styled-components';
import ConferenceTimetableTable from '../basics/ConferenceTimetableTable';

const TimelineInput = styled.textarea`
  min-height: 50vh;
  width: 100%;
`;

type ConferenceFormProps = {
  conf: Conference;
  disabled: boolean;
  onChange: (conf: Conference) => void;
}

const TimelineEditor: React.FC<ConferenceFormProps> = (props) => {
  const { conf } = props;

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange({
      ...conf,
      timetable: event.currentTarget.value,
    });
  };

  return (
    <TimelineInput
      disabled={props.disabled}
      onChange={onChange}
      value={conf.timetable}
    />
  );
};

type Props = RouteComponentProps<{ id: string }>;

const ConferenceEditTimelinePage: React.FC<Props> = (props) => {
  const [originalConf, confInitialized] = useConference(props.match.params.id);
  const [conf, setConf] = useState<Conference | null>(null);
  const [saving, setSaving] = useState(false);
  const [timetable, setTimetable] = useState<ConferenceTimetable | null>(null);
  const [timetableError, setTimetableError] = useState('');

  if (!confInitialized) {
    return <LoadingScreen />
  }

  if (!originalConf) {
    return <NotFoundScreen />
  }

  if (!conf) {
    setConf(originalConf);
    try {
      const newTimeline = JSON.parse(originalConf.timetable);
      setTimetable(newTimeline);
    } catch (error) {
      setTimetableError(String(error && error.message));
    }
    return <LoadingScreen />
  }

  const onChange = (conf: Conference) => {
    setConf(conf);

    try {
      const newTimeline = JSON.parse(conf.timetable);
      setTimetable(newTimeline);
      setTimetableError('');
    } catch (error) {
      setTimetableError(String(error && error.message));
    }
  };

  const onSaveClick = async () => {
    setSaving(true);
    await saveConference(conf);
    setSaving(false);
  };

  return (
    <BasicLayout className="ConferenceEditTimelinePage">
      <p>
        <Link to={getConferencePath('edit', conf)}>← Edit</Link>
      </p>
      <BasicHeading1>{conf.name} - Timeline</BasicHeading1>
      <p>
        <button disabled={saving} onClick={onSaveClick}>Save</button>
      </p>
      <TimelineEditor
        conf={conf}
        disabled={saving}
        onChange={onChange}
      />
      <BasicHeading2>Preview</BasicHeading2>
      {timetableError && (
        <p>{timetableError}</p>
      )}
      {timetable && <ConferenceTimetableTable
        timetable={timetable}
      />}
    </BasicLayout>
  );
};

export default ConferenceEditTimelinePage;
