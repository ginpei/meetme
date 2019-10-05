import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { appHistory } from './misc';
import HomePage from './screens/HomePage';
import NotFoundScreen from './screens/NotFoundPage';

const App: React.FC = () => {
  return (
    <Router history={appHistory}>
      <div className="App">
        <Switch>
          <Route exact={true} path="/" component={HomePage}/>
          <Route component={NotFoundScreen}/>
        </Switch>
      </div>
      </Router>
  );
}

export default App;
