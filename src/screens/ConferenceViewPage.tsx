import React, { useState, useMemo } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import ConferenceTimetableTable from '../basics/ConferenceTimetableTable';
import BasicLayout from '../complexes/BasicLayout';
import { ConferenceTimetableSelection, getConferencePath, OnConferenceTimetableSelect, useConference, getTimetable } from '../models/conferences';
import { useAdminUser } from '../models/users';
import { BasicHeading1, BasicHeading2 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';
import NotFoundScreen from './NotFoundPage';

type Props = RouteComponentProps<{ id: string }>

const ConferenceListPage: React.FC<Props> = (props) => {
  const confId = props.match.params.id;
  const [conf, confInitialized] = useConference(confId);
  const [selecting, setSelecting] = useState(false);
  const [admin, adminInitialized] = useAdminUser();
  const [selections, setSelections] = useState<ConferenceTimetableSelection>({});

  const timetable = useMemo(
    () => conf && getTimetable(conf),
    [conf && conf.timetable],
  );

  // TODO implement replacing this dummy
  const userSelections: ConferenceTimetableSelection = {
    '12:00': 0,
    '14:15': 1,
  };

  if (!confInitialized || !adminInitialized) {
    return <LoadingScreen />
  }

  if (!conf) {
    return <NotFoundScreen />
  }

  const onStartSelectingClick = () => {
    setSelecting(true);
  };

  const onFinishSelectingClick = () => {
    setSelecting(false);
  };

  const onSelect: OnConferenceTimetableSelect = (startsAt, index) => {
    const selectedIndex = selections[startsAt] === index ? NaN : index;
    const update = {
      ...selections,
      [startsAt]: selectedIndex,
    };
    setSelections(update);
  };

  return (
    <BasicLayout className="ConferenceListPage">
      <BasicHeading1>{conf.name}</BasicHeading1>
      {admin && (
        <p>
          {'Admin: '}
          <Link to={getConferencePath('edit', conf)}>Edit</Link>
        </p>
      )}
      <div>{conf.description}</div>
      <BasicHeading2>Timetable</BasicHeading2>
      <p>
        {selecting ? (
          <button onClick={onFinishSelectingClick}>
            Finish selecting sessions
          </button>
        ) : (
          <button onClick={onStartSelectingClick}>
            Start selecting sessions
          </button>
        )}
      </p>
      {timetable ? (
        <ConferenceTimetableTable
          onSelect={onSelect}
          selecting={selecting}
          selections={selections}
          timetable={timetable}
        />
      ) : (
        <div>Failed to build timetable.</div>
      )}
    </BasicLayout>
  );
};

export default ConferenceListPage;
