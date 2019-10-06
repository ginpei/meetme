import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { appHistory } from './misc';
import AdminTopPage from './screens/AdminTopPage';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import LogoutPage from './screens/LogoutPage';
import NotFoundScreen from './screens/NotFoundPage';

const App: React.FC = () => {
  return (
    <Router history={appHistory}>
      <div className="App">
        <Switch>
          <Route exact={true} path="/" component={HomePage}/>
          <Route exact={true} path="/login" component={LoginPage}/>
          <Route exact={true} path="/logout" component={LogoutPage}/>
          <Route exact={true} path="/admin/" component={AdminTopPage}/>
          <Route component={NotFoundScreen}/>
        </Switch>
      </div>
      </Router>
  );
}

export default App;
