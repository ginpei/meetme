import React from 'react';
import BasicLayout from '../complexes/BasicLayout';
import { BasicHeading1 } from '../pure/BasicHeading';

type Props = {
  error: Error | firebase.auth.Error | firebase.firestore.FirestoreError;
};

const ErrorScreen: React.FC<Props> = (props) => {
  const { error } = props;
  
  return (
    <BasicLayout className="ErrorScreen">
      <BasicHeading1>
        Error
        <span aria-hidden>😥</span>
      </BasicHeading1>
      <p>
        {'code' in error && (
          <>[{error.code}] </>
        )}
        {error.message}
      </p>
    </BasicLayout>
  );
};

export default ErrorScreen;
