import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import Login from './profile/login.js'
import Register from './profile/register.js'
import ChangePassword from './profile/change-password.js'
import Default from './layout/default';
import Simple from './layout/simple';
import ForgotPassword from './profile/forgot-password';
import ResetPassword from './profile/reset-password';
import EditProfile from './profile/edit-profile';
import RegisterUser from './profile/registerUser';
import AddMember from './members/add';
import EditMember from './members/edit';
import MemberList from './members/index';
import TeamList from './team/index';
import Dashboard from './dashbord/index';
import Projects from './projects/index';
import Createteam from './team/createteam.js';
import Editteam from './team/edit.js';
import Screens from './projectDetails/screens';
import ScreenComments from './projectDetails/screens/comments';
import ScreenPreview from './projectDetails/screens/preview';
import Workflow from './projectDetails/workflow';
import Activity from './projectDetails/activity';
import Comments from './projectDetails/comments';
import NotFound from './notFound'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={browserHistory}>
          <Route component={Default}>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/change-password" component={ChangePassword} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/register/:projectId" component={RegisterUser} />
            <Route exact path="/reset-password/:token" component={ResetPassword} />
            <Route exact path="/members" component={MemberList} />
            <Route exact path="/members/edit/:id" component={EditMember} />
            <Route exact path="/members/add" component={AddMember} />
            <Route exact path="/team" component={TeamList} />
            <Route exact path="/team/createteam" component={Createteam} />
            <Route exact path="/team/edit/:id" component={Editteam} />
            <Route exact path="/edit-profile" component={EditProfile} />
            <Route exact path="/projects" component={Projects} />
            <Route exact path="/project/:projectId/screens" component={Screens} />
            <Route exact path="/project/:projectId/workflow" component={Workflow} />
            <Route exact path="/project/:projectId/activity" component={Activity} />
            <Route exact path="/project/:projectId/comments" component={Comments} />
          </Route>
          <Route component={Simple}>
            <Route exact path="/project/:projectId/screen/:screenId/preview" component={ScreenPreview} />
            <Route exact path="/project/:projectId/screen/:screenId/comments" component={ScreenComments} />
          </Route>
          <Route path="*" component={NotFound} />
        </Router >
      </div>
    );
  }
}
export default App;