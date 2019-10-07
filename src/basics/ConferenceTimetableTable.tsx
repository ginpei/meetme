import React from 'react';
import { ConferenceTimetable } from '../models/conferences';
import styled from 'styled-components';

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
  padding: 0.4rem 1rem;
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

type Props = {
  timetable: ConferenceTimetable;
};

const ConferenceTimetableTable: React.FC<Props> = (props) => {
  const { timetable } = props;

  return (
    <Table className="ConferenceTimetableTable">
      <Row>
        <RowTitle>Rooms</RowTitle>
        {timetable.rooms.map((room) => (
          <Cell key={room.name}>{room.name}</Cell>
        ))}
      </Row>
      {timetable.schedule.map((row, rowIndex) => (
        <Row key={row.startsAt}>
          <RowTitle>{row.startsAt}</RowTitle>
          {row.sessions.map((session, cellIndex) =>
            <Cell key={`${rowIndex}-${cellIndex}`}>
              {session.body && (
                <>
                  <Time>{row.startsAt}</Time>
                  <SessionBody>{session.body}</SessionBody>
                </>
              )}
            </Cell>
          )}
        </Row>
      ))}
    </Table>
  );
};

export default ConferenceTimetableTable;
