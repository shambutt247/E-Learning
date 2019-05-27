import React from "react";
import ReactDOM from "react-dom";
import history from "./history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.4.0";

// pages for this product
import Components from "views/Components/Components.jsx";
import LandingPage from "views/LandingPage/LandingPage.jsx";
import ProfilePage from "views/ProfilePage/ProfilePage.jsx";
import LoginMainPage from "views/MainPage/LoginMainPage.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";
import landingStudent from "views/Student/landingStudent.jsx";
import landingTeacher from "views/Teacher/landingTeacher.jsx";
import AdminDashboard from "views/Admin/AdminDashboard.jsx";
import SubjectHome from "views/Subject/subjectHome.jsx";
import Uploading from "views/uploading.jsx";
import { SnackbarProvider } from 'notistack';


ReactDOM.render(
 <SnackbarProvider maxSnack={3}
 anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
    }}>
  <Router history={history}>
    <Switch>
      <Route path="/landing-page" component={LandingPage} />
      <Route path="/profile-page" component={ProfilePage} />
      <Route path="/home-student" component={landingStudent} />
      <Route path="/home-teacher" component={landingTeacher} />
      <Route path="/login-page" component={LoginPage} />
      <Route path="/components" component={Components} />
      <Route path="/subject-home" component={SubjectHome} />
      <Route path="/home-admin" component={AdminDashboard} />
      <Route path="/" component={LoginMainPage} />
      
    </Switch>
  </Router>,
 </SnackbarProvider>,
  document.getElementById("root")
);

