import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { appHistory } from './misc';
import AdminTopPage from './screens/AdminTopPage';
import ConferenceEditPage from './screens/ConferenceEditPage';
import ConferenceListPage from './screens/ConferenceListPage';
import ConferenceNewPage from './screens/ConferenceNewPage';
import ConferenceViewPage from './screens/ConferenceViewPage';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import LogoutPage from './screens/LogoutPage';
import NotFoundScreen from './screens/NotFoundPage';

const App: React.FC = () => {
  return (
    <Router history={appHistory}>
      <div className="App">
        <Switch>
          <Route path="/admin/conferences/:id/edit" component={ConferenceEditPage}/>
          <Route path="/admin/conferences/new" component={ConferenceNewPage}/>
          <Route path="/admin/" component={AdminTopPage}/>
          <Route path="/conferences/:id" component={ConferenceViewPage}/>
          <Route path="/conferences" component={ConferenceListPage}/>
          <Route path="/login" component={LoginPage}/>
          <Route path="/logout" component={LogoutPage}/>
          <Route exact={true} path="/" component={HomePage}/>
          <Route component={NotFoundScreen}/>
        </Switch>
      </div>
      </Router>
  );
}

export default App;
