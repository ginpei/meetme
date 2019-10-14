import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { appHistory } from './misc';
import AdminTopPage from './screens/AdminTopPage';
import ConferenceEditPage from './screens/ConferenceEditPage';
import ConferenceEditTimelinePage from './screens/ConferenceEditTimelinePage';
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
          <Route exact={true} path="/" component={HomePage}/>
          <Route exact={true} path="/admin/" component={AdminTopPage}/>
          <Route exact={true} path="/admin/conferences/:id/edit" component={ConferenceEditPage}/>
          <Route exact={true} path="/admin/conferences/:id/editTimetable" component={ConferenceEditTimelinePage}/>
          <Route exact={true} path="/admin/conferences/new" component={ConferenceNewPage}/>
          <Route exact={true} path="/conferences" component={ConferenceListPage}/>
          <Route exact={true} path="/conferences/:id" component={ConferenceViewPage}/>
          <Route exact={true} path="/login" component={LoginPage}/>
          <Route exact={true} path="/logout" component={LogoutPage}/>
          <Route component={NotFoundScreen}/>
        </Switch>
      </div>
      </Router>
  );
}

export default App;
