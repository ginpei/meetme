import React from 'react';
import styled from 'styled-components';
import { ConferenceAttendanceMap } from '../models/conferenceParticipants';
import { ConferenceTimetable, ConferenceTimetableSchedule, ConferenceTimetableSelection, ConferenceTimetableSession, OnConferenceTimetableSelect } from '../models/conferences';

const breakPoint = '500px';

const Table = styled.div`
  --color-timetable-bg-1: hsl(30, 80%, 90%);
  --color-timetable-fg-1: hsl(30, 80%, 50%);
  --color-timetable-bg-2: hsl(150, 80%, 90%);
  --color-timetable-fg-2: hsl(150, 80%, 30%);
  --color-timetable-bg-3: hsl(210, 80%, 90%);
  --color-timetable-fg-3: hsl(210, 80%, 50%);
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: ${breakPoint}){
    & {
      flex-direction: column;
      margin-bottom: 1rem;
    }
  }
`;

const RowTitle = styled.div`
  display: none;
  font-weight: bold;
  margin-left: calc(2px + 1rem);

  @media (max-width: ${breakPoint}){
    & {
      display: block;
    }
  }
`;

const Cell = styled.div`
  background-color: #fff;
  border-left: solid 2px #999;
  box-sizing: border-box;
  flex-grow: 1;
  margin: 0.2rem;
  opacity: 0.5;
  padding: 0.4rem 1rem;
  transition: transform 200ms;
  width: 100%;

  &:empty {
    visibility: hidden;
  }
  &:nth-child(2) {
    background-color: var(--color-timetable-bg-1);
    border-color: var(--color-timetable-fg-1);
  }
  &:nth-child(3) {
    background-color: var(--color-timetable-bg-2);
    border-color: var(--color-timetable-fg-2);
  }
  &:nth-child(4) {
    background-color: var(--color-timetable-bg-3);
    border-color: var(--color-timetable-fg-3);
  }
  &.heading {
    opacity: 1;
  }
  &.selecting {
    cursor: pointer;
    transform: scale(0.9);
  }
  &.selected {
    opacity: 1;
    transform: scale(1);
  }

  @media (max-width: ${breakPoint}){
    & {
      margin-left: 0;
      margin-right: 0;
    }
    &:empty {
      display: none;
    }
  }
`;

type StaticSelectableCellProps = {
  row: ConferenceTimetableSchedule;
  session: ConferenceTimetableSession;
}

type SelectableCellProps =
  | StaticSelectableCellProps
  | (StaticSelectableCellProps & {
    index: number;
    onSelect: OnConferenceTimetableSelect;
    selected: boolean;
    selecting: boolean;
  });

const SessionCell: React.FC<SelectableCellProps> = (props) => {
  const { row, session } = props;

  let className = 'selected';
  let onClick: () => void = () => undefined;

  if ('onSelect' in props) {
    className = [
      props.selected ? 'selected' : '',
      props.selecting ? 'selecting' : '',
    ].join(' ');

    if (props.selecting) {
      onClick = () => {
        if (props.onSelect) {
          props.onSelect(row.startsAt, props.index);
        }
      };
    }
  }

  return (
    <Cell
      className={className}
      onClick={onClick}
    >
      {session.body && (
        <>
          <Time>{row.startsAt}</Time>
          <SessionBody>{session.body}</SessionBody>
        </>
      )}
    </Cell>
  );
};

const Time = styled.div`
  font-size: 0.8em;
  font-weight: bold;

  @media (max-width: ${breakPoint}){
    & {
      display: none;
    }
  }
`;

const SessionBody = styled.div`
`;

type StaticProps = {
  timetable: ConferenceTimetable;
}

type Props = StaticProps | (StaticProps & {
  onSelect: OnConferenceTimetableSelect;
  selecting: boolean;
  selections: ConferenceAttendanceMap;
});

const ConferenceTimetableTable: React.FC<Props> = (props) => {
  const { timetable } = props;

  let onSelect: OnConferenceTimetableSelect = () => undefined;
  let selecting = false;
  let selections: ConferenceAttendanceMap = {};

  if ('onSelect' in props) {
    onSelect = props.onSelect;
    selecting = props.selecting;
    selections = props.selections;
  }

  const isSelected = (
    selections: ConferenceAttendanceMap,
    row: ConferenceTimetableSchedule,
    index: number,
  ) => {
    return index === selections[row.startsAt];
  };

  return (
    <Table className="ConferenceTimetableTable">
      <Row>
        <RowTitle>Rooms</RowTitle>
        {timetable.rooms.map((room) => (
          <Cell key={room.name} className="heading">{room.name}</Cell>
        ))}
      </Row>
      {timetable.schedule.map((row, rowIndex) => (
        <Row key={row.startsAt}>
          <RowTitle>{row.startsAt}</RowTitle>
          {row.sessions.map((session, cellIndex) =>
            <SessionCell
              index={cellIndex}
              key={`${rowIndex}-${cellIndex}`}
              onSelect={onSelect}
              row={row}
              selecting={Boolean(selecting)}
              selected={isSelected(selections, row, cellIndex)}
              session={session}
            />
          )}
        </Row>
      ))}
    </Table>
  );
};

export default ConferenceTimetableTable;
