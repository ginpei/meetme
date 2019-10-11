import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import ConferenceTimetableTable from '../basics/ConferenceTimetableTable';
import BasicLayout from '../complexes/BasicLayout';
import { ConferenceTimetable, ConferenceTimetableSelection, getConferencePath, OnConferenceTimetableSelect, useConference } from '../models/conferences';
import { useAdminUser } from '../models/users';
import { BasicHeading1, BasicHeading2 } from '../pure/BasicHeading';
import LoadingScreen from './LoadingScreen';
import NotFoundScreen from './NotFoundPage';

type Props = RouteComponentProps<{ id: string }>

const ConferenceListPage: React.FC<Props> = (props) => {
  const [conf, confInitialized] = useConference(props.match.params.id);
  const [timetable, setTimetable] = useState<ConferenceTimetable | null>(null);
  const [timetableInitialized, setTimetableInitialized] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [admin, adminInitialized] = useAdminUser();
  const [selections, setSelections] = useState<ConferenceTimetableSelection>({});

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

  if (!timetableInitialized) {
    setTimetableInitialized(true);
    try {
      const data: ConferenceTimetable = JSON.parse(conf.timetable);
      setTimetable(data);

      const initialSelection = data.schedule
        .reduce<ConferenceTimetableSelection>((dic, { startsAt }) => {
          dic[startsAt] = startsAt in userSelections
            ? userSelections[startsAt]
            : NaN;
          return dic;
        }, {})
      setSelections(initialSelection);
    } catch (error) {
      console.error(error);
    }
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
