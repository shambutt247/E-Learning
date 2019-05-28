import React from "react";
import ReactDOM from "react-dom";
import history from "./history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.4.0";

// pages for this product
import LoginMainPage from "views/MainPage/LoginMainPage.jsx";
import landingStudent from "views/Student/landingStudent.jsx";
import landingTeacher from "views/Teacher/landingTeacher.jsx";
import AdminDashboard from "views/Admin/AdminDashboard.jsx";
import SubjectHome from "views/Subject/subjectHome.jsx";
import { SnackbarProvider } from 'notistack';


ReactDOM.render(
 <SnackbarProvider maxSnack={3}
 anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
    }}>
  <Router history={history}>
    <Switch>
      <Route path="/home-student" component={landingStudent} />
      <Route path="/home-teacher" component={landingTeacher} />
      <Route path="/subject-home" component={SubjectHome} />
      <Route path="/home-admin" component={AdminDashboard} />
      <Route path="/" component={LoginMainPage} />
      
    </Switch>
  </Router>,
 </SnackbarProvider>,
  document.getElementById("root")
);

